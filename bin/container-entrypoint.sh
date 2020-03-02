#!/bin/sh

ON_BEFORE_RUN="${APP_CWD}/source/bin/on-before-run.sh"
ON_RUN="${APP_CWD}/source/bin/on-run.sh"

if [ -f ${ON_BEFORE_RUN} ] && [ $# -gt 0 ]; then
    ${ON_BEFORE_RUN} $@ || exit $?
fi

if [ -f ${ON_RUN} ] && [ $# -gt 0 ]; then
    ${ON_RUN} $@ || exit $?
    exit 0
fi


/bin/bash || exit $?
