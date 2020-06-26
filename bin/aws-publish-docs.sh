#!/bin/sh

. $(dirname $(readlink -m $0))/aws-publish-source

cd ${ROOT_DIR}

[ "[$1]" = "[-b]" ] && make build
[ -d ${ROOT_DIR}/docs ] || make build

# upload docs
aws s3 sync docs "s3://diko-dev-portfolio/javascript/old-docs/dikolab-basic/${PACKAGE_VERSION}" --delete
aws s3 sync docs "s3://diko-dev-portfolio/javascript/dikolab-basic" --delete
