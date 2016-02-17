# banana

### Checklist:
- Gulp
- Backend (Express, Hapi, Parse)
- Sass/css framework (bootstrap, Foundtation, etc)
- BDD/TDD (cucumber.js?)
- Analytics (Google?)
- Database (Mongo?)
- Emulator (Genymotion?)
- [Foreman](https://www.npmjs.com/package/foreman) for combining tasks? 
- Deployment and staging server (heroku?)
- ios TestFlight app 

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
- [protractor](http://www.protractortest.org/#/): for testing Angular.js
- [mocha](https://www.npmjs.com/package/mocha): a popular assertion library in JS.

###Doing tests:
0. Run `$ npm install -g cucumber `
1. Write your gherkin tests in `ionic/features/*.feature`
2. then create a JS file in step_definition with the same name underscore steps.js (see example in features folder)
3. run `gulp cucumber`

# Database
- PostgreSQL + pg (npm package) + knex (query builder)
- MongoDB + Mongoose
