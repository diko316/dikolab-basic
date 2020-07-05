#!/bin/sh

mkdir -p ${APP_CWD}/source

apk add --no-cache bash || exit $?

cp ${APP_CWD}/setup/container-entrypoint.sh /usr/local/bin/entrypoint.sh && \
    chmod +x /usr/local/bin/entrypoint.sh || exit $?

cd ${APP_CWD}/cache

############## install packages
PACKAGES=

while read PACK; do
  if [ "[${PACKAGES}]" = "[]" ]; then
    PACKAGES="${PACK}"
  else
    PACKAGES="${PACKAGES}
${PACK}"
  fi
done <<PACK
$(cat package.json | jq '.devDependencies | keys' | jq -r '.[]')
PACK

rm -Rf node_modules package-lock.json

npm uninstall ${PACKAGES} && \
  npm install -y -dd --save-dev ${PACKAGES} || exit $?

