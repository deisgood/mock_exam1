# 배포 가이드 — Lightsail (bespin-dev-an2-web-1)

정적 SPA를 로컬에서 빌드해 nginx로 서빙한다. **서버에 Node.js 불필요** (512MB RAM — 서버 빌드 금지).

> 로컬에 Node가 없어도 된다. `scripts/deploy.sh`는 `npm`이 PATH에 없으면 검증·빌드를
> `node:22-alpine` 컨테이너(OrbStack/Docker)에서 자동으로 실행한다. rsync·curl은 호스트에서 돈다.

| 항목 | 값 |
|---|---|
| 서버 | Amazon Linux 2023 · 15.165.3.90 · ec2-user |
| SSH | `ssh bespin-dev-an2-web-1` (~/.ssh/config 등록됨) |
| 웹 루트 | /var/www/nca-exam (ec2-user 소유) |
| nginx 설정 | /etc/nginx/conf.d/nca-exam.conf ← 저장소 [nginx/nca-exam.conf](nginx/nca-exam.conf) |

| 스크립트 | 용도 | 실행 시점 |
|---|---|---|
| `scripts/setup-server.sh` | nginx·rsync 설치, 웹 루트 생성, swap 활성화 | 최초 1회 |
| `scripts/setup-nginx.sh` | nginx 설정 적용 (검증·롤백 포함) | 최초 1회 + 설정 변경 시 |
| `scripts/deploy.sh` | 검증 → 빌드(로컬 npm 또는 컨테이너) → rsync → 확인 | **매 배포** |

## 1단계 — 서버 초기 설정 (최초 1회)

```bash
ssh bespin-dev-an2-web-1 'bash -s' < scripts/setup-server.sh
```

nginx·rsync 설치, `/var/www/nca-exam` 생성(ec2-user 소유), swap 활성화, nginx 기동까지 수행.

## 2단계 — nginx 사이트 설정 올리기 (최초 1회 + 설정 변경 시)

```bash
./scripts/setup-nginx.sh
```

업로드 → 기존 설정 백업 → 반영 → `nginx -t` 문법 검증 → reload → 웹 루트 권한 점검 → HTTP 확인.
**문법 오류 시 백업을 되돌리고 reload하지 않으므로 서비스가 중단되지 않습니다** (실제 검증 완료).

> 설정 항목별 상세 설명·트러블슈팅은 [nginx/README.md](nginx/README.md) 참고.

## 3단계 — 배포 (매번)

```bash
./scripts/deploy.sh
```

검증(`npm run validate:all`) → 빌드 → `dist/`만 rsync(--delete) → HTTP 200 확인.
`npm`이 없으면 앞의 두 단계가 컨테이너로 실행된다(`./scripts/deploy.sh --docker`로 강제 가능).
`--dry-run`을 붙이면 rsync가 실제 전송 없이 삭제·변경 목록만 보여준다.

## 4단계 — 확인

브라우저에서 http://15.165.3.90 접속. 새로고침(SPA 폴백)과 시험 진행까지 확인.

---

## 이후 작업 (도메인 확보 후)

### HTTPS (Let's Encrypt)

1. **Lightsail 콘솔에서 443 개방** (IPv4·IPv6 모두 — 현재 미개방)
2. 도메인 A 레코드 → 15.165.3.90 (IPv6 쓰면 AAAA도)
3. `nginx/nca-exam.conf`의 `server_name`에 도메인 추가 → 2단계 재실행
4. 서버에서:
   ```bash
   sudo dnf install -y certbot python3-certbot-nginx   # 패키지명 주의: python3-nginx 아님
   sudo certbot --nginx -d <도메인>
   sudo certbot renew --dry-run                        # 자동 갱신 검증 필수
   ```

> ⚠️ HTTP-01 챌린지는 **80 포트가 전 세계에 열려 있어야** 갱신된다.
> 접근 제어는 방화벽 IP 제한이 아니라 Basic Auth로 할 것.

### Basic Auth (반드시 HTTPS 적용 후 — HTTP에선 비밀번호 평문 노출)

```bash
sudo dnf install -y httpd-tools
sudo htpasswd -c /etc/nginx/.htpasswd <사용자명>   # 추가 사용자는 -c 빼고
```

`nca-exam.conf`의 `auth_basic` 두 줄 주석 해제 → 2단계 재실행.

## 트러블슈팅

| 증상 | 확인 |
|---|---|
| 배포했는데 403/404 | `ls -la /var/www/nca-exam` (index.html 있는지), `sudo nginx -t` |
| SELinux Enforcing에서 403 | `getenforce`가 Enforcing이면: `sudo restorecon -Rv /var/www/nca-exam` |
| 설정 반영 안 됨 | `sudo systemctl reload nginx` 실행했는지, `conf.d`에 파일 있는지 |
| certbot 갱신 실패 | 80 포트가 막혔는지 Lightsail 방화벽 확인 후 `sudo certbot renew --dry-run` |
| 메모리 부족 | `free -h`로 swap 1GiB 활성 확인 (`sudo swapon -a`) |
| `ssh bespin-dev-an2-web-1` 실패 | `~/.ssh/config`에 `Host bespin-dev-an2-web-1` 블록이 있는지(`-01` 아님), `IdentityFile` 키 권한 600 |
| 컨테이너 빌드 후 로컬 `npm run build` 깨짐 | `node_modules`가 리눅스용으로 설치된 것. `rm -rf node_modules && npm ci` |
