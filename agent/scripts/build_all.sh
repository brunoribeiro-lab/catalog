#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.."; pwd)"
cd "$ROOT"

echo "=== Preparing dist/ ==="
rm -rf dist build
mkdir -p dist build

# Ensure that venv support is available
if ! python3 -m venv --help >/dev/null 2>&1; then
  echo "python3-venv is required. On Debian/Ubuntu: sudo apt-get update && sudo apt-get install -y python3-venv"
  exit 1
fi

# Create and use an isolated virtual environment (avoids PEP 668 'externally-managed' error)
VENV="$ROOT/build/.venv"
python3 -m venv "$VENV"
. "$VENV/bin/activate"

echo '=== Installing build dependencies in venv ==='
pip install -U pip setuptools wheel
# Install project requirements + pyinstaller inside the venv
pip install -r requirements.txt pyinstaller

PYI="$VENV/bin/pyinstaller"

# 1) Build local Linux binary (assuming compatible environment)
echo "=== Building local (linux x86_64) with pyinstaller ==="
"$PYI" --onefile src/main.py -n agent
mv dist/agent dist/agent-linux-amd64 || true

# 2) Build ARM64 (if host is ARM, pyinstaller will produce an ARM binary)
if [ "$(uname -m)" = "aarch64" ]; then
  echo "Host is aarch64 — building native arm64 binary"
  "$PYI" --onefile src/main.py -n agent
  mv dist/agent dist/agent-linux-arm64 || true
else
  echo "Host is not aarch64. To build arm64 use a CI runner or Docker emulation (see README)."
fi

# 3) Build s390x using docker + emulation
echo "=== Building s390x binary inside an s390x container (requires binfmt/qemu) ==="
docker run --rm --privileged multiarch/qemu-user-static --reset -p yes || true

docker run --rm --platform linux/s390x -v "$PWD":/src -w /src s390x/ubuntu:22.04 bash -lc "\
  apt-get update && apt-get install -y python3 python3-pip build-essential && \
  python3 -m pip install --no-cache-dir pyinstaller boto3 pyyaml requests && \
  pyinstaller --onefile src/main.py -n agent && \
  chown $(id -u):$(id -g) dist/agent || true
"

if [ -f dist/agent ]; then
  mv dist/agent dist/agent-linux-s390x || true
fi

echo "=== Done. Artifacts are located in dist/ ==="
ls -la dist || true
