/*
This file contains global variables
	iconUrl - a url for fetching icons from openweather - replace imageCode with the weather code returned from the api
This file contains functions
	createCurrentWeatherCard - builds the main weather card container, and builds and appends the weatherComponent and the tempContainer of tempComponents
	createForecastWeatherContainer - creates the main container for a forecast request - builds and appends individiual forecast card groups where each group is a list of forecasts sorted into the groups by date
	createForecastWeatherCard - given one group of forecasts that share the same date, builds the components that represent each forecast into one card
	getMode - given array of strings, return which occurs the most
	getAverage - given an array of integers/numbers/floats return an average
	getHighest - given an array of integers/numbers/floats return the max value
	getLowest - given an array of integers/numbers/floats return the min value
	createSingleFOrecastDataList - pulls wanted data from one forecast and returns an object to be put into an array of entries for later averaging, analyzing etc.
	unixTimeToDate - takes a Unix TImestamp and a timezone and converts it into MM/DD/YYYY HH:MM format
	getDateFromUnixTime - takes a unix Timestamp and a timezone and returns just the DD portion - used to quickly sort forecasts
	getDayFromUnixTime - returns the day of the week given a unixtime and timezone
	splitListByDate - takes a 1d array [] of forecasts and converts it into a 2d aray, where each entry in the first field of the new array is an array of forecasts that share the same date
*/
var iconUrl = 'https://openweathermap.org/img/wn/{imageCode}{resolution}.png';

function createCurrentWeatherCard(results){
	//takes a parsed JSON array of open weather api response
	//builds a card to be used to display a current weather request

	var cardContainer = document.createElement('div');
	cardContainer.classList.add('currentWeatherCardContainer');
	//cardContainer.appendChild(createTitleContainer(results.name, unixTimeToDate(results.dt * 1000 + results.timezone)));
	
	var currentWeatherCardMainPanel = document.createElement('div');
	currentWeatherCardMainPanel.classList.add('currentWeatherCardMainPanel');
		
		var cityNameComp = document.createElement('div');
		cityNameComp.classList.add('cityNameComp');
		cityNameComp.innerText = results.name;
		currentWeatherCardMainPanel.appendChild(cityNameComp);

		var dateTimeComp = document.createElement('div');
		dateTimeComp.classList.add('dateTimeComp');
		dateTimeComp.innerText =getDayFromUnixTime(results.dt, results.timezone) + ', ' + unixTimeToDate(results.dt * 1000 + results.timezone);
		currentWeatherCardMainPanel.appendChild(dateTimeComp);

		var weatherDescriptionComp = document.createElement('div');
		weatherDescriptionComp.classList.add('weatherDescriptionComp');
		weatherDescriptionComp.innerText = results.weather[0].main + ' - ' + results.weather[0].description;
		currentWeatherCardMainPanel.appendChild(weatherDescriptionComp);

		var weatherIconCompContainer = document.createElement('div');
		weatherIconCompContainer.classList.add('weatherIconCompContainer');
			var weatherIconComp = document.createElement('img');
			weatherIconComp.classList.add('weatherIconComp');
			weatherIconComp.setAttribute('alt', results.weather[0].main);
			weatherIconComp.setAttribute('src', iconUrl.replace('{imageCode}', results.weather[0].icon).replace('{resolution}', '@2x'));
			weatherIconCompContainer.appendChild(weatherIconComp);
		currentWeatherCardMainPanel.appendChild(weatherIconCompContainer);
	cardContainer.appendChild(currentWeatherCardMainPanel);

	var currentTemperatureContainer = document.createElement('div');
	currentTemperatureContainer.classList.add('currentTemperatureContainer');
		
		var currentTempComp = document.createElement('div');
		currentTempComp.classList.add('tempComp', 'currentTempComp');
		currentTempComp.innerText = "Currently: " + Math.round(results.main.temp) + unitSymbol;
		currentTemperatureContainer.appendChild(currentTempComp);

		var feelsLikeTempComp = document.createElement('div');
		feelsLikeTempComp.classList.add('tempComp', 'feelsLikeTempComp');
		feelsLikeTempComp.innerText = 'Feels like: ' + Math.round(results.main.feels_like) + unitSymbol;
		currentTemperatureContainer.appendChild(feelsLikeTempComp);
	cardContainer.appendChild(currentTemperatureContainer);

	return cardContainer;

}

function createForecastWeatherContainer(results){
	//creates main container for forecasted weather request, takes in parsed JSON response from openweathermap api
	//splits response by day, adjusts by timezone to properly split by correct day
	var forecastList = splitListByDate(results.list, results.city.timezone);
	var forecastContainer = document.createElement('div');
	forecastContainer.classList.add('mainForecastCardContainer');
	var cardCount = forecastList.length;
	forecastList.forEach(forecastGroup => forecastContainer.appendChild(createForecastWeatherCard(forecastGroup, results.city.timezone, cardCount)));

	return forecastContainer;
}
function createForecastWeatherCard(forecastGroup, timezone, cardCount){
	//creates a single day's forecast weather card - given an array of lists, each list contains an object that contains the respons from openweathermap api
	var forecastCard = document.createElement('div');
	forecastCard.classList.add('forecastCard');
	forecastCard.style.width = 'calc(100%/' + cardCount +')';

	var forecastCardDayComp = document.createElement('div');
	forecastCardDayComp.classList.add('forecastCardDayComp');
	forecastCardDayComp.innerText = getDayFromUnixTime(forecastGroup[0].dt,timezone);
	forecastCard.appendChild(forecastCardDayComp);

	var forecastDataList = [];
	forecastGroup.forEach(forecast => forecastDataList.push(createSingleForecastDataList(forecast)));
	
	var weatherTypeArray = [];
	var weatherIconArray = [];
	var tempArray = [];
	var tempHighArray = [];
	var tempLowArray = [];

	forecastDataList.forEach((entry) => {
		weatherTypeArray.push(entry.weatherType);
		weatherIconArray.push(entry.weatherIcon.slice(0, entry.weatherIcon.length - 1));
		tempArray.push(entry.temp);
		tempHighArray.push(entry.tempHigh);
		tempLowArray.push(entry.tempLow);
	});

	var modeWeatherType = getMode(weatherTypeArray);
	var modeWeatherIcon = getMode(weatherIconArray);
	var averageTemp = getAverage(tempArray);
	var averageTempHigh = getHighest(tempHighArray);
	var averageTempLow = getLowest(tempLowArray);

	var weatherTypeComp = document.createElement('div');
	weatherTypeComp.classList.add('forecastWeatherTypeComp');
	weatherTypeComp.innerText = modeWeatherType;
	forecastCard.appendChild(weatherTypeComp);

	var weatherIconComp = document.createElement('img');
	weatherIconComp.classList.add('forecastWeatherIconComp');
	weatherIconComp.setAttribute('alt', modeWeatherType);
	weatherIconComp.setAttribute('src', iconUrl.replace('{imageCode}', modeWeatherIcon + 'd').replace('{resolution}', ''));
	forecastCard.appendChild(weatherIconComp);

	var tempComp = document.createElement('div');
	tempComp.classList.add('forecastTempComp');
	tempComp.classList.add('tempComp');
	tempComp.innerText = Math.round(averageTemp) + unitSymbol;
	forecastCard.appendChild(tempComp);

	var tempHighComp = document.createElement('div');
	tempHighComp.classList.add('forecastTempHighComp');
	tempHighComp.classList.add('tempComp');
	tempHighComp.innerText = 'H:' + Math.round(averageTempHigh) + unitSymbol;
	forecastCard.appendChild(tempHighComp);

	var tempLowComp = document.createElement('div');
	tempLowComp.classList.add('forecastTempLowComp');
	tempLowComp.classList.add('tempComp');
	tempLowComp.innerText = 'L:' + Math.round(averageTempLow) + unitSymbol;
	forecastCard.appendChild(tempLowComp);

	return forecastCard;
}
function getMode(array){
	var numberOf = new Object();

	array.forEach((entry) => {
		if(!numberOf.hasOwnProperty(entry)){
			numberOf[entry] = 1;
		}else {
			numberOf[entry]++;
		}
	});

	var properties = [];
	for(var property in numberOf){
		properties.push(property);
	}
	var maxOccuring = 0;
	var maxEntry;
	for(var i = 0; i < properties.length; i++){
		if(numberOf[properties[i]] > maxOccuring){
			maxEntry = properties[i];
			maxOccuring = numberOf[properties[i]];
		}
	}
	return maxEntry;
}
function getAverage(array){
	var sum = 0;
	for(var i =0; i < array.length; i++){
		sum += array[i];
	}
	return(sum / array.length);
}
function getHighest(array){
	var high = Number.MIN_SAFE_INTEGER;
	for(var i = 0; i < array.length; i++){
		if(array[i] > high){
			high = array[i];
		}
	}
	return high;
}
function getLowest(array){
	var low = Number.MAX_SAFE_INTEGER;
	for(var i = 0; i < array.length; i++){
		if(array[i] < low){
			low = array[i];
		}
	}
	return low;
}
function createSingleForecastDataList(forecast, timezone){
	//creates each individual forecast. takes one single list item from the array of lists in the forecastGroup
	//builds the card representing that 3hour block of data
	
	var forecastDataEntry = new Object();
	forecastDataEntry.weatherType = forecast.weather[0].main;
	forecastDataEntry.weatherIcon = forecast.weather[0].icon;
	forecastDataEntry.temp = forecast.main.temp;
	forecastDataEntry.tempHigh = forecast.main.temp_max;
	forecastDataEntry.tempLow = forecast.main.temp_min;

	return forecastDataEntry;
}
function unixTimeToDate(unixTimeShifted){//expects time to be shifted if in milliseconds, and adjusted for timezone
	// converts unixtime, that has been adjusted rom seconds to milliseconds and shifted by timezone
	//converts into a date in format mm/dd/yyyy hh:mm
	var date = new Date(unixTimeShifted);
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hour = date.getHours();
	var meridian = hour > 11 ? 'PM' : 'AM';
	if(hour > 12){
		hour -= 12;
	}
	if(hour == 0){
		hour = 12;
	}

	var min = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

	return(month + '/' + day + '/' + year + ' ' + hour + ':' + min + ' ' + meridian);
}
function getDateFromUnixTime(unixTime, timezone){
	//returns just the day of a given unixtime timezone combination
	//used for splitting lists by correct day
	var date = new Date(unixTime * 1000 + timezone);
	return date.getDate();
}
function getDayFromUnixTime(unixTime, timezone){
	var date = new Date(unixTime * 1000 + timezone);
	switch(date.getDay()){
		case 0:
			return 'Sunday';
			break;
		case 1:
			return 'Monday';
			break;
		case 2:
			return 'Tuesday';
			break;
		case 3:
			return 'Wednesday';
			break;
		case 4:
			return 'Thursday';
			break;
		case 5:
			return 'Friday';
			break;
		case 6:
			return 'Saturday';
			break;
		default:
			return '';
			break;
	}

}
function splitListByDate(list, timezone){
	//takes a list of responses from api, each inner list has a dt property representing it's unixtimestamp.
	//using the timezone, the list is split into a a 2d list of lists, with each roup of lists being grouped by day and returned
	var tempList = list;
	var splitList = [];
	var splitIndex = 0;
	var currentDay;
	tempList.forEach(listItem => listItem.day = getDateFromUnixTime(listItem.dt, timezone));
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