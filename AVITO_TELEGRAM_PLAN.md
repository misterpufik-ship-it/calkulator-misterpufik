# План подключения Avito к Telegram

## Что уже подготовлено

1. Сервер принимает входящие события Avito по адресу `/api/avito/webhook`.
2. Новые текстовые сообщения из Avito пересылаются в Telegram.
3. Ответ в Telegram на пересланное сообщение отправляется обратно в тот же чат Avito.
4. Есть проверка готовности настроек по адресу `/api/avito/status`.

## Что нужно получить

1. В Avito Developers создать приложение и получить `client_id` и `client_secret`.
2. Убедиться, что у аккаунта Avito есть доступ к Messenger API. Обычно для этого нужен профессиональный профиль и подходящий тариф.
3. В Telegram создать бота через BotFather и получить токен.
4. Узнать `chat_id` чата или группы, куда должны приходить сообщения.
5. Дать серверу публичный HTTPS-адрес. Для локальной проверки можно использовать ngrok, Cloudflare Tunnel или другой туннель.

## Переменные окружения

```powershell
$env:AVITO_USER_ID="ваш_id_аккаунта_avito"
$env:AVITO_CLIENT_ID="client_id"
$env:AVITO_CLIENT_SECRET="client_secret"
$env:TELEGRAM_BOT_TOKEN="токен_бота"
$env:TELEGRAM_CHAT_ID="chat_id"
$env:TELEGRAM_WEBHOOK_SECRET="любая_секретная_строка"
python server.py
```

Если Avito выдаёт OAuth access token именно для Messenger API, можно вместо пары `AVITO_CLIENT_ID`/`AVITO_CLIENT_SECRET` задать:

```powershell
$env:AVITO_ACCESS_TOKEN="access_token"
```

## Вебхуки

1. Avito должен отправлять события на:

```text
https://ваш-домен.example/api/avito/webhook
```

2. Telegram webhook настраивается так:

```powershell
$token="TELEGRAM_BOT_TOKEN"
$url="https://ваш-домен.example/api/telegram/webhook"
$secret="та_же_строка_что_TELEGRAM_WEBHOOK_SECRET"
Invoke-RestMethod -Method Post -Uri "https://api.telegram.org/bot$token/setWebhook" -Body @{
  url=$url
  secret_token=$secret
}
```

## Как отвечать

Самый удобный способ: в Telegram нажать "Ответить" на пересланное сообщение Avito и написать текст. Сервер найдёт исходный чат и отправит ответ в Avito.

Запасной способ:

```text
/avito chat_id текст ответа
```

или если нужно указать аккаунт явно:

```text
/avito account_id chat_id текст ответа
```

## Следующие шаги

1. Вписать реальные ключи и запустить сервер.
2. Проверить `/api/avito/status`.
3. Поставить Telegram webhook.
4. Зарегистрировать Avito webhook в кабинете разработчика Avito.
5. Написать тестовое сообщение в Avito с другого аккаунта.
6. Ответить на него из Telegram.
