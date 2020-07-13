/*
This file contains global variables
	searchString - used for setting the full query string, including query type and query, when making a request from the openweathermap api
	units - used to set which unit type the query should be returned in
	weatherType - used to differentiate between a request for current weather and forecasted weather

This file adds event listeners
	unitType - sets the global variable unit when the selection is changed
	weatherType - sets the global variable weatherType when the selection is changed

This file contains functions
	updateUnits - sets the global variable units
	updateWeatherType - sets the global variable weatherType
	setSearch - cleans page by removing the old error messages and weather requests, sets the global variable searchString - including the appropriate query type and query value - and makes a request if the searchString is set
	makeRequest - begin a new request from the openweatherapi
	searchFailed - shows an error message when the search input is not parsed as a zip code or a city name
	removeOldErrorMessages - checks the document for existing error messages and removes them
	removeElement - given an element, remove that element from the document by removing it from the list of children of its parent node
*/

var searchString;
var units = document.getElementById('unitType').value;
var weatherType = document.getElementById('weatherType').value;

//document.getElementById('searchType').addEventListener('change', updateSearchForm);
document.getElementById('unitType').addEventListener('change', updateUnits);
document.getElementById('weatherType').addEventListener('change', updateWeatherType);

function updateUnits(unitInput){
	//sets the proper unit value when a different option is selected
	units = unitInput.target.value;
}

function updateWeatherType(typeInput){
	//updates weather search type - forecast or current
	weatherType = typeInput.target.value;
}
function setSearch(form){
	//builds search string to be sent to api based upon form values
	removeoldErrorMessages();
	removeOldRequest();

	var inputString = form.searchInput.value;
	var stateCode = form.stateSelect.value;

	if(/^\d\d\d\d\d([-. +]?\d\d\d\d)?$/.test(inputString)){
		searchString = 'zip=' + inputString;
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
function searchFailed(){
	var errorMessage = document.createElement('p');
	errorMessage.setAttribute('id', 'errorParsing');
	errorMessage.classList.add('errorMessage');
	errorMessage.innerText = "Search did not parse as ZIP or City Name. ZIP should be in format #####, #####[.-+ ]####, or #########. City name should only contain letters, with multiple word names seperated by a single space between words. Must start and end with a letter.";
	document.getElementById("searchForm").appendChild(errorMessage);
}
function removeoldErrorMessages(){
	var errorList = document.querySelectorAll('.errorMessage');
	if(errorList != null){
		errorList.forEach(error => removeElement(error));
	}
}
function removeElement(element){
	element.parentNode.removeChild(element);
}