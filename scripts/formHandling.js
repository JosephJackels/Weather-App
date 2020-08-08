/*
This file contains global variables
	searchString - used for setting the full query string, including query type and query, when making a request from the openweathermap api
	units - used to set which unit type the query should be returned in

This file adds event listeners
	unitType - sets the global variable unit when the selection is changed

This file contains functions
	updateUnits - sets the global variable units
	setSearch - cleans page by removing the old error messages and weather requests, sets the global variable searchString - including the appropriate query type and query value - and makes a request if the searchString is set
	makeRequest - begin a new request from the openweatherapi
	createErrorMessage - given a string and an element, creates a p tag with the given string, setes the errorMessage class, and appends the error element to the given element
	searchFailed - creates an error message when the search input is not parsed as a zip code or a city name
	removeOldErrorMessages - checks the document for existing error messages and removes them
	removeElement - given an element, remove that element from the document by removing it from the list of children of its parent node
*/

var searchString;
var units = document.getElementById('unitType').value;

//document.getElementById('searchType').addEventListener('change', updateSearchForm);
document.getElementById('unitType').addEventListener('change', updateUnits);

function updateUnits(unitInput){
	//sets the proper unit value when a different option is selected
	//if request is already made, updates unit values
	if(document.getElementById('currentWeatherResponseContainer').childNodes.length){
		//request exists
		document.querySelectorAll('.tempComp').forEach(comp => comp.innerText = calcNewTemp(comp.innerText, unitInput.target.value));
	}
	units = unitInput.target.value;
}

function setSearch(form){
	//builds search string to be sent to api based upon form values
	removeOldErrorMessages();
	removeOldRequest();

	var inputString = form.searchInput.value;
	var stateCode = form.stateSelect.value;

	if(/^\d\d\d\d\d([-. +]?\d\d\d\d)?$/.test(inputString)){
		searchString = 'zip=' + inputString.slice(0,5);
		makeRequest();
	} else if(/^[a-zA-z]+(\s[a-zA-Z]+)*$/.test(inputString)){
		searchString = 'q=' + inputString;
		if(stateCode  != ''){
			searchString +=',' + stateCode + ',US';
		}
		makeRequest();
	}else {
		searchFailed();
	}
}
function makeRequest(){
	getWeather();
}
function createErrorMessage(errorString, appendTo){
	removeOldErrorMessages();
	var errorMessage = document.createElement('p');
	errorMessage.classList.add('errorMessage');
	errorMessage.innerText = errorString; 
	appendTo.appendChild(errorMessage);
}
function searchFailed(){
	var message = "Search did not parse as ZIP or City Name. ZIP should be in format #####, #####[.-+ ]####, or #########. City name should only contain letters, with multiple word names seperated by a single space between words. Must start and end with a letter.";
	createErrorMessage(message, document.getElementById("searchForm"));
}
function removeOldErrorMessages(){
	var errorList = document.querySelectorAll('.errorMessage');
	if(errorList != null){
		errorList.forEach(error => removeElement(error));
	}
}
function removeElement(element){
	element.parentNode.removeChild(element);
}

function calcNewTemp(text, newUnit){
	var oldUnit = text[text.length - 1];
	var preTemp = text.replace(/\d+.*$/, '');
	var temp = parseInt(text.replace(/^\D*(\d+)\D*$/g, '$1'));
	var symbol = "\u00B0";
	switch(oldUnit){
		case'F':
			if(newUnit == 'metric' || newUnit == ''){
				temp = ((temp - 32) * (5 / 9));
			}
			if(newUnit == ''){
				temp = temp + 273.15;
			}
		break;
		case'C':
			if(newUnit == ''){
				temp = temp + 273.15;
			}else if(newUnit == 'imperial'){
				temp = ((temp * (9/5)) + 32);
			}
		break;
		case'K':
			if(newUnit == 'metric' || newUnit == 'imperial'){
				temp = temp - 273.15;
			}
			if(newUnit == 'imperial'){
				temp = ((temp * (9/5)) + 32);
			}
		break;
		default:
		break;
	}

	switch(newUnit){
		case 'imperial':
			symbol += 'F';
		break;
		case 'metric':
			symbol += 'C';
		break;
		case '':
		default:
			symbol += 'K';
		break;
	}
	return(preTemp + Math.round(temp) + symbol);
}