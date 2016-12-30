
var BasePage = require('../utilities/base');

//Page object representing pagination screen
var PaginationPage = (function () {
    function PaginationPage() {

		//Creating locator for page
		this.paginationLoc = by.css("ul.pagination-sm");
		this.stepForwardIconLoc = by.css(".fa-step-forward");
		this.stepBackwardIconLoc = by.css(".fa-step-backward");
		this.arrowRightLoc = by.css(".fa-caret-right");
		this.arrowLeftLoc = by.css(".fa-caret-left");
		this.pageNoLoc = by.repeater("page in pages track by $index");
		this.currentPageLoc = by.xpath("//*[contains(@ng-bind,'currentPage')]");
		this.pageLinkLoc = by.xpath("//a[contains(@ng-click, 'selectPage(page.number, $event)')]");
		this.stepNextLoc = by.xpath("//*[contains(@ng-click, 'selectPage(page + 1, $event)')]");
		this.totalPageCountLoc = by.xpath("//*[contains(@ng-bind,'currentPage')]/following-sibling::*");

		// Function to click on Icons
		this.clickStepForwardIcon = function() {
			element(this.stepForwardIconLoc).waitReady();
			element(this.paginationLoc).element(this.stepForwardIconLoc).click();
		};

		// Function to click on backward Icons
		this.clickStepBackwardIcon = function() {
			element(this.stepBackwardIconLoc).waitReady();
			element(this.paginationLoc).element(this.stepBackwardIconLoc).click();
		};

		//function to click on previous page arrow
		this.clickOnPreviousPage = function() {
			element(this.arrowLeftLoc).waitReady();
			element(this.paginationLoc).element(this.arrowLeftLoc).click();
		};

		//function to click on next page arrow
		this.clickOnNextPage = function() {
			element(this.arrowRightLoc).waitReady();
			element(this.paginationLoc).element(this.arrowRightLoc).click();
		};

		//Function to get total no of page count
		this.getTotalNoOfPageCount = function() {
			element(this.totalPageCountLoc).waitReady();
			return element.all(this.totalPageCountLoc).map(function(count) {
				return count.getText();
			});
		};

		//Function to get total page count
		this.getTotalPageCount = function() {
			pageNoLoc = this.pageNoLoc;
			return element(this.paginationLoc).isDisplayed().then(function(elem){
				return element.all(pageNoLoc).count().then(function (pageCount) {
					return pageCount;
				});
			}, function(err){
				return 1;
			});
		};

		//function to click on respective page based on page no index
		this.clickOnPageNo = function(index) {
			var pageNo = by.xpath("//li[contains(@ng-repeat,'page in pages track')]//a[text()='"+index+"']");
			element(pageNo).waitReady();
			element(pageNo).click();
		};

		//function to get current page index
		this.getCurrentPage = function()
		{
			 element(this.currentPageLoc).waitReady();
			 return element(this.currentPageLoc).getText();
		}

		// Function to click on last page
		this.navigateToLastPage = function() {
			paginationLoc = this.paginationLoc;
			stepForwardIconLoc = this.stepForwardIconLoc;
			this.getTotalPageCount().then(function (pageCount) {
				if(pageCount>1){
					element(paginationLoc).element(stepForwardIconLoc).click();
				}
			});
		};

		//Function to validate element is enabled or not
		this.isElementEnabled = function(locator){
			return element(locator).isEnabled();
		};

		// Function to click page based on presence of text in div
		this.navigateToPage = function(textDiv, text) {
			stepNextLoc = this.stepNextLoc;
			return this.getTotalPageCount().then(function (pageCount) {
				for(i=0; i<pageCount; i++){
				if(pageCount>1){
					return element(textDiv).getText().then(function (faxText) {
						if(faxText.indexOf(text)!=-1){
							return true;
						}
						element(stepNextLoc).click();
						});
					}
				}
			});
		};

        // Function to get the active page number in pagination widget
        this.getActivePageNumber = function(){
            this.loc = by.xpath("//*[contains(@class, 'ng-scope active')]");
            return element(this.loc).getText();
        };
    }

    PaginationPage.prototype = new BasePage();
    PaginationPage.prototype.constructor = PaginationPage;
    return PaginationPage;
})();

exports = module.exports = {
	PaginationPage : PaginationPage
};
