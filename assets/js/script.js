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
    for (var i = 0; i < localStorage.length; i++) {
        var keyDivs = document.createElement('div');
        keyDivs.textContent = localStorage.getItem(localStorage.key(i));
        historyContainer.appendChild(keyDivs);

    }
}

function citySearch (event){
    city = searchCity.value
    var searchUrl = apiUrl + cityTerm + city + apiKeyTerm + apiKey + unitTerm
    getApi(searchUrl);
    localStorage.setItem(city, city)
    event.preventDefault()
    loadHistory();

}
loadHistory();
searchForm.addEventListener("submit",citySearch);