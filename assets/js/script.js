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

function createDateEl (date) {
    var dateEl = document.createElement('h3');
    dateEl.textContent = dayjs.unix(date).format('MM/DD/YYYY');
    dateEl.className = "card-data"
    return dateEl;
}
function createIconEl(icon) {
    var iconEl = document.createElement('img');
    iconEl.src = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
    iconEl.className = "card-data";
    return iconEl;
}

function createTempEl(temp) {
    var tempEl = document.createElement('div')
    tempEl.textContent = temp + "°F";
    tempEl.className = "card-data";
    return tempEl;
}

function createWindEl(wind) {
    var windEl = document.createElement('div')
    windEl.textContent = wind + " MPH";
    windEl.className = "card-data";
    return windEl;
}

function createHumidEl(humid) {
    var humidEl = document.createElement('div')
    humidEl.textContent = humid + " %";
    humidEl.className = "card-data";
    return humidEl;
}

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

function loadFullHistory() {
    for (var i = 0; i < localStorage.length; i++) {
        var divKey = document.createElement('div');
        divKey.textContent = localStorage.getItem(localStorage.key(i));
        historyContainer.appendChild(divKey);
    }
}

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

function citySearch (event) {
    event.preventDefault();
    if (searchCity.value === "") { return; }
    clearPreviousForecast();
    retrieveWeatherData(searchCity.value);
}

loadFullHistory();
searchForm.addEventListener("submit", citySearch);


