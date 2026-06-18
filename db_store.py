from __future__ import annotations

import json
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent
VENDOR_DIR = ROOT / "vendor"
if VENDOR_DIR.is_dir():
    sys.path.insert(0, str(VENDOR_DIR))


def load_env(path: Path | None = None) -> None:
    env_path = path or ROOT / ".env"
    if not env_path.exists():
        return
    for raw_line in env_path.read_text(encoding="utf-8", errors="ignore").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


load_env()


class DatabaseNotConfigured(RuntimeError):
    pass


def database_configured() -> bool:
    return all(os.environ.get(key) for key in ("DB_HOST", "DB_NAME", "DB_USER", "DB_PASSWORD"))


def connect():
    if not database_configured():
        raise DatabaseNotConfigured("Database settings are missing in .env.")
    import pymysql

    return pymysql.connect(
        host=os.environ["DB_HOST"],
        port=int(os.environ.get("DB_PORT") or "3306"),
        user=os.environ["DB_USER"],
        password=os.environ["DB_PASSWORD"],
        database=os.environ["DB_NAME"],
        charset="utf8mb4",
        autocommit=False,
        connect_timeout=10,
        read_timeout=20,
        write_timeout=20,
        cursorclass=pymysql.cursors.DictCursor,
    )


def ensure_schema(connection) -> None:
    with connection.cursor() as cursor:
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS pillow_calc_state (
                state_key VARCHAR(64) NOT NULL PRIMARY KEY,
                data LONGTEXT NOT NULL,
                updated_at DATETIME NOT NULL
            ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
            """
        )
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS pillow_calc_backups (
                id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                state_key VARCHAR(64) NOT NULL,
                data LONGTEXT NOT NULL,
                created_at DATETIME NOT NULL,
                reason VARCHAR(255) NOT NULL,
                INDEX idx_state_key_created_at (state_key, created_at)
            ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
            """
        )
    connection.commit()


def load_state(state_key: str = "main") -> dict[str, Any]:
    with connect() as connection:
        ensure_schema(connection)
        with connection.cursor() as cursor:
            cursor.execute("SELECT data, updated_at FROM pillow_calc_state WHERE state_key = %s", (state_key,))
            row = cursor.fetchone()
        if not row:
            return {"state": {}, "updatedAt": None}
        return {"state": json.loads(row["data"] or "{}"), "updatedAt": row["updated_at"].isoformat()}


def save_state(state: dict[str, Any], state_key: str = "main", reason: str = "save") -> dict[str, Any]:
    now = datetime.now()
    data = json.dumps(state, ensure_ascii=False, separators=(",", ":"))
    with connect() as connection:
        ensure_schema(connection)
        with connection.cursor() as cursor:
            cursor.execute("SELECT data FROM pillow_calc_state WHERE state_key = %s FOR UPDATE", (state_key,))
            previous = cursor.fetchone()
            if previous:
                cursor.execute(
                    "INSERT INTO pillow_calc_backups (state_key, data, created_at, reason) VALUES (%s, %s, %s, %s)",
                    (state_key, previous["data"], now, reason[:255]),
                )
            cursor.execute(
                """
                INSERT INTO pillow_calc_state (state_key, data, updated_at)
                VALUES (%s, %s, %s)
                ON DUPLICATE KEY UPDATE data = VALUES(data), updated_at = VALUES(updated_at)
                """,
                (state_key, data, now),
            )
        connection.commit()
    return {"ok": True, "updatedAt": now.isoformat()}
