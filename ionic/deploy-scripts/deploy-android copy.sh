#!/bin/bash

# get last tag version number
current_tag=$(git describe --abbrev=0 --tags)
echo "Current tag: $current_tag"

# push the app to HockeyApp
response=$(curl \
  -F "status=2" \
  -F "notify=1" \
  -F "notes=Version v$current_tag" \
  -F "ipa=@android-release-unsigned.apk" \
  -H "X-HockeyAppToken:c1bd646b19644552a974e48cc9ad2616" \
  https://rink.hockeyapp.net/api/2/apps/upload)

echo $response

publink=$(echo $response | json public_url)

msg="Android Build $current_tag published: $publink"

publish link to HipChat
ROOM_ID=2441414
AUTH_TOKEN=84c3fe7cf3785dc58ad1997e119136
MESSAGE="$msg"

echo $(curl \
	-v -L -G \
	-d "room_id=$ROOM_ID&from=HockeyApp"	\
	--data-urlencode "message=$MESSAGE"	\
	"https://api.hipchat.com/v1/rooms/message?auth_token=${AUTH_TOKEN}&format=json"
	)