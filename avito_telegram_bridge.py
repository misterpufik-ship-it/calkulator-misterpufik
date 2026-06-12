from __future__ import annotations

import json
import hashlib
import html
import hmac
import imaplib
import os
import re
import smtplib
import time
import urllib.error
import urllib.parse
import urllib.request
from email.message import EmailMessage
from email.parser import BytesParser
from email.policy import default as email_policy
from pathlib import Path


ROOT = Path(__file__).resolve().parent
ENV_PATH = ROOT / ".env"
STATE_PATH = ROOT / "outputs" / "avito_telegram_state.json"
AVITO_API_BASE = "https://api.avito.ru"
TELEGRAM_API_BASE = "https://api.telegram.org"
WHATSAPP_GRAPH_BASE = "https://graph.facebook.com"

SOURCE_LABELS = {
    "avito": "Avito",
    "whatsapp": "WhatsApp",
    "yandex": "Яндекс",
    "email": "Email",
}


class BridgeError(Exception):
    pass


def load_env_file():
    if not ENV_PATH.exists():
        return
    for raw_line in ENV_PATH.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        name, value = line.split("=", 1)
        name = name.strip()
        value = value.strip().strip('"').strip("'")
        if name and name not in os.environ:
            os.environ[name] = value


load_env_file()


def _env(name: str, default: str = "") -> str:
    return os.environ.get(name, default).strip()


def _first_env(*names: str, default: str = "") -> str:
    for name in names:
        value = _env(name)
        if value:
            return value
    return default


def _source_key(source: str) -> str:
    return re.sub(r"[^A-Z0-9]+", "_", str(source or "").upper()).strip("_")


def _source_label(source: str) -> str:
    return SOURCE_LABELS.get(source, source.title() if source else "Unknown")


def _source_env(name: str, source: str, default: str = "") -> str:
    key = _source_key(source)
    return _env(f"{name}_{key}") or _env(name, default)


def _telegram_chat_id(source: str = "") -> str:
    return _source_env("TELEGRAM_CHAT_ID", source) or _env("TELEGRAM_TARGET")


def bridge_status() -> dict:
    required = {
        "AVITO_USER_ID": bool(_env("AVITO_USER_ID")),
        "TELEGRAM_BOT_TOKEN": bool(_env("TELEGRAM_BOT_TOKEN")),
        "TELEGRAM_CHAT_ID": bool(_telegram_chat_id()),
    }
    avito_auth = bool(_env("AVITO_ACCESS_TOKEN")) or (
        bool(_env("AVITO_CLIENT_ID")) and bool(_env("AVITO_CLIENT_SECRET"))
    )
    required["AVITO_AUTH"] = avito_auth
    whatsapp = {
        "WHATSAPP_ACCESS_TOKEN": bool(_env("WHATSAPP_ACCESS_TOKEN")),
        "WHATSAPP_PHONE_NUMBER_ID": bool(_env("WHATSAPP_PHONE_NUMBER_ID")),
        "WHATSAPP_VERIFY_TOKEN": bool(_env("WHATSAPP_VERIFY_TOKEN")),
        "WHATSAPP_APP_SECRET": bool(_env("WHATSAPP_APP_SECRET")),
    }
    email = {
        "SMTP_HOST": bool(_env("SMTP_HOST", "smtp.yandex.ru")),
        "SMTP_USER": bool(_first_env("SMTP_USER", "YANDEX_MAIL_USER", default="info-misterpufik@yandex.ru")),
        "SMTP_PASSWORD": bool(_first_env("SMTP_PASSWORD", "YANDEX_MAIL_PASSWORD")),
        "NOTIFY_EMAIL_TO": bool(_env("NOTIFY_EMAIL_TO", _first_env("SMTP_USER", "YANDEX_MAIL_USER", default="info-misterpufik@yandex.ru"))),
    }
    return {
        "ok": all(required.values()) or all(email.values()),
        "configured": required,
        "whatsappOk": all(whatsapp[name] for name in ("WHATSAPP_ACCESS_TOKEN", "WHATSAPP_PHONE_NUMBER_ID", "WHATSAPP_VERIFY_TOKEN")),
        "whatsappConfigured": whatsapp,
        "emailOk": all(email.values()),
        "emailConfigured": email,
    }


def _read_state() -> dict:
    if not STATE_PATH.exists():
        return {"telegramMessages": {}, "emailMessages": {}}
    try:
        state = json.loads(STATE_PATH.read_text(encoding="utf-8"))
        state.setdefault("telegramMessages", {})
        state.setdefault("emailMessages", {})
        return state
    except Exception:
        return {"telegramMessages": {}, "emailMessages": {}}


def _write_state(state: dict):
    STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
    STATE_PATH.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding="utf-8")


def _request_json(url: str, payload: dict | None = None, headers: dict | None = None, method: str | None = None) -> dict:
    data = None
    final_headers = dict(headers or {})
    if payload is not None:
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        final_headers.setdefault("Content-Type", "application/json; charset=utf-8")
    request = urllib.request.Request(url, data=data, headers=final_headers, method=method)
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            raw = response.read().decode("utf-8", errors="replace")
            return json.loads(raw or "{}")
    except urllib.error.HTTPError as error:
        raw = error.read().decode("utf-8", errors="replace")
        raise BridgeError(f"HTTP {error.code}: {raw}") from error
    except urllib.error.URLError as error:
        raise BridgeError(str(error)) from error


def _request_form(url: str, fields: dict, headers: dict | None = None) -> dict:
    data = urllib.parse.urlencode(fields).encode("utf-8")
    final_headers = {"Content-Type": "application/x-www-form-urlencoded"}
    final_headers.update(headers or {})
    request = urllib.request.Request(url, data=data, headers=final_headers, method="POST")
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            raw = response.read().decode("utf-8", errors="replace")
            return json.loads(raw or "{}")
    except urllib.error.HTTPError as error:
        raw = error.read().decode("utf-8", errors="replace")
        raise BridgeError(f"HTTP {error.code}: {raw}") from error


def avito_access_token() -> str:
    token = _env("AVITO_ACCESS_TOKEN")
    if token:
        return token

    client_id = _env("AVITO_CLIENT_ID")
    client_secret = _env("AVITO_CLIENT_SECRET")
    if not client_id or not client_secret:
        raise BridgeError("Set AVITO_ACCESS_TOKEN or AVITO_CLIENT_ID + AVITO_CLIENT_SECRET.")

    response = _request_form(
        f"{AVITO_API_BASE}/token",
        {
            "grant_type": "client_credentials",
            "client_id": client_id,
            "client_secret": client_secret,
        },
    )
    token = response.get("access_token")
    if not token:
        raise BridgeError(f"Avito did not return access_token: {response}")
    return str(token)


def send_avito_message(account_id: str, chat_id: str, text: str) -> dict:
    if not account_id:
        account_id = _env("AVITO_USER_ID")
    if not account_id or not chat_id or not text.strip():
        raise BridgeError("Need account_id, chat_id and message text.")

    url = f"{AVITO_API_BASE}/messenger/v1/accounts/{account_id}/chats/{chat_id}/messages"
    payload = {"message": {"text": text.strip()}, "type": "text"}
    return _request_json(url, payload, headers={"Authorization": f"Bearer {avito_access_token()}"}, method="POST")


def send_whatsapp_message(phone: str, text: str) -> dict:
    token = _env("WHATSAPP_ACCESS_TOKEN")
    phone_number_id = _env("WHATSAPP_PHONE_NUMBER_ID")
    graph_version = _env("WHATSAPP_GRAPH_VERSION", "v23.0")
    if not token or not phone_number_id:
        raise BridgeError("Set WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID.")
    if not phone or not text.strip():
        raise BridgeError("Need WhatsApp recipient phone and message text.")

    url = f"{WHATSAPP_GRAPH_BASE}/{graph_version}/{phone_number_id}/messages"
    payload = {
        "messaging_product": "whatsapp",
        "to": phone,
        "type": "text",
        "text": {"body": text.strip(), "preview_url": False},
    }
    return _request_json(url, payload, headers={"Authorization": f"Bearer {token}"}, method="POST")


def send_telegram_message(text: str, avito_context: dict | None = None, source: str = "") -> dict:
    token = _env("TELEGRAM_BOT_TOKEN")
    chat_id = _telegram_chat_id(source)
    if not token or not chat_id:
        raise BridgeError("Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID.")

    payload = {
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML",
        "disable_web_page_preview": True,
    }
    thread_id = _source_env("TELEGRAM_THREAD_ID", source)
    if thread_id:
        payload["message_thread_id"] = thread_id
    response = _request_json(f"{TELEGRAM_API_BASE}/bot{token}/sendMessage", payload, method="POST")

    if avito_context:
        message_id = str((response.get("result") or {}).get("message_id") or "")
        if message_id:
            state = _read_state()
            state.setdefault("telegramMessages", {})[message_id] = {
                **avito_context,
                "createdAt": int(time.time()),
            }
            _write_state(state)

    return response


def _plain_text(value: str) -> str:
    text = re.sub(r"<[^>]+>", "", value or "")
    return html.unescape(text).strip()


def send_email_message(subject: str, text: str, source: str = "", recipient: str = "") -> dict:
    host = _env("SMTP_HOST", "smtp.yandex.ru")
    port = int(_env("SMTP_PORT", "465") or "465")
    user = _first_env("SMTP_USER", "YANDEX_MAIL_USER", default="info-misterpufik@yandex.ru")
    password = _first_env("SMTP_PASSWORD", "YANDEX_MAIL_PASSWORD")
    sender = _env("SMTP_FROM", user)
    recipient = recipient or _source_env("NOTIFY_EMAIL_TO", source, user)
    if not host or not user or not password or not recipient:
        raise BridgeError("Set SMTP_HOST, SMTP_USER, SMTP_PASSWORD and NOTIFY_EMAIL_TO.")

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = sender
    message["To"] = recipient
    message.set_content(_plain_text(text))

    with smtplib.SMTP_SSL(host, port, timeout=20) as smtp:
        smtp.login(user, password)
        smtp.send_message(message)
    return {"ok": True, "to": recipient}


def send_notification(
    subject: str,
    text: str,
    avito_context: dict | None = None,
    source: str = "",
    channels: tuple[str, ...] = ("telegram", "email"),
) -> dict:
    delivered = {}
    errors = {}
    source_label = _source_label(source)
    tagged_subject = f"[{source_label}] {subject}"
    tagged_text = "\n".join(
        [
            f"<b>Источник: {_html_escape(source_label)}</b>",
            "",
            text,
        ]
    ).strip()

    if "telegram" in channels and _env("TELEGRAM_BOT_TOKEN") and _telegram_chat_id(source):
        try:
            delivered["telegram"] = send_telegram_message(tagged_text, avito_context, source).get("ok")
        except Exception as error:
            errors["telegram"] = str(error)

    if "email" in channels and _env("SMTP_PASSWORD"):
        try:
            delivered["email"] = send_email_message(tagged_subject, tagged_text, source).get("ok")
        except Exception as error:
            errors["email"] = str(error)

    if delivered:
        return {"ok": True, "delivered": delivered, "errors": errors}
    if errors:
        raise BridgeError("; ".join(f"{key}: {value}" for key, value in errors.items()))
    raise BridgeError("Set Telegram or email notification settings.")


def _email_text(message) -> str:
    if message.is_multipart():
        for part in message.walk():
            if part.get_content_type() == "text/plain" and not part.get_filename():
                return str(part.get_content() or "")
        for part in message.walk():
            if part.get_content_type() == "text/html" and not part.get_filename():
                return _plain_text(str(part.get_content() or ""))
        return ""
    content = str(message.get_content() or "")
    if message.get_content_type() == "text/html":
        return _plain_text(content)
    return content


def _email_sender(message) -> str:
    sender = str(message.get("Reply-To") or message.get("From") or "")
    match = re.search(r"<([^>]+)>", sender)
    return (match.group(1) if match else sender).strip()


def send_yandex_reply(context: dict, text: str) -> dict:
    recipient = str(context.get("from") or "").strip()
    subject = str(context.get("subject") or "Ответ").strip()
    if not recipient:
        raise BridgeError("No email sender in Telegram reply context.")
    if not subject.lower().startswith("re:"):
        subject = f"Re: {subject}"
    return send_email_message(subject, text, "yandex", recipient)


def check_yandex_mail(limit: int = 10) -> dict:
    host = _env("IMAP_HOST", "imap.yandex.ru")
    port = int(_env("IMAP_PORT", "993") or "993")
    user = _env("IMAP_USER", _first_env("SMTP_USER", "YANDEX_MAIL_USER", default="info-misterpufik@yandex.ru"))
    password = _env("IMAP_PASSWORD", _first_env("SMTP_PASSWORD", "YANDEX_MAIL_PASSWORD"))
    if not host or not user or not password:
        raise BridgeError("Set IMAP_HOST, IMAP_USER and IMAP_PASSWORD.")

    state = _read_state()
    seen = state.setdefault("emailMessages", {})
    forwarded = []

    with imaplib.IMAP4_SSL(host, port) as imap:
        imap.login(user, password)
        imap.select("INBOX")
        status, data = imap.search(None, "UNSEEN")
        if status != "OK":
            raise BridgeError("Could not search Yandex inbox.")
        message_numbers = (data[0] or b"").split()[-limit:]
        for message_number in message_numbers:
            status, fetched = imap.fetch(message_number, "(RFC822)")
            if status != "OK" or not fetched:
                continue
            raw = next((item[1] for item in fetched if isinstance(item, tuple)), b"")
            message = BytesParser(policy=email_policy).parsebytes(raw)
            message_id = str(message.get("Message-ID") or message_number.decode("ascii", errors="ignore"))
            if message_id in seen:
                continue

            sender = _email_sender(message)
            subject = str(message.get("Subject") or "Без темы").strip()
            body = _email_text(message).strip()
            if len(body) > 3000:
                body = body[:3000].rstrip() + "\n..."

            telegram_text = "\n".join(
                [
                    "<b>Новое письмо</b>",
                    f"От: <code>{_html_escape(sender)}</code>" if sender else "",
                    f"Тема: {_html_escape(subject)}",
                    "",
                    _html_escape(body),
                    "",
                    "Чтобы ответить, ответьте на это сообщение в Telegram.",
                ]
            ).strip()
            notification = send_notification(
                subject,
                telegram_text,
                {
                    "source": "yandex",
                    "from": sender,
                    "subject": subject,
                    "messageId": message_id,
                },
                "yandex",
                ("telegram",),
            )
            state = _read_state()
            seen = state.setdefault("emailMessages", {})
            seen[message_id] = {"from": sender, "subject": subject, "createdAt": int(time.time())}
            _write_state(state)
            forwarded.append({"from": sender, "subject": subject, **notification})

    return {"ok": True, "forwarded": forwarded}


def _html_escape(value: str) -> str:
    return (
        str(value or "")
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def _header(headers: dict, name: str) -> str:
    expected = name.lower()
    for key, value in headers.items():
        if str(key).lower() == expected:
            return str(value)
    return ""


def _message_text(value: dict) -> str:
    content = value.get("content") or {}
    if isinstance(content, dict):
        return str(content.get("text") or content.get("value") or "")
    return str(value.get("text") or "")


def _avito_value(payload: dict) -> dict:
    inner = payload.get("payload") if isinstance(payload.get("payload"), dict) else payload
    value = inner.get("value") if isinstance(inner.get("value"), dict) else inner
    return value if isinstance(value, dict) else {}


def handle_avito_webhook(headers: dict, payload: dict) -> dict:
    value = _avito_value(payload)
    message_id = str(value.get("id") or "")
    chat_id = str(value.get("chat_id") or value.get("chatId") or "")
    account_id = str(value.get("user_id") or value.get("account_id") or _env("AVITO_USER_ID"))
    author_id = str(value.get("author_id") or "")
    text = _message_text(value).strip()

    if author_id and author_id == account_id:
        return {"ok": True, "skipped": "outgoing_message"}
    if not chat_id:
        return {"ok": True, "skipped": "no_chat_id"}
    if not text:
        return {"ok": True, "skipped": "non_text_message", "chatId": chat_id}

    avito_link = f"https://www.avito.ru/profile/messenger/channel/{chat_id}"
    telegram_text = "\n".join(
        [
            "<b>Новое сообщение Avito</b>",
            f"Чат: <code>{_html_escape(chat_id)}</code>",
            f"Автор: <code>{_html_escape(author_id)}</code>" if author_id else "",
            "",
            _html_escape(text),
            "",
            "Чтобы ответить, ответьте на это сообщение в Telegram.",
            f"Avito: {_html_escape(avito_link)}",
        ]
    ).strip()

    notification = send_notification(
        "Новое сообщение Avito",
        telegram_text,
        {
            "source": "avito",
            "accountId": account_id,
            "chatId": chat_id,
            "avitoMessageId": message_id,
        },
        "avito",
    )
    return {"ok": True, **notification, "chatId": chat_id}


def _telegram_secret_valid(headers: dict) -> bool:
    expected = _env("TELEGRAM_WEBHOOK_SECRET")
    if not expected:
        return True
    actual = _header(headers, "x-telegram-bot-api-secret-token")
    return actual == expected


def verify_whatsapp_subscription(query: dict) -> str:
    mode = str((query.get("hub.mode") or [""])[0])
    token = str((query.get("hub.verify_token") or [""])[0])
    challenge = str((query.get("hub.challenge") or [""])[0])
    expected = _env("WHATSAPP_VERIFY_TOKEN")
    if mode == "subscribe" and expected and token == expected and challenge:
        return challenge
    raise BridgeError("Invalid WhatsApp webhook verification token.")


def _whatsapp_signature_valid(headers: dict, raw_body: bytes) -> bool:
    secret = _env("WHATSAPP_APP_SECRET")
    if not secret:
        return True
    actual = _header(headers, "x-hub-signature-256")
    if not actual.startswith("sha256="):
        return False
    digest = hmac.new(secret.encode("utf-8"), raw_body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(actual, f"sha256={digest}")


def _whatsapp_text(message: dict) -> str:
    if message.get("type") == "text":
        text = message.get("text") or {}
        return str(text.get("body") or "")
    return ""


def _whatsapp_messages(payload: dict) -> list[tuple[dict, dict]]:
    found = []
    for entry in payload.get("entry") or []:
        for change in entry.get("changes") or []:
            value = change.get("value") or {}
            for message in value.get("messages") or []:
                found.append((value, message))
    return found


def handle_whatsapp_webhook(headers: dict, payload: dict, raw_body: bytes = b"") -> dict:
    if not _whatsapp_signature_valid(headers, raw_body):
        raise BridgeError("Invalid WhatsApp webhook signature.")

    delivered = []
    for value, message in _whatsapp_messages(payload):
        phone = str(message.get("from") or "")
        message_id = str(message.get("id") or "")
        text = _whatsapp_text(message).strip()
        if not phone or not text:
            continue

        contact_name = ""
        contacts = value.get("contacts") or []
        if contacts:
            profile = contacts[0].get("profile") or {}
            contact_name = str(profile.get("name") or "")

        telegram_text = "\n".join(
            [
                "<b>Новое сообщение WhatsApp</b>",
                f"Телефон: <code>{_html_escape(phone)}</code>",
                f"Имя: {_html_escape(contact_name)}" if contact_name else "",
                "",
                _html_escape(text),
                "",
                "Чтобы ответить, ответьте на это сообщение в Telegram.",
            ]
        ).strip()

        response = send_notification(
            "Новое сообщение WhatsApp",
            telegram_text,
            {
                "source": "whatsapp",
                "phone": phone,
                "whatsappMessageId": message_id,
            },
            "whatsapp",
        )
        delivered.append({"phone": phone, **response})

    if delivered:
        return {"ok": True, "delivered": delivered}
    return {"ok": True, "skipped": "no_text_messages"}


def handle_telegram_webhook(headers: dict, payload: dict) -> dict:
    if not _telegram_secret_valid(headers):
        raise BridgeError("Invalid Telegram webhook secret.")

    message = payload.get("message") or payload.get("edited_message") or {}
    text = str(message.get("text") or "").strip()
    if not text:
        return {"ok": True, "skipped": "no_text"}

    context = None
    reply = message.get("reply_to_message") or {}
    reply_id = str(reply.get("message_id") or "")
    if reply_id:
        context = _read_state().get("telegramMessages", {}).get(reply_id)

    if context:
        if context.get("source") == "yandex":
            response = send_yandex_reply(context, text)
            return {"ok": True, "sent": True, "yandex": response}
        if context.get("source") == "whatsapp":
            response = send_whatsapp_message(str(context.get("phone") or ""), text)
            return {"ok": True, "sent": True, "whatsapp": response}
        response = send_avito_message(str(context.get("accountId") or ""), str(context.get("chatId") or ""), text)
        return {"ok": True, "sent": True, "avito": response}

    if text.startswith("/avito "):
        parts = text.split(maxsplit=3)
        if len(parts) == 3:
            account_id = _env("AVITO_USER_ID")
            chat_id = parts[1]
            reply_text = parts[2]
        elif len(parts) >= 4:
            account_id = parts[1]
            chat_id = parts[2]
            reply_text = parts[3]
        else:
            raise BridgeError("Use /avito chat_id text or /avito account_id chat_id text.")
        response = send_avito_message(account_id, chat_id, reply_text)
        return {"ok": True, "sent": True, "avito": response}

    if text.startswith("/wa "):
        parts = text.split(maxsplit=2)
        if len(parts) < 3:
            raise BridgeError("Use /wa phone text.")
        response = send_whatsapp_message(parts[1], parts[2])
        return {"ok": True, "sent": True, "whatsapp": response}

    return {"ok": True, "skipped": "not_avito_reply"}
