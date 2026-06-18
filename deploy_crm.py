from __future__ import annotations

import os
from datetime import datetime
from ftplib import FTP
from pathlib import Path


ROOT = Path(__file__).resolve().parent
FILES = [
    "index.html",
    "app.js",
    "styles.css",
    "api.py",
    "server.py",
    "db_store.py",
    "crm.htaccess",
]


def load_env() -> None:
    env_path = ROOT / ".env"
    if not env_path.exists():
        return
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip())


def required_env(name: str) -> str:
    value = os.environ.get(name, "").strip()
    if not value:
        raise RuntimeError(f"Set {name} in .env")
    return value


def ensure_remote_dir(ftp: FTP, path: str) -> None:
    current = ftp.pwd()
    parts = [part for part in path.strip("/").split("/") if part]
    ftp.cwd("/")
    for part in parts:
        try:
            ftp.cwd(part)
        except Exception:
            ftp.mkd(part)
            ftp.cwd(part)
    ftp.cwd(current)


def main() -> None:
    load_env()
    host = required_env("FTP_HOST")
    user = required_env("FTP_USER")
    password = required_env("FTP_PASSWORD")
    remote_dir = required_env("FTP_REMOTE_DIR").rstrip("/")
    files = [name for name in FILES if (ROOT / name).exists()]
    backup_dir = f"{remote_dir}/backups/deploy-{datetime.now().strftime('%Y%m%d-%H%M%S')}"

    with FTP(host, timeout=30) as ftp:
        ftp.login(user, password)
        ensure_remote_dir(ftp, backup_dir)
        for name in files:
            remote_path = f"{remote_dir}/{name}"
            backup_path = f"{backup_dir}/{name}"
            try:
                with (ROOT / "backups" / f"remote-{name}.tmp").open("wb") as backup_file:
                    ftp.retrbinary(f"RETR {remote_path}", backup_file.write)
                with (ROOT / "backups" / f"remote-{name}.tmp").open("rb") as backup_file:
                    ftp.storbinary(f"STOR {backup_path}", backup_file)
            finally:
                try:
                    (ROOT / "backups" / f"remote-{name}.tmp").unlink()
                except FileNotFoundError:
                    pass
            with (ROOT / name).open("rb") as local_file:
                ftp.storbinary(f"STOR {remote_path}", local_file)
            print(f"Uploaded {name}")
    print(f"Backup: {backup_dir}")


if __name__ == "__main__":
    main()
