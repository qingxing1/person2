#!/usr/bin/env bash
set -euo pipefail

DOMAIN="ztcyj.club"
GATEWAY_CONTAINER="nest-admin-gateway"

# 脚本所在目录的上一级即仓库根目录
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CERT_DIR="$REPO_ROOT/nginx/certs"
ACME_BIN="$HOME/.acme.sh/acme.sh"

log() { printf '\033[32m[ssl]\033[0m %s\n' "$*"; }
warn() { printf '\033[33m[warn]\033[0m %s\n' "$*"; }
die() { printf '\033[31m[error]\033[0m %s\n' "$*" >&2; exit 1; }

# ---------- 0. 前置检查 ----------
# 切换为腾讯云新版 API 密钥对检查，避免使用无权限的旧 DP_Id
[ -n "${Tencent_SecretId:-}" ] || die "缺少 Tencent_SecretId。请先 export Tencent_SecretId=<腾讯云 SecretId>"
[ -n "${Tencent_SecretKey:-}" ] || die "缺少 Tencent_SecretKey。请先 export Tencent_SecretKey=<腾讯云 SecretKey>"
command -v curl >/dev/null 2>&1 || die "系统缺少 curl, 请先安装"

if [ -z "${ACME_EMAIL:-}" ]; then
    warn "未设置 ACME_EMAIL, 证书到期提醒邮件将无法送达 (不影响签发)"
fi

mkdir -p "$CERT_DIR"

# ---------- 1. 安装 acme.sh ----------
if [ ! -f "$ACME_BIN" ]; then
    log "安装 acme.sh ..."
    curl -fsSL https://acme.sh | sh -s email="${ACME_EMAIL:-}"
else
    log "acme.sh 已存在, 跳过安装"
fi

[ -x "$ACME_BIN" ] || die "acme.sh 安装失败, 请检查服务器能否访问 get.acme.sh"

# 导出变量，acme.sh 运行时会读取并自动写入 ~/.acme.sh/account.conf
export Tencent_SecretId Tencent_SecretKey

# ---------- 2. 签发证书 ----------
# 【核心修改】：--dns 参数从 dns_dp 变更为 dns_tencent
ISSUE_ARGS=(--issue --server letsencrypt --dns dns_tencent -d "$DOMAIN" -d "*.$DOMAIN" --keylength ec-256)

if [ -n "${ACME_EMAIL:-}" ]; then
    ISSUE_ARGS+=(--accountemail "$ACME_EMAIL")
fi

# 强制重签控制
REISSUE=${REISSUE:-0}
case "${REISSUE}" in
    1|true|yes) 
        ISSUE_ARGS+=(--force)
        log "启用强制重新签发" 
        ;;
esac

log "开始签发 $DOMAIN 与 *.$DOMAIN (腾讯云 DNS 验证, 通常 1-3 分钟)"
"$ACME_BIN" "${ISSUE_ARGS[@]}"

# ---------- 3. 安装证书 + 注册续期钩子 ----------
log "安装证书到 $CERT_DIR"
"$ACME_BIN" --install-cert -d "$DOMAIN" --ecc \
    --key-file "$CERT_DIR/privkey.pem" \
    --fullchain-file "$CERT_DIR/fullchain.pem" \
    --reloadcmd "docker exec $GATEWAY_CONTAINER nginx -s reload || true"

# ---------- 4. 校验产物 ----------
[ -s "$CERT_DIR/fullchain.pem" ] || die "fullchain.pem 未生成"
[ -s "$CERT_DIR/privkey.pem" ] || die "privkey.pem 未生成"
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

然后在服务器本地执行验证 (回环访问避免受 DNS 缓存影响):
curl -fsS --resolve ztcyj.club:443:127.0.0.1 https://ztcyj.club -o /dev/null -w '%{http_code}\n'
curl -fsS --resolve admin.ztcyj.club:443:127.0.0.1 https://admin.ztcyj.club -o /dev/null -w '%{http_code}\n'

从外网检查证书链:
https://ssllabs.com
============================================================
EOF
