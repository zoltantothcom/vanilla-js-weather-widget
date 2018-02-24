/**
* @fileOverview
* @author Zoltan Toth
* @version 1.0.0
*/

/**
* @description
* A vanilla JavaScript weather widget.
*/
const API_URL = 'https://dataservice.accuweather.com'
const API_KEY = 'Anwu0N8FAUGXlEUzxvWeEwx9eJ3OAAGS'
const API_ERR = 'Unfortunately an API error occured.'

export default class Weather {
    constructor() {
        this.element = document.querySelector('.weather')
        this.location = null
        this.locations = {}
        this.input = this.element.querySelector('.weather__input')

        this.element.querySelector('.weather__form').addEventListener('submit', e => {
            e.preventDefault();
            this.getCurrentWeather('Toronto')
            //this.getCurrentWeather(this.input.value)
        }, false)

        localStorage.setItem('WEATHER_LOCATIONS', JSON.stringify(this.locations));

        this.getCurrentWeather = this.getCurrentWeather.bind(this)
        this.getHourlyForecast = this.getHourlyForecast.bind(this)
        this.displayMessage = this.displayMessage.bind(this)
        this.showCurrentConditions = this.showCurrentConditions.bind(this)
        this.getCachedLocations = this.getCachedLocations.bind(this)
    }


    getCurrentWeather(city) {
        let locations = this.getCachedLocations()

        if (locations[city]) {
            console.log('cached woeid found')
        }

        fetch(`${API_URL}/locations/v1/cities/search?apikey=${API_KEY}&q=${city}`)
            .then(response => { return response.json() })
            .then(data => {
                this.location = data[0].Key
                this.locations[city] = this.location

                localStorage.setItem('WEATHER_LOCATIONS', JSON.stringify(this.locations));

                return fetch(`${API_URL}/currentconditions/v1/${this.location}?apikey=${API_KEY}&details=true`)
            })
            .then(response => { return response.json() })
            .then(data => {
                this.showCurrentConditions(data)
                this.element.querySelector('.weather__get-hourly').classList.remove('weather__get-hourly--hidden')
                this.element.querySelector('.weather__location').innerText = `Weather in ${city}`
                //this.getHourlyForecast();
            })
            .catch(function (err) {
                console.log(err)
                this.displayMessage(API_ERR, 'error')
            });
    }

    getCachedLocations() {
        let storedLocations = localStorage.getItem('WEATHER_LOCATIONS');
        return JSON.parse(storedLocations);
    }

    getHourlyForecast() {
        fetch(`${API_URL}/forecasts/v1/hourly/12hour/${this.location}?apikey=${API_KEY}&metric=true`)
            .then(response => { return response.json() })
            .then(data => {
                console.log(data)
            })
            .catch(function (err) {
                console.log(err)
                this.displayMessage(API_ERR, 'error')
            });
    }

    showCurrentConditions(data) {
        let temperatureElem = this.element.querySelector('.weather__temperature')
        let detailsElem = this.element.querySelector('.weather__details')
        let d = data[0]

        console.log(data)

        temperatureElem.innerHTML = `${Math.round(d.Temperature.Metric.Value)} &deg;${d.Temperature.Metric.Unit}`

    }

    displayMessage(msg, type) {
        let elem = document.createElement('div')
        elem.innerText = msg;
        elem.classList.add(`weather-${type}`)

        document.querySelector('.weather__form').prepend(elem)
    }
}