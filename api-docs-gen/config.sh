export BASE=`dirname $0`/consolidated
export BUNDLES="stompjs rx-stomp ng2-stompjs"

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
