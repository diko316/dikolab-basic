#!/bin/sh

# move node_modules to source
cd ${APP_CWD}/source && \
    rm -Rf node_modules && \
    cp -Rf ${APP_CWD}/cache/node_modules ${APP_CWD}/source/ && \
    chown -r $(stat -c "%u:%g" .) . || exit $?

