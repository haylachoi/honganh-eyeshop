#!/bin/bash
set -e

print_usage() {
  echo "Usage: $0 [-o <os>]"
  echo "  -o   OS type: arch or ubuntu (default: auto-detect)"
  exit 1
}

OS="auto"

while getopts "o:" opt; do
  case $opt in
    o) OS=$OPTARG ;;
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

echo "Installing Node.js on $OS..."

if [[ "$OS" == "arch" ]]; then
  sudo pacman -Sy --noconfirm nodejs npm
elif [[ "$OS" == "ubuntu" ]]; then
  curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
  sudo apt-get install -y nodejs
else
  echo "Unsupported OS"
  exit 1
fi

echo "Node.js version: $(node -v)"
echo "NPM version: $(npm -v)"
