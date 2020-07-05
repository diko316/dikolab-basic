#!/bin/sh

# move node_modules to source
cd ${APP_CWD}/source && \
    rm -Rf node_modules package-lock.json && \
    cp -Rf ${APP_CWD}/cache/node_modules ${APP_CWD}/source/ && \
    cp -f ${APP_CWD}/cache/package-lock.json ${APP_CWD}/source/ && \
    chown -R $(stat -c "%u:%g" .) . || exit $?

echo "Container Ready!"
