
var ConfigParser = require('../node_modules/protractor/lib/configParser');
require('./waitReady'); //Import waitready for element to appear
var _ = require('../library/underscore.js');
log = require('../library/logger');
const execFile = require('child_process').execFile;
var configParser = new ConfigParser();
var config = configParser.getConfig();
var env = require('../environment.js');

/*This Page provides the common utilities across all pages*/

var Page = (function () {
    function Page() {

        /*This function provides the utilities to switch between multiple windows
         * Usage Pass window title as parameter*/

        //This function is used to switch to multiple browser windows
        this.switchToWindow = function (windowTitle) {

            console.log("switching to " + windowTitle);
            return browser.getAllWindowHandles().then(function (handles) {
                for (handle = handles.length - 1; handle >= 0; --handle) {
                    browser.switchTo().window(handles[handle]);
                    return browser.getTitle().then(function (title) {
                        if (windowTitle === title) {
                            console.log("switched to " + title);
                            return true;
                        }
                    })
                }
                return false;
            });
        };

        //This function is used to switch to Jiva window.
        this.switchToJivaWindow = function () {
            console.log("switching to Jiva Window");
            browser.getAllWindowHandles().then(function (handles) {
                browser.switchTo().window(handles[0]);
                browser.getTitle().then(function (title) {
                    console.log("Switched to " + title);
                });
            });

        };

        //This function is used to close the Browser window.
        this.closeBrowserWindow = function () {
            console.log("closing the browser window");
            browser.driver.executeScript('window.close()');
            console.log("closed the browser window");
        };

        /*This function provides the utilities to accept or dismiss alert*/
        this.switchToAlertAcceptOrDismiss = function (alert) {

            try {
                var alertDialog = browser.driver.switchTo().alert();
                if (typeof alert === 'undefined' || alert === true) {
                    alertDialog.accept();
                    return true;
                }
                else {
                    alertDialog.dismiss();
                    return true;
                }
            }
            catch (NoAlertPresentException) {
                log.warn('No alert displayed');
                return false;
            }
        };

        /*This function provides the utilities to accept or dismiss the alert based on text*/
        this.switchToAlertWithText = function (text, alert) {

            try {
                var alertDialog = browser.driver.switchTo().alert();
                return alertDialog.getText().then(function (textPresent) {
                    if (textPresent.indexOf(text) !== -1 && (alert === true)) {
                        alertDialog.accept();
                        return true;
                    }
                    else {
                        alertDialog.dismiss();
                        return false;
                    }

                });
            }

            catch (err) {
                log.warn('No alert displayed');
            }
        };

        /*This function provides the utilities to Compare text with a webElement text
         * locator is the first argument, text to Compare - second argument
         * */
        this.isTextPresent = function (locator, textCompare) {
            return element.all(locator).map(function (item) {
                return item.getText();
            }).then(function (text) {
                if (text[0].indexOf(textCompare) !== -1) {
                    return true;
                }
                else {
                    return false;
                }
            });
        };

        //This function provides the utilities to validate link using text
        this.isLinkPresent = function (linktext) {
            return element(by.linkText(linktext)).getText().then(function (element) {
                    return true;
                },
                function (err) {
                    return false;
                });
        };

        /*This function provides the utilities to accept alert if exists, else returns false
         * */
        this.isAlertPresentAccept = function () {
            return browser.driver.switchTo().alert().then(
                function (alert) {
                    alert.accept();
                    return true;
                },
                function (err) {
                    return true;
                });
        };

        this.isAlertPresentDismiss = function () {
            return browser.driver.switchTo().alert().then(
                function (alert) {
                    alert.dismiss();
                    return true;
                },
                function (err) {
                    return true;
                });
        };

        this.isAlertPresent = function () {
            return browser.driver.switchTo().alert().then(
                function (alert) {
                    return true;
                },
                function (err) {
                    return false;
                });
        };

        /*This function provides the utilities to check for error displayed
         * */
        this.isErrorDisplayed = function () {
            ajax_error = by.className('toast-error');
            return element(ajax_error).getText().then(function (element) {
                    return true;
                },
                function (err) {
                    return false;
                });
        };

        /*This function provides the utilities to get path of data file to be uploaded
         in angular and non-angular pages. Example:getDataFile('sentinel/data/Sample.txt') * */
        this.getDataFile = function (filename) {
            var path = require('path');
            var fs = require('fs');
            var pathtoData = path.dirname(__filename);
            var absolutePath = path.resolve(pathtoData, '../' + filename);
            return absolutePath;
        };

        /*This function provides the utilities to validate the success text for non angular pages* 
         text to Compare is the argument to be sent*/

        this.isSuccessTextPresent = function (textCompare) {
            successText = by.className('ze-success-text');
            element.all(successText).last().waitReady();
            return element.all(successText).last().isDisplayed().then(
                function (present) {
                    if (present) {
                        return element.all(successText).last().getText().then(function (text) {
                            if (text.indexOf(textCompare) !== -1) {
                                element.all(successText).last().element(by.tagName('a')).click();
                                return true;
                            }
                            else {
                                console.log('failed to display success message with given text');
                                return false;
                            }
                        });
                    }
                    else {
                        console.log('failed to display success message');
                        return false;
                    }
                },
                function (err) {
                    return false;
                });
        };

        /*This function to get ze success text / confirmation message for non angular page*/
        this.getSuccessText = function () {
            this.locator = by.css("[class*=ze-success-text],[class ='added-filter-notification'] [ng-bind='message']");
            browser.wait(protractor.ExpectedConditions.presenceOf(element(this.locator)), 8000);
            return element(this.locator).getText();
        };

        /*This function to get ze success text / confirmation message for angular page*/
        this.getSuccessTextAngular = function () {
            this.locator = by.xpath("//*[@class='added-filter-notification']//*[@ng-bind='message' or @class='ze-success-text']");
            element(this.locator).waitReady();
            return element(this.locator).getText();
        };

        /*This function provides the utilities to close YUI window of both angular and non-angular pages*/
        this.closeYuiWindow = function () {
            //function to close non angular yui modal window
            closeIconLoc = by.css('span.container-close');
            modalWindowDisplayed = element(by.id('modelwindowobj')).element(by.linkText('Close')).isPresent().then(
                function (displayed) {
                    if (displayed) {
                        element(by.id('modelwindowobj')).element(by.linkText('Close')).click();
                        return true;
                    } else {
                        element.all(closeIconLoc).last().click();
                        return true;
                    }
                }, function (err) {
                    console.log("Non-Angular yui modal window not found");
                    return false;
                });

            //function to close angular yui modal window
            return modalWindowDisplayed.then(function (windowDisplayed) {
                if (windowDisplayed === false) {
                    angularCloseIconLoc = by.xpath("//div[contains(@class, 'modal-content')]//button[@class='close']");
                    modalWindowDisplayed = element(angularCloseIconLoc).isDisplayed().then(
                        function (displayed) {
                            if (displayed) {
                                element(angularCloseIconLoc).click();
                                return true;
                            }
                        }, function (err) {
                            console.log("Angular yui modal window not found");
                            return false;
                        });
                }
                else {
                    return windowDisplayed;
                }
            });
        };

        /*This function provides the utilities to find Warning icons displayed or not,for
         mandatory fields in non-angular pages* */
        this.isWarningQuestionsIconDisplayed = function (num) {
            warnIconLoc = by.className('warnInfoField');
            return element.all(warnIconLoc).then(function (warnIcons) {
                if (warnIcons.length == num) {
                    return true;
                }
                else {
                    return false;
                }
            });
        };

        //Function to mouse move to Element
        this.mouseMoveToElement = function (locator) {
            element(locator).waitReady();
            browser.actions().mouseMove(element(locator)).perform();
        };

        //Function to wait for complete page load
        this.waitForPageToLoad = function (sleep) {
            var count = 0;
            if(sleep===undefined)
                sleep=2000;
            (function pageToLoad() {
                browser.getPageSource().then(function (htmlSource) {
                    browser.sleep(sleep);
                    browser.getPageSource().then(function (newHtmlSource) {
                        if (count < 20 && htmlSource != newHtmlSource) {
                            count++;
                            console.log("Number of wait iterations to load Page:" + count);
                            pageToLoad();
                        }
                    });
                });
            }());
        };

        /*
         * This function returns the value associated with the label in horizontal bar graph
         * Note : config argument should be same as the config attribute of div element just before
         *        svg element of graph
         */
        this.getHorizontalBarGraphLabelValue = function (config, labelName) {
            var divLoc = "div[config='" + config + "']";
            var graphLabelLoc = by.css(divLoc + " [class='highcharts-axis-labels highcharts-xaxis-labels'] text");
            var graphValueLoc = by.css(divLoc + " [class='highcharts-stack-labels'] text");

            var index = 0;

            var labelList = element.all(graphLabelLoc).map(function (element) {
                return element.getText().then(function (text) {
                    return text;
                });
            });

            return labelList.then(function (llist) {
                var index = _.indexOf(llist, labelName);
                return element.all(graphValueLoc).get(index).getText().then(function (text) {
                    return text;
                });
            });

            return true;
        };

        /*
         * This function clicks on the bar associated with the label in horizontal bar graph
         * Note : config argument should be same as the config attribute of div element just before
         *        svg element of graph
         */
        this.clickHorizontalBarGraphLabelBar = function (config, labelName) {
            var divLoc = "div[config='" + config + "']";
            var graphLabelLoc = by.css(divLoc + " [class='highcharts-axis-labels highcharts-xaxis-labels'] text");
            var graphValueLoc = by.css(divLoc + " [class='highcharts-stack-labels'] text");
            var graphBarLoc = by.css(divLoc + " [class='highcharts-series-group'] [class='highcharts-series highcharts-series-0 highcharts-tracker'] rect");
            var index = 0;
            var labelList = element.all(graphLabelLoc).map(function (element) {
                return element.getText().then(function (text) {
                    return text;
                });
            });

            var valueList = element.all(graphValueLoc).map(function (element) {
                return element.getText().then(function (text) {
                    return text;
                });
            });

            var offsetArr = [];

            valueList.then(function (vlist) {
                var offset = 0;
                for (var i = 0; i <= vlist.length - 1; i++) {
                    if (vlist[i] != 0) {
                        offsetArr.push(offset);
                    }
                    else {
                        offset += 1;
                        offsetArr.push(0);
                    }
                }

                labelList.then(function (llist) {
                    var index = _.indexOf(llist, labelName);
                    var offset = offsetArr[index];
                    var barIndex = index - offset;
                    element.all(graphBarLoc).get(barIndex).click();
                });
            });

            return true;
        };

        /*
         * This function will mouse hover on the bar associated with the label in horizontal bar graph
         * returns the tooltip in a list.
         * Note : config argument should be same as the config attribute of div element just before
         *        svg element of graph
         */
        this.getHorizontalBarGraphLabelToolTip = function (config, labelName) {
            var divLoc = "div[config='" + config + "']";
            var graphLabelLoc = by.css(divLoc + " [class='highcharts-axis-labels highcharts-xaxis-labels'] text");
            var graphValueLoc = by.css(divLoc + " [class='highcharts-stack-labels'] text");
            var graphBarLoc = by.css(divLoc + " [class='highcharts-series-group'] [class='highcharts-series highcharts-tracker'][visibility='visible'] rect");
            var toolTipLoc = by.css(divLoc + " .highcharts-tooltip text tspan");
            var index = 0;

            var labelList = element.all(graphLabelLoc).map(function (element) {
                return element.getText().then(function (text) {
                    return text;
                });
            });

            var valueList = element.all(graphValueLoc).map(function (element) {
                return element.getText().then(function (text) {
                    return text;
                });
            });

            var offsetArr = [];

            return valueList.then(function (vlist) {
                var offset = 0;
                for (var i = 0; i <= vlist.length - 1; i++) {
                    if (vlist[i] != 0) {
                        offsetArr.push(offset);
                    }
                    else {
                        offset += 1;
                        offsetArr.push(0);
                    }
                }

                return labelList.then(function (llist) {
                    var index = _.indexOf(llist, labelName);
                    var offset = offsetArr[index];
                    var barIndex = index - offset;
                    browser.actions().mouseMove(element.all(graphBarLoc).get(barIndex)).perform();
                    element(toolTipLoc).waitReady();
                    return element.all(toolTipLoc).map(function (element) {
                        return element.getText();
                    });
                });
            });
        };

        // Function to download a file into workspace for all browsers
        this.downLoadFile = function () {
            var filePath = this.getDataFile('library/Download.exe');
            var pathtoDownload = this.getDataFile('data');
            browser.sleep(0).then(function(){
            execFile(filePath+'', [process.env.TEST_BROWSER_NAME+ '', pathtoDownload+'', '30'],  function (error, stdout, stderr) {
                if (error != null) {
                    console.log(stderr);
                }
            });
        });
            this.waitForPageToLoad();
        };

        /*To click on Breadcrumb link
         * @param {string} breadCrumbLinkName*/
        this.clickBreadCrumbLink = function (link) {
            element(by.partialLinkText(link)).waitReady();
            element(by.partialLinkText(link)).click();
        };

        /*To click on button or link using locator
         * @param {string} locator*/
        this.clickOnButton = function (locator) {
            element(locator).waitReady();
            element(locator).click();
        };

        /*To check a section of a page present
         * @param {string} visible text of section*/
        this.isSectionPresent = function(sectionText){
            this.loc = by.xpath("//*[contains(text(),'"+sectionText+"')]");
            return element(this.loc).isPresent();
        };

        /*To check an element present
         * @param {string} locator*/
        this.isElementPresent = function(locator){
            return element(locator).isPresent();
        };

        //Function to get model window title
        this.getModelWindowHeaderText = function(){
            var titleLoc = by.xpath("//*[contains(@class, 'modal-title')]");
            element(titleLoc).waitReady();
            return element(titleLoc).getText();
        };

        //Function to click gear/action icon based on index
        this.clickOnActionIcon = function (index) {
            var index = index || 1;
            this.actionIconloc = by.xpath("(//a[@class = 'action-icons dropdown-toggle'])['"+index+"']/i");
            element(this.actionIconloc).waitReady();
            element(this.actionIconloc).click();
        };

        /* Function to verify table column headers
         * @param {string} tableHeaderLoc
         * @param {list} compareList
         */
        this.isTableHeadersPresent = function (tableHeaderLoc, compareList ) {
            return element(tableHeaderLoc).getText().then(function (text) {
                var result = true;
                for (var i = 0; i < compareList.length; i++) {
                    if (text.indexOf(compareList[i]) !== -1) {
                        continue;
                    } else {
                        console.log('Unmatched table header is' + compareList[i]);
                        result = false;
                    }
                }
                return result;
            });
        };

        /*To get x coordinates location of an element
         * @param {locator} locator eg: by.name('name')
         * @example: expect(elem2location).toBeGreaterThan(elem1location)*/
        this.getLocationOfElement = function (locator) {
            element(locator).waitReady();
            return element.all(locator).last().getLocation().then(function (navDivLocation) {
                return navDivLocation.x;
            });
        };

        /*To get line through(strikeout) or deactivated records text
         * in angular and non-angular page
         */
        this.getLineThroughRecords = function () {
            var locator = by.xpath("//*[contains(@class, 'ze-row-deactivated') or contains(@class, 'line-through')]");
            element(locator).waitReady();
            return element.all(locator).map(function (elems) {
                return elems.getText().then(function(text){
                    return text;
                });
            }).then(function(elms){
                return elms.join('');
            });
        };

        /*To verify the presence of horizontal scrollbar in an element
         * in angular and non-angular page
         * @param {locator} locator eg: by.name('name')
         * @param {int} index eg: 1
         * @example: expect(isHorizontalScrollBarPresent(loc)).toBeTruthy();
         */
        this.isHorizontalScrollBarPresent = function (locator, index) {
            this.index = index || 0;
            return browser.executeScript("return arguments[0].scrollWidth>arguments[0].clientWidth", element.all(locator).get(this.index).getWebElement());
        };

        /*To verify the presence of vertical scrollbar in an element
         * in angular and non-angular page
         * @param {locator} locator eg: by.name('name')
         * @param {int} index eg: 1
         * @example: expect(isVerticalScrollBarPresent(loc)).toBeTruthy();
         */
        this.isVerticalScrollBarPresent = function (locator, index) {
            this.index = index || 0;
            return browser.executeScript("return arguments[0].scrollHeight>arguments[0].clientHeight", element.all(locator).get(this.index).getWebElement());
        };
    };

    return Page;
})();

module.exports = Page;
