#!/bin/bash
set -e

# Tự động phát hiện OS
if [[ -f /etc/arch-release ]]; then
  OS="arch"
elif [[ -f /etc/lsb-release || -f /etc/debian_version ]]; then
  OS="ubuntu"
else
  echo "Không xác định được hệ điều hành!"
  exit 1
fi

echo "===> Cài đặt Fail2Ban cho $OS"

if [[ "$OS" == "arch" ]]; then
  sudo pacman -Sy --noconfirm fail2ban
  sudo systemctl enable fail2ban
  sudo systemctl start fail2ban
elif [[ "$OS" == "ubuntu" ]]; then
  sudo apt update
  sudo apt install -y fail2ban
  sudo systemctl enable fail2ban
  sudo systemctl start fail2ban
fi

# Cấu hình fail2ban đơn giản
echo "===> Thiết lập cấu hình SSH cơ bản cho Fail2Ban..."
sudo tee /etc/fail2ban/jail.local > /dev/null <<EOF
[sshd]
enabled = true
port    = ssh
logpath = %(sshd_log)s
backend = auto
maxretry = 5
bantime = 3600
EOF

sudo systemctl restart fail2ban

echo "✅ Fail2Ban đã được cài đặt và kích hoạt."
