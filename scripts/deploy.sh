#!/bin/bash
set -e

COMPOSE_FILE="/srv/app/docker-compose.prod.yml"

echo "========================================"
echo " Blog-Chat Deploy Start"
echo "========================================"

# ────────────────────────────────────────────
# 1. 최신 이미지 pull
# ────────────────────────────────────────────
echo ""
echo "[1/5] Pulling latest images..."
docker compose -f "$COMPOSE_FILE" pull

# ────────────────────────────────────────────
# 2. MySQL 먼저 기동 (헬스체크 통과까지 대기)
# ────────────────────────────────────────────
echo ""
echo "[2/5] Starting MySQL..."
docker compose -f "$COMPOSE_FILE" up -d mysql

echo "Waiting for MySQL to be healthy..."
TIMEOUT=90
ELAPSED=0
until docker compose -f "$COMPOSE_FILE" ps mysql | grep -q "(healthy)"; do
  if [ "$ELAPSED" -ge "$TIMEOUT" ]; then
    echo "ERROR: MySQL did not become healthy within ${TIMEOUT}s"
    exit 1
  fi
  sleep 3
  ELAPSED=$((ELAPSED + 3))
  echo "  ...waiting (${ELAPSED}s)"
done
echo "MySQL is healthy."

# ────────────────────────────────────────────
# 3. DB 마이그레이션 실행
# ────────────────────────────────────────────
echo ""
echo "[3/5] Running DB migrations..."
docker compose -f "$COMPOSE_FILE" --profile migrate run --rm migrate
echo "Migrations complete."

# ────────────────────────────────────────────
# 4. 전체 서비스 기동 (app, nginx 포함)
# ────────────────────────────────────────────
echo ""
echo "[4/5] Starting all services..."
docker compose -f "$COMPOSE_FILE" up -d --remove-orphans

# ────────────────────────────────────────────
# 5. 오래된 이미지 정리
# ────────────────────────────────────────────
echo ""
echo "[5/5] Cleaning up dangling images..."
docker image prune -f

echo ""
echo "========================================"
echo " Deploy Complete!"
echo "========================================"
