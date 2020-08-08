/*
This file contains global variables
	apiKey - my apiKey used when making a request from openweatherapi *This is a free key and can only make a limited amountof requests per minute, may cause errors*
	url - the base url to be editted for a search by replacing {weatherType}, {search}, {key}, and {units} appropriately
	unitSymbol - a variable that is set when a request is made, creating a string to be used to display temperature units

This file contains functions
	getWeather - intializes two HTTP requests, one for a current weather query, and one for a forecast weather query 
	setRequest - gives the given HTTP request an eventListener to fire after it recieves a response, opens and sends the request of the type requestType
	removeOldRequest - removes the old container that was created via a previous response, if it exists
	removeAllChildren - given an element, empty it by removing all of its children
	requestListener - awaits a response from the HTTP request, parses it as JSON, calls the appropriate cardBuilder, and appends the result to the document in the appropriate spot
	notFoundError - creates an error message if a search passes the zip/city parsing but is not found by the openweathermap api
*/
var apiKey = "b4808d3be62ce204189dcf0c196809f0";
var url = 'https:api.openweathermap.org/data/2.5/{weatherType}?{search}&appid={key}&units={units}';
var unitSymbol;

function getWeather(){
	//performs a request from openweathermap.org using their api
	var currentWeatherRequest = new XMLHttpRequest();
	var forecastWeatherRequest = new XMLHttpRequest();

	unitSymbol = "\u00B0";
	switch(units){
		case 'imperial':
			unitSymbol += 'F';
		break;
		case 'metric':
			unitSymbol += 'C';
		break;
		case '':
		default:
			unitSymbol += 'K';
		break;
	}

	setRequest(currentWeatherRequest, 'weather');
	setRequest(forecastWeatherRequest, 'forecast');
}
function setRequest(request, requestType){
	request.addEventListener('load', requestListener);
	request.open("GET",url.replace('{weatherType}', requestType).replace('{search}', searchString).replace('{key}',apiKey).replace('{units}',units));
	request.send();

}
function removeOldRequest() {
	//removes current output container, if it exists
	removeAllChildren(document.getElementById('currentWeatherResponseContainer'));
	removeAllChildren(document.getElementById('forecastWeatherResponseContainer'));

}
function removeAllChildren(parent){
	parent.childNodes.forEach(node => parent.removeChild(node));
}
function requestListener(){
	//fires when a response is recieved from api request
	//parses response, build elements from response, appends to page

	var results = JSON.parse(this.responseText);
	//console.log(results);
	if(results.cod == '200'){
		if(results.hasOwnProperty('list')){
			document.getElementById('forecastWeatherResponseContainer').appendChild(createForecastWeatherContainer(results));
		} else {
			document.getElementById('currentWeatherResponseContainer').appendChild(createCurrentWeatherCard(results));
			moveMap(results.coord.lon, results.coord.lat);
		}
	} else if(results.cod == '404'){
		var attemptType = searchString.substring(0,searchString.indexOf('='));
		var attempt = searchString.substring(attemptType.length + 1);

		if(attemptType == 'q'){
			notFoundError('A city with the parameters - ' + attempt);
		} else if(attemptType == 'zip'){
			notFoundError('A zip code with the paramater - ' + attempt);
		} else {
			notFoundError('Search type was not found correctly. This error should never happen');
		}
	}
}
function notFoundError(queryString){
	var message = "That search parsed correctly, but was not found in the openweathermap api. Was that a US zip code, or a US city? Does that city exist? You searched for: " + queryString;
	createErrorMessage(message, document.getElementById("searchForm"));
}