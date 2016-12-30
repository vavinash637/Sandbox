
require('./waitReady'); //Import waitready for element to appear
var _ = require('../library/underscore');

var BaseElement = (function () {
    function BaseElement(locator) {
        this.locator = locator;

        this.isMandatory = function () {
            return element.all(this.locator).map(function (item) {
                return item.getAttribute('required');
            }).then(function (required) {
                if (required[0] === null) {
                    return false;
                }
                else {
                    return true;
                }
            });
        };

        this.isPresent = function () {
            //element(this.locator).waitReady();
            return element(this.locator).isPresent();
        };

        //Function to verify element is enabled
        this.isEnabled = function () {
            return element(this.locator).isEnabled();
        };

        // utilities to verify field is readonly
        this.isFieldIsReadOnly = function () {
            element(this.locator).waitReady();
            return element(this.locator).getAttribute('readonly').then(function (readonly) {
                if (readonly == 'readonly' || readonly == 'true') {
                    return true;
                }
                else {
                    return false;
                }
            });
        };

        this.isHelpTextPresent = function (text) {
            element(this.locator).waitReady();
            parentElement = element(this.locator).element(by.xpath('..'));
            if(text == undefined){
                return parentElement.$('.ng-scope').isPresent();
            }else{
                return parentElement.$('.ng-scope').isPresent().then(function (present){
                    if(present){
                        return parentElement.$('.ng-scope').getText().then(function(text){
                            if(text.indexOf(text) !== -1){
                                return true;
                            }else{
                                return false;
                            }
                        })
                    }});
            }
        };

        // To verify field is highlighted
        this.isFieldHighLighted = function () {
            element(this.locator).waitReady();
            return element(this.locator).getCssValue('border-top-color').then(function (highlight) {
                return highlight.indexOf('rgba(169, 68, 66') !== -1;
            });
        };
    }
    return BaseElement;
})();

/*This function provides the utilities to get and set TextBox element of both angular
 and Nonangular pages*/

var TextBoxElement = (function () {
    function TextBoxElement(locator) {
        this.locator = locator;
        this.baseElement = new BaseElement(locator);

        this.setValue = function (value, clear) {
            element(locator).waitReady();
            element(locator).click();
            element(locator).clear();
            if(clear){
                element(locator).clear();
            }
            element(locator).sendKeys(value);
        };

        this.getValue = function () {
            element(locator).waitReady();
            return element(locator).getAttribute('value');
        };

        this.getHelpText = function () {
            element(locator).waitReady();
            parentElement = element(this.locator).element(by.xpath('..'));
            return parentElement.$('[class*=ng-scope],[class*=help-block]').getText();
        };

        this.isMandatory = this.baseElement.isMandatory;
        this.isPresent = this.baseElement.isPresent;
        this.isFieldIsReadOnly = this.baseElement.isFieldIsReadOnly;
        this.isHelpTextPresent = this.baseElement.isHelpTextPresent;
        this.isEnabled = this.baseElement.isEnabled;
        this.isFieldHighLighted = this.baseElement.isFieldHighLighted;
    }

    return TextBoxElement;
})();

/*This function provides the utilities to get and set TextArea element of both angular
 and Nonangular pages*/

var TextAreaElement = (function () {
    function TextAreaElement(locator) {
        this.locator = locator;
        this.baseElement = new BaseElement(locator);

        this.setValue = function (value) {
            element(locator).waitReady();
            element(locator).click();
            element(locator).sendKeys(value);
        };

        this.getValue = function () {
            element(locator).waitReady();
            return element(locator).getAttribute('value');
        };

        this.isMandatory = this.baseElement.isMandatory;
        this.isPresent = this.baseElement.isPresent;
        this.isFieldIsReadOnly = this.baseElement.isFieldIsReadOnly;
        this.isEnabled = this.baseElement.isEnabled;
    }

    return TextAreaElement;
})();

var DateElement = (function () {
    function DateElement(locator) {
        this.locator = locator;
        this.baseElement = new BaseElement(locator);

         this.setValue = function (value) {
           element(locator).waitReady();
           element(locator).click();
           element(locator).clear();
           element(locator).sendKeys(value);
           var calenderClose = by.xpath("./..//button[contains(text(),'Close')]");
           element(locator).element(calenderClose).isPresent().then(function(present){
                               if(present == true)
                                       element(locator).element(calenderClose).click();
                               else
                                       element(by.xpath("//div[@id='calendarContainer']/a[@class='link-close']/span")).click();
                       });
       };

        this.getValue = function () {
            element(locator).waitReady();
            return element(locator).getAttribute('value');
        };

        this.isMandatory = this.baseElement.isMandatory;
        this.isPresent = this.baseElement.isPresent;
        this.isHelpTextPresent = this.baseElement.isHelpTextPresent;
        this.isEnabled = this.baseElement.isEnabled;
        this.isFieldHighLighted = this.baseElement.isFieldHighLighted;
    }

    return DateElement;
})();


/*This function provides the utilities to get and set Autocomplete element of both angular
 and Nonangular pages*/

var AutoCompleteElement = (function () {
    function AutoCompleteElement(locator) {
        this.locator = locator;
        this.baseElement = new BaseElement(locator);

        this.setValue = function (value) {
            element(locator).waitReady();
            element(locator).click();
            element(locator).clear();
            element(locator).sendKeys(value);
            browser.driver.sleep(3000);
            browser.wait(function () {
                if (element(locator).getAttribute('aria-expanded') == 'true' || element(by.className('yui-ac-content'))
                        .isPresent()) {
                    element(locator).sendKeys(protractor.Key.TAB);
                    return true;
                }
                else {
                    return false;
                }
            }, 10000);
        };

        this.getValue = function () {
            element(locator).waitReady();
            return element(locator).getAttribute('value');
        };

        this.getHelpText = function () {
            element(locator).waitReady();
            parentElement = element(this.locator).element(by.xpath('..'));
            return parentElement.$('[class*=ng-scope],[class*=help-block]').getText();
        };

        this.isMandatory = this.baseElement.isMandatory;
        this.isPresent = this.baseElement.isPresent;
        this.isFieldIsReadOnly = this.baseElement.isFieldIsReadOnly;
        this.isHelpTextPresent = this.baseElement.isHelpTextPresent;
        this.isEnabled = this.baseElement.isEnabled;
        this.isFieldHighLighted = this.baseElement.isFieldHighLighted;
    }

    return AutoCompleteElement;
})();


/*This function provides the utilities to get and set RadioButtonElement element of both angular
 and Nonangular page*/

var RadioButtonElement = (function () {
    function RadioButtonElement(locator) {
        this.locator = locator;
        this.baseElement = new BaseElement(locator);

        this.setValue = function (value) {
            element(locator).waitReady();
        element.all(this.locator).
                filter(function (elem) {
                    return elem.getAttribute('value').then(function (attribute) {
                        return attribute === value;
                    });
                }).click();
        };

        this.getValue = function () {
            return element(by.css('input:checked')).getAttribute('value').then(function(defaultvalue){
                return defaultvalue;
            });
        };

        this.isFieldHighLighted = function () {
            element(this.locator).waitReady();
            return element(this.locator).getCssValue('outline-color').then(function (highlight) {
                return highlight.indexOf('rgba(169, 68, 66') !== -1;
            });
        };

        this.isMandatory = this.baseElement.isMandatory;
        this.isPresent = this.baseElement.isPresent;
    }

    return RadioButtonElement;
})();


/*This function provides the utilities to get and set CheckBoxElement element of both angular
 and Nonangular pages*/

var CheckBoxElement = (function () {
    function CheckBoxElement(locator) {
        this.locator = locator;
        //this.multipleCheckboxLoc = multipleCheckboxLoc;
        this.baseElement = new BaseElement(locator);

        this.setValueAngular = function (value) {

            element(this.locator).waitReady();

            return element.all(this.locator).then(function (elements) {
                for (i = elements.length - 1; i >= 0; i--) {
                    var optionLocTemplate = _.template("//tr[td/span[starts-with(text(),'<%= value %>')]]//input");
                    var optionLoc = optionLocTemplate({value: value});
                    return elements[i].element(protractor.By.xpath(optionLoc)).isPresent().then(function(present) {
                        if (present){
                            elements[i].element(protractor.By.xpath(optionLoc)).click();
                            return true;
                        }
                        else{
                            var optionLocTemplate = _.template("//span[starts-with(text(),'<%= value %>')]//preceding-sibling::input");
                            var optionLoc1 = optionLocTemplate({value: value});
                            elements[i].element(protractor.By.xpath(optionLoc1)).click();
                            return true;
                        }
                    }, function(err) {
                        return false;
                    });
                }
            });
};

        this.setValueNonAngular = function (value) {
            element(this.locator).waitReady();
            element.all(this.locator).
                filter(function (elem) {
                    return elem.getAttribute('value').then(function (attribute) {
                        return attribute === value;
                    });
                }).click();
        };

        this.isMandatory = this.baseElement.isMandatory;
        this.isPresent = this.baseElement.isPresent;
        this.isEnabled = this.baseElement.isEnabled;
    }

    return CheckBoxElement;
})();


/*This function provides the utilities to get and set DropDownElement for angular
 and Nonangular pages*/

var DropDownElement = (function () {
    function DropDownElement(locator) {
        this.locator = locator;
        this.baseElement = new BaseElement(locator);

        this.setValue = function (value) {
            var optionLocTemplate = _.template(".//option[contains(text(),'<%= value %>')]");
            var optionLoc = optionLocTemplate({value: value});
            element(locator).waitReady();
            //element(by.xpath(optionLoc)).waitReady();  // FIXED for faxespage and all dropdowns
            element(locator).
                all(by.xpath(optionLoc)).last().waitReady();
            element(locator).
                all(by.xpath(optionLoc)).
                filter(function (option) {
                    return option.getText().then(function (txt) {
                        return txt === value;
                    });
                }).click();
        };

        // Function to select first drop down value
        this.setFirstValue = function () {
            var optionLoc = ".//option";
            element(locator).waitReady();
            element(by.xpath(optionLoc)).waitReady();
            element(locator).
                all(by.xpath(optionLoc)).
                get(1).click();

            return true;
        };

        this.getValue = function () {
            return element(locator).element(by.css('option:checked')).getText().then(function (defaultvalue) {
                return defaultvalue;
            });
        };

        this.isMandatory = this.baseElement.isMandatory;
        this.isPresent = this.baseElement.isPresent;
        this.isFieldIsReadOnly = this.baseElement.isFieldIsReadOnly;
        this.isHelpTextPresent = this.baseElement.isHelpTextPresent;
        this.isEnabled = this.baseElement.isEnabled;
        this.isFieldHighLighted = this.baseElement.isFieldHighLighted;
    }

    return DropDownElement;
})();


/*This function provides the utilities to set TinyMceElement of both angular
 and Nonangular page*/

var TinyMceElement = (function () {
    function TinyMceElement(locator) {
        this.locator = locator;
        this.baseElement = new BaseElement(locator);

        this.setValue = function (value) {
            element(locator).getAttribute('id').then(function (elementId) {
                element(By.id(elementId + "_ifr")).waitReady();
                browser.switchTo().frame(browser.findElement(by.id(elementId + "_ifr")));
                browser.findElement(by.tagName('body')).sendKeys(value);
                browser.switchTo().defaultContent();
                browser.waitForAngular();    // If next element is angular
            });
        };

        this.getValue = function () {
            return element(locator).getAttribute('id').then(function (elementId) {
                element(By.id(elementId + "_ifr")).waitReady();
                browser.switchTo().frame(browser.findElement(by.id(elementId + "_ifr")));
                return browser.findElement(by.tagName('body')).getText().then(function(val){
                    browser.switchTo().defaultContent();
                    return val;
                });
            });
        };
        this.isMandatory = this.baseElement.isMandatory;
        this.isPresent = this.baseElement.isPresent;
    }

    return TinyMceElement;
})();


/*This function provides the utilities to get and set BrowserButton element of both angular
 and Nonangular pages*/

var BrowserButtonElement = (function () {
    function BrowserButtonElement(locator) {
        this.locator = locator;
        this.baseElement = new BaseElement(locator);

        this.setValue = function (value) {
            element(locator).sendKeys(value);
        };

        this.getValue = function () {
            return element(locator).getAttribute('value');
        };

        this.isMandatory = this.baseElement.isMandatory;
        this.isPresent = this.baseElement.isPresent;
   }

    return BrowserButtonElement;
})();

/*This function provides the utilities to get and set DateButton element of both angular
 and Nonangular pages*/

var DatePickerElement = (function () {
    function DatePickerElement(locator) {
        this.locator = locator;
        this.baseElement = new BaseElement(locator);

        this.setValue = function (value) {
            var d = new Date(value);
            element(locator).clear();
            monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            var dd = d.getDate()< 10? '0'+d.getDate():d.getDate();
            element(locator).waitReady();
            parentElement = element(locator).element(by.xpath('..'));
            parentElement.element(by.css('.fa-calendar')).click();
            // Use wait condition here
            browser.sleep(2000);
            var yearLoc = by.xpath("//button[contains(@ng-click, 'toggleMode')]");
            element(yearLoc).waitReady();
            var monthYYYY = monthNames[d.getMonth()]+ ' '+ d.getFullYear();
            element(yearLoc).getText().then(function(text){
            ddLoc = by.xpath("//button[contains(@ng-click,'select(dt.date)')]/span[text()='"+dd+"']");
            monthLoc = by.xpath("//button[contains(@ng-click,'select(dt.date)')]/span[text()='"+monthNames[d.getMonth()]+"']");
            yrLoc = by.xpath("//button[contains(@ng-click,'select(dt.date)')]/span[text()='"+d.getFullYear().toString().substring(2)+"']");
            loc = by.xpath("//button[@ng-click='select(dt.date)' and not(contains(@disabled, 'disabled'))]/span");

            date = {
                yearMonthDay: function () {
                    element(yrLoc).click();
                    this.monthDay();
                },
                navigateToDate: function () {
                    var date = new Date();
                    var count = Math.abs(Math.ceil(date.getFullYear() / 20) * 20 - Math.ceil(d.getFullYear() / 20) * 20)/ 20;
                    if(d.getFullYear()- date.getFullYear()>0) for(i=0; i<count; i++){
                        element(by.xpath("//button[@ng-click='move(1)']")).click();
                    }
                    for(i=0; i<count; i++){
                        element(by.xpath("//button[@ng-click='move(-1)']")).click();
                    };
                    this.yearMonthDay();
                },
                monthDay: function () {
                    element(monthLoc).click();
                    element(ddLoc).click();
                },
                day: function () {
                    element(ddLoc).click();
                },
            }

            if(text.indexOf(monthYYYY) != -1)  date.day();
            else{
                element(yearLoc).click();
                (text.indexOf(d.getFullYear().toString())!=-1) ? date.monthDay()
                : (
                element(yearLoc).click(),
                element.all(loc).map(function(elem){
                    elem.getText();
                }).then(function(arr){
                    _.contains(arr, d.getFullYear().toString().substring(2))? date.yearMonthDay() :date.navigateToDate();
                }));
            }
            });
        }

        this.getValue = function () {
            element(locator).waitReady();
            return element(locator).getAttribute('value');
        };

        this.isMandatory = this.baseElement.isMandatory;
        this.isPresent = this.baseElement.isPresent;
        this.isHelpTextPresent = this.baseElement.isHelpTextPresent;
        this.isEnabled = this.baseElement.isEnabled;
    }

    return DatePickerElement;
})();

exports = module.exports = {
    TextBoxElement: TextBoxElement,
    AutoCompleteElement: AutoCompleteElement,
    RadioButtonElement: RadioButtonElement,
    CheckBoxElement: CheckBoxElement,
    DropDownElement: DropDownElement,
    TinyMceElement: TinyMceElement,
    BrowserButtonElement: BrowserButtonElement,
    DateElement: DateElement,
    TextAreaElement: TextAreaElement,
    DatePickerElement: DatePickerElement
};
