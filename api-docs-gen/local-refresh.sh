#!/usr/bin/env bash

# Generatinf locally, by default assume devlop
export BRANCH=${1:-develop}

source `dirname $0`/config.sh

mkdir -p $BASE
cd $BASE

for bundle in $BUNDLES
do
    rsync -av --delete ../../../$bundle/src $bundle
done
