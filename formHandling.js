/*
This file contains global variables
	searchString - used for setting the full query string, including query type and query, when making a request from the openweathermap api
	units - used to set which unit type the query should be returned in
	weatherType - used to differentiate between a request for current weather and forecasted weather

This file adds event listeners
	searchType - a select input used to set which type of search is being done(by zip or city name) and update the form to hide/show the appropriate inputs
	unitType - sets the global variable unit when the selection is changed
	weatherType - sets the global variable weatherType when the selection is changed

This file contains functions
	updateUnits - sets the global variable units
	updateSearchForm - hides/shows the appropriate inputs and resets values of hidden inputs
	updateWeatherType - sets the global variable weatherType
	setSearch - sets the global variable searchString - including the appropriate query type and query value - and makes a request if the searchString is set
	makeRequest - removes any prior request, if it exists, and begin a new request from the openweatherapi
*/

var searchString;
var units;
var weatherType;

document.getElementById('searchType').addEventListener('change', updateSearchForm);
document.getElementById('unitType').addEventListener('change', updateUnits);
document.getElementById('weatherType').addEventListener('change', updateWeatherType);

function updateUnits(unitInput){
	//sets the proper unit value when a different option is selected
	units = unitInput.target.value;
}
function updateSearchForm(searchInput){
	//adjusts visibility of form elements based upon selection, and resets any values taht were set for the search option that is not being used
	var cityChildren = [].slice.call(document.getElementById('citySearchForm').children);
	var zipChildren = [].slice.call(document.getElementById('zipSearchForm').children)
	switch(searchInput.target.value){
		case 'zip':
			cityChildren.forEach(input => input.value='');
			document.getElementById('citySearchForm').style.display = "none";
			document.getElementById('zipSearchForm').style.display = 'inline';
		break;
		case 'city':
			zipChildren.forEach(input => input.value='');
			document.getElementById('zipSearchForm').style.display = "none";
			document.getElementById('citySearchForm').style.display = 'inline';
		break;
		default://should never get here
		break;
	}
}
function updateWeatherType(typeInput){
	//updates weather search type - forecast or current
	weatherType = typeInput.target.value;
}
function setSearch(form){
	//builds search string to be sent to api based upon form values
	var cityName = form.citySearch.value;
	var stateCode = form.stateSelect.value;
	var zipCode = form.zipSearch.value;
	var tempString = "";
	if(cityName != '') {
		tempString = 'q=' + cityName;
		if(stateCode != ''){
			tempString += ',stateCode';
		}
	} else if(zipCode != ''){
		tempString = 'zip=' + zipCode;
	}
	
	if(tempString != ""){	
		searchString = tempString;
		makeRequest();
	}else{
		alert('Did you enter an input?');
	}
}
function makeRequest(){
	removeOldRequest();
	getWeather();
}