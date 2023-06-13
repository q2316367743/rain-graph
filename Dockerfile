FROM nginx

LABEL org.opencontainers.image.authors="esion"

COPY src-utools/dist/ /usr/share/nginx/html/

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

VOLUME [ "/usr/share/nginx/html/" ]