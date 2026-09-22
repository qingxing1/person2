#!/usr/bin/env bash
set -euo pipefail

DOMAIN="zecyj.club"
GATEWAY_CONTAINER="nest-admin-gateway"

# 脚本所在目录的上一级即仓库根目录, 不依赖 CI 的 DEPLOY_DIR 变量
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CERT_DIR="$REPO_ROOT/nginx/certs"
ACME_BIN="$HOME/.acme.sh/acme.sh"

log()  { printf '\033[32m[ssl]\033[0m %s\n' "$*"; }
warn() { printf '\033[33m[warn]\033[0m %s\n' "$*"; }
die()  { printf '\033[31m[error]\033[0m %s\n' "$*" >&2; exit 1; }

# ---------- 0. 前置检查 ----------
[ -n "${DP_Id:-}" ]  || die "缺少 DP_Id。请先 export DP_Id=<DNSPod API ID>"
[ -n "${DP_Key:-}" ] || die "缺少 DP_Key。请先 export DP_Key=<DNSPod API Token>"

command -v curl >/dev/null 2>&1 || die "系统缺少 curl, 请先安装"

if [ -z "${ACME_EMAIL:-}" ]; then
    warn "未设置 ACME_EMAIL, 证书到期提醒邮件将无法送达 (不影响签发)"
fi

mkdir -p "$CERT_DIR"

# ---------- 1. 安装 acme.sh ----------
if [ ! -f "$ACME_BIN" ]; then
    log "安装 acme.sh ..."
    curl -fsSL https://get.acme.sh | sh -s email="${ACME_EMAIL:-}"
else
    log "acme.sh 已存在, 跳过安装"
fi
[ -x "$ACME_BIN" ] || die "acme.sh 安装失败, 请检查服务器能否访问 get.acme.sh"

# DNS API 凭据写入 acme.sh 的 account.conf, 后续续期时自动复用
# shellcheck source=/dev/null
export DP_Id DP_Key

# ---------- 2. 签发证书 ----------
ISSUE_ARGS=(--issue --server letsencrypt --dns dns_dp -d "$DOMAIN" -d "*.$DOMAIN" --keylength ec-256)
if [ -n "${ACME_EMAIL:-}" ]; then
    ISSUE_ARGS+=(--accountemail "$ACME_EMAIL")
fi
# 强制重签: 证书出问题时 REISSUE=1 bash scripts/init-ssl.sh
case "${REISSUE:-0}" in
    1|true|yes) ISSUE_ARGS+=(--force); log "启用强制重新签发" ;;
esac

log "开始签发 $DOMAIN 与 *.$DOMAIN (DNS 验证, 通常 1-3 分钟)"
"$ACME_BIN" "${ISSUE_ARGS[@]}"

# ---------- 3. 安装证书 + 注册续期钩子 ----------
log "安装证书到 $CERT_DIR"
"$ACME_BIN" --install-cert -d "$DOMAIN" --ecc \
    --key-file       "$CERT_DIR/privkey.pem" \
    --fullchain-file "$CERT_DIR/fullchain.pem" \
    --reloadcmd      "docker exec $GATEWAY_CONTAINER nginx -s reload || true"

# ---------- 4. 校验产物 ----------
[ -s "$CERT_DIR/fullchain.pem" ] || die "fullchain.pem 未生成"
[ -s "$CERT_DIR/privkey.pem" ]   || die "privkey.pem 未生成"
chmod 600 "$CERT_DIR/privkey.pem"

log "证书使用者与有效期:"
openssl x509 -in "$CERT_DIR/fullchain.pem" -noout -subject -dates -ext subjectAltName 2>/dev/null || \
    warn "openssl 不可用, 跳过证书信息打印"

log "续期 cron 状态:"
crontab -l 2>/dev/null | grep acme.sh || warn "未找到 acme.sh 的 cron, 请检查 cron 服务是否运行"

cat <<EOF

============================================================
证书就绪。接下来启动网关容器:

    cd $REPO_ROOT
    docker compose up -d gateway

然后验证 (在服务器上执行, 回环访问避免受 DNS 缓存影响):

    curl -fsS --resolve www.zecyj.club:443:127.0.0.1   https://www.zecyj.club/api/health
    curl -fsS --resolve admin.zecyj.club:443:127.0.0.1 https://admin.zecyj.club/ -o /dev/null -w '%{http_code}\n'

从外网检查证书链:

    https://www.ssllabs.com/ssltest/analyze.html?d=www.zecyj.club
============================================================
EOF
