#!/usr/bin/env bash
# nginx 사이트 설정 적용 — nginx/nca-exam.conf 를 서버에 반영한다.
#
# 사용법:
#   ./scripts/setup-nginx.sh              # 기본 호스트에 적용
#   ./scripts/setup-nginx.sh <ssh-host>
#
# 안전장치: 기존 설정을 백업하고 nginx -t 로 검증한다.
# 검증 실패 시 백업을 되돌리고 reload 하지 않으므로, 서비스는 중단되지 않는다.
set -euo pipefail

HOST="${1:-bespin-dev-an2-web-1}"
CONF_NAME="nca-exam.conf"
REMOTE_CONF="/etc/nginx/conf.d/${CONF_NAME}"

cd "$(dirname "$0")/.."
LOCAL_CONF="nginx/${CONF_NAME}"
[ -f "$LOCAL_CONF" ] || { echo "설정 파일 없음: $LOCAL_CONF"; exit 1; }

echo "== 1/3 설정 파일 업로드 → $HOST"
scp -q "$LOCAL_CONF" "$HOST:/tmp/${CONF_NAME}"

echo "== 2/3 백업 · 반영 · 문법 검증"
ssh "$HOST" "bash -euo pipefail -s" <<REMOTE
CONF="${REMOTE_CONF}"
BACKUP="/tmp/${CONF_NAME}.backup.\$(date +%Y%m%d-%H%M%S)"

# 기존 설정이 있으면 백업
if [ -f "\$CONF" ]; then
  sudo cp "\$CONF" "\$BACKUP"
  echo "  기존 설정 백업: \$BACKUP"
else
  BACKUP=""
  echo "  기존 설정 없음 (신규 적용)"
fi

sudo install -o root -g root -m 644 "/tmp/${CONF_NAME}" "\$CONF"
rm -f "/tmp/${CONF_NAME}"

# 문법 검증 — 실패하면 되돌리고 reload 하지 않는다 (서비스 무중단)
if ! sudo nginx -t 2>&1 | sed 's/^/  /'; then
  echo "  ✗ 문법 오류 — 되돌립니다"
  if [ -n "\$BACKUP" ]; then
    sudo cp "\$BACKUP" "\$CONF"
  else
    sudo rm -f "\$CONF"
  fi
  sudo nginx -t >/dev/null 2>&1 && echo "  기존 설정으로 복구 완료 (서비스 영향 없음)"
  exit 1
fi

sudo systemctl reload nginx
echo "  reload 완료 · nginx: \$(systemctl is-active nginx)"

# 웹 루트 권한 점검 — nginx 워커는 'nginx' 유저로 돌기 때문에 읽기 권한이 필요하다
ROOT_DIR=\$(grep -oP '^\s*root\s+\K[^;]+' "\$CONF" | head -1)
if [ -n "\$ROOT_DIR" ] && [ -d "\$ROOT_DIR" ]; then
  sudo -u nginx test -r "\$ROOT_DIR/index.html" 2>/dev/null \
    && echo "  웹 루트 읽기 권한 OK (\$ROOT_DIR)" \
    || echo "  ⚠️ nginx 유저가 \$ROOT_DIR/index.html 을 읽을 수 없습니다 — chmod 755 확인 필요"
fi
REMOTE

echo "== 3/3 서빙 확인"
IP=$(grep -oE '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+' "$LOCAL_CONF" | head -1)
if [ -n "$IP" ]; then
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "http://${IP}/" || echo "실패")
  echo "GET http://${IP}/ → HTTP $code"
fi
echo "설정 적용 완료 ✔"
