import os
import time
import threading
from datetime import datetime

from config import CONFIG
from services.log_reader import collect_existing_paths
from services.compressor import create_tar_gz
from services.transports import send_to_s3, send_to_http
from services.cleaner import remove_files


def run_once() -> int:
    now = datetime.now().isoformat() + "Z"
    payload = {"agent_version": CONFIG.get("version"), "timestamp": now}
    print(f"[agent] run_once payload: {payload}")

    log_paths_cfg = CONFIG.get("logs", {}).get("paths", [])
    files = collect_existing_paths(log_paths_cfg)
    if not files:
        print("[agent] no log files found to send")
        return 1

    # compression
    compress = CONFIG.get("logs", {}).get("compress", True)
    archive_path = None
    try:
        if compress:
            prefix = CONFIG.get("transport", {}).get("s3", {}).get("prefix", "agent")
            archive_path = create_tar_gz(files, prefix=prefix)
            to_send = archive_path
        else:
            print("[agent] compression disabled: individual file sending not implemented, creating tar anyway")
            archive_path = create_tar_gz(files, prefix="agent")
            to_send = archive_path
    except Exception as e:
        print(f"[agent] compression error: {e}")
        return 2

    # transport
    transport_conf = CONFIG.get("transport", {})
    ttype = transport_conf.get("type")
    sent = False
    if ttype == "s3":
        s3_conf = transport_conf.get("s3", {})
        sent = send_to_s3(to_send, s3_conf)
    elif ttype in ("url", "http"):
        url_conf = transport_conf.get("url", {})
        sent = send_to_http(to_send, url_conf)
    else:
        print(f"[agent] unknown transport type: {ttype}")

    # cleanup
    if sent:
        if CONFIG.get("logs", {}).get("clean_after_send", False):
            print("[agent] cleanup enabled, removing original log files...")
            remove_files(files)
        try:
            if archive_path and os.path.exists(archive_path):
                os.remove(archive_path)
                print(f"[agent] removed temporary archive: {archive_path}")
        except Exception as e:
            print(f"[agent] error removing temporary archive: {e}")
        return 0

    print("[agent] send failed, original files were not removed")
    return 3


def run_forever() -> int:
    print(f"Agent starting (version {CONFIG.get('version')})")
    try:
        while True:
            t = threading.Thread(target=run_once)
            t.start()
            t.join()
            sleep_seconds = int(CONFIG.get("loop_seconds", 30))
            time.sleep(sleep_seconds)
    except KeyboardInterrupt:
        print("Exiting...")
        return 0
