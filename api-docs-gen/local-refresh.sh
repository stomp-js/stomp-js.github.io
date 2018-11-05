#!/usr/bin/env bash

BASE=`dirname $0`/consolidated
BUNDLES="stompjs rx-stomp ng2-stompjs"

rm -rf $BASE
mkdir -p $BASE
cd $BASE

for bundle in $BUNDLES
do
    mkdir $bundle
    cp -r ../../../$bundle/src $bundle
done
