#!/usr/bin/env bash

set -ex

git config --global user.email "deepak@kreatio.com"
git config --global user.name "Deepak Kumar"

git add -A

message=$(
echo "Committed by Github action"
echo

for i in master develop; do
  echo -n "$i: "
  cat _data/versions/$i.json
done
)

if git commit -m "$message"
then
  git push origin HEAD
fi
