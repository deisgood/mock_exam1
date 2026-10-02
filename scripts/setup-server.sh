#!/usr/bin/env bash
# 서버 최초 1회 설정 — Amazon Linux 2023 (bespin-dev-an2-web-01)
#
# 로컬에서 실행:
#   ssh bespin-dev-an2-web-1 'bash -s' < scripts/setup-server.sh
#
# 하는 일: nginx·rsync 설치, 배포 디렉터리 생성(ec2-user 소유), swap 활성화 확인.
# nginx 사이트 설정(nginx/nca-exam.conf)은 별도로 scp — DEPLOY.md 참고.
set -euo pipefail

echo "== 1. 패키지 설치 (nginx, rsync)"
sudo dnf install -y nginx rsync

echo "== 2. 배포 디렉터리 생성 — rsync가 sudo 없이 쓰도록 ec2-user 소유"
sudo mkdir -p /var/www/nca-exam
sudo chown ec2-user:ec2-user /var/www/nca-exam
sudo chmod 755 /var/www/nca-exam

echo "== 3. swap 활성화 확인 (fstab 등록은 돼 있음)"
sudo swapon -a 2>/dev/null || true
free -h | grep -i swap

echo "== 4. nginx 기동 + 부팅 시 자동 시작"
sudo systemctl enable --now nginx
systemctl is-active nginx

echo "== 5. SELinux 모드 확인 (AL2023 기본 permissive — Enforcing이면 DEPLOY.md 참고)"
getenforce || true

echo
echo "완료. 다음 단계: nginx/nca-exam.conf 를 서버에 올리고 reload (DEPLOY.md 2단계)"
