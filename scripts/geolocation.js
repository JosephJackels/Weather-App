/*
This file contains global variables:
	openWeatherMapUrl - the url for requesting map layers from openweathermap
	view - used for setting where on the map is being viewed
	map - the map object, contains all layers and views
	tempLayer - a layer for temperature maps
	cloudLayer - a layer for cloud cover
	precipLayer - a layer for precipitation map

This file adds event listeners:
	map.on('moveend') - when scrolling/zooming/panning map, make request when move ends
	layerInputs('change') - event listener for checkboxes controling which weather layers are overlaid on map

This file contains functions:
	moveMap - function used to move a map to desired coordinates
	zoomMap - function to animate a change in zoom level
	bounceTo - function to zoom out of current coordinates and zoom in on new coordinates
	setLayer - sets a given layer's visibility to the value of its checkbox
*/

var openWeatherMapUrl = 'https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid={api_key}';
if('geolocation' in navigator){
	navigator.geolocation.getCurrentPosition((position) => {moveMap(position.coords.longitude, position.coords.latitude);});
}
//init coords set to St Paul, MN (Falcon Heights). init coords are used when geolocation is unavailable/to set map until geolocation is approved,
//gives map somewhere to 'move' from
var view = new ol.View({
	center: ol.proj.fromLonLat([-93.16, 44.95]),
	zoom: 4,
});

var map = new ol.Map({
	target: 'mapFrame',
	layers: [
		new ol.layer.Tile({
			source: new ol.source.OSM(),
		})
	],
	view: view,
});

var tempLayer = new ol.layer.Tile({
	source: new ol.source.XYZ({
		url: openWeatherMapUrl.replace('{layer}', 'temp_new').replace('{api_key}', apiKey)
	})
});
map.addLayer(tempLayer);

var cloudLayer = new ol.layer.Tile({
	source: new ol.source.XYZ({
		url: openWeatherMapUrl.replace('{layer}', 'clouds_new').replace('{api_key}', apiKey)
	})
});
map.addLayer(cloudLayer);

var precipLayer = new ol.layer.Tile({
	source: new ol.source.XYZ({
		url: openWeatherMapUrl.replace('{layer}', 'precipitation_new').replace('{api_key}', apiKey)
	})
});
map.addLayer(precipLayer);

map.on('moveend', function(){
	var tempLon = ol.proj.toLonLat(map.getView().getCenter())[0];
	var tempLat = ol.proj.toLonLat(map.getView().getCenter())[1];
	searchString = 'lat={lat}&lon={lon}'.replace('{lat}', tempLat).replace('{lon}', tempLon);
	getWeather();
});

function moveMap(lon, lat){
	var newCenter = ol.proj.fromLonLat([lon, lat]);
	view.animate({
		center: newCenter,
		duration: 2000,
	});
}

function zoomMap(zoomLevel){
	view.animate({
		zoom: zoomLevel,
		duration: 2000,
	});
}
//The high timeout may make some searches seem slow, specifically when the new search is close to the old one
//The high timout is required in case the new search is very very far so that the zoom is done after panning
function bounceTo(lon, lat){
	if(view.getZoom() > 4){
		zoomMap(4);
	} 
	setTimeout(function(){moveMap(lon, lat); zoomMap(12);}, 3000);
}

var layerInputs = document.querySelectorAll('.layerSelector');
layerInputs.forEach(input => input.addEventListener('change', (event) => {
	setLayer(event.target.name);
}));

function setLayer(layer){
	switch(layer){
		case 'tempLayer':
			tempLayer.setVisible(document.getElementById('tempLayer').checked);
		break;
		case 'cloudLayer':
			cloudLayer.setVisible(document.getElementById('cloudLayer').checked);
		break;
		case 'precipLayer':
			precipLayer.setVisible(document.getElementById('precipLayer').checked);
		break;
		default:
		break;
	}
}