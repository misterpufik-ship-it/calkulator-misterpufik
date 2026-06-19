from __future__ import annotations

import logging
from datetime import datetime
from pathlib import Path
from typing import Any

from db_store import DatabaseNotConfigured, get_elba_document, upsert_elba_document
from elba_client import ElbaAuthError, ElbaClient, ElbaConfigError, ElbaError, ElbaValidationError
from elba_mapper import ElbaMapper


LOGGER = logging.getLogger("misterpufik.elba")


class ElbaService:
    def __init__(self, output_dir: Path):
        self.output_dir = output_dir
        self.mapper = ElbaMapper()

    def check_connection(self) -> dict[str, Any]:
        client = ElbaClient()
        return {"ok": True, **client.check_connection()}

    def create_bill(self, order: dict[str, Any]) -> dict[str, Any]:
        order_id = self.mapper.order_id(order)
        existing = get_elba_document(order_id, "bill")
        if existing and existing.get("elba_document_id"):
            return {"ok": True, "alreadyExists": True, "document": existing, "message": "Счёт уже создан."}

        try:
            client = ElbaClient()
            client.check_connection()
            counterparty = self._find_or_create_counterparty(client, order)
            payload = self.mapper.order_to_bill(order, counterparty)
            response = client.create_outgoing_bill(payload)
            document_id = self._document_id(response)
            if not document_id:
                raise ElbaError("Эльба создала счёт, но не вернула ID документа.", details=response)
            document = upsert_elba_document(
                order_id,
                "bill",
                elba_document_id=document_id,
                status=self._status(response, "created"),
                payload=payload,
                response=response,
                synced_at=datetime.now(),
            )
            pdf_url = self._try_download_pdf(client, document_id, order_id)
            return {"ok": True, "alreadyExists": False, "document": document, "pdfUrl": pdf_url}
        except Exception as error:
            self._save_error(order_id, "bill", error)
            raise

    def refresh_bill_status(self, order: dict[str, Any]) -> dict[str, Any]:
        order_id = self.mapper.order_id(order)
        document = get_elba_document(order_id, "bill")
        if not document or not document.get("elba_document_id"):
            raise ElbaValidationError("Счёт для этого заказа ещё не создан.")
        client = ElbaClient()
        response = client.get_document(str(document["elba_document_id"]))
        updated = upsert_elba_document(
            order_id,
            "bill",
            elba_document_id=str(document["elba_document_id"]),
            status=self._status(response, document.get("status") or "created"),
            response=response,
            synced_at=datetime.now(),
        )
        return {"ok": True, "document": updated}

    def get_bill_pdf(self, order: dict[str, Any]) -> dict[str, Any]:
        order_id = self.mapper.order_id(order)
        document = get_elba_document(order_id, "bill")
        if not document or not document.get("elba_document_id"):
            raise ElbaValidationError("Счёт для этого заказа ещё не создан.")
        client = ElbaClient()
        pdf_url = self._try_download_pdf(client, str(document["elba_document_id"]), order_id)
        return {"ok": True, "pdfUrl": pdf_url, "document": document}

    def create_closing_document(self, order: dict[str, Any], document_type: str) -> dict[str, Any]:
        if document_type not in ("act", "upd", "delivery_note"):
            raise ElbaValidationError("Неизвестный тип закрывающего документа.")
        raise ElbaValidationError("Закрывающие документы заложены в архитектуру и будут реализованы на втором этапе.")

    def _find_or_create_counterparty(self, client: ElbaClient, order: dict[str, Any]) -> dict[str, Any]:
        payload = self.mapper.order_to_counterparty(order)
        query = payload.get("Inn") or payload["Name"]
        existing = client.find_counterparty(str(query))
        return existing or client.create_counterparty(payload)

    def _try_download_pdf(self, client: ElbaClient, document_id: str, order_id: str) -> str | None:
        try:
            body = client.download_document_pdf(document_id, with_stamp=True)
        except Exception as error:
            LOGGER.warning("Elba PDF download failed for order %s: %s", order_id, self._public_error(error))
            return None
        self.output_dir.mkdir(parents=True, exist_ok=True)
        path = self.output_dir / f"elba_bill_{order_id.replace(':', '_')}_{document_id}.pdf"
        path.write_bytes(body)
        return f"/outputs/proposals/{path.name}"

    def _save_error(self, order_id: str, document_type: str, error: Exception) -> None:
        LOGGER.exception("Elba %s error for order %s: %s", document_type, order_id, self._public_error(error))
        try:
            upsert_elba_document(order_id, document_type, status="error", error_message=self._public_error(error))
        except DatabaseNotConfigured:
            raise
        except Exception:
            LOGGER.exception("Could not save Elba error for order %s", order_id)

    def _public_error(self, error: Exception) -> str:
        if isinstance(error, ElbaConfigError):
            return str(error)
        if isinstance(error, ElbaAuthError):
            return "Неверный API-ключ Эльбы или нет доступа к организации."
        if isinstance(error, ElbaValidationError):
            return str(error)
        if isinstance(error, ElbaError):
            return str(error)
        if isinstance(error, ValueError):
            return str(error)
        return "Не получилось выполнить действие в Эльбе."

    def _document_id(self, response: Any) -> str:
        if isinstance(response, dict):
            return str(response.get("id") or response.get("documentId") or response.get("billId") or "")
        return ""

    def _status(self, response: Any, fallback: str) -> str:
        if isinstance(response, dict):
            return str(response.get("status") or response.get("state") or fallback)
        return fallback
