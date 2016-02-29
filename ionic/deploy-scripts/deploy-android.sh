#!/bin/bash

# get last tag version number
current_tag=$(git describe --abbrev=0 --tags)
echo "Current tag: $current_tag"

echo $directory
# push the app to HockeyApp
# API parameters: http://support.hockeyapp.net/kb/api/api-apps#upload-app
response=$(curl \
  -F "status=2" \
  -F "notify=1" \
  -F "notes=Version v$current_tag" \
  -F "version=$current_tag" \
  -F "shortversion=0.1.$current_tag" \
  -F "ipa=@../platforms/android/build/outputs/apk/android-release-unsigned.apk" \
  -H "X-HockeyAppToken:7dad379789524d4b93307967498404ac" \
  https://rink.hockeyapp.net/api/2/apps/26809419b03d4fc880dcc3334a71851f/app_versions/upload)

# Pretty prints the JSON object to break variables to a new line
echo "$response" | python -m json.tool
linkobj=$(echo "$response" | python -m json.tool)

msg="Android Build $current_tag published: $linkobj"

# publish link to HipChat
ROOM_ID=2441414
AUTH_TOKEN=84c3fe7cf3785dc58ad1997e119136
MESSAGE="$msg"

echo $(curl \
	-v -L -G \
	-d "room_id=$ROOM_ID&from=IonicApp"	\
	--data-urlencode "message=$MESSAGE"	\
  -d "message_format=text" \
	"https://api.hipchat.com/v1/rooms/message?auth_token=${AUTH_TOKEN}"
)