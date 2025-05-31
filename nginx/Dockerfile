# Đặt biến ARG cho version nginx
ARG NGINX_VERSION=1.27.5

FROM ubuntu:24.04 AS builder

ARG NGINX_VERSION
ENV NGINX_VERSION=${NGINX_VERSION}

RUN apt update \
  && apt upgrade -y \
  && apt install -y libpcre3 libpcre3-dev zlib1g zlib1g-dev openssl libssl-dev wget git gcc make libbrotli-dev

WORKDIR /app
RUN wget https://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz \
  && tar -zxf nginx-${NGINX_VERSION}.tar.gz

RUN git clone --recurse-submodules -j8 https://github.com/google/ngx_brotli

RUN cd nginx-${NGINX_VERSION} && ./configure --with-compat --add-dynamic-module=../ngx_brotli \
  && make modules

FROM nginx:${NGINX_VERSION}

COPY --from=builder /app/nginx-${NGINX_VERSION}/objs/ngx_http_brotli_static_module.so /etc/nginx/modules/
COPY --from=builder /app/nginx-${NGINX_VERSION}/objs/ngx_http_brotli_filter_module.so /etc/nginx/modules/

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./brotli.conf /etc/nginx/conf.d/brotli.conf
COPY ./default-location.conf /etc/nginx/conf.d/default-location.conf

