#!/bin/bash

set -e

print_usage() {
  echo "Usage: $0 -d <domain> [-o <os>] [-f <filename>]"
  echo "  -d   Domain name (required), e.g. example.com"
  echo "  -o   OS type: arch or ubuntu (default: auto detect)"
  echo "  -f   Filename for nginx config (default: nextjs-app)"
  exit 1
}

DOMAIN=""
OS=""
FILENAME="nextjs-app"

while getopts "d:o:f:" opt; do
  case ${opt} in
    d )
      DOMAIN=$OPTARG
      ;;
    o )
      OS=$OPTARG
      ;;
    f )
      FILENAME=$OPTARG
      ;;
    * )
      print_usage
      ;;
  esac
done

if [ -z "$DOMAIN" ]; then
  echo "Error: domain is required."
  print_usage
fi

# Auto detect OS if not provided
if [[ -z "$OS" ]]; then
  if [ -f /etc/arch-release ]; then
    OS="arch"
  elif [ -f /etc/lsb-release ] || [ -f /etc/debian_version ]; then
    OS="ubuntu"
  else
    echo "Cannot auto detect OS. Please specify with -o arch|ubuntu"
    exit 1
  fi
fi

if [[ "$OS" != "arch" && "$OS" != "ubuntu" ]]; then
  echo "Unsupported OS option: $OS"
  exit 1
fi

# Paths and variables based on OS
if [[ "$OS" == "arch" ]]; then
  NGINX_SITES_DIR="/etc/nginx/sites"
  NGINX_CONF_PATH="$NGINX_SITES_DIR/$FILENAME.conf"
  INCLUDE_LINE="include /etc/nginx/sites/*.conf;"
elif [[ "$OS" == "ubuntu" ]]; then
  NGINX_SITES_AVAILABLE="/etc/nginx/sites-available"
  NGINX_SITES_ENABLED="/etc/nginx/sites-enabled"
  NGINX_CONF_PATH="$NGINX_SITES_AVAILABLE/$FILENAME"
fi

echo "Creating Nginx config for domain $DOMAIN as file $FILENAME on OS $OS..."

# Create nginx sites dir if not exist (Arch)
if [[ "$OS" == "arch" && ! -d "$NGINX_SITES_DIR" ]]; then
  sudo mkdir -p "$NGINX_SITES_DIR"
fi

# Create config file
sudo tee "$NGINX_CONF_PATH" > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;

        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;

        proxy_cache_bypass \$http_upgrade;
    }

    access_log /var/log/nginx/${FILENAME}-access.log;
    error_log /var/log/nginx/${FILENAME}-error.log;
}
EOF

# On Arch, add include line to nginx.conf if not present
if [[ "$OS" == "arch" ]]; then
  if ! grep -qF "$INCLUDE_LINE" /etc/nginx/nginx.conf; then
    echo "Adding include line to /etc/nginx/nginx.conf"
    sudo sed -i '/http {/a \    '"$INCLUDE_LINE" /etc/nginx/nginx.conf
  fi
fi

# On Ubuntu, create symlink in sites-enabled
if [[ "$OS" == "ubuntu" ]]; then
  if [ ! -L "$NGINX_SITES_ENABLED/$FILENAME" ]; then
    sudo ln -s "$NGINX_CONF_PATH" "$NGINX_SITES_ENABLED/$FILENAME"
  fi
fi

# Test and reload nginx
echo "Testing Nginx config..."
sudo nginx -t

echo "Reloading Nginx..."
sudo systemctl reload nginx

echo "Nginx config for $DOMAIN is set up as $FILENAME and reloaded."

