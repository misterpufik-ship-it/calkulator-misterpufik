from __future__ import annotations

import json
import os
import urllib.error
import urllib.parse
import urllib.request
from typing import Any


class ElbaError(RuntimeError):
    def __init__(self, message: str, status: int | None = None, details: Any = None):
        super().__init__(message)
        self.status = status
        self.details = details


class ElbaConfigError(ElbaError):
    pass


class ElbaAuthError(ElbaError):
    pass


class ElbaValidationError(ElbaError):
    pass


class ElbaClient:
    def __init__(self):
        self.api_key = os.environ.get("ELBA_API_KEY", "").strip()
        self.base_url = os.environ.get("ELBA_API_BASE_URL", "").strip().rstrip("/")
        self.organization_id = os.environ.get("ELBA_ORGANIZATION_ID", "").strip()
        if not self.api_key:
            raise ElbaConfigError("Не указан ELBA_API_KEY в .env.")
        if not self.base_url:
            raise ElbaConfigError("Не указан ELBA_API_BASE_URL в .env.")

    def _headers(self, extra: dict[str, str] | None = None) -> dict[str, str]:
        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": f"Bearer {self.api_key}",
            "X-Kontur-ApiKey": self.api_key,
        }
        headers.update(extra or {})
        return headers

    def _url(self, path: str, params: dict[str, Any] | None = None) -> str:
        url = f"{self.base_url}/{path.lstrip('/')}"
        params = {key: value for key, value in (params or {}).items() if value not in (None, "")}
        if params:
            url = f"{url}?{urllib.parse.urlencode(params, doseq=True)}"
        return url

    def request(
        self,
        method: str,
        path: str,
        *,
        params: dict[str, Any] | None = None,
        payload: dict[str, Any] | None = None,
        accept_pdf: bool = False,
        timeout: int = 30,
    ) -> Any:
        data = None
        if payload is not None:
            data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        headers = self._headers({"Accept": "application/pdf"} if accept_pdf else None)
        request = urllib.request.Request(self._url(path, params), data=data, headers=headers, method=method)
        try:
            with urllib.request.urlopen(request, timeout=timeout) as response:
                body = response.read()
                content_type = response.headers.get("Content-Type", "")
        except urllib.error.HTTPError as error:
            error_body = error.read().decode("utf-8", errors="replace")
            details = self._parse_error(error_body)
            message = self._message_from_error(error.code, details)
            if error.code in (401, 403):
                raise ElbaAuthError("Эльба отклонила API-ключ или доступ к организации.", error.code, details)
            if error.code == 400:
                raise ElbaValidationError(message, error.code, details)
            raise ElbaError(message, error.code, details)
        except urllib.error.URLError as error:
            raise ElbaError("API Эльбы недоступен. Проверьте ELBA_API_BASE_URL и сеть.", None, str(error.reason))
        except TimeoutError:
            raise ElbaError("API Эльбы не ответил вовремя.")

        if accept_pdf:
            return body
        if not body:
            return {}
        if "json" not in content_type.lower():
            return {"raw": body.decode("utf-8", errors="replace")}
        return json.loads(body.decode("utf-8"))

    def _parse_error(self, value: str) -> Any:
        try:
            return json.loads(value)
        except json.JSONDecodeError:
            return value

    def _message_from_error(self, status: int, details: Any) -> str:
        if isinstance(details, dict):
            return str(details.get("message") or details.get("error") or f"Эльба вернула ошибку {status}.")
        if details:
            return f"Эльба вернула ошибку {status}: {details}"
        return f"Эльба вернула ошибку {status}."

    def check_connection(self) -> dict[str, Any]:
        return {"organization": self.get_organization()}

    def get_organization(self) -> dict[str, Any]:
        if self.organization_id:
            return self.request("GET", f"/organizations/{self.organization_id}")
        result = self.request("GET", "/organizations")
        if isinstance(result, list) and result:
            return result[0]
        if isinstance(result, dict):
            organizations = result.get("items") or result.get("organizations")
            if isinstance(organizations, list) and organizations:
                return organizations[0]
        return result

    def find_counterparty(self, query: str) -> dict[str, Any] | None:
        result = self.request("GET", "/contractors", params={"organizationId": self.organization_id, "query": query})
        if isinstance(result, list):
            return result[0] if result else None
        items = result.get("items") or result.get("contractors") if isinstance(result, dict) else None
        return items[0] if items else None

    def create_counterparty(self, payload: dict[str, Any]) -> dict[str, Any]:
        return self.request("POST", "/contractors", params={"organizationId": self.organization_id}, payload=payload)

    def create_outgoing_bill(self, payload: dict[str, Any]) -> dict[str, Any]:
        return self.request("POST", "/documents/outgoing-bills", params={"organizationId": self.organization_id}, payload=payload)

    def get_document(self, document_id: str) -> dict[str, Any]:
        return self.request("GET", f"/documents/{document_id}", params={"organizationId": self.organization_id})

    def download_document_pdf(self, document_id: str, *, with_stamp: bool = True) -> bytes:
        return self.request(
            "GET",
            f"/documents/{document_id}/print",
            params={"organizationId": self.organization_id, "withStamp": str(with_stamp).lower(), "withSignature": str(with_stamp).lower()},
            accept_pdf=True,
        )
