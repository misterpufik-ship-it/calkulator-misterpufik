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

    def _organization_path(self, path: str) -> str:
        if not self.organization_id:
            raise ElbaConfigError("Не указан ELBA_ORGANIZATION_ID в .env.")
        return f"/organizations/{self.organization_id}/{path.lstrip('/')}"

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
            error = details.get("error")
            if isinstance(error, dict):
                nested_details = error.get("details")
                if isinstance(nested_details, list) and nested_details:
                    messages = [str(item.get("message")) for item in nested_details if isinstance(item, dict) and item.get("message")]
                    if messages:
                        return "; ".join(messages)
                return str(error.get("message") or error.get("code") or f"Эльба вернула ошибку {status}.")
            details_list = details.get("details")
            if isinstance(details_list, list) and details_list:
                messages = [str(item.get("message")) for item in details_list if isinstance(item, dict) and item.get("message")]
                if messages:
                    return "; ".join(messages)
            return str(details.get("message") or details.get("error") or f"Эльба вернула ошибку {status}.")
        if details:
            return f"Эльба вернула ошибку {status}: {details}"
        return f"Эльба вернула ошибку {status}."

    def check_connection(self) -> dict[str, Any]:
        return {"organization": self.get_organization()}

    def get_organization(self) -> dict[str, Any]:
        result = self.request("GET", "/organizations")
        organizations = result if isinstance(result, list) else None
        if isinstance(result, dict):
            organizations = result.get("items") or result.get("organizations")
        if self.organization_id and isinstance(organizations, list):
            for organization in organizations:
                if not isinstance(organization, dict):
                    continue
                organization_id = str(organization.get("id") or organization.get("organizationId") or "")
                if organization_id == self.organization_id:
                    return organization
            raise ElbaError("Эльба не вернула организацию с ELBA_ORGANIZATION_ID.", 404, result)
        if isinstance(result, list) and result:
            return result[0]
        if isinstance(result, dict):
            if isinstance(organizations, list) and organizations:
                return organizations[0]
        return result

    def find_counterparty(self, query: str) -> dict[str, Any] | None:
        result = self.request("POST", self._organization_path("/contractors/search"), payload={})
        items = result if isinstance(result, list) else result.get("contractors") if isinstance(result, dict) else None
        if not isinstance(items, list):
            return None
        needle = str(query or "").strip().lower()
        if not needle:
            return items[0] if items else None
        for item in items:
            if not isinstance(item, dict):
                continue
            values = (
                item.get("inn"),
                item.get("name"),
                item.get("shortName"),
            )
            if any(needle == str(value or "").strip().lower() for value in values):
                return item
        return None

    def create_counterparty(self, payload: dict[str, Any]) -> dict[str, Any]:
        return self.request("POST", self._organization_path("/contractors"), payload=payload)

    def create_outgoing_bill(self, payload: dict[str, Any]) -> dict[str, Any]:
        return self.request("POST", self._organization_path("/bills"), payload=payload)

    def get_document(self, document_id: str) -> dict[str, Any]:
        return self.request("GET", self._organization_path(f"/bills/{document_id}"))

    def download_document_pdf(self, document_id: str, *, with_stamp: bool = True) -> bytes:
        return self.request(
            "GET",
            self._organization_path(f"/bills/{document_id}/print"),
            params={"withStamp": str(with_stamp).lower(), "withSignature": str(with_stamp).lower()},
            accept_pdf=True,
        )
