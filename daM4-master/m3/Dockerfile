FROM httpd:alpine

RUN apk update
RUN apk add curl

COPY cgi/* /usr/local/apache2/cgi-bin/
COPY httpd.conf /usr/local/apache2/conf/httpd.conf

EXPOSE 80
