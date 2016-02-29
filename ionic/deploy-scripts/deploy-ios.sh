#!/bin/bash -u

# get last tag version number
current_tag=$(git describe --abbrev=0 --tags)
echo "Current tag: $current_tag"

# APP_FILE should match the <name> in your config.xml file. 
APP_FILE="Onboard App"

VAR=$(dirname "$PWD")

# This archives the .xcodeproj file generated from [$ ionic build ios]...
/usr/bin/xcodebuild archive -project $VAR/platforms/ios/"$APP_FILE".xcodeproj -scheme "$APP_FILE" -archivePath $VAR/platforms/ios/"$APP_FILE"

# ...then generates an ipa file that we can upload to HockeyApp
/usr/bin/xcrun -sdk iphoneos PackageApplication $VAR/platforms/ios/"$APP_FILE".xcarchive/Products/Applications/"$APP_FILE".app -o $VAR/platforms/ios/build/"$APP_FILE""_v""$current_tag".ipa

# APP_ID can be located by selecting your app on HockeyApp's dashboard. 
APP_ID=2a0012a1204841fb80505ed362fcfdcc

# The API_TOKEN is located in HockeyApp's Account Settings > API Tokens
API_TOKEN=7dad379789524d4b93307967498404ac

# Push to HockeyApp [API parameters: http://support.hockeyapp.net/kb/api/api-apps#upload-app]
response=$(curl \
  -F "status=2" \
  -F "notify=1" \
  -F "notes=Version v$current_tag" \
  -F "ipa=@../platforms/ios/build/$APP_FILE""_v$current_tag.ipa" \
  -H "X-HockeyAppToken:$API_TOKEN" \
  https://rink.hockeyapp.net/api/2/apps/2a0012a1204841fb80505ed362fcfdcc/app_versions/upload)
  
# Pretty prints the JSON object
echo "$response" | python -m json.tool
linkobj=$(echo "$response" | python -m json.tool)

# Publish build info to HipChat project room
ROOM_ID=2441414
AUTH_TOKEN=84c3fe7cf3785dc58ad1997e119136
MESSAGE="iOS Build $current_tag published: $linkobj"

echo $(curl \
	-v -L -G \
	-d "room_id=$ROOM_ID&from=IonicApp"	\
	--data-urlencode "message=$MESSAGE"	\
  -d "message_format=text" \
	"https://api.hipchat.com/v1/rooms/message?auth_token=${AUTH_TOKEN}&format=json"
)