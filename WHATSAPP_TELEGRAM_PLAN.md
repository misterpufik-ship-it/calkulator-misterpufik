# План подключения WhatsApp API к Telegram

## Цель

Сделать единый рабочий сценарий:

1. Клиент пишет в WhatsApp на бизнес-номер.
2. Сервер принимает событие WhatsApp Cloud API на `/api/whatsapp/webhook`.
3. Сообщение пересылается в Telegram.
4. Менеджер отвечает в Telegram реплаем на пересланное сообщение.
5. Сервер отправляет ответ клиенту обратно в WhatsApp.

Avito остается в той же схеме: входящие Avito идут в Telegram, ответы из Telegram уходят обратно в Avito.

## Что уже добавлено в проект

1. Проверка настроек WhatsApp в `/api/avito/status`.
2. Webhook verification для Meta по адресу `/api/whatsapp/webhook`.
3. Прием входящих текстовых WhatsApp-сообщений.
4. Пересылка WhatsApp-сообщений в Telegram.
5. Ответ из Telegram обратно в WhatsApp через reply.
6. Ручная команда Telegram:

```text
/wa phone text
```

Пример:

```text
/wa 79939920515 Здравствуйте! Подскажите, какой размер подушек нужен?
```

## Что нужно получить в Meta

1. Meta Business Portfolio.
2. WhatsApp Business Account.
3. Business phone number, подключенный к Cloud API.
4. Permanent access token или System User access token.
5. Phone Number ID.
6. Verify token - любая длинная секретная строка, которую вы сами зададите и вставите и в Meta, и в переменные окружения.
7. App Secret - желательно включить для проверки подписи webhook.

## Переменные окружения

```powershell
$env:WHATSAPP_ACCESS_TOKEN="постоянный_токен_meta"
$env:WHATSAPP_PHONE_NUMBER_ID="phone_number_id"
$env:WHATSAPP_VERIFY_TOKEN="любая_длинная_секретная_строка"
$env:WHATSAPP_APP_SECRET="app_secret_meta"
$env:WHATSAPP_GRAPH_VERSION="v23.0"
```

Нужные старые переменные для Telegram тоже должны быть заполнены:

```powershell
$env:TELEGRAM_BOT_TOKEN="токен_бота"
$env:TELEGRAM_CHAT_ID="chat_id"
$env:TELEGRAM_WEBHOOK_SECRET="секрет_telegram_webhook"
```

## Webhook в Meta

Callback URL:

```text
https://ваш-домен.example/api/whatsapp/webhook
```

Verify token:

```text
то же значение, что в WHATSAPP_VERIFY_TOKEN
```

После проверки webhook нужно подписаться на события `messages` у WhatsApp Business Account.

## Важные ограничения WhatsApp

1. Свободно отвечать клиенту можно в рамках 24-часового окна после входящего сообщения.
2. Чтобы писать первым или после закрытия окна, нужны заранее одобренные message templates.
3. Номер, подключенный к Cloud API, нельзя параллельно использовать как обычный номер в WhatsApp-приложении.
4. Для боевой работы нужен публичный HTTPS-адрес. Для теста подойдет Cloudflare Tunnel или ngrok.

## Проверка

1. Запустить сервер:

```powershell
python server.py
```

2. Открыть статус:

```text
http://127.0.0.1:4173/api/avito/status
```

3. Убедиться, что `whatsappOk` равен `true`.
4. Настроить Telegram webhook на `/api/telegram/webhook`.
5. Настроить Meta webhook на `/api/whatsapp/webhook`.
6. Отправить тестовое сообщение на WhatsApp business number.
7. Ответить в Telegram реплаем на пересланное сообщение.
