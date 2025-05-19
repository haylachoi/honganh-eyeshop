#!/bin/bash

set -e

print_usage() {
  echo "Usage: $0 [-o <os>]"
  echo "  -o, --os   OS type: arch or ubuntu (optional, auto detect if not provided)"
  exit 1
}

OS=""

# Parse args
while [[ $# -gt 0 ]]; do
  case $1 in
    -o|--os)
      OS="$2"
      shift 2
      ;;
    -*)
      echo "Unknown option: $1"
      print_usage
      ;;
    *)
      break
      ;;
  esac
done

# Auto detect OS if not provided
if [[ -z "$OS" ]]; then
  if [ -f /etc/arch-release ]; then
    OS="arch"
  elif [ -f /etc/lsb-release ] || [ -f /etc/debian_version ]; then
    OS="ubuntu"
  else
    echo "Cannot auto detect OS. Please specify with -o arch|ubuntu"
    print_usage
  fi
fi

if [[ "$OS" != "arch" && "$OS" != "ubuntu" ]]; then
  echo "Error: Unsupported OS '$OS'. Only 'arch' or 'ubuntu' supported."
  exit 1
fi

echo "Installing MongoDB on $OS..."

if [[ "$OS" == "arch" ]]; then
  sudo pacman -Sy --noconfirm mongodb
  sudo systemctl enable --now mongodb.service

elif [[ "$OS" == "ubuntu" ]]; then
  wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
  echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -sc)/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
  sudo apt-get update
  sudo apt-get install -y mongodb-org
  sudo systemctl enable mongod
  sudo systemctl start mongod
fi

echo "MongoDB installation completed on $OS."
