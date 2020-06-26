#!/bin/sh

EXEC_PATHS="${APP_CWD}/source/bin"
ON_BEFORE_RUN="${EXEC_PATHS}/on-before-run.sh"
ON_RUN="${EXEC_PATHS}/on-run.sh"

if [ -f ${ON_BEFORE_RUN} ]; then
  chmod +x ${ON_BEFORE_RUN} && \
    ${ON_BEFORE_RUN} || exit $?
else
  echo "Script not found ${ON_BEFORE_RUN}"
fi

if [ -f ${ON_RUN} ] && [ $# -gt 0 ]; then
  chmod +x ${ON_RUN} && \
    ${ON_RUN} $@ || exit $?
  exit 0
fi

/bin/bash || exit $?
