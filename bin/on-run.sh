#!/bin/sh

PROJECT_ROOT=${APP_CWD}/source

cd ${PROJECT_ROOT}

echo "tdd? " $@

case $1 in
  test)
    npm run lint && \
      npm run test && \
      chown -R $(stat -c '%u:%g' ${PROJECT_ROOT}) ${PROJECT_ROOT} || exit $?
    ;;
  build)
    npm run lint && \
      npm run test && \
      npm run build && \
      npm run doc && \
      chown -R $(stat -c '%u:%g' ${PROJECT_ROOT}) ${PROJECT_ROOT} || exit $?
    ;;
  doc)
    npm run doc && \
      chown -R $(stat -c '%u:%g' ${PROJECT_ROOT}) ${PROJECT_ROOT} || exit $?
    ;;
  tdd)
    npm run tdd
    ;;
  ddd)
    chown -R $(stat -c '%u:%g' ${PROJECT_ROOT}) ${PROJECT_ROOT} && \
      npm run doc-dev
    ;;
  clean-source)
    chown -R $(stat -c '%u:%g' ${PROJECT_ROOT}) ${PROJECT_ROOT} && \
      npm run clean || exit $?
    ;;
  *)
    echo "No matching command found: $1"
    ;;
esac
