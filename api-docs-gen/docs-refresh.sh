#!/usr/bin/env bash

BASE=`dirname $0`/consolidated
BUNDLES="stompjs rx-stomp ng2-stompjs"

rm -rf $BASE
mkdir -p $BASE
cd $BASE


for bundle in $BUNDLES
do
    wget -O $bundle.zip https://github.com/stomp-js/$bundle/archive/master.zip
    unzip -o $bundle
    mv $bundle-master $bundle
done
