#!/usr/bin/env bash

source `dirname $0`/config.sh

cd $BASE/..

WATCHES=`echo $BUNDLES| ruby -e 'puts ARGF.read.split.map{|x| "../../#{x}/src"}.join(" ")'`


./local-refresh.sh; ./doc-gen.sh; date; echo "watching ..."

fswatch -r $WATCHES -o | xargs -n1 -I{} sh -c './local-refresh.sh; ./doc-gen.sh; date; echo "watching ..."'
