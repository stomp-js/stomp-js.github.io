#!/usr/bin/env bash

source `dirname $0`/config.sh

mkdir -p $BASE
cd $BASE

for bundle in $BUNDLES
do
    rsync -av ../../../$bundle/src $bundle
done
