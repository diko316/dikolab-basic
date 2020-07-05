#!/bin/sh

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


npm uninstall ${PACKAGES}
rm -Rf node_modules package-lock.json

npm install --save-dev ${PACKAGES}
