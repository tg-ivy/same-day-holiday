

/*
rapidOptions = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '515a8e69camsh8fecf8fa617ca9dp1aca4fjsn00234c16da57',
		'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
	}
}

function fetchData() {
    fetch('https://tripadvisor16.p.rapidapi.com/api/v1/flights/searchAirport?query=manchester', rapidOptions)
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        console.log(data);
    })
}

fetchData();
*/

// ----------------------- API Keys & Options------------------------------

openWeatherKey = '7867288bff076c11ab0fe1c5a52166df';
tripOptions = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '515a8e69camsh8fecf8fa617ca9dp1aca4fjsn00234c16da57',
		'X-RapidAPI-Host': 'tripadvisor16.p.rapidapi.com'
	}
}

// ----------------------- Declarations ---------------------

// Global Vars
let userHome;
let userSearch;

let opQueryURL;

let homeAirportURL;
let destAirportURL;

let homeCode;
let destCode;

let hotelGeocodeURL;

let flightInfoURL;
let hotelInfoURL;

// Form
const destinationInput = document.getElementById('destination-input')
const searchButton = document.getElementById('search-button')
const homeInput = document.getElementById('home-input')

// City Info
const cityName = document.getElementById('city-name');
const cityIcon = document.getElementById('city-icon');
const cityIconTwo = document.getElementById('city-icon-two');
const cityTemp = document.getElementById('city-temp');
const cityFeelsLike = document.getElementById('city-feelslike');
const cityWeather = document.getElementById('city-weather');
const cityWindspeed = document.getElementById('city-windspeed');

// Flights
const flightContainer = document.getElementById('flight-container');

// --------------------------------------------------------- Functions -----------------------------------------------------

// Event listener on Search button 

searchButton.addEventListener('click', (e) => {
    e.preventDefault();

    userHome = homeInput.value;
    userSearch = destinationInput.value;
    
    createOpURL(userSearch);
    fetchOpData();

    createAirportURLs(userSearch, userHome);
    fetchHomeAirport();
});

// Function that generates openweather URL with user's city search
 
function createOpURL(search) {
    opQueryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + search + '&appid=' + openWeatherKey + '&units=metric';
 };

 // Function that fetches Open Weather data and appends it to the HTML

function fetchOpData() {
    fetch(opQueryURL)
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        console.log(data);

        cityName.textContent = "City Name: " + data.name;
        cityTemp.textContent = "Temperature: " + data.main.temp + "°C"
        cityFeelsLike.textContent = "Feels Like: " + data.main.feels_like + "°C"
        cityWeather.textContent = "Weather: " + data.weather[0].description
        cityWindspeed.textContent = "Windspeed: " + data.wind.speed + "km/h"
        cityIcon.setAttribute('src', 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png');
        cityIconTwo.setAttribute('src', 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png');
    })
};


// Function that generates tripadvisor queryURL that will aloow us to fetch airport codes

function createAirportURLs(dest, home) {
    destAirportURL = "https://tripadvisor16.p.rapidapi.com/api/v1/flights/searchAirport?query=" + dest;
    homeAirportURL = "https://tripadvisor16.p.rapidapi.com/api/v1/flights/searchAirport?query=" + home;
}



// Function to get airport code for home > then get code for dest > then create flight info URL > then fetch flight info

function fetchHomeAirport() {
    fetch(homeAirportURL, tripOptions)
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        console.log(data);
        homeCode = data.data[0].airportCode;
        console.log(homeCode);
        fetchDestAirport();
    })
};


// Function to get airport code for destination > then get URLand flight info

function fetchDestAirport() {
    fetch(destAirportURL, tripOptions)
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        destCode = data.data[0].airportCode
        console.log(data);
        console.log(destCode)
        createFlightURL(homeCode, destCode);
        fetchFlightInfo();
    })
};



// Function to create a URL to get flight info

function createFlightURL(home, dest) {
    flightInfoURL = 'https://tripadvisor16.p.rapidapi.com/api/v1/flights/searchFlights?sourceAirportCode=' + home + '&destinationAirportCode=' + dest + '&date=2024-01-04&itineraryType=ONE_WAY&sortOrder=PRICE&numAdults=1&numSeniors=0&classOfService=ECONOMY&pageNumber=1&currencyCode=USD'
}


// Function to fetch flight info 

function fetchFlightInfo() {
    fetch(flightInfoURL, tripOptions)
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        console.log(data);
    })
    
};


// --------------------------------------------- Running Code -----------------------------------------------------------------------------------