var _ = require('./underscore.js');
var Runner = require('../node_modules/protractor/lib/runner');

exports.getRandomString = function(length) {
	  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz';
	  length = length ? length : 32;
	  
	  var string = '';
	  
	  for (var i = 0; i < length; i++) {
	    var randomNumber = Math.floor(Math.random() * chars.length);
	    string += chars.substring(randomNumber, randomNumber + 1);
	  }
	  
	  return string;
};

exports.getRandomNumber = function(length) {
	  var chars = '0123456789';
	  length = length ? length : 9;
	  
	  var string = '';
	  
	  for (var i = 0; i < length; i++) {
	    var randomNumber = Math.floor(Math.random() * chars.length);
	    string += chars.substring(randomNumber, randomNumber + 1);
	  }
	  
	  return string;
};

exports.readConfig = function(section, option, filename) {
	var nconf = require('nconf');
	filename = filename ? filename : './data.json';
	
	nconf.use('file', { file: filename});
	nconf.load();
	var value = nconf.get(section)[option];
	console.log('Configuration read successfully.');
	return value;
};

exports.writeConfig = function(section, option, value, filename) {
	var nconf = require('nconf');
	filename = filename ? filename : './data.json';
	console.log(filename);
	nconf.use('file', { file: filename});
	nconf.load();  
	console.log(section+':'+option);
	console.log(value);
	nconf.set(section+':'+option, value);
	
	nconf.save(function (err) {
		if (err) {
		  console.error(err.message);
		  return false;
		}
		console.log('Configuration saved successfully.');
	  });

	return true;
};	

exports.writeConfigList = function(section, optionValueList, filename) {
	var nconf = require('nconf');
	filename = filename ? filename : './data.json';
	console.log(filename);
	nconf.use('file', { file: filename});
	nconf.load();  
	
	_.each(optionValueList, function(value, option) {
	   nconf.set(section+':'+option, value);
    });
	
	nconf.save(function (err) {
		if (err) {
		  console.error(err.message);
		  return false;
		}
		console.log('Configuration List saved successfully.');
	  });
	
	return true;
};

/*This function provides the utilities to get the required date*/
exports.getDate = function(additionalDays) {
    var today = new Date();
    if (additionalDays == undefined) {
        var dd = today.getDate();
    }
    else {
        today.setDate(today.getDate() + additionalDays);
        var dd = today.getDate();
    }
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    reqDate = mm + '/' + dd + '/' + yyyy;
    return reqDate;
};

/*To get System time in 24 hrs format
* @param {integer} additionalHours no of additional hrs from current time*/
exports.getTime = function (additionalHours) {
    var date = new Date();
    var hours, minutes;
    if (additionalHours === undefined) {
    minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    hours = date.getHours() % 24 || 0;
    hours = hours < 10 ? "0" + hours:hours;
  }
else {
  minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  hours = (date.getHours()+additionalHours) % 24 || 0;
  hours = hours < 0 ? hours + 24:hours;
  hours = hours < 10 ? "0" + hours:hours;
  }
  var time = {'hours': hours, 'minutes': minutes};
  return time;
};

/*This function provides the utilities to get system timestamp in hr and min*/
exports.getTimeStamp = function (){
	var today = new Date();
	var timeStamp = today.toTimeString().substring(0,5);
	return timeStamp;
};

/*This function provides the utilities to capture screenshots on each failure of test*/
// exports.saveScreenshot = function(){
// 	var fs = require('fs'),
// 	path = require('path');
// 	var passed = jasmine.getEnv().currentSpec.results().passed();
// 	var specName = jasmine.getEnv().currentSpec.description.replace(/[:*?"<>/ ]/g, '-'),
// 	baseFileName = specName,
// 	screenshotsDir = path.resolve(__dirname, browser.params.screenshotsPath);
// 	if (!passed) {
// 		if (!fs.existsSync(screenshotsDir)) {
// 			fs.mkdirSync(screenshotsDir);
// 		}
// 		var file = path.resolve(screenshotsDir + '/' + baseFileName + '.png');
// 		browser.takeScreenshot().then(function (png) {
// 			console.log('Writing file ' + file);
// 			fs.writeFileSync(file, png, {encoding: 'base64'}, console.log);
// 		}, console.log);
// 	}
// };

/*This function is to create new browser from specs*/
exports.launchBrowser = function(newbrowserName){
    var myConfig = {
        allScriptsTimeout: 3600000,
        getPageTimeout: 3600000,
        params: {
        screenshotsPath: 'screenshots',
    },
        capabilities: { browserName: newbrowserName, count: 1, 'platform': 'ANY'}
    };
    runner = new Runner(myConfig);
    newBrowser = runner.createBrowser();
    browser = newBrowser;
    element = newBrowser.element;
    browser.ignoreSynchronization = true;
};
