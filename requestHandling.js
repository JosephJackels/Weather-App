/*
This file contains global variables
	apiKey - my apiKey used when making a request from openweatherapi *This is a free key and can only make a limited amountof requests per minute, may cause errors*
	url - the base url to be editted for a search by replacing {weatherType}, {search}, {key}, and {units} appropriately

This file contains functions
	getWeather - intializes an HTTP request from the openweatherapi by setting the url appropriately, and creating an event listener that fires after the request is returned
	removeOldRequest - removes the old container that was created via a previous response, if it exists
	requestListener - awaits a response from the HTTP request, parses it as JSON, calls the appropriate cardBuilder, and appends the result to the document
	notFoundError - creates an error message if a search passes the zip/city parsing but is not found by the openweathermap api
*/
var apiKey = "b4808d3be62ce204189dcf0c196809f0";
var url = 'https:api.openweathermap.org/data/2.5/{weatherType}?{search}&appid={key}&units={units}';

function getWeather(){
	//performs a request from openweathermap.org using their api
	var request = new XMLHttpRequest();
	request.addEventListener("load", requestListener);
	request.open("GET",url.replace('{weatherType}', weatherType).replace('{search}', searchString).replace('{key}',apiKey).replace('{units}',units));
	request.send();
}
function removeOldRequest() {
	//removes current output container, if it exists
	if(document.getElementById('mainContainer') != null){
		document.getElementById('mainContainer').parentNode.removeChild(document.getElementById('mainContainer'));
	}
}
function requestListener(){
	//fires when a response is recieved from api request
	//parses response, build elements from response, appends to page

	var results = JSON.parse(this.responseText);
	if(results.cod == '200'){
		if(weatherType == 'weather'){
			document.body.appendChild(createCurrentWeatherCard(results));
		} else if(weatherType == 'forecast'){
			document.body.appendChild(createForecastWeatherContainer(results));
		}
	} else if(results.cod == '404'){
		var attemptType = searchString.substring(0,searchString.indexOf('='));
		var attempt = searchString.substring(attemptType.length + 1);

		if(attemptType == 'q'){
			notFoundError('A city with the parameters - ' + attempt);
		} else if(attemptType == 'zip'){
			notFoundError('A zip code with the paramater - ' + attempt);
		} else {
			notFoundError('Search type was not found correctly. How did you get here?');
		}
	}
}
function notFoundError(queryString){
	var errorMessage = document.createElement('p');
	errorMessage.setAttribute('id', 'notFound');
	errorMessage.classList.add('errorMessage');
	errorMessage.innerText = "That search parsed correctly, but was not found in the openweathermap api. Was that a US zip code, or a US city? Does that city exist? You searched for: " + queryString;
	document.getElementById("searchForm").appendChild(errorMessage);
}