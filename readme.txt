*** Found a bug? Have a comment, critique, or suggestion? Want to hire me? Make a commit, or send me an email at jackelsjoseph@gmail.com ***

This is a simple Weather App. A forecast is created via the Open Weather Map API - https://openweathermap.org

The app requests a current forecast and 5day/3hour forecast - the free options from Open Weather Map
The app uses OpenLayers, OpenStreetMap, and OpenWeatherMap to create a layered map of the desired location, with layers for - the base geography, temperature, cloud cover, and precipitation.


A search can be made by entering a city name or a zip code, the state selection is optional, but may need to be used when searching for a city name that exists in multiple states

Each day's forecast is created by grouping by date, setting the weather type to the most occuring weather type in that day's forecasts, setting the weather icon to the 'day' version of that day's most occuring icon, setting the temp to the average maintemp of that day's forecasts, seting the High to the highest value of that day's max temps, and setting the low to the lowest value of that day's min temps

The search funtion of the app may only support searches in the U.S. reliably.

If a search is done by city name, a state is selected, the city does not exist in selected state, AND the city does exist in one or more other states, the results will be given for the city,state combinition that comes first when listed alphabetically
This search allows for extended zip codes - #####-####, but the openweathermap api does not support them, so the zip code is trimmed to the leading 5 digits

This app is currently utilizing a free teir of the openweathermap api, as a result calls to the api are limited. If the app is not working, this is a likely culprit. The variable apiKey in the file requestHandling.js can be updated to the users own free key in this case.

This app was made to practice/show off Web Development skills including:
	HTML
	CSS
	Vanilla JS
	Form Handling
	Use of Regular Expressions
	JSON HTTP requests
	API usage