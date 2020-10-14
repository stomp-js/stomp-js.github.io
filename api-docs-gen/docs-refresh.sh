#!/usr/bin/env bash

# by default assume master branch
export BRANCH=${1:-master}

source `dirname $0`/config.sh

rm -rf "$BASE"
mkdir -p "$BASE"
cd "$BASE"


for bundle in $BUNDLES
do
    wget -O $bundle.zip https://github.com/stomp-js/$bundle/archive/$BRANCH.zip
    unzip -o $bundle
    mv $bundle-$BRANCH $bundle
done

cd -
`dirname $0`/doc-gen.sh
