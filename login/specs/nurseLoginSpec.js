var adminLogin = require('../data/loginInput').login.adminLogin;
var NavigationPage = require('../../utilities/navigationPage').NavigationPage;
var LoginPage = require('../page/login');
var Base = require('../../utilities/base');

describe('When the username and password is entered', function () {
    var loginPage = new LoginPage();
    var navigationPage = new NavigationPage();
    var basePage = new Base();

    beforeEach(function () {
        loginPage.open();
        loginPage.login(adminLogin);
        basePage.waitForPageToLoad();
    });


    it('The user should be logged in', function() {
        basePage.waitForPageToLoad();
        expect(navigationPage.clickMenu('Intake', 'Member Search')).toEqual(true);
        basePage.waitForPageToLoad();
    });

    afterEach(function () {
        navigationPage.logout();
    });
});
