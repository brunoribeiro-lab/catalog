#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.."; pwd)"
cd "$ROOT"

docker run --rm --privileged multiarch/qemu-user-static --reset -p yes

docker run --rm --platform linux/s390x -v "$PWD":/src -w /src s390x/ubuntu:22.04 bash -lc "\
  apt-get update && apt-get install -y python3 python3-pip build-essential && \
  python3 -m pip install --no-cache-dir pyinstaller boto3 pyyaml requests && \
  pyinstaller --onefile src/main.py -n agent && \
  chown $(id -u):$(id -g) dist/agent || true
"
