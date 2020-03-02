#!/bin/sh

cd ${APP_CWD}/source

echo "tdd? " $@

case $1 in
  tdd)
    npm run tdd
    ;;
esac
