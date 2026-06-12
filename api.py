#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VENDOR_DIR = os.path.join(BASE_DIR, "vendor")
if os.path.isdir(VENDOR_DIR):
  sys.path.insert(0, VENDOR_DIR)

from server import (
  OUTPUTS,
  build_company_card_pdf,
  build_docx,
  build_oksana_docx,
  build_oksana_xlsx,
  build_pdf,
  safe_name,
)


def response(status: str, payload: dict):
  body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
  print(f"Status: {status}")
  print("Content-Type: application/json; charset=utf-8")
  print(f"Content-Length: {len(body)}")
  print("X-Robots-Tag: noindex, nofollow, noarchive")
  print()
  sys.stdout.buffer.write(body)


def read_payload() -> dict:
  length = int(os.environ.get("CONTENT_LENGTH") or "0")
  raw = sys.stdin.buffer.read(length) if length > 0 else b"{}"
  return json.loads(raw.decode("utf-8") or "{}")


def public_url(path):
  return f"/crm/outputs/proposals/{path.name}"


def handle_proposal(payload: dict):
  slug = safe_name(payload.get("number") or datetime.now().strftime("%Y%m%d%H%M%S"))
  docx_path = OUTPUTS / f"kp_{slug}.docx"
  pdf_path = OUTPUTS / f"kp_{slug}.pdf"
  oksana_docx_path = OUTPUTS / f"raschet_oksana_{slug}.docx"
  oksana_xlsx_path = OUTPUTS / f"raschet_oksana_{slug}.xlsx"
  build_docx(payload, docx_path)
  build_pdf(payload, pdf_path)
  build_oksana_docx(payload, oksana_docx_path)
  build_oksana_xlsx(payload, oksana_xlsx_path)
  response("200 OK", {
    "docxUrl": public_url(docx_path),
    "pdfUrl": public_url(pdf_path),
    "oksanaDocxUrl": public_url(oksana_docx_path),
    "oksanaXlsxUrl": public_url(oksana_xlsx_path),
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
    else:
      response("404 Not Found", {"ok": False, "error": "Unknown API action."})
  except Exception as error:
    response("500 Internal Server Error", {"ok": False, "error": str(error)})


if __name__ == "__main__":
  main()
