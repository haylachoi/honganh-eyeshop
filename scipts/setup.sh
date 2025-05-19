#!/bin/bash
set -e

# Mặc định biến
DOMAIN=""
OS="auto"
FILENAME="nextjs-app"
SSH_PORT="22"

print_usage() {
  echo "Usage: $0 -d <domain> [-o <os>] [-f <filename>] [-s <ssh_port>]"
  echo "  -d   Domain name (required), e.g. example.com"
  echo "  -o   OS type: arch or ubuntu (default: auto-detect)"
  echo "  -f   Nginx config filename (default: nextjs-app)"
  echo "  -s   SSH port (default: 22)"
  exit 1
}

while getopts "d:o:f:s:" opt; do
  case ${opt} in
    d ) DOMAIN=$OPTARG ;;
    o ) OS=$OPTARG ;;
    f ) FILENAME=$OPTARG ;;
    s ) SSH_PORT=$OPTARG ;;
    * ) print_usage ;;
  esac
done

if [ -z "$DOMAIN" ]; then
  echo "Error: domain is required."
  print_usage
fi

# Tự động phát hiện OS nếu chưa truyền
if [[ "$OS" == "auto" ]]; then
  if [[ -f /etc/arch-release ]]; then
    OS="arch"
  elif [[ -f /etc/lsb-release || -f /etc/debian_version ]]; then
    OS="ubuntu"
  else
    echo "Không xác định được hệ điều hành!"
    exit 1
  fi
fi

echo "=== BẮT ĐẦU CÀI ĐẶT TOÀN DIỆN ==="
echo "OS: $OS"
echo "Domain: $DOMAIN"
echo "Nginx config filename: $FILENAME"
echo "SSH Port: $SSH_PORT"
echo ""

# 1. Cài Node.js
echo "--- Step 1: Install Node.js ---"
bash ./install-node.sh -o "$OS"

# 2. Cài MongoDB
echo "--- Step 2: Install MongoDB ---"
bash ./install-mongodb.sh -o "$OS"

# 3. Cài PM2 & khởi động app
echo "--- Step 3: Start app with PM2 ---"
bash ./start-pm2.sh

# 4. Setup PM2 Startup
echo "--- Step 4: Setup PM2 startup ---"
bash ./setup-pm2-startup.sh

# 5. Cấu hình Nginx
echo "--- Step 5: Setup Nginx config ---"
bash ./setup-nginx.sh -d "$DOMAIN" -o "$OS" -f "$FILENAME"

# 6. Cài SSL với Certbot
echo "--- Step 6: Setup SSL ---"
bash ./setup-ssl.sh -d "$DOMAIN" -o "$OS"

# 7. Thiết lập firewall (truyền SSH port)
echo "--- Step 7: Setup firewall ---"
bash ./setup-firewall.sh -o "$OS" -p "$SSH_PORT"

# 8. Cài Fail2Ban
echo "--- Step 8: Setup Fail2Ban ---"
bash ./setup-fail2ban.sh

# 9. Cấu hình SSH 
if [[ -f ./setup-ssh.sh ]]; then
  echo "--- Step 9: Setup SSH config ---"
  bash ./setup-ssh.sh -p "$SSH_PORT"
fi

echo ""
echo "✅ TOÀN BỘ QUÁ TRÌNH CÀI ĐẶT ĐÃ HOÀN TẤT!"

