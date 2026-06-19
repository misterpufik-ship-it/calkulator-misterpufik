from __future__ import annotations

import re
from datetime import datetime
from typing import Any


SERVICE_WORDS = ("аренда", "доставка", "монтаж", "демонтаж", "пошив", "сборка", "производство", "услуга")


class ElbaMapper:
    def order_to_counterparty(self, order: dict[str, Any]) -> dict[str, Any]:
        requisites = self._parse_requisites(str(order.get("clientRequisites") or ""))
        client = requisites.get("Name") or self._client_name(order)
        if not client:
            raise ValueError("В заказе не указан клиент.")
        payload = {
            "Name": client,
            "Type": self._counterparty_type(requisites),
            "Comment": requisites.get("Raw", ""),
        }
        payload.update({key: value for key, value in requisites.items() if key != "Raw" and value})
        return payload

    def order_to_bill(self, order: dict[str, Any], counterparty: dict[str, Any]) -> dict[str, Any]:
        items = self._items(order)
        if not items:
            raise ValueError("В заказе нет позиций для счёта.")
        return {
            "ExternalId": self.order_id(order),
            "Number": str(order.get("number") or "").replace("#", ""),
            "Date": self._date(order.get("date")),
            "ContractorId": counterparty.get("id") or counterparty.get("contractorId"),
            "Contractor": counterparty,
            "Positions": items,
            "Comment": str(order.get("title") or order.get("orderType") or "").strip(),
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
        if delivery > 0 and not any("достав" in str(item.get("Name", "")).lower() for item in items):
            items.append({"Name": "Доставка", "Type": "service", "Quantity": 1, "Price": round(delivery, 2), "Amount": round(delivery, 2)})
        return items

    def _line_to_item(self, line: dict[str, Any]) -> dict[str, Any]:
        name = str(line.get("positionName") or line.get("item") or line.get("whatOrdered") or line.get("type") or "Позиция").strip()
        type_source = f"{name} {line.get('type') or ''}".lower()
        quantity = max(1, float(line.get("quantity") or 1))
        amount = float(line.get("totalPrice") or line.get("amount") or line.get("total") or 0)
        unit_price = float(line.get("unitPrice") or (amount / quantity if quantity else amount))
        return {
            "Name": name,
            "Type": "service" if any(word in type_source for word in SERVICE_WORDS) else "product",
            "Quantity": quantity,
            "Price": round(unit_price, 2),
            "Amount": round(amount, 2),
            "VatRate": self._vat_rate(line),
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

    def _counterparty_type(self, requisites: dict[str, str]) -> str:
        inn = requisites.get("INN", "")
        if requisites.get("OGRNIP") or len(inn) == 12:
            return "individual"
        if len(inn) == 10:
            return "legalEntity"
        return "individual"

    def _parse_requisites(self, text: str) -> dict[str, str]:
        raw = text.strip()
        result: dict[str, str] = {"Raw": raw}
        if not raw:
            return result
        lines = [line.strip() for line in raw.splitlines() if line.strip()]
        first_line = lines[0] if lines else ""
        if first_line and not re.search(r":|\b(ИНН|ОГРН|ОГРНИП|БИК|счет|сч[её]т|банк)\b", first_line, re.IGNORECASE):
            result["Name"] = first_line
        patterns = {
            "INN": r"\bИНН(?:\s+банка)?\D*(\d{10}|\d{12})",
            "OGRNIP": r"\bОГРНИП\D*(\d{15})",
            "OGRN": r"\bОГРН(?!ИП)\D*(\d{13})",
            "BIK": r"\bБИК(?:\s+банка)?\D*(\d{9})",
            "BankAccount": r"(?:Рас[чч]?[её]тный\s+счет|Рас[чч]?[её]тный\s+сч[её]т|р/?с)\D*(\d{20})",
            "CorrespondentAccount": r"(?:Корр\.?\s*счет|Корр\.?\s*сч[её]т|к/?с)\D*(\d{20})",
        }
        for key, pattern in patterns.items():
            match = re.search(pattern, raw, flags=re.IGNORECASE)
            if match:
                result[key] = match.group(1)
        bank_match = re.search(r"Банк\s+(.+)", raw, flags=re.IGNORECASE)
        if bank_match:
            result["BankName"] = bank_match.group(1).strip().strip(".")
        legal_address = self._line_value(lines, "Юридический адрес")
        actual_address = self._line_value(lines, "Фактический адрес")
        if legal_address:
            result["LegalAddress"] = legal_address
        if actual_address:
            result["Address"] = actual_address
        return result

    def _line_value(self, lines: list[str], label: str) -> str:
        prefix = label.lower()
        for line in lines:
            if line.lower().startswith(prefix):
                return line.split(":", 1)[-1].strip().strip(".") if ":" in line else line[len(label):].strip().strip(".")
        return ""
