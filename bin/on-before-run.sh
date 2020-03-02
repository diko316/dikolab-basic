#!/bin/sh

# move node_modules to source
cd ${APP_CWD}/source && \
    rm -Rf node_modules && \
    cp -Rf ${APP_CWD}/cache/node_modules ${APP_CWD}/source/ && \
    chown -R $(stat -c "%u:%g" .) . || exit $?

echo "Container Ready!"
