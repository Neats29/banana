// An example configuration file.
exports.config = {
    directConnect: true,

    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        'browserName': 'chrome'
    },

    // Framework to use. Jasmine is recommended.
    framework: 'custom',
    frameworkPath: './node_modules/protractor-cucumber-framework',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    // Spec patterns are relative to the current working directly when
    // protractor is called.
    specs: ['./features/*.feature'],
    cucumberOpts: {
        require: './features/step_definitions/*_steps.js',
        format: 'pretty'
    }

};