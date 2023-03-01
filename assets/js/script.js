var searchForm = document.querySelector ("#search-form")
var historyContainer = document.querySelector ("#history-container")
var weatherArea = document.querySelector ("#weather-area")
var fiveDayForecast = document.querySelector ("five-day-forecast")

function getApi(){

}

function loadHistory (){

}

function citySearch (event){
    event.preventDefault()
    console.log('hi')

}

searchForm.addEventListener("submit",citySearch);