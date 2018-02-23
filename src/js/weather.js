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
        this.input = this.element.querySelector('.weather__input')

        this.element.querySelector('.weather__form').addEventListener('submit', e => {
            e.preventDefault();
            this.getCurrentWeather('Toronto')
            //this.getCurrentWeather(this.input.value)
        }, false)

        this.getCurrentWeather = this.getCurrentWeather.bind(this)
        this.getHourlyForecast = this.getHourlyForecast.bind(this)
        this.displayMessage = this.displayMessage.bind(this)
    }


    getCurrentWeather(city) {
        fetch(`${API_URL}/locations/v1/cities/search?apikey=${API_KEY}&q=${city}`)
            .then(response => { return response.json() })
            .then(data => {
                this.location = data[0].Key
                return fetch(`${API_URL}/currentconditions/v1/${this.location}?apikey=${API_KEY}&details=true`)
            })
            .then(response => { return response.json() })
            .then(data => {
                console.log(data)
                this.getHourlyForecast();
            })
            .catch(function (err) {
                console.log(err)
                this.displayMessage(API_ERR, 'error')
            });
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

    displayMessage(msg, type) {
        let elem = document.createElement('div')
        elem.innerText = msg;
        elem.classList.add(`weather-${type}`)

        document.querySelector('.weather__form').prepend(elem)
    }
}