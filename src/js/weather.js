/**
* @fileOverview
* @author Zoltan Toth
* @version 1.0.0
*/

/**
* @description
* A vanilla JavaScript weather widget.
*/
const API_URL = 'http://dataservice.accuweather.com';
const API_KEY = 'Anwu0N8FAUGXlEUzxvWeEwx9eJ3OAAGS';

export default class Weather {
    constructor(options) {
        this.getWeatherInfo('Toronto')
    }


    getWeatherInfo(city) {
        fetch(`${API_URL}/locations/v1/cities/search?apikey=${API_KEY}&q=${city}`)
            .then(response => { return response.json(); })
            .then(data => {
                return fetch(`${API_URL}/forecasts/v1/hourly/12hour/${data[0].Key}?apikey=${API_KEY}&metric=true`)
            })
            .then(response => { return response.json(); })
            .then(data => {
                console.log(data)
            })
            .catch(function (err) {
                console.log('Unfortunately an API error occured. Please try again.')
            });
    }
}