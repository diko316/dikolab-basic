#!/bin/sh

PROJECT_ROOT=${APP_CWD}/source

cd ${PROJECT_ROOT}

echo "tdd? " $@

case $1 in
  tdd)
    npm run tdd
    ;;
  doc)
    npm run doc && \
      chown -R $(stat -c '%u:%g' ${PROJECT_ROOT}) ${PROJECT_ROOT}
    ;;
  ddd)
    chown -R $(stat -c '%u:%g' ${PROJECT_ROOT}) ${PROJECT_ROOT} && \
      npm run doc-dev
    ;;
  *)
    echo "No matching command found: $1"
    ;;
esac
