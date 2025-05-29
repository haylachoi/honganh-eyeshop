FROM ubuntu:24.04 AS builder

RUN apt update \
  && apt upgrade -y \
  && apt install -y libpcre3 libpcre3-dev zlib1g zlib1g-dev openssl libssl-dev wget git gcc make libbrotli-dev

WORKDIR /app
RUN wget https://nginx.org/download/nginx-1.27.5.tar.gz && tar -zxf nginx-1.27.5.tar.gz
RUN git clone --recurse-submodules -j8 https://github.com/google/ngx_brotli
RUN cd nginx-1.27.5 && ./configure --with-compat --add-dynamic-module=../ngx_brotli \
  && make modules

FROM nginx:1.27.5

COPY --from=builder /app/nginx-1.27.5/objs/ngx_http_brotli_static_module.so /etc/nginx/modules/
COPY --from=builder /app/nginx-1.27.5/objs/ngx_http_brotli_filter_module.so /etc/nginx/modules/

# Thay vì override nginx.conf bằng echo như cũ, ta dùng COPY file cấu hình từ host
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./brotli.conf /etc/nginx/conf.d/brotli.conf

