var assert = require('assert');

module.exports = function () {
  
  this.Given(/^I am a user$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.When(/^I navigate to '\/profile'$/, function (callback) {
//    it('should add Hello to the name', function() {
//  expect(element(by.binding("greeting")).getText()).toEqual('Bonjour World!');
//});
    callback.pending();
  });

  this.Then(/^I should see a input box to enter my name$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });
  
};