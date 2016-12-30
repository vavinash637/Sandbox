var _ = require('../library/underscore.js');
var log = require('../library/logger.js');
require('./waitReady');
var BasePage = require('../utilities/base');
var jivaTesting = require('../library/jivaTesting.js');
var env = require('../environment.js');

var NavigationPage = (function() {
    function NavigationPage() {
        this.userNameLoc = by.xpath("//*[contains(@ng-bind,'headerScope.username')]");
		this.legendIconLoc = by.xpath("//*[contains(@class,'fa-th-large')]");
        this.helpIconLoc = by.xpath("//*[contains(@class,'fa-info-circle')]");
        this.messageIconLoc = by.xpath("//*[contains(@class,'fa-envelope')]");
        this.memoryListIconLoc = by.linkText('Memory List');
        this.userOptionsLinkLoc = by.xpath("//*[@role='menu']//a");
        this.clickContinueSessionLoc = by.xpath("//*[@ng-click='sessionmgmtctrl.updateSession()']");
        this.clickLogoutSessionLoc = by.xpath("//*[@ng-click='sessionmgmtctrl.logout()']");

        this.clickMenu = function(topMenu, subMenu){
        	element(by.linkText('Menu')).waitReady();
            element(by.linkText('Menu')).click();
        	
            var locatorTemplate = _.template("//div[text()='<%= menu %>']/..//span[text()='<%= subMenu %>']");
        	var locator = locatorTemplate({menu: topMenu, subMenu:subMenu});
            element(by.xpath(locator)).waitReady();
        	return element(by.xpath(locator)).isPresent().then(function(present){
        		if(present==true){
        			element(by.xpath(locator)).waitReady();
        			element(by.xpath(locator)).click();
                	return true;
        		}
        		else{
        			moreOptionLoc = "//*[@class='btn btn-lg btn-default ng-scope']";
                	element(by.xpath(moreOptionLoc)).waitReady();
                    element(by.xpath(moreOptionLoc)).click();
                    element(by.xpath(locator)).waitReady();
                    element(by.xpath(locator)).click();
                	return true;
        		}
        		return false;
        	});
        };

        this.menuValidation = function(topMenu, subMenu){
           element(by.linkText('Menu')).waitReady();
            element(by.linkText('Menu')).click();
            browser.waitForAngular();
            browser.sleep(5000);
            var locatorTemplate = _.template("//div[text()='<%= menu %>']/..//span[text()='<%= subMenu %>']");
            var locator = locatorTemplate({menu: topMenu, subMenu:subMenu});
            return element(by.xpath(locator)).isPresent().then(function(present){
                if(present==true){
                    element(by.xpath(locator)).waitReady();
                    element(by.xpath(locator)).click();
                    return true;
                }
                else{
                    return false;
                }
            });
        };

        this.isMenuPresent = function(){
            return element(by.linkText('Menu')).isPresent();
        };
        
        this.clickDashboard = function(){
        	element(by.linkText('Dashboard')).waitReady();
            element(by.linkText('Dashboard')).click();
            return true;
        };

        this.clickMemoryList = function () {
            element(this.memoryListIconLoc).waitReady();
            element(this.memoryListIconLoc).click();
            return true;
        };
        
        this.clickCalendar = function(){
        	element(by.linkText('Calendar')).waitReady();
            element(by.linkText('Calendar')).click();
            return true;
        };

        //Method to click on My Profile
         this.myProfile = function(){
            //jivaTesting.saveScreenshot();
            element(by.xpath("//span[contains(@ng-bind,'headerScope.username')]")).waitReady();
            element(by.xpath("//span[contains(@ng-bind,'headerScope.username')]")).click();
            element(by.linkText('My Profile')).waitReady();
            element(by.linkText('My Profile')).click();
        };

        this.logout = function(){
            //jivaTesting.saveScreenshot();
            element(by.binding('headerScope.username')).waitReady();
            element(by.binding('headerScope.username')).click();
            element(by.linkText('Logout')).waitReady();
            element(by.linkText('Logout')).click();
            this.isAlertPresentAccept();
            logoutWaitLoc = by.xpath("//*[@name='__ac_name' or contains(text(),'login')]");
            element.all(logoutWaitLoc).last().waitReady();
            if (env.capabilities.browserName != 'internet explorer'){
                this.closeBrowserWindow();
            }
        };

        this.getUserName = function() {
            element(this.userNameLoc).waitReady();
            return element(this.userNameLoc).getText().then(function(text){
                if(text){
                    return text;
                }
            });
        };

        this.clickWorkList = function(){
            element(by.linkText('Worklists')).waitReady();
            element(by.linkText('Worklists')).isPresent().then(function(present){
                element(by.linkText('Worklists')).click();
            });
        };

        // To click on memory list items
        this.clickMemoryListItems = function (linkName) {
            this.clickBreadCrumbLink(linkName);
        };

        // Function to verify memory list link
        this.isMemoryListLinkPresent = function () {
            return element(this.memoryListIconLoc).isPresent();
        };

        // Function to verify message icon
        this.isMessageIconPresent = function () {
            return element(this.messageIconLoc).isPresent();
        };

        // Function to verify legend icon
        this.isLegendIconPresent = function () {
            return element(this.legendIconLoc).isPresent();
        };

        // Function to verify help icon
        this.isHelpIconPresent = function () {
            return element(this.helpIconLoc).isPresent();
        };

        // Function to click on user name
        this.clickOnUserName = function(){
            element(this.userNameLoc).waitReady();
            element(this.userNameLoc).click();
            browser.waitForAngular();
        };

        // Function to click on link
        this.clickOnUserOptionsLink = function(linkText){
            var optionLoc = by.linkText(linkText);
            element(optionLoc).waitReady();
            element(optionLoc).click();
        };

        // Function to get text of user drop down options link text
        this.getUserOptionsLinkText = function(){
            element.all(this.userOptionsLinkLoc).get(0).waitReady();
            return element.all(this.userOptionsLinkLoc).map(function(elems){
                return elems.getText().then(function(text){
                    return text.trim();
                });
            });
        };

        this.toClickContinueSessionButton = function() {
            element(this.clickContinueSessionLoc).waitReady();
            element(this.clickContinueSessionLoc).click();
        };

        //to Click on logout button
        this.toClickLogoutButton = function() {
            element(this.clickLogoutSessionLoc).waitReady();
            element(this.clickLogoutSessionLoc).click();
        };

    }
    NavigationPage.prototype = new BasePage();
    NavigationPage.prototype.constructor = NavigationPage.prototype;
    return NavigationPage;
})();

exports = module.exports = {
		NavigationPage : NavigationPage
};
