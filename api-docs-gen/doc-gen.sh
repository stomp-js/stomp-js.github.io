#!/usr/bin/env bash

# usually will receive from calling script, assume develop otherwise
export BRANCH=${BRANCH:-$1}
export BRANCH=${BRANCH:-develop}

source `dirname $0`/config.sh

rm -rf $DESTINATION

cd $BASE/..

sed -e "3i$MESSAGE\n" README-src.md > README.md

./node_modules/.bin/compodoc \
        -p tsconfig.json \
        -d $DESTINATION \
        --disablePrivate --disableProtected --disableInternal --disableGraph \
        --theme $THEME --hideGenerator \
        "$@"
