var searchForm = document.querySelector ("#search-form")
var historyContainer = document.querySelector ("#history-container")
var weatherArea = document.querySelector ("#weather-area")
var fiveDayForecast = document.querySelector ("five-day-forecast")
var searchCity = document.querySelector ("#search-city")

var apiUrl = "https://api.openweathermap.org/data/2.5/weather?"
var cityTerm = "q="
var city = "" 
var apiKeyTerm = "&appid="
var apiKey= "c2c1687183f47dd81077647bcda4336d"
var unitTerm = "&units=imperial"



function getApi(searchUrl){
    fetch(searchUrl)
    .then (function (response) {
        return response.json();   
    })
    .then(function(butterfly) {
        console.log(butterfly);
    })
}

function loadHistory (){

}

function citySearch (event){
    city = searchCity.value
    var searchUrl = apiUrl + cityTerm + city + apiKeyTerm + apiKey + unitTerm
    getApi(searchUrl);
    event.preventDefault()
}

searchForm.addEventListener("submit",citySearch);