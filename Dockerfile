FROM node:12.16.1-alpine3.10

ENV APP_CWD=/opt/app

COPY bin/* $APP_CWD/setup/
COPY package.json $APP_CWD/cache/package.json
COPY package-lock.json $APP_CWD/cache/package-lock.json

RUN cd $APP_CWD && \
    chmod -R +x setup/* && \
    setup/container-provision.sh && \
    rm -Rf $APP_CWD/setup

WORKDIR ${APP_CWD}/source

ENTRYPOINT ["entrypoint.sh"]

