/**
* @fileOverview
* @author Zoltan Toth
* @version 1.0.0
*/

/**
* @description
* A vanilla JavaScript weather widget.
*/
const API_URL = 'http://dataservice.accuweather.com'
const API_KEY = 'Anwu0N8FAUGXlEUzxvWeEwx9eJ3OAAGS'

export default class Weather {
    constructor(options) {
        this.location = null

        this.getCurrentWeather = this.getCurrentWeather.bind(this)
        this.getHourlyForecast = this.getHourlyForecast.bind(this)

        this.getCurrentWeather('Toronto')
    }


    getCurrentWeather(city) {
        fetch(`${API_URL}/locations/v1/cities/search?apikey=${API_KEY}&q=${city}`)
            .then(response => { return response.json() })
            .then(data => {
                this.location = data[0].Key
                return fetch(`${API_URL}/currentconditions/v1/${this.location}?apikey=${API_KEY}`)
            })
            .then(response => { return response.json() })
            .then(data => {
                console.log(data)
                this.getHourlyForecast();
            })
            .catch(function (err) {
                console.log('Unfortunately an API error occured. Please try again.')
            });
    }

    getHourlyForecast() {
        fetch(`${API_URL}/forecasts/v1/hourly/12hour/${this.location}?apikey=${API_KEY}&metric=true`)
            .then(response => { return response.json() })
            .then(data => {
                console.log(data)
            })
    }
}