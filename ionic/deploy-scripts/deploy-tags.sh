#!/bin/bash

# get the revision number
revision=$(git rev-list --count HEAD)
echo "Revision: $revision"

# get last tag version number
#last_tag=$(git describe --abbrev=0 --tags)
#echo "$last_tag"

# create a version number for a new tag
new_tag=$((revision+1))
echo "$new_tag"

# Announce to HipChat
ROOM_ID=2441414
AUTH_TOKEN=84c3fe7cf3785dc58ad1997e119136
MESSAGE="Starting build $new_tag"

echo $(curl \
	-v -L -G \
	-d "room_id=$ROOM_ID&from=IonicApp"	\
	--data-urlencode "message=$MESSAGE"	\
	"https://api.hipchat.com/v1/rooms/message?auth_token=${AUTH_TOKEN}&format=json"
	)

# change the version name and code in Android Manifest
cat ../platforms/android/AndroidManifest.xml | sed -e "s/android:versionCode\=\"[0-9]*\"/android:versionCode\=\"$new_tag\"/g" > ../platforms/android/AndroidManifest.temp.xml
rm ../platforms/android/AndroidManifest.xml
mv ../platforms/android/AndroidManifest.temp.xml ../platforms/android/AndroidManifest.xml

cat ../platforms/android/AndroidManifest.xml | sed -e "s/android:versionName\=\"[0-9.]*\"/android:versionName\=\"0.1.$new_tag\"/g" > ../platforms/android/AndroidManifest.temp.xml
rm ../platforms/android/AndroidManifest.xml
mv ../platforms/android/AndroidManifest.temp.xml ../platforms/android/AndroidManifest.xml

cat ../config.xml | sed -e "s/version\=\"[0-9.]*\"/version\=\"$new_tag\"/g" > ../config.temp.xml
rm ../config.xml
mv ../config.temp.xml ../config.xml

# change the version in iOS Info.plist
# /usr/libexec/PlistBuddy -c "Set CFBundleVersion 0.1.$new_tag" src/Moleskin.iOS/Info.plist
# /usr/libexec/PlistBuddy -c "Set CFBundleShortVersionString 0.1.$new_tag" src/Moleskin.iOS/Info.plist

# create a new tag and push it to VCS
git tag -a $new_tag -m "Cohaesus App v$new_tag"
git push origin --tags