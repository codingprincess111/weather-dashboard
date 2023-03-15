var searchForm = document.querySelector ("#search-form")
var historyContainer = document.querySelector ("#history-container")
var todayContainer = document.querySelector("#today")
var fivedayContainer= document.querySelector("#five-day-forecast")
var searchCity = document.querySelector ("#search-city")

var forecastUrl = "http://api.openweathermap.org/data/2.5/forecast?"
var geocodeUrl = "http://api.openweathermap.org/geo/1.0/direct?q="
var cityTerm = "q="; 
var limitSearch = "&limit=1"
var apiKeyTerm = "&appid=";
var apiKey= "c2c1687183f47dd81077647bcda4336d";
var unitTerm = "&units=imperial"

function createcityEl (cityName) {
    var cityEl = document.createElement('h2');
    cityEl.textContent = cityName;
    cityEl.className = 'card-data'
    cityEl.setAttribute('id','city-name');
    return cityEl;
}
//function used to create the city name element that will be displayed on forecast card 

function createDateEl (date) {
    var dateEl = document.createElement('h3');
    dateEl.textContent = dayjs.unix(date).format('MM/DD/YYYY');
    dateEl.className = "card-data"
    return dateEl;
}
//function used to create the date element that will be displayed on the forecast card

function createIconEl(icon) {
    var iconEl = document.createElement('img');
    iconEl.src = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
    iconEl.className = "card-data";
    return iconEl;
}
//function displays icon for given forecast retrieved from api to the page

function createTempEl(temp) {
    var tempEl = document.createElement('div')
    tempEl.textContent = temp + "°F";
    tempEl.className = "card-data";
    return tempEl;
}
//function displays temperature on forecast card

function createWindEl(wind) {
    var windEl = document.createElement('div')
    windEl.textContent = wind + " MPH";
    windEl.className = "card-data";
    return windEl;
}
//function displays wind mph on forecast card

function createHumidEl(humid) {
    var humidEl = document.createElement('div')
    humidEl.textContent = humid + " %";
    humidEl.className = "card-data";
    return humidEl;
}
//function displays humidity index on forecast card

function renderForecast(cityName, date, icon, temp, humid, wind) {
    var forecastCard = document.createElement('div');
    var forecastContainer = fivedayContainer;
    forecastCard.className = "card";
    if (cityName.length > 0) {
        forecastContainer = todayContainer;
        forecastCard.append(createcityEl(cityName))
    } 
    forecastCard.append(createDateEl(date), createIconEl(icon), createTempEl(temp), createHumidEl(humid), createWindEl(wind));
    forecastContainer.append(forecastCard);
}
//function renders today's forecast when user search city name

function retrieveWeatherData(inputCity) {
    var fullGeoUrl = geocodeUrl + inputCity + limitSearch + apiKeyTerm + apiKey
    
    fetch(fullGeoUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (weather) {
        return(weather[0]);
    })
    .then(function (data) {        
        var latitudeTerm = "lat=" + data.lat;
        var longitudeTerm = "&lon=" + data.lon;
        var fullForecastUrl = forecastUrl + latitudeTerm + longitudeTerm + apiKeyTerm + apiKey + unitTerm;

        asyncApiCall(fullForecastUrl);
    });
}
//fetching to request api endpoint, once data is recieved, function extracts json data using json method, and returns the first element in the array weather [0] which contains, long & lat
//used then function to retrieve the forecast data long, lat, forecast url, apikey term, unit term, api key - variables
//line 92 makes call to fetch data, function retrieves long and lat for given city 

async function asyncApiCall(url) {
    const result = await fetch(url)
    .then (function (response) {
        return response.json();
    })
    var cityName = result.city.name 
    localStorage.setItem(localStorage.length, cityName)
    for (var i = 0; i < 6; i++) {
        var name = ""
        if (i === 0) { name = result.city.name; }
        renderForecast(
            name,
            result.list[i].dt,
            result.list[i].weather[0].icon,
            result.list[i].main.temp,
            result.list[i].main.humidity,
            result.list[i].wind.speed)
    }
}
//async function allows the program to continue running while it waits to complete tasks and does not block the main thread and allows other code to run
//loops through result.list array which contains weather data for the next 5 days
//for each loop iterated over result.list, it calls renderforecast function to pass through parameters
//this code is responsible for extracting anf storing name of city and rendering forecast using weather data from api call

function loadFullHistory() {
    for (var i = 0; i < localStorage.length; i++) {
        var divKey = document.createElement('div');
        divKey.textContent = localStorage.getItem(localStorage.key(i));
        historyContainer.appendChild(divKey);
    }
}
//when user enters city, it is saved into local storage and history is displayed below search bar

function clearPreviousForecast() {
    if (todayContainer.childNodes.length > 0) {
        todayContainer.removeChild(todayContainer.firstChild)
        clearPreviousForecast();
    }
    if (fivedayContainer.childNodes.length > 0) {
        fivedayContainer.removeChild(fivedayContainer.firstChild)
        clearPreviousForecast();
    }
}
//when user refresh page, weather rendered for that city will be gone until city is entered again

function citySearch (event) {
    event.preventDefault();
    if (searchCity.value === "") { return; }
    clearPreviousForecast();
    retrieveWeatherData(searchCity.value);
}
//when user enters new city search, previous forecast from previous search is cleared. 
//preventing the default form submission behavior

loadFullHistory();
searchForm.addEventListener("submit", citySearch);
//user can see search history after they submit search

