//init coords set to St Paul, MN. init coords are used when geolocation is unavailable/to set map until geolocation is approved,
//gives map somewhere to 'move' from
var mapLon = -93.16;
var mapLat = 44.95;
var openWeatherMapUrl = 'https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid={api_key}';
if('geolocation' in navigator){
	navigator.geolocation.getCurrentPosition((position) => {moveMap(position.coords.longitude, position.coords.latitude);});
}
var view = new ol.View({
	center: ol.proj.fromLonLat([mapLon, mapLat]),
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
	removeOldRequest();
	getWeather();
});

function moveMap(lon, lat){
	var newCenter = ol.proj.fromLonLat([lon, lat]);
	console.log(lon + ', ' + lat);
	view.animate({
		center: newCenter,
		duration: 2000,
	});
}