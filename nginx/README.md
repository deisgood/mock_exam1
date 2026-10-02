# nginx 설정 가이드

이 앱은 **정적 SPA**라서 nginx가 하는 일은 "파일 배달"뿐입니다. 뒤에서 Node.js 프로세스가 돌지 않으므로
리버스 프록시(`proxy_pass`) 설정이 없습니다. 서버는 Amazon Linux 2023 · nginx 1.30 기준입니다.

- 설정 파일: [nca-exam.conf](nca-exam.conf)
- 적용: `./scripts/setup-nginx.sh`
- 배포 전체 절차: [../DEPLOY.md](../DEPLOY.md)

---

## 1. 서버의 nginx 파일 구조 (AL2023)

```
/etc/nginx/
├── nginx.conf              메인 설정 — 건드리지 않는다
│   └── http { }
│       ├── include /etc/nginx/conf.d/*.conf;   ← ★ 우리 설정이 여기로 들어온다
│       └── server { server_name _; root /usr/share/nginx/html; }   기본 서버 (AL2023 기본값)
├── conf.d/
│   └── nca-exam.conf       ← 우리가 관리하는 유일한 파일
├── default.d/              기본 server 블록 안에서만 include됨 (우리와 무관)
└── mime.types              Content-Type 매핑
```

**메인 `nginx.conf`은 수정하지 않습니다.** `conf.d/` 에 파일을 하나 놓는 것으로 끝입니다.
패키지 업데이트 시 메인 설정이 덮어써져도 우리 설정은 살아남습니다.

| 항목 | 값 |
|---|---|
| nginx 워커 실행 유저 | **`nginx`** (ec2-user 아님 — 권한 문제의 주 원인) |
| 웹 루트 | `/var/www/nca-exam` (소유자 ec2-user, 권한 755) |
| 로그 | `/var/log/nginx/access.log` · `error.log` |
| SELinux | Permissive (Enforcing으로 바뀌면 아래 트러블슈팅 참고) |

### ⚠️ 알아둬야 할 동작: 우리 블록이 기본 서버(default server)다

`nginx.conf`에서 `include conf.d/*.conf` 가 **AL2023 기본 server 블록보다 먼저** 나옵니다.
nginx는 같은 포트에 여러 server 블록이 있을 때 `default_server` 표시가 없으면 **가장 먼저 정의된 블록**을
기본으로 씁니다. 따라서 :80으로 들어온 요청 중 어떤 `server_name`과도 일치하지 않는 것까지 전부
우리 블록이 받습니다. (기본 블록의 `server_name _;` 의 `_` 는 와일드카드가 아니라 "절대 일치하지 않는 더미 이름"입니다.)

실무적 의미:
- IP로 접속하든, 나중에 도메인을 IP로 연결하든 `server_name` 을 고치기 전에도 일단 동작합니다
- 그래도 도메인이 생기면 `server_name` 에 명시하세요. certbot이 `server_name` 을 보고 인증서를 매칭합니다

---

## 2. 설정 항목별 설명

### SPA 폴백 — 가장 중요한 한 줄

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

요청 경로에 해당하는 파일을 찾고, 없으면 **404 대신 `index.html`을 준다**는 뜻입니다.

이 앱은 화면 전환을 `screen` state로만 해서 URL이 늘 `/` 이지만, 사용자가 주소창에 임의 경로를 입력하거나
나중에 라우터를 붙일 때를 위해 필요합니다. 이 줄이 없으면 `/exam` 같은 주소에서 새로고침 시 404가 뜹니다.

> 검증: `curl -o /dev/null -w '%{http_code}' http://15.165.3.90/foo` → `200` 이어야 정상

### 캐시 전략 — 배포 즉시 반영의 핵심

```nginx
location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
location = /index.html {
    add_header Cache-Control "no-cache";
}
```

Vite 빌드 결과물의 파일명에는 내용 해시가 붙습니다 (`index-BySckcXV.js`). 코드가 바뀌면 **파일명 자체가
바뀌므로** 영구 캐시를 걸어도 낡은 파일을 볼 위험이 없습니다.

반대로 `index.html`은 "지금 어떤 해시 파일을 불러올지" 적힌 색인이라 캐시하면 안 됩니다.
**이 조합이 깨지면 "배포했는데 옛 화면이 보인다" 문제가 생깁니다.**

| 파일 | 캐시 | 이유 |
|---|---|---|
| `/assets/*.js`, `*.css` | 1년 immutable | 파일명에 해시 → 내용이 바뀌면 이름도 바뀜 |
| `/index.html` | no-cache | 새 해시를 가리키는 색인이므로 항상 최신이어야 함 |

### gzip 압축

```nginx
gzip on;
gzip_comp_level 5;
gzip_min_length 1024;
gzip_types text/css application/javascript application/json image/svg+xml;
```

JS 412KB → **약 137KB**로 줄어듭니다. 모바일 접속에서 체감이 큽니다.
`text/html`은 nginx가 기본으로 항상 압축하므로 `gzip_types`에 적지 않습니다.

> 검증: `curl -H "Accept-Encoding: gzip" -o /dev/null -w '%{size_download}' http://15.165.3.90/assets/index-*.js`

### server_name

```nginx
server_name 15.165.3.90;   # 도메인 확보 후: example.com 15.165.3.90
```

도메인이 생기면 앞에 추가하고 `./scripts/setup-nginx.sh` 를 다시 실행하세요.

### 보안 헤더

| 헤더 | 역할 |
|---|---|
| `X-Content-Type-Options: nosniff` | 브라우저의 MIME 타입 추측 차단 |
| `X-Frame-Options: DENY` | 다른 사이트에서 iframe으로 삽입하는 것 차단 (클릭재킹 방어) |
| `Referrer-Policy: strict-origin-when-cross-origin` | 외부로 나갈 때 전체 URL 대신 출처만 전달 |

### Basic Auth (현재 주석 처리됨)

```nginx
# auth_basic "NCA-AIIO Mock Exam";
# auth_basic_user_file /etc/nginx/.htpasswd;
```

> ⚠️ **HTTPS를 적용한 뒤에 주석을 해제하세요.** Basic Auth는 비밀번호를 Base64로만 인코딩해서 보내므로,
> HTTP에서 켜면 네트워크에서 평문으로 읽힙니다. 켜지 않은 것보다 나쁠 수 있습니다.

---

## 3. 적용 방법

### 스크립트 (권장)

```bash
./scripts/setup-nginx.sh
```

하는 일: 업로드 → **기존 설정 백업** → 반영 → `nginx -t` 문법 검증 → reload → 웹 루트 권한 점검 → HTTP 확인.

**문법 오류가 있으면 백업을 되돌리고 reload를 하지 않습니다.** 잘못된 설정으로 사이트가 죽는 일이 없습니다
(nginx는 reload 전까지 기존 설정으로 계속 서비스합니다).

### 수동

```bash
scp nginx/nca-exam.conf bespin-dev-an2-web-1:/tmp/
ssh bespin-dev-an2-web-1 'sudo mv /tmp/nca-exam.conf /etc/nginx/conf.d/ && sudo nginx -t && sudo systemctl reload nginx'
```

> `reload`(무중단 재적용)를 쓰고 `restart`는 쓰지 마세요. restart는 순간적으로 연결이 끊깁니다.

---

## 4. HTTPS 적용 (도메인 확보 후)

1. **Lightsail 콘솔에서 443 개방** — IPv4·IPv6 모두. 서버 안에서는 할 수 없고 콘솔에서만 가능합니다
2. 도메인 A 레코드 → `15.165.3.90` (IPv6도 쓰면 AAAA 추가)
3. `nca-exam.conf` 의 `server_name` 에 도메인 추가 → `./scripts/setup-nginx.sh`
4. 서버에서:

```bash
sudo dnf install -y certbot python3-certbot-nginx   # 패키지명 주의: python3-nginx 가 아님
sudo certbot --nginx -d <도메인>
sudo certbot renew --dry-run                        # 자동 갱신 검증 — 반드시 실행
```

certbot이 `nca-exam.conf` 를 자동으로 수정해 443 listen과 인증서 경로를 넣고, 80 → 443 리다이렉트를 추가합니다.

> ⚠️ **함정**: HTTP-01 챌린지는 갱신할 때마다 **80 포트가 전 세계에 열려 있어야** 합니다.
> 방화벽으로 특정 IP만 허용하면 90일 뒤 갱신이 조용히 실패합니다.
> 접근 제어는 방화벽이 아니라 Basic Auth로 하세요.

> ⚠️ certbot이 설정을 고치므로, 이후 `setup-nginx.sh` 를 다시 실행하면 certbot의 수정분이 날아갑니다.
> HTTPS 적용 후에는 서버의 `/etc/nginx/conf.d/nca-exam.conf` 를 받아와 저장소 파일을 갱신해두세요:
> `scp bespin-dev-an2-web-1:/etc/nginx/conf.d/nca-exam.conf nginx/`

---

## 5. Basic Auth 적용 (HTTPS 적용 후)

```bash
ssh bespin-dev-an2-web-1
sudo dnf install -y httpd-tools
sudo htpasswd -c /etc/nginx/.htpasswd <사용자명>    # 최초 1명 (-c = 파일 새로 생성)
sudo htpasswd /etc/nginx/.htpasswd <다른사용자>     # 추가 시 -c 빼기 (빼지 않으면 기존 계정이 전부 지워짐)
sudo chown root:nginx /etc/nginx/.htpasswd && sudo chmod 640 /etc/nginx/.htpasswd
```

그 다음 `nca-exam.conf` 의 `auth_basic` 두 줄 주석을 해제하고 `./scripts/setup-nginx.sh`.

팀 공유 방식이면 계정 하나를 공유하는 게 현실적입니다 (앱이 사용자를 구분하지 않으므로 계정을
나눠도 의미가 없습니다 — 기록은 각자 브라우저의 localStorage에 남습니다).

---

## 6. 트러블슈팅

| 증상 | 원인·확인 |
|---|---|
| **403 Forbidden** | nginx 워커는 `nginx` 유저로 돕니다. `sudo -u nginx test -r /var/www/nca-exam/index.html` 로 확인. 실패면 `sudo chmod 755 /var/www/nca-exam` |
| **404 Not Found** | 파일이 없는 것. `ls -la /var/www/nca-exam/` 로 `index.html` 존재 확인 → 없으면 `./scripts/deploy.sh` |
| **배포했는데 옛 화면** | `curl -I http://15.165.3.90/ \| grep -i cache` 가 `no-cache` 인지 확인. 맞으면 브라우저 강력 새로고침 (`Cmd/Ctrl+Shift+R`) |
| **설정을 바꿨는데 반영 안 됨** | `sudo nginx -t` 로 문법 확인 후 `sudo systemctl reload nginx`. `conf.d/` 에 파일이 있는지도 확인 |
| **502 / 503** | 이 구성에서는 나올 수 없는 에러입니다(백엔드가 없으므로). 나온다면 누군가 `proxy_pass` 를 추가한 것 |
| **SELinux 403** (Enforcing 시) | `getenforce` → Enforcing이면 `sudo restorecon -Rv /var/www/nca-exam` 또는 `sudo semanage fcontext -a -t httpd_sys_content_t "/var/www/nca-exam(/.*)?"` |
| **certbot 갱신 실패** | 80 포트가 막혔는지 Lightsail 방화벽 확인 → `sudo certbot renew --dry-run` |
| **원인 불명** | `sudo tail -50 /var/log/nginx/error.log` |

### 상태 점검 한 줄

```bash
ssh bespin-dev-an2-web-1 'systemctl is-active nginx; sudo nginx -t; ls -la /var/www/nca-exam/; curl -s -o /dev/null -w "local: %{http_code}\n" http://localhost/'
```
