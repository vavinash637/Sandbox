// Common configuration files with defaults plus overrides from environment vars
module.exports = {
  // The address of a running selenium server.
  //seleniumAddress: 
  //  (process.env.SELENIUM_URL || 'http://localhost:4444/wd/hub'),

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName':
        (process.env.TEST_BROWSER_NAME    || 'firefox'),
    'version':
        (process.env.TEST_BROWSER_VERSION || 'ANY'),
    shardTestFiles: (process.env.SHARD_TEST_FILES || true),
    maxInstances: (process.env.MAX_BROWSER_INSTANCES || 6)
  },
  
  specs : (process.env.SPECS    || '**/nurseLoginSpec.js'),
  
  jivaURL : (process.env.JIVA_URL || 'https://qa61.zeomega.org'),
  
  adminUserName : (process.env.ADMIN_USER_NAME    || 'zeadmin'),
  adminPassword : (process.env.ADMIN_PASSWORD    || 'Jiva@123'),

  restartBrowserBetweenTests : (process.env.RESTART_BROWSER_BETWEEN_TESTS || true)
};
