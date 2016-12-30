var TextBoxElement = require('../../utilities/element').TextBoxElement;
require('../../utilities/waitReady')
var jivaConfig = require('../data/jivaConf').config;
var BasePage = require('../../utilities/base');
var env = require('../../environment.js');

// Page object representing nurse login page 
var LoginPage = (function () {
    function LoginPage() {
        //define locators for the page
        this.loginButton = by.name('LogIn');
        this.dashboardLoc = by.xpath("//*[@title = 'Menu']");
        this.usernameLoc = by.name('__ac_name');
        this.passwordLoc = by.name('__ac_password');
        this.loginErrorLoc = by.className("login-page-error-container");
        this.pageUrl = jivaConfig['jivaUrl'];
        this.jivaTitleLoc = by.xpath("//title[contains(text(),'Welcome to Jiva')]");
        this.encryptedPasswordLoc = by.xpath("//input[@type='password']");
        var basePage = new BasePage();

        //User Logging in for first time have to change password
        this.oldPwdLoc = by.name('old_password');
        this.newPwdLoc1 = by.name('new_password1');
        this.newPwdLoc2 = by.name('new_password2');
        this.pwdGuideLineLoc = by.name('Password GuideLines');
        this.changePwdButtonLoc = by.name('force_changepassword');
        this.changePwdPageMsgLoc = by.xpath("//div[@class = 'ze-login-eror']");
        this.pwdChangeSuccessMsgLoc = by.xpath("//*[@class = 'ze-message']");
        this.backToLoginLoc = by.linkText('Back to login');

        //Create New User login password Change element object
        this.oldPwdElem = new TextBoxElement(this.oldPwdLoc);
        this.newPwdElem1 = new TextBoxElement(this.newPwdLoc1);
        this.newPwdElem2 = new TextBoxElement(this.newPwdLoc2);

        //Create Username element object
        this.userNameElem = new TextBoxElement(this.usernameLoc);

        //Create Password element object
        this.passwordElem = new TextBoxElement(this.passwordLoc);

        // goto URL of login page
        this.open = function () {
            browser.get(this.pageUrl);
            this.waitForPageToLoad();

            // In case of internet explorer, we need to click on link 
            // "Continue to this website (not recommended)." before proceeding to login page.
            // Below statement will click on the link, if it is existing for internet explorer
            // if (env.capabilities.browserName === 'internet explorer')
                // browser.get("javascript:if(document.getElementById('overridelink')){document.getElementById('overridelink').click()}");

            browser.driver.manage().window().maximize();
        };

        //Initialise the login page
        this.init = function () {
            // initialisation stuff here
            browser.ignoreSynchronization = true;
        };

        this.init();

        //Function to click login button
        this.clickLoginButton = function () {
            browser.findElement(this.loginButton).click();
        };

        this.clickChangePwdButton = function () {
            browser.findElement(this.changePwdButtonLoc).click();
            element(this.backToLoginLoc).waitReady();
        };

        this.clickBackToLogin = function () {
            element(this.backToLoginLoc).waitReady();
            element(this.backToLoginLoc).click();
        };

        //Function to enter username, password and then click on login button
        this.login = function (login) {
            this.userNameElem.setValue(login['userName']);
            this.passwordElem.setValue(login['password']);
            this.clickLoginButton();
            browser.waitForAngular();

            // check for login errors
            return element(this.loginErrorLoc).isPresent().then(function (present) {
                if (present == true) {
                    element(by.className("login-page-error-container")).getText().then(function (text) {
                        console.log(text);
                    });
                    return false;
                }
                else {
                    basePage.isAlertPresentDismiss();
                    basePage.waitForPageToLoad();
                    element(By.xpath("//*[contains(text(), 'Dashboard')]")).waitReady();
                    return true;
                }
            });
        };

        //this function will help to change the user password when first time login
        this.firstTimeLogin = function (loginCred, newPwd) {
            //First time logging with credentials
            this.userNameElem.setValue(loginCred['userName']);
            this.passwordElem.setValue(loginCred['password']);
            this.clickLoginButton();

            //System prompts for change password for first time login
            basePage.waitForPageToLoad();
            this.oldPwdElem.setValue(loginCred['password']);
            this.newPwdElem1.setValue(newPwd);
            this.newPwdElem2.setValue(newPwd);
            element(this.changePwdButtonLoc).waitReady();
            this.clickChangePwdButton();
            //Successfull message and returning back to login page
            basePage.waitForPageToLoad();
            this.open();

            //Logging in with the new credenctials & should land to Jiva DashBoard
            loginCred['password'] = newPwd;
            return this.login(loginCred);
        };
        
        //this function to login to reinsurance portal
        this.reinsurancePortalLogin = function (login) {
            this.userNameElem.setValue(login['userName']);
            this.passwordElem.setValue(login['password']);
            this.clickLoginButton();
            browser.waitForAngular();

            // check for login errors
            return element(this.loginErrorLoc).isPresent().then(function (present) {
                if (present == true) {
                    element(by.className("login-page-error-container")).getText().then(function (text) {
                        console.log(text);
                    });
                    return false;
                }
                else {
                    basePage.isAlertPresentDismiss();
                    basePage.waitForPageToLoad();
                    element(By.xpath("//*[contains(@class, 'fa-bars')]")).waitReady();
                    return true;
                }
            });
        };

        //Function to verify the jiva title is present
        this.isJivaTitlePresent = function() {
            return element(this.jivaTitleLoc).isPresent();
        };

        //Function to verify passord field is encrypted
        this.isPasswordFieldEncrypted = function() {
            return element(this.encryptedPasswordLoc).isPresent();
        };
    }

    LoginPage.prototype = new BasePage();
    LoginPage.prototype.constructor = LoginPage;
    return LoginPage;
})();

module.exports = LoginPage;
