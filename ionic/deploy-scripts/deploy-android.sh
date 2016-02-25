#!/bin/bash

# get last tag version number
current_tag=$(git describe --abbrev=0 --tags)
echo "Current tag: $current_tag"

# push the app to HockeyApp
# API parameters: http://support.hockeyapp.net/kb/api/api-apps#upload-app
response=$(curl \
  -F "status=2" \
  -F "notify=1" \
  -F "notes=Version v$current_tag" \
  -F "ipa=@../platforms/android/outputs/apk/android-release-unsigned.apk" \
  -H "X-HockeyAppToken:62ba048fb5fc4151b39d7f56a9b56b0f" \
  https://rink.hockeyapp.net/api/2/apps/upload)

echo $response

publink=$(echo $response)

msg="Android Build $current_tag published: $publink"

# publish link to HipChat
ROOM_ID=2441414
AUTH_TOKEN=84c3fe7cf3785dc58ad1997e119136
MESSAGE="$msg"

echo $(curl \
	-v -L -G \
	-d "room_id=$ROOM_ID&from=IonicApp"	\
	--data-urlencode "message=$MESSAGE"	\
	"https://api.hipchat.com/v1/rooms/message?auth_token=${AUTH_TOKEN}&format=json"
	)



  {"apps":[{
    "title":"ionic_experiment",
    "bundle_identifier":"com.ionicframework.ionicexperiment798537",
    "public_identifier":"26809419b03d4fc880dcc3334a71851f",
    "platform":"Android",
    "release_type":0,
    "custom_release_type":null,
    "created_at":"2016-02-24T14:08:38Z",
    "updated_at":"2016-02-25T11:14:49Z",
    "featured":false,
    "id":289488,
    "minimum_os_version":"4.1",
    "device_family":null,
    "status":2,
    "visibility":"private",
    "owner":"Andrew Dick",
    "owner_token":"505913c2abecca01d7fc88988d09651759bb2e9d",
    "company":"Cohaesus"}],

    "status":"success"}