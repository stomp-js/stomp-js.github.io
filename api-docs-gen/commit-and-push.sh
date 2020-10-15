#!/usr/bin/env bash

set -ex

git config --global user.email "deepak@kreatio.com"
git config --global user.name "Deepak Kumar"

git add -A

if git commit -m "Committed by Github action"
then
  git push origin HEAD
fi
