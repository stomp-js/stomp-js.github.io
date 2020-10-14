#!/usr/bin/env bash

# Generating locally, by default assume develop
export BRANCH=${1:-develop}

source `dirname $0`/config.sh

mkdir -p "$BASE"
cd "$BASE"

for bundle in $BUNDLES
do
    rsync -av --delete ../../../$bundle/src $bundle
done
