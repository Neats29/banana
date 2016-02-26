//http://chaijs.com/
var chai = require('chai');

//https://github.com/domenic/chai-as-promised/
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var expect = chai.expect;

var baseURL = 'http://172.16.32.143:8100/#/app';


module.exports = function () {

    this.Given(/^I am on the profile page$/, function (next) {
        var url = baseURL + '/profile';
        browser.get(url);
        browser.getCurrentUrl().then(function (url) {
            console.log('Browser Current URL', url);
            next();
        });


    });

    this.When(/^I click the save button$/, function (next) {
        var saveButton = browser.findElement({
            id: 'saveButton'
        });

        saveButton.click().then(function () {
            console.log('Click Callback parameter');

            next();
        });
    });

    this.Then(/^I should be taken to '\/profile\/view'$/, function (callback) {
        browser.getCurrentUrl().then(function (url) {
            console.log('THEN: Browser Current URL', url);
            expect(url).to.equal(baseURL + '/profile/view');
            callback();
        });
    });
};