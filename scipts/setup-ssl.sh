#!/bin/bash
set -e

print_usage() {
  echo "Usage: $0 -d <domain> [-o <os>]"
  echo "  -d   Domain name (required)"
  echo "  -o   OS type: arch or ubuntu (default: auto-detect)"
  exit 1
}

DOMAIN=""
OS="auto"

while getopts "d:o:" opt; do
  case $opt in
    d) DOMAIN=$OPTARG ;;
    o) OS=$OPTARG ;;
    *) print_usage ;;
  esac
done

if [ -z "$DOMAIN" ]; then
  echo "Error: domain is required"
  print_usage
fi

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

echo "Installing Certbot and obtaining SSL for $DOMAIN on $OS..."

if [[ "$OS" == "ubuntu" ]]; then
  sudo apt update
  sudo apt install -y certbot python3-certbot-nginx
elif [[ "$OS" == "arch" ]]; then
  sudo pacman -Sy --noconfirm certbot certbot-nginx
else
  echo "Unsupported OS"
  exit 1
fi

sudo certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m your-email@example.com

echo "SSL certificate installed and configured."
