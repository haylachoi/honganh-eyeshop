#!/bin/bash

# Đường dẫn file ecosystem config
CONFIG_FILE="./ecosystem.config.js"

# Kiểm tra PM2 đã cài chưa, nếu chưa thì cài
if ! command -v pm2 &> /dev/null
then
    echo "PM2 chưa được cài, cài đặt..."
    npm install -g pm2
fi

# Start hoặc reload app với PM2
pm2 start $CONFIG_FILE --env production --update-env || pm2 reload $CONFIG_FILE --env production --update-env

# Lưu config để pm2 tự động khởi động khi reboot server
pm2 save

echo "PM2 đã khởi chạy ứng dụng với config $CONFIG_FILE"
