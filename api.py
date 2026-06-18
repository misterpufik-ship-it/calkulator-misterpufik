#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import secrets
import sys
import urllib.error
import urllib.request
from datetime import datetime
from http.cookies import SimpleCookie
from urllib.parse import urlsplit

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VENDOR_DIR = os.path.join(BASE_DIR, "vendor")
if os.path.isdir(VENDOR_DIR):
  sys.path.insert(0, VENDOR_DIR)

from server import (
  OUTPUTS,
  build_company_card_pdf,
  build_docx,
  build_oksana_docx,
  build_oksana_pdf,
  build_pdf,
  safe_name,
)
from db_store import DatabaseNotConfigured, load_state, save_state
from elba_client import ElbaAuthError, ElbaConfigError, ElbaError, ElbaValidationError
from elba_service import ElbaService

ELBA_SERVICE = ElbaService(OUTPUTS)


def response(status: str, payload: dict, extra_headers: list[tuple[str, str]] | None = None):
  body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
  extra = "".join(f"{name}: {value}\r\n" for name, value in (extra_headers or []))
  headers = (
    f"Status: {status}\r\n"
    "Content-Type: application/json; charset=utf-8\r\n"
    f"{extra}"
    f"Content-Length: {len(body)}\r\n"
    "X-Robots-Tag: noindex, nofollow, noarchive\r\n"
    "\r\n"
  ).encode("utf-8")
  sys.stdout.buffer.write(headers + body)


def read_payload() -> dict:
  length = int(os.environ.get("CONTENT_LENGTH") or "0")
  raw = sys.stdin.buffer.read(length) if length > 0 else b"{}"
  return json.loads(raw.decode("utf-8") or "{}")


def request_method() -> str:
  return os.environ.get("REQUEST_METHOD", "GET").upper()


def public_url(path):
  return f"/crm/outputs/proposals/{path.name}"


def normalize_public_urls(payload: dict) -> dict:
  result = dict(payload)
  if isinstance(result.get("pdfUrl"), str) and result["pdfUrl"].startswith("/outputs/"):
    result["pdfUrl"] = "/crm" + result["pdfUrl"]
  return result


def public_elba_error(error: Exception):
  if isinstance(error, ElbaConfigError):
    response("503 Service Unavailable", {"ok": False, "error": str(error)})
    return
  if isinstance(error, ElbaAuthError):
    response("401 Unauthorized", {"ok": False, "error": "Неверный API-ключ Эльбы или нет доступа к организации."})
    return
  if isinstance(error, (ElbaValidationError, ValueError)):
    response("400 Bad Request", {"ok": False, "error": str(error)})
    return
  if isinstance(error, ElbaError):
    response("502 Bad Gateway", {"ok": False, "error": str(error)})
    return
  if isinstance(error, DatabaseNotConfigured):
    response("503 Service Unavailable", {"ok": False, "error": "База данных не настроена в .env."})
    return
  response("500 Internal Server Error", {"ok": False, "error": "Не получилось выполнить действие в Эльбе."})


def csrf_cookie_value() -> str:
  cookie = SimpleCookie(os.environ.get("HTTP_COOKIE", ""))
  morsel = cookie.get("crm_csrf")
  return morsel.value if morsel else ""


def validate_crm_post() -> bool:
  if request_method() != "POST":
    response("405 Method Not Allowed", {"ok": False, "error": "Method not allowed."})
    return False
  if os.environ.get("HTTP_X_REQUESTED_WITH") != "XMLHttpRequest":
    response("403 Forbidden", {"ok": False, "error": "Запрос отклонён: действие доступно только из CRM."})
    return False
  host = os.environ.get("HTTP_HOST", "")
  origin = os.environ.get("HTTP_ORIGIN") or os.environ.get("HTTP_REFERER") or ""
  if origin:
    parsed = urlsplit(origin)
    if parsed.netloc and parsed.netloc != host:
      response("403 Forbidden", {"ok": False, "error": "Запрос отклонён: неверный источник."})
      return False
  header_token = os.environ.get("HTTP_X_CSRF_TOKEN", "")
  cookie_token = csrf_cookie_value()
  if not header_token or header_token != cookie_token or len(header_token) < 24:
    response("403 Forbidden", {"ok": False, "error": "CSRF-токен устарел. Обновите страницу и повторите действие."})
    return False
  return True


def handle_csrf():
  token = secrets.token_urlsafe(32)
  response("200 OK", {"ok": True, "csrfToken": token}, [("Set-Cookie", f"crm_csrf={token}; Path=/crm; SameSite=Strict")])


def handle_elba_status():
  try:
    response("200 OK", ELBA_SERVICE.check_connection())
  except Exception as error:
    public_elba_error(error)


def handle_elba_bill(payload: dict):
  if not validate_crm_post():
    return
  try:
    result = ELBA_SERVICE.create_bill(payload.get("order") or {})
    response("200 OK", normalize_public_urls(result))
  except Exception as error:
    public_elba_error(error)


def handle_elba_bill_status(payload: dict):
  if not validate_crm_post():
    return
  try:
    response("200 OK", ELBA_SERVICE.refresh_bill_status(payload.get("order") or {}))
  except Exception as error:
    public_elba_error(error)


def handle_elba_bill_pdf(payload: dict):
  if not validate_crm_post():
    return
  try:
    result = ELBA_SERVICE.get_bill_pdf(payload.get("order") or {})
    response("200 OK", normalize_public_urls(result))
  except Exception as error:
    public_elba_error(error)


def handle_elba_closing(payload: dict):
  if not validate_crm_post():
    return
  try:
    result = ELBA_SERVICE.create_closing_document(payload.get("order") or {}, str(payload.get("documentType") or ""))
    response("200 OK", result)
  except Exception as error:
    public_elba_error(error)


def handle_proposal(payload: dict):
  slug = safe_name(payload.get("number") or datetime.now().strftime("%Y%m%d%H%M%S"))
  docx_path = OUTPUTS / f"kp_{slug}.docx"
  pdf_path = OUTPUTS / f"kp_{slug}.pdf"
  oksana_docx_path = OUTPUTS / f"poshiv_{slug}.docx"
  oksana_pdf_path = OUTPUTS / f"poshiv_{slug}.pdf"
  build_docx(payload, docx_path)
  build_pdf(payload, pdf_path)
  build_oksana_docx(payload, oksana_docx_path)
  build_oksana_pdf(payload, oksana_pdf_path)
  response("200 OK", {
    "docxUrl": public_url(docx_path),
    "pdfUrl": public_url(pdf_path),
    "oksanaDocxUrl": public_url(oksana_docx_path),
    "oksanaPdfUrl": public_url(oksana_pdf_path),
  })


def handle_company_card(payload: dict):
  slug = safe_name(payload.get("name") or payload.get("title") or datetime.now().strftime("%Y%m%d%H%M%S"))
  pdf_path = OUTPUTS / f"company_card_{slug}.pdf"
  build_company_card_pdf(payload, pdf_path)
  response("200 OK", {"pdfUrl": public_url(pdf_path)})


def handle_rental(payload: dict):
  webhook_url = str(payload.get("webhookUrl") or "").strip()
  if not webhook_url.startswith("https://script.google.com/"):
    response("400 Bad Request", {"ok": False, "error": "Укажите корректный URL Google Apps Script webhook."})
    return
  data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
  request = urllib.request.Request(
    webhook_url,
    data=data,
    headers={"Content-Type": "application/json; charset=utf-8"},
    method="POST",
  )
  try:
    with urllib.request.urlopen(request, timeout=20) as remote:
      text = remote.read().decode("utf-8", errors="replace")
    response("200 OK", {"ok": True, "googleResponse": text})
  except urllib.error.HTTPError as error:
    text = error.read().decode("utf-8", errors="replace")
    response("502 Bad Gateway", {"ok": False, "error": f"Google вернул ошибку {error.code}: {text}"})
  except Exception as error:
    response("502 Bad Gateway", {"ok": False, "error": str(error)})


def handle_state(payload: dict):
  try:
    if request_method() == "GET":
      result = load_state()
      response("200 OK", {"ok": True, **result})
      return
    if request_method() != "POST":
      response("405 Method Not Allowed", {"ok": False, "error": "Method not allowed."})
      return
    result = save_state(payload.get("state") or {}, reason=str(payload.get("reason") or "browser-save"))
    response("200 OK", result)
  except DatabaseNotConfigured:
    response("503 Service Unavailable", {"ok": False, "error": "Database is not configured."})
  except Exception as error:
    response("500 Internal Server Error", {"ok": False, "error": str(error)})


def main():
  try:
    payload = read_payload()
    action = os.environ.get("QUERY_STRING", "").split("action=", 1)[-1].split("&", 1)[0]
    if action == "proposal":
      handle_proposal(payload)
    elif action == "company-card":
      handle_company_card(payload)
    elif action == "rental":
      handle_rental(payload)
    elif action == "state":
      handle_state(payload)
    elif action == "csrf":
      handle_csrf()
    elif action == "elba-status":
      handle_elba_status()
    elif action == "elba-bills":
      handle_elba_bill(payload)
    elif action == "elba-bills-status":
      handle_elba_bill_status(payload)
    elif action == "elba-bills-pdf":
      handle_elba_bill_pdf(payload)
    elif action == "elba-closing-documents":
      handle_elba_closing(payload)
    else:
      response("404 Not Found", {"ok": False, "error": "Unknown API action."})
  except Exception as error:
    response("500 Internal Server Error", {"ok": False, "error": str(error)})


if __name__ == "__main__":
  main()
