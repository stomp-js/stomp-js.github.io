#!/usr/bin/env bash

source `dirname $0`/config.sh

rm -rf $BASE
mkdir -p $BASE
cd $BASE


for bundle in $BUNDLES
do
    wget -O $bundle.zip https://github.com/stomp-js/$bundle/archive/master.zip
    unzip -o $bundle
    mv $bundle-master $bundle
done

cd -
`dirname $0`/doc-gen.sh
