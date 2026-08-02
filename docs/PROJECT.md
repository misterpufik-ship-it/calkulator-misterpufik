# Calkulator CRM — инструкции проекта

## Хостинг

- Доступ: FTP через `misterpufik.ru`
- Путь CRM на проде: `/misterpufik.ru/public_html/crm`
- Деплой: `python deploy_crm.py` (читает `.env`, делает бэкап на хостинге, затем заливает файлы)
- Пароли и ключи — только в локальном `.env`, не в git и не в сообщениях

## База данных

- Настройки через `.env`
- На Beget: `DB_HOST=localhost`
- Имя БД / пользователь: `mrpuffch_main`
- Пароль БД — только в `.env`

## GitHub

- Репозиторий: https://github.com/misterpufik-ship-it/calkulator-misterpufik.git
- Ветка: `main`
- В git не должны попадать: `.env`, `.codex/`, `backups/`, `outputs/`

## Рабочий процесс

1. Правки и проверка локально (`python server.py` → http://127.0.0.1:4173)
2. Деплой изменённых CRM-файлов: `python deploy_crm.py`
3. После правок фронта обновить cache query (`?v=...`) в `index.html` для `app.js` и `styles.css`
4. Проверить прод:
   - https://misterpufik.ru/crm/
   - https://misterpufik.ru/crm/app.js

## Перенос в другой аккаунт Cursor

1. Clone этого репозитория
2. Скопировать `.env.example` → `.env` и заполнить секреты (получить отдельно, не из GitHub)
3. Открыть папку проекта в Cursor
4. Запустить `python server.py`
