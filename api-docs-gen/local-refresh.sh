#!/usr/bin/env bash

source `dirname $0`/config.sh

rm -rf $BASE
mkdir -p $BASE
cd $BASE

for bundle in $BUNDLES
do
    mkdir $bundle
    cp -r ../../../$bundle/src $bundle
done
