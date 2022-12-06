FROM alpine:latest

RUN apk update \
    && apk add --no-cache nodejs npm git \
    && npm i -g typescript \
    && addgroup vscode \
    && adduser vscode -G vscode -D
