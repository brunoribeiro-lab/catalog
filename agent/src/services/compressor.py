import os
import tarfile
import tempfile
from datetime import datetime
from typing import List


def _sanitize_prefix(prefix: str) -> str:
    if not prefix:
        return "logs"

    safe = prefix.strip("/")
    safe = safe.replace("/", "_")
    return safe or "logs"


def create_tar_gz(files: List[str], prefix: str = "") -> str:
    """
    Creates a tar.gz archive containing the given files.
    Returns the path to the generated temporary file.
    Ensures the directory exists and sanitizes the prefix.
    """
    timestamp = datetime.now().strftime("%Y%m%dT%H%M%SZ")
    safe_prefix = _sanitize_prefix(prefix)
    archive_name = f"{safe_prefix}_{timestamp}.tar.gz"

    tmpdir = tempfile.gettempdir()
    archive_dir = os.path.join(tmpdir, safe_prefix)
    os.makedirs(archive_dir, exist_ok=True)

    archive_path = os.path.join(archive_dir, archive_name)

    with tarfile.open(archive_path, "w:gz") as tar:
        for f in files:
            try:
                arcname = os.path.basename(f)
                tar.add(f, arcname=arcname)
                print(f"[compressor] adding {f} as {arcname}")
            except Exception as e:
                print(f"[compressor] error adding {f}: {e}")

    print(f"[compressor] archive created: {archive_path}")

    return archive_path
