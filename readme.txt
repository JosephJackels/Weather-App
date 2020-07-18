This is a simple Weather App. A forecast is created via the Open Weather Map API - https://openweathermap.org
The app requests a current forecast and 5day/3hour forecast - the free options from Open Weather Map

A search can be made by entering a city name or a zip code, the state selection is optional, but may need to be used when searching for a city name that exists in multiple states

This app currently only supports searches in the U.S. :(
If a search is done by city name, a state is selected, the city does not exist in selected state, AND the city does exist in one or more other states, the results will be given for the city,state combinition that comes first when listed alphabetically
This search allows for extended zip codes - #####-####, but the openweathermap api does not support them, so the zip code is trimmed to the leading 5 digits

This app was made to practice/show off Web Development skills including:
	HTML
	CSS
	Vanilla JS
	Form Handling
	Use of Regular Expressions
	JSON HTTP requests
	API usage