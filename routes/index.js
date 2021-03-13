var express = require('express');
var router = express.Router();
var request = require('request');
var json = require('express-json');
require('dotenv').config(); 
geoUrl = `http://ip-api.com/json/?fields=61439`; //user location

//default values for geolocation
var  city = {
city: 'Belgrade',
lat: '43.3247', //coordinate
lon:'21.9033' //coordinate
}

//function where call api weather
var placeOfWeather = (city) =>{
var api_key = process.env.API_KEY; //call key from .env file
var units = 'metric'; //The unit of measurement is imerial
var time = 'hourly,alerts,minutely'; //  forecast is skipped
//url addres from openweather
return `https://api.openweathermap.org/data/2.5/onecall?lat=${city.lat}&lon=${city.lon}&units=${units}&exclude=${time}&appid=${api_key}`;
}
// function where parse JSON
var allDaysWeather = (url, city) =>{
 return new Promise((resolve, rejekt)=>{ 
request(url, (error, response, body) =>{ 
  if(error)
  {
    reject({ error: "Error"});
  }  

  weather = JSON.parse(body);
  weather.city = city;
  resolve(weather)
});
});
}
//use parametars location from JSON 
var geoPlace = (url) =>
{
  return new Promise((resolve, reject) =>
  {
    request(url, (error, response, body) =>{ 
      if(error)
      {
        reject(city)
      }

      var geoRes = JSON.parse(body);
      var geoLocation = {
        city: geoRes.city,
        lat: geoRes.lat,
        lon: geoRes.lon
      }
      resolve(geoLocation);
  });
});
}
// function where call another function 
var getWeatherInfo = (url)=>{
geoPlace(url)
  .then((res) =>{
  var place = placeOfWeather(res);
  allDaysWeather(place, res.city).then((weather)=>
  {
    getRoute(weather);
  
  }, (weather)=>{
  
    getRoute(weather);
  
  });
},
  (city) =>
  {
    allDaysWeather(place, city.city)
    .then((weather)=>
    {
      getRoute(weather);
    
    }, 
    (weather)=>{
    
      getRoute(weather);
    
    });

  });
}

// create route
var getRoute = (weather) =>{
router.get('/',(req, res) => {
  
  res.render('index.ejs', {weather: weather}); //render index file with weather json file
});
}
//function with geolocation API
getWeatherInfo(geoUrl);
module.exports = router;
