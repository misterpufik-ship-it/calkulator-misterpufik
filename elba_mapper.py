from __future__ import annotations

import re
from datetime import datetime
from typing import Any


SERVICE_WORDS = ("аренда", "доставка", "монтаж", "демонтаж", "пошив", "сборка", "производство", "услуга")


class ElbaMapper:
    def order_to_counterparty(self, order: dict[str, Any]) -> dict[str, Any]:
        client = self._client_name(order)
        if not client:
            raise ValueError("В заказе не указан клиент.")
        requisites = str(order.get("clientRequisites") or "").strip()
        inn = self._extract_inn(requisites)
        return {
            "name": client,
            "type": "legalEntity" if inn else "individual",
            "inn": inn,
            "comment": requisites,
        }

    def order_to_bill(self, order: dict[str, Any], counterparty: dict[str, Any]) -> dict[str, Any]:
        items = self._items(order)
        if not items:
            raise ValueError("В заказе нет позиций для счёта.")
        return {
            "externalId": self.order_id(order),
            "number": str(order.get("number") or "").replace("#", ""),
            "date": self._date(order.get("date")),
            "contractorId": counterparty.get("id") or counterparty.get("contractorId"),
            "contractor": counterparty,
            "positions": items,
            "comment": str(order.get("title") or order.get("orderType") or "").strip(),
        }

    def order_id(self, order: dict[str, Any]) -> str:
        kind = str(order.get("kind") or order.get("orderType") or "order").strip().lower()
        number = str(order.get("number") or order.get("sourceIndex") or datetime.now().timestamp()).strip()
        return re.sub(r"[^0-9a-zA-Zа-яА-Я:_-]+", "_", f"{kind}:{number}")[:128]

    def _client_name(self, order: dict[str, Any]) -> str:
        return str(
            order.get("clientName")
            or order.get("client")
            or order.get("customer")
            or order.get("title")
            or ""
        ).strip()

    def _items(self, order: dict[str, Any]) -> list[dict[str, Any]]:
        lines = order.get("lines") or order.get("payload", {}).get("lines") or []
        items = [self._line_to_item(line) for line in lines if line]
        delivery = float(order.get("deliveryGrossAmount") or order.get("deliveryAmount") or 0)
        if delivery > 0 and not any("достав" in str(item.get("name", "")).lower() for item in items):
            items.append({"name": "Доставка", "type": "service", "quantity": 1, "price": round(delivery, 2), "amount": round(delivery, 2)})
        return items

    def _line_to_item(self, line: dict[str, Any]) -> dict[str, Any]:
        name = str(line.get("positionName") or line.get("item") or line.get("whatOrdered") or line.get("type") or "Позиция").strip()
        type_source = f"{name} {line.get('type') or ''}".lower()
        quantity = max(1, float(line.get("quantity") or 1))
        amount = float(line.get("totalPrice") or line.get("amount") or line.get("total") or 0)
        unit_price = float(line.get("unitPrice") or (amount / quantity if quantity else amount))
        return {
            "name": name,
            "type": "service" if any(word in type_source for word in SERVICE_WORDS) else "product",
            "quantity": quantity,
            "price": round(unit_price, 2),
            "amount": round(amount, 2),
            "vatRate": self._vat_rate(line),
        }

    def _vat_rate(self, line: dict[str, Any]) -> str:
        rate = float(line.get("vatRate") or 0)
        if rate <= 0:
            return "none"
        return f"{round(rate * 100)}%"

    def _date(self, value: Any) -> str:
        text = str(value or "").strip()
        for fmt in ("%d.%m.%Y", "%Y-%m-%d"):
            try:
                return datetime.strptime(text, fmt).date().isoformat()
            except ValueError:
                pass
        return datetime.now().date().isoformat()

    def _extract_inn(self, text: str) -> str:
        match = re.search(r"(?:ИНН|inn)\D*(\d{10}|\d{12})", text, flags=re.IGNORECASE)
        return match.group(1) if match else ""
