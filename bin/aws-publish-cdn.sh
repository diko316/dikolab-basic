#!/bin/sh

. $(dirname $(readlink -m $0))/aws-publish-source

cd ${ROOT_DIR}

[ -d ${ROOT_DIR}/umd ] || make build

# upload to latest
[ "[$1]" = "[-l]" ] && aws s3 sync umd "s3://diko-dev-portfolio/cdn/js/dikolab/basic/latest"

aws s3 sync umd "s3://diko-dev-portfolio/cdn/js/dikolab/basic/${PACKAGE_VERSION}"
