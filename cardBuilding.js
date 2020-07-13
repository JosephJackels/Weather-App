/*
This file contains functions
	createTitleContainer - creates the header for a current weather card container - given a city name and the date of the requested weather
	createTitleContainerRange - creates the header for a forecast weather card container - given a city name and the starting and ending date
	createCurrentWeatherCard - builds the main weather card container, and builds and appends the weatherComponent and the tempContainer of tempComponents
	createForecastWeatherContainer - creates the main container for a forecast request - builds and appends individiual forecast card groups where each group is a list of forecasts sorted into the groups by date
	createForecastWeatherCard - given one group of forecasts that share the same date, builds the components that represent each forecast into one card
	createSingleForecast - creates the single forecast component to be grouped into a card
	unixTimeToDate - takes a Unix TImestamp and a timezone and converts it into MM/DD/YYYY HH:MM format
	getDayFromUnixTime - takes a unix Timestamp and a timezone and returns just the DD portion - used to quickly sort forecasts
	splitListByDate - takes a 1d array [] of forecasts and converts it into a 2d aray, where each entry in the first field of the new array is an array of forecasts that share the same date
*/
function createTitleContainer(cityName, date) {
	//creates the title container for current weather requests, given a string for the city name and a string for the date that has already been converted from Unix UTC
	var titleContainer = document.createElement('div');
	titleContainer.classList.add('titleContainer');
	
	var title = document.createElement('p');
	title.classList.add('titleNameComponent');
	title.innerText = cityName;
	titleContainer.appendChild(title);

	var time = document.createElement('p');
	time.classList.add('titleTimeComponent');
	time.innerText = date;
	titleContainer.appendChild(time);

	return titleContainer;
}
function createTitleContainerRange(cityName, startDate, endDate){
	//creates a title container for forecast weather requests, date has a start and end to represent the range of time being given a forecast for
	var titleContainer = document.createElement('div');
	titleContainer.classList.add('titleContainer');
	
	var title = document.createElement('p');
	title.classList.add('titleNameComponent');
	title.innerText = cityName;
	titleContainer.appendChild(title);

	var time = document.createElement('p');
	time.classList.add('titleTimeComponent');
	time.innerText = startDate + ' - ' + endDate;
	titleContainer.appendChild(time);

	return titleContainer;		
}
function createCurrentWeatherCard(results){
	//takes a parsed JSON array of open weather api response
	//builds a card to be used to display a current weather request

	var cardContainer = document.createElement('div');
	cardContainer.classList.add('currentWeatherCardContainer');
	cardContainer.setAttribute('id', 'mainContainer');
	cardContainer.appendChild(createTitleContainer(results.name, unixTimeToDate(results.dt * 1000 + results.timezone)));

	var weatherCond = document.createElement('p');
	weatherCond.classList.add('weatherComponent');
	weatherCond.innerText = results.weather[0].main;
	cardContainer.appendChild(weatherCond);

	var tempContainer = document.createElement('div');
	tempContainer.classList.add('tempContainer');
	var currentTemp = document.createElement('p');
	currentTemp.classList.add('tempComponent');
	currentTemp.innerText = 'Current Temp: ' + results.main.temp;
	tempContainer.appendChild(currentTemp);

	var feelsLikeTemp = document.createElement('p');
	feelsLikeTemp.classList.add('tempComponent');
	feelsLikeTemp.innerText = 'Feels Like: ' + results.main.feels_like;
	tempContainer.appendChild(feelsLikeTemp);

	cardContainer.appendChild(tempContainer);

	return cardContainer;

}
function createForecastWeatherContainer(results){
	//creates main container for forecasted weather request, takes in parsed JSON response from openweathermap api
	//splits response by day, adjusts by timezone to properly split by correct day
	var forecastList = splitListByDate(results.list, results.city.timezone);
	var forecastContainer = document.createElement('div');
	forecastContainer.classList.add('mainForecastCardContainer');
	forecastContainer.setAttribute('id', 'mainContainer');
	forecastContainer.appendChild(createTitleContainerRange(results.city.name, unixTimeToDate(forecastList[0][0].dt * 1000 + results.city.timezone), unixTimeToDate(forecastList[forecastList.length - 1][forecastList[forecastList.length - 1].length - 1].dt * 1000 + results.city.timezone)));

	forecastList.forEach(forecastGroup => forecastContainer.appendChild(createForecastWeatherCard(forecastGroup, results.city.timezone)));

	return forecastContainer;
}
function createForecastWeatherCard(forecastGroup, timezone){
	//creates a single day's forecast weather card - given an array of lists, each list contains an object that contains the respons from openweathermap api
	var groupContainer = document.createElement('div');
	groupContainer.classList.add('forecastCardGroup');
	var groupDate = document.createElement('p');
	groupDate.classList.add('forecastDateComponent');
	tempString = unixTimeToDate(forecastGroup[0].dt * 1000 + timezone);
	groupDate.innerText = tempString.substring(0,tempString.indexOf(' '));
	groupContainer.appendChild(groupDate);
	forecastGroup.forEach(forecast => groupContainer.appendChild(createSingleForecast(forecast, timezone)));
	
	return groupContainer;
}
function createSingleForecast(forecast, timezone){
	//creates each individual forecast. takes one single list item from the array of lists in the forecastGroup
	//builds the card representing that 3hour block of data
	var singleForecastContainer = document.createElement('div');
	singleForecastContainer.classList.add('singleForecastComponentContainer');
	var time = document.createElement('p');
	time.classList.add('timeComponent');
	var tempString = unixTimeToDate(forecast.dt * 1000 + timezone);
	time.innerText = tempString.substring(tempString.indexOf(' '));
	singleForecastContainer.appendChild(time);

	var weather = document.createElement('p');
	weather.classList.add('weatherComponent');
	weather.innerText = forecast.weather[0].main + ' - ' + forecast.weather[0].description;
	singleForecastContainer.appendChild(weather);

	var tempContainer = document.createElement('div');
	tempContainer.classList.add('tempContainer');
	var currentTemp = document.createElement('p');
	currentTemp.classList.add('tempComponent');
	currentTemp.innerText = 'Temp. : ' + forecast.main.temp;
	tempContainer.appendChild(currentTemp);

	var feelsLikeTemp = document.createElement('p');
	feelsLikeTemp.classList.add('tempComponent');
	feelsLikeTemp.innerText = 'Feels like: ' + forecast.main.feels_like;
	tempContainer.appendChild(feelsLikeTemp);

	var maxTemp = document.createElement('p');
	maxTemp.classList.add('tempComponent');
	maxTemp.innerText = 'High of: ' + forecast.main.temp_max;
	tempContainer.appendChild(maxTemp);

	var minTemp = document.createElement('p');
	minTemp.classList.add('tempComponent');
	minTemp.innerText = 'Low of: ' + forecast.main.temp_min;
	tempContainer.appendChild(minTemp);

	singleForecastContainer.appendChild(tempContainer);

	return singleForecastContainer;
}
function unixTimeToDate(unixTimeShifted){//expects time to be shifted if in milliseconds, and adjusted for timezone
	// converts unixtime, that has been adjusted rom seconds to milliseconds and shifted by timezone
	//converts into a date in format mm/dd/yyyy hh:mm
	var date = new Date(unixTimeShifted);
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hour = date.getHours();

	var min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

	return(month + '/' + day + '/' + year + ' ' + hour + ':' + min);
}
function getDayFromUnixTime(unixTime, timezone){
	//returns just the day of a given unixtime timezone combination
	//used for splitting lists by correct day
	var date = new Date(unixTime * 1000 + timezone);
	return date.getDate();
}
function splitListByDate(list, timezone){
	//takes a list of responses from api, each inner list has a dt property representing it's unixtimestamp.
	//using the timezone, the list is split into a a 2d list of lists, with each roup of lists being grouped by day and returned
	var tempList = list;
	var splitList = [];
	var splitIndex = 0;
	var currentDay;
	tempList.forEach(listItem => listItem.day = getDayFromUnixTime(listItem.dt, timezone));
	currentDay = tempList[0].day;
	for(var i = 0; i < tempList.length; i++){
		if(currentDay == tempList[i].day){
			if(splitList[splitIndex] == null){
				splitList[splitIndex] = new Array;
			}
			splitList[splitIndex].push(tempList[i]);
		} else {
			currentDay = tempList[i].day;
			splitIndex++;
			i-=1;
		}
	}
	return splitList;

}