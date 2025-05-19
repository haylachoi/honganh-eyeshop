#!/bin/bash
set -e

USER_NAME=$(whoami)
HOME_DIR=$HOME

echo "Setting up PM2 startup for user $USER_NAME ..."

sudo pm2 startup systemd -u $USER_NAME --hp $HOME_DIR

pm2 save

echo "PM2 startup script generated and saved."
