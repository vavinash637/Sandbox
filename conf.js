var env = require('./environment.js');
exports.config = {
  // browser(only chrome and firefox) configured will not look for webdriver manager
  directConnect: true,
  // recommended framework
  framework: 'jasmine2',
  // only when used with webdriver manager
  seleniumAddress: 'http://localhost:4444/wd/hub',
  capabilities: {
    browserName: 'firefox'
  },
  jasmineNodeOpts: {
    showColors: true, // Use colors in the command-line report
    defaultTimeoutInterval: 360000
  },
  specs: [env.specs],
  params: {
  junitReportPath: 'junitReport',
  screenshotsPath: 'screenshots',
  },
  onPrepare: function() {
  
    browser.manage().timeouts().implicitlyWait(5000);
    
      // Add a screenshot reporter and store screenshots to `/tmp/screnshots`:
    var path = require('path');
    require('jasmine-reporters');
    
    jasmine.getEnv().addReporter(
      new jasmine.JUnitXmlReporter(browser.params.junitReportPath, true, true, 'Junit')
    );
  }

};
