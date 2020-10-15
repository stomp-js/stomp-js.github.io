#!/usr/bin/env bash

set -ex

# usually will receive from calling script, assume develop otherwise
export BRANCH=${BRANCH:-$1}
export BRANCH=${BRANCH:-develop}

source `dirname $0`/config.sh

if [[ "$BRANCH" == "develop" ]]
then
  export DESTINATION=../api-docs/develop/
  export THEME=postmark
  export MESSAGE="These docs correspond to development versions. Please see [api-docs](../latest/) for NPM released versions."
else
  export DESTINATION=../api-docs/latest/
  export THEME=vagrant
  export MESSAGE="These docs correspond to NPM released main line versions. Please see [dev docs](../develop/) for development versions."
fi

# Change to the Node application with Compodoc installed
cd "$BASE"/..

APP_TITLE=`./app-title.rb`

# It will be used by Jekyll pages to show current versions
./pkg-versions.rb > ../_data/versions/$BRANCH.json

# Adjust the README depending on the branch
sed -e "3i$MESSAGE\n" README-src.md > README.md

# Clear the previously generated doc and regenerate
rm -rf "$DESTINATION"
./node_modules/.bin/compodoc \
        -p tsconfig.json \
        -d "$DESTINATION" \
        --disablePrivate --disableProtected --disableInternal --disableGraph \
        --theme "$THEME" --hideGenerator \
        -n "$APP_TITLE" \
        "$@"
