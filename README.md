# banana

# Mobile App
- Install ionic 
```{engine='bash'}
$ npm install -g cordova ionic
```

- In order for ionic to work with android you will need the following
	- Install the [Android SDK](http://developer.android.com/sdk/installing/index.html?pkg=tools)
	- You will need to install platform tools as well as some additional items, check out the [Ionic Installation Guide](http://ionicframework.com/docs/guide/installation.html)
	- You will need an emulator, we highly recommend genymotion, it is easier to setup and faster, not that you will use the ``` ionic run android ``` command to test with genymotion as opposed to ``` ionic emulate android ```
- Ionic iOS should be straightforward to install from a mac

### Developing the ionic app
- The ionic files to be edited are in the `www` folder, from there you can run `ionic serve` where you will be able see your changes in the browser on live-reload.
- Run `gulp watch` in another termial tab to bundle up the javascript files, run sass etc.


# Emulating Android on Mac

### via Cordova
- Install Java for Mac OSX (http://www.java.com/en/download/mac_download.jsp).
- Download the Android SDK (http://developer.android.com/sdk/installing/index.html?pkg=tools).
- Open the Android SDK. Navigate to tools. Run android. 
	- If it errors ['To view this web content, you need to...''], download the legacy Java SE 6 runtime (https://support.apple.com/kb/DL1572?locale=en_US).
- Android SDK Tools should appear as Installed. Install your desired Android SDK Platform(s), Android SDK Build Tools (>= v19.1.0), and Android Support Repository (Extras).
- Update PATH in ~./bash_profile to point to the android SDK, e.g. export PATH=${PATH}:/Users/<CohaesusEmployee>/Development/android-sdk/platform-tools:/Users/<CohaesusEmployee>/Development/android-sdk/tools ()
- Save and then run this in your terminal: $ source ~/.bash_profile 
- Configure your Android devices via Tools > Manage AVDs in the Android SDK. 

### via GenyMotion (recommended)
- Create and verify a Genymotion account (https://www.genymotion.com)
- Download Genymotion (https://www.genymotion.com/download/)
- Drag Genymotion into the Applications folder (Genymotion shell optional), then launch. 
- Add your desired devices to the program. Double click a device to launch (alternatively, highlight and press Start).
- In your terminal, use the following command (with your device open in Genymotion): $ ionic run android


# API
- You will need node.js, if you don't have it already,  for the backend API
- You will also the express framework for node 
	- ``` $ npm install express --save ```
- You will also need loopback for creating your APIs quickly
	- ```$ npm install -g strongloop ```
	- ``` slc loopback ```
	- To access the gui editor for making your models type:
		- ``` slc arc ```
		- Otherwise you can use the CLI
	- You will need to install the connector for your db of choice 
	- ``` npm install loopback-connector-postgresql --save ```
- You will need a Database, you can use heroku, or something local to get started
	- (we reccomend postgreSQL, as it is easier to manipulate the data structure of relational databases as you go along.)



# Testing
For Testing we are using the following: 
- [gherkin](https://github.com/cucumber/cucumber/wiki/Gherkin): for BDD to write in human-readable language (especially useful for non-techies)
- [cucumber](https://github.com/cucumber/cucumber-js): takes gherkin syntax and converts it into JS
- [protractor](http://www.protractortest.org/#/): for End2End testing in Angular.js
- [mocha](https://www.npmjs.com/package/mocha): a popular assertion library in JS.

### Doing tests:
0. Run `$ npm install -g cucumber `
1. Write your gherkin tests in `ionic/features/*.feature`
2. then create a JS file in step_definition with the same name underscore steps.js (see example in features folder)
3. run `gulp cucumber`, you could also run `cucumber.js`
4. then copy the gherkin converted js code and paste it into the JS file you created in step_definitions, now you can add your assertions etc.

# Database
- PostgreSQL + pg (npm package) + knex (query builder)
- MongoDB + Mongoose
