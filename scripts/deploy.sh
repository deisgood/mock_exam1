#!/usr/bin/env bash
# 배포 — 로컬 빌드 후 dist/ 만 서버로 rsync (서버에는 Node 불필요)
#
# 사용법:
#   ./scripts/deploy.sh                      # 기본 호스트(bespin-dev-an2-web-1)로 배포
#   ./scripts/deploy.sh <ssh-host>           # ~/.ssh/config 의 다른 호스트로 배포
#   ./scripts/deploy.sh --dry-run            # rsync 전송 없이 삭제·변경 목록만 확인
#   ./scripts/deploy.sh --docker             # npm 이 있어도 컨테이너로 검증·빌드
#
# 로컬에 npm 이 없으면(OrbStack/Docker만 있는 머신) 검증·빌드를 node:22-alpine 컨테이너에서 돈다.
# rsync 와 curl 은 항상 호스트에서 실행된다.
set -euo pipefail

HOST="bespin-dev-an2-web-1"
DEST="/var/www/nca-exam"
URL="http://15.165.3.90"
NODE_IMAGE="node:22-alpine"
DRY_RUN=""
FORCE_DOCKER=0

for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN="--dry-run" ;;
    --docker)  FORCE_DOCKER=1 ;;
    -*)        echo "알 수 없는 옵션: $arg (사용 가능: --dry-run, --docker)"; exit 2 ;;
    *)         HOST="$arg" ;;
  esac
done

cd "$(dirname "$0")/.."

# npm 이 있으면 그대로, 없으면 컨테이너 — 두 경로의 산출물은 같다 (.env 도 프로젝트 루트에서 동일하게 읽힘)
if [ "$FORCE_DOCKER" = 1 ] || ! command -v npm >/dev/null 2>&1; then
  command -v docker >/dev/null 2>&1 || { echo "npm 도 docker 도 없습니다 — Node 를 설치하거나 OrbStack 을 켜세요"; exit 1; }
  run_npm() { docker run --rm -v "$PWD":/app -w /app "$NODE_IMAGE" npm "$@"; }
  echo "(npm 없음 → $NODE_IMAGE 컨테이너로 검증·빌드)"
else
  run_npm() { npm "$@"; }
fi

echo "== 1/4 문제 데이터 검증"
run_npm run validate:all

echo "== 2/4 빌드 (로컬 — 서버 512MB에서 빌드 금지)"
run_npm run build

echo "== 3/4 rsync → $HOST:$DEST ${DRY_RUN:+(dry-run)}"
rsync -avz --delete $DRY_RUN dist/ "$HOST:$DEST/"
[ -n "$DRY_RUN" ] && { echo "dry-run 종료 — 실제 전송 없음"; exit 0; }

echo "== 4/4 서빙 확인"
code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$URL" || echo "접속 실패")
echo "GET $URL → HTTP $code"
[ "$code" = "200" ] && echo "배포 완료 ✔" || echo "⚠️ 200이 아닙니다 — 서버에서 'sudo nginx -t && sudo systemctl status nginx' 확인"
