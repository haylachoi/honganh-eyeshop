#!/bin/bash
set -e

print_usage() {
  echo "Usage: $0 [-o <os>] [-p <ssh_port>]"
  echo "  -o   OS type: arch or ubuntu (default: auto-detect)"
  echo "  -p   SSH port to allow (default: 22)"
  exit 1
}

OS="auto"
SSH_PORT=22

while getopts "o:p:" opt; do
  case $opt in
    o) OS=$OPTARG ;;
    p) SSH_PORT=$OPTARG ;;
    *) print_usage ;;
  esac
done

# Auto detect OS if not given
if [[ "$OS" == "auto" ]]; then
  if [[ -f /etc/arch-release ]]; then
    OS="arch"
  elif [[ -f /etc/lsb-release || -f /etc/debian_version ]]; then
    OS="ubuntu"
  else
    echo "Unsupported OS"
    exit 1
  fi
fi

echo "Setting up firewall on $OS with SSH port $SSH_PORT..."

if [[ "$OS" == "ubuntu" ]]; then
  sudo ufw allow "$SSH_PORT"
  sudo ufw allow 80
  sudo ufw allow 443
  sudo ufw --force enable
  echo "UFW status:"
  sudo ufw status
elif [[ "$OS" == "arch" ]]; then
  sudo systemctl start firewalld
  sudo systemctl enable firewalld
  sudo firewall-cmd --permanent --add-port="$SSH_PORT"/tcp
  sudo firewall-cmd --permanent --add-service=http
  sudo firewall-cmd --permanent --add-service=https
  sudo firewall-cmd --reload
  echo "firewalld rules:"
  sudo firewall-cmd --list-all
else
  echo "Unsupported OS"
  exit 1
fi

