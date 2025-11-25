import os
from datetime import datetime


def send_to_s3(file_path: str, s3_conf: dict) -> bool:
    try:
        import boto3
        from botocore.exceptions import BotoCoreError, ClientError
    except ImportError:
        print("[transports.s3] boto3 not installed. Run: pip install boto3")
        return False

    bucket = s3_conf.get("bucket")
    region = s3_conf.get("region")
    prefix = s3_conf.get("prefix", "")

    if not bucket:
        print("[transports.s3] bucket not configured")
        return False

    s3 = boto3.client("s3", region_name=region) if region else boto3.client("s3")

    filename = os.path.basename(file_path)
    timestamp = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
    key = os.path.join(prefix.rstrip("/"), f"{timestamp}_{filename}") if prefix else f"{timestamp}_{filename}"

    try:
        s3.upload_file(file_path, bucket, key)
        print(f"[transports.s3] uploaded to s3://{bucket}/{key}")
        return True
    except (BotoCoreError, ClientError) as e:
        print(f"[transports.s3] upload failed: {e}")
        return False


def send_to_http(file_path: str, endpoint_conf: dict) -> bool:
    try:
        import requests
    except ImportError:
        print("[transports.http] requests not installed. Run: pip install requests")
        return False

    endpoint = endpoint_conf.get("endpoint")
    if not endpoint:
        print("[transports.http] endpoint not configured")
        return False

    try:
        with open(file_path, "rb") as fh:
            files = {"file": (os.path.basename(file_path), fh)}
            resp = requests.post(endpoint, files=files, timeout=60)

        if 200 <= resp.status_code < 300:
            print(f"[transports.http] upload successful ({resp.status_code})")
            return True
        else:
            print(f"[transports.http] upload failed ({resp.status_code}): {resp.text}")
            return False

    except Exception as e:
        print(f"[transports.http] error during upload: {e}")
        return False
