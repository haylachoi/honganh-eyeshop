#!/bin/bash
set -e

# Mặc định port
SSH_PORT=22

# Xử lý tham số
while getopts "p:" opt; do
  case ${opt} in
    p )
      SSH_PORT=$OPTARG
      ;;
    * )
      echo "Usage: $0 [-p <ssh_port>]"
      exit 1
      ;;
  esac
done

echo "===> Thiết lập SSH với port: $SSH_PORT"

# Sao lưu file config gốc
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak.$(date +%F-%H%M%S)

# Thay đổi config
sudo sed -i "s/^#\?Port .*/Port $SSH_PORT/" /etc/ssh/sshd_config
sudo sed -i "s/^#\?PermitRootLogin .*/PermitRootLogin no/" /etc/ssh/sshd_config
# sudo sed -i "s/^#\?PasswordAuthentication .*/PasswordAuthentication yes/" /etc/ssh/sshd_config
sudo sed -i "s/^#\?ChallengeResponseAuthentication .*/ChallengeResponseAuthentication no/" /etc/ssh/sshd_config
sudo sed -i "s/^#\?UsePAM .*/UsePAM yes/" /etc/ssh/sshd_config

# Khởi động lại SSH
echo "===> Khởi động lại sshd..."
sudo systemctl restart sshd

# Kiểm tra status
echo "===> Trạng thái SSH:"
sudo systemctl status sshd --no-pager

echo "✅ SSH đã được cấu hình xong với port $SSH_PORT"
