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
let searchArr = [];

let opQueryURL;

let homeAirportURL;
let destAirportURL;

let homeCode;
let destCode;

let hotelGeocodeURL;

let flightInfoURL;
let hotelInfoURL;


let stringDate = new Date()
let currentDate = stringDate.toISOString().split('T')[0]
console.log(currentDate)

// Form
const destinationInput = document.getElementById('destination-input')
const searchButton = document.getElementById('search-button')
const homeInput = document.getElementById('home-input')


// City Info
citySection = document.getElementById("city-section")
const cityContainer = document.getElementById("city-container")
const cityName = document.getElementById('city-name');
const cityIcon = document.getElementById('city-icon');
const cityIconTwo = document.getElementById('city-icon-two');
const cityTemp = document.getElementById('city-temp');
const cityFeelsLike = document.getElementById('city-feelslike');
const cityWeather = document.getElementById('city-weather');
const cityWindspeed = document.getElementById('city-windspeed');

// Flights
const flightContainer = document.getElementById('flight-container');

// Spinner
const spinnerContainer = document.getElementById('spinner-container');
const spinner = document.createElement('div');

// History 
const historyContainer = document.getElementById('history-container');
const historyNames = document.getElementById('history-names');

// --------------------------------------------------------- Functions -----------------------------------------------------

// Event listener on Search button 

searchButton.addEventListener('click', (e) => {
    e.preventDefault();

    if (homeInput.value == "" || destinationInput.value == "") {
        let myModal = new bootstrap.Modal(document.getElementById('my-modal'), {});
        myModal.show();
    } else {
    userHome = homeInput.value;
    userSearch = destinationInput.value;
    
    addToHistory(userHome, userSearch);
    appendHistory();

    spinnerContainer.style.display = "flex";
    spinner.classList.add('spinner');
    spinnerContainer.appendChild(spinner);

    createOpURL(userSearch);
    fetchOpData();

    createAirportURLs(userSearch, userHome);
    fetchHomeAirport();
    }
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

        citySection.style.display = "block";
        cityContainer.classList.add("city-container");
        cityName.textContent = data.name + " - What's the weather like?";
        cityTemp.textContent = "Temperature: " + data.main.temp + "°C"
        cityFeelsLike.textContent = "Feels Like: " + data.main.feels_like + "°C"
        cityWeather.textContent = "Weather: " + data.weather[0].description
        cityWindspeed.textContent = "Windspeed: " + data.wind.speed + "km/h"
        cityIcon.setAttribute('src', 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png');
        cityIconTwo.setAttribute('src', 'https://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png');

        historyContainer.style.display = "flex";
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
    flightInfoURL = 'https://tripadvisor16.p.rapidapi.com/api/v1/flights/searchFlights?sourceAirportCode=' + home + '&destinationAirportCode=' + dest + '&date=' + "2024-01-10" + '&itineraryType=ONE_WAY&sortOrder=PRICE&numAdults=1&numSeniors=0&classOfService=ECONOMY&pageNumber=1&currencyCode=USD'
}


// Function to fetch flight info 

function fetchFlightInfo() {
    fetch(flightInfoURL, tripOptions)
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        console.log(data);
        for (i = 0; i < 6; i++) {
            flightContainer.classList.add('flight-container');

            let flightBox = document.createElement('div');
            flightBox.classList.add("flight-box");

            let planeIcon = document.createElement('img');
            planeIcon.classList.add("plane-icon");
            planeIcon.setAttribute('src', './img/plane-icon.png')
            flightBox.appendChild(planeIcon);

            let flightInfo = document.createElement('div');
            flightBox.appendChild(flightInfo);

            let flightSeller = document.createElement('div')
            flightSeller.textContent = "Seller: " + data.data.flights[i].purchaseLinks[0].commerceName;
            flightInfo.appendChild(flightSeller);

            let flightProvider = document.createElement('div');
            flightProvider.textContent = "Provider: " + data.data.flights[i].purchaseLinks[0].providerId;
            flightInfo.appendChild(flightProvider);

            let flightPrice = document.createElement('div');
            flightPrice.textContent = "Price: $" + data.data.flights[i].purchaseLinks[0].totalPrice;
            flightInfo.appendChild(flightPrice);

            let flightLink =  document.createElement('a');
            flightLink.setAttribute('href', data.data.flights[i].purchaseLinks[0].url);
            flightInfo.appendChild(flightLink);

            let flightButton = document.createElement('button');
            flightButton.classList.add("purchase-button")
            flightButton.textContent = "Purchase"
            flightLink.appendChild(flightButton);

            let saveButton = document.createElement('button');
            saveButton.textContent = "Save"
            saveButton.classList.add = "save-button"
            flightInfo.appendChild(saveButton);

            flightContainer.appendChild(flightBox);
            

        }
        spinnerContainer.removeChild(spinnerContainer.firstElementChild);
        spinnerContainer.style.display = "none"
    })
};

// Function that adds search to search history
function addToHistory(home, dest) {
    let mySave = home + " to " + dest;
    let myString = mySave.toString();
    console.log(myString)
    searchArr.push(myString);
    localStorage.setItem("History", JSON.stringify(searchArr));
}

// Function that appends history to history section
function appendHistory() {
    let historyArr = JSON.parse(localStorage.getItem("History"));
    for (i = 0; i < historyArr.length; i++) {
        // Appends city to search history
        let cityEl = document.createElement('div');
        cityEl.textContent = historyArr[i];
        historyNames.appendChild(cityEl);

        // Adds event listener to each city element
        cityEl.addEventListener('click', (e) => {
            e.preventDefault();
        })
        
    }
}


// --------------------------------------------- Running Code -----------------------------------------------------------------------------------