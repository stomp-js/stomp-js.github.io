#!/usr/bin/env bash

# usually will receive from calling script, assume develop otherwise
export BRANCH=${BRANCH:-$1}
export BRANCH=${BRANCH:-develop}

source `dirname $0`/config.sh

# Change to the Node application with Compodoc installed
cd $BASE/..

# It will be used by Jekyll pages to show current versions
`dirname $0`/pkg-versions.rb > ../_data/versions/$BRANCH.json

# Adjust the README depending on the branch
sed -e "3i$MESSAGE\n" README-src.md > README.md

# Clear the previously generated doc and regenerate
rm -rf $DESTINATION
./node_modules/.bin/compodoc \
        -p tsconfig.json \
        -d $DESTINATION \
        --disablePrivate --disableProtected --disableInternal --disableGraph \
        --theme $THEME --hideGenerator \
        "$@"
