//http://chaijs.com/
var chai = require('chai');

//https://github.com/domenic/chai-as-promised/
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var expect = chai.expect;

var baseUrl = 'http://localhost:8100/#/app';
var profileUrl = baseUrl + '/profile';

// TODO: Write tests
module.exports = function () {

  this.When(/^I navigate to '\/profile'$/, function (next) {
    browser.get(profileUrl).then(next);
  }, 100000);

  this.Then(/^I should arrive at the profile page$/, function (next) {
    browser.getCurrentUrl().then(function (url) {
      expect(url).to.equal(profileUrl);
    }, next);

    // in the case of an error, call the next function passing in the error object
  });
  this.Given(/^I am on the profile page$/, function (next) {
    browser.getCurrentUrl().then(function (url) {
      expect(url).to.equal(profileUrl);
      next();
    }, next);
  });

  this.Then(/^I should see inputs to enter my details$/, function (next) {
    var elementsPromise = browser.findElements(By.tagName('input')).then(function (results) {
      expect(results.length).to.equal(5);
      next();
    });
  });

  this.When(/^I enter my details$/, function (next) {

    browser.findElements(By.tagName('input')).then(function (inputs) {
      var values = [];

      //push each value into the array during the promise callback
      inputs.forEach(function (input) {
        input.sendKeys("test string");
        input.getAttribute('value').then(function (value) {
          values.push(value);
          checkValues();
        });
      });

      var checkValues = function () {
        // check if all the callbacks have finished
        if (values.length === inputs.length) {
          values.forEach(function (value) {
            expect(value).to.be.ok;
          });
          next();
        }
      }
    });
  });

  this.When(/^I click the save button$/, function (next) {
    // Write code here that turns the phrase above into concrete actions
    next.pending();
  });

  this.Then(/^my details should be saved to the server$/, function (next) {
    // Write code here that turns the phrase above into concrete actions
    next.pending();
  });

  this.Then(/^I should be taken to '\/profile\/view'$/, function (next) {
    // Write code here that turns the phrase above into concrete actions
    next.pending();
  });

};