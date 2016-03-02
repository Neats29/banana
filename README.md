# banana (333)
==================

## Setup
To start, please clone the project and install the following:
- `$ npm install -g gulp, bower, cucumber, cordova ionic, strongloop`
- `$ npm install` (to get all the dependencies)

Run `$ gulp` (Default task) to generate your dist folder in ionic/www

To create a new project, you can follow Ionic's [installation guide] (http://ionicframework.com/docs/guide/installation.html).


## Configure Platforms

[**iOS**] (http://cordova.apache.org/docs/en/3.4.0/guide/platforms/ios/index.html#iOS%20Platform%20Guide) (Mac only)

[**Android**] (http://cordova.apache.org/docs/en/3.4.0/guide/platforms/android/index.html#Android%20Platform%20Guide)


## CSS Framework

### SASS
- SASS structure is based on [Inverted the Triangle CSS] (http://www.creativebloq.com/web-design/manage-large-css-projects-itcss-101517528) (ITCSS), courtesy of Harry Roberts.
- It is important that you load in any files your create in the correct order in the main.scss file. 
- Each folder contains a readme.md file, which explains the expected content.

### Angular-ui-Bootstrap
- We have also installed Bootstrap components written in pure AngularJS. You can view the documentation [here] (https://angular-ui.github.io/bootstrap/).

### Bootstrap CSS
- The Bootstrap CSS library is a listed dependancy of the angular-ui-bootstrap module, so you also have access to the [Bootstrap CSS library] (http://getbootstrap.com/css/).

### CSS
- We have left in a default style.css in the www folder. Use either this or SASS (found in scss in the parent directory). DO not use both, as the SASS 


## Emulation
### Browser (live reload)
- In your ionic folder run `$ ionic serve` from the terminal.
- The Gulp Watch task will automatically run when you use the browser emulation. When changes made to any HTML, CSS, or JavaScript files are saved, Gulp will recompile your dist files and then automatically reload the browser.

### iOS
- Mac only
- Inside your ionic folder, build the app via the terminal `$ ionic build ios`
- Emulate the build `$ ionic emulate ios`

### Android
#### via Cordova
- Make sure [Java for Mac OSX] (http://www.java.com/en/download/mac_download.jsp) and the [Android SDK] (http://developer.android.com/sdk/installing/index.html?pkg=tools) are installed.
- Open the Android SDK. Navigate to tools. Run android - If it errors ['To view this web content, you need to...'], download the legacy [Java SE 6 runtime] (https://support.apple.com/kb/DL1572?locale=en_US)).
- Install your desired Android SDK Platform(s), Android SDK Tools, Android SDK Build Tools (>= v19.1.0), SDK Platform Tools and Android Support Repository (found in Extras).
- Update PATH in ~./bash_profile to point to the android SDK, e.g. export PATH=${PATH}:/Users/CohaesusEmployee/Development/android-sdk-macosx/platform-tools:/Users/CohaesusEmployee/Development/android-sdk-macosx/tools ()
- Save and then run this in your terminal: `$ source ~/.bash_profile`
- Configure your Android devices via Tools > Manage AVDs in the Android SDK.
- Inside your ionic folder, build the app via the terminal `$ ionic build android`
- Emulate the build `$ ionic emulate android`

#### via GenyMotion [recommended]
- Create and verify a [Genymotion] (https://www.genymotion.com) account.
- [Download] (https://www.genymotion.com/download/) and install Genymotion.
- Add your desired devices to the program. Double click a device to launch (alternatively, highlight and press Start).
- Inside your ionic folder, build the app via the terminal `$ ionic build android`
- Emulate the build (with your device open in Genymotion) `$ ionic run android `


## API
- You will need node.js, if you don't have it already,  for the backend API
- You will also the express framework for node
	- ``` $ npm install express --save ```
- You will also need loopback for creating your APIs quickly
	- ``` slc loopback ```
	- To access the gui editor for making your models type:
		- ``` slc arc ```
		- Otherwise you can use the CLI
	- You will need to install the connector for your db of choice
	- ``` npm install loopback-connector-postgresql --save ```
- You will need a Database, you can use heroku, or something local to get started
	- (we reccomend postgreSQL, as it is easier to manipulate the data structure of relational databases as you go along.)


## HockeyApp
### Setup
- We are using Hockeyapp to distribute builds to approved devices. 
- Request an invitation to the Cohaesus HockeyApp account / create a free [account] (https://rink.hockeyapp.net/registrations/new)
- At this point there are no scripts to initially create the apps. Either navigate to the HockeyApp [dashboard] (https://rink.hockeyapp.net/manage/dashboard) and drag & drop the .apk/.ipa files, or alternatively download [HockeyApp for Mac] (http://hockeyapp.net/releases/mac/) and upload the files directly.   
- Add your devices to your profile. 
- Collect the App IDs (located by selecting the app from the dashboard) and [generate API tokens] (https://rink.hockeyapp.net/manage/auth_tokens) for the apps. Update the deploy-scripts files accordingly.

### Deploying to HockeyApp
#### Android (.apk)
##### Initial Setup
1. In the ionic directory, run `$ ionic build android'
2. Follow [these instructions](http://ionicframework.com/docs/guide/publishing.html) to generate and sign the .apk file.

##### Future Deployment
1. Run the Deploy Android Gulp task `$ gulp deploy-Android`

#### iOS (.ipa)
##### Initial Setup
- In the ionic directory, run `$ ionic build ios`
- Request an invitation to the 'Cohaesus Projects Ltd' Apple Developer Account.
- Navigate to Xcode > Preferences > Account.
- Import your developer profile using the cog (next to the plus symbol).
- Open Xcode. Import the .xcodeproj generated from `$ ionic build ios`.
- Select Product > Clean.
- If you experience the following error: “Missing iOS Distribution signing identity for …”, [this] (http://stackoverflow.com/questions/32821189/xcode-7-error-missing-ios-distribution-signing-identity-for) should resolve it.

##### Future Deployment
1. Run the Deploy iOS Gulp task `$ gulp deploy-iOS`


## Testing
For Testing we are using the following:
- [gherkin](https://github.com/cucumber/cucumber/wiki/Gherkin): for BDD to write in human-readable language (especially useful for non-techies)
- [cucumber](https://github.com/cucumber/cucumber-js): takes gherkin syntax and converts it into JS
- [protractor](http://www.protractortest.org/#/): for End2End testing in Angular.js
- [mocha](https://www.npmjs.com/package/mocha): a popular assertion library in JS.

### Doing tests:
1. Write your gherkin tests in `ionic/features/*.feature`
2. then create a JS file in step_definition with the same name underscore steps.js (see example in features folder)
3. run `gulp cucumber`, you could also run `cucumber.js`
4. then copy the gherkin converted js code and paste it into the JS file you created in step_definitions, now you can add your assertions etc.

# Database
- PostgreSQL + pg (npm package) + knex (query builder)
- MongoDB + Mongoose
