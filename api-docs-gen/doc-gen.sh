#!/usr/bin/env bash

DESTINATION=../api-docs/

rm -rf $DESTINATION

./node_modules/.bin/compodoc \
        -p tsconfig.json \
        -d $DESTINATION \
        --disablePrivate --disableInternal \
        --theme Vagrant --hideGenerator \
        "$@"
