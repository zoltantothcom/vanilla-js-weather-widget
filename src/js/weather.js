/**
* @fileOverview
* @author Zoltan Toth
* @version 1.0.0
*/

/**
* @description
* A vanilla JavaScript weather widget.
*/
const API_URL = 'https://dataservice.accuweather.com';
const API_KEY = 'Anwu0N8FAUGXlEUzxvWeEwx9eJ3OAAGS';
const API_ERR = 'Unfortunately an API error occured.';
const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default class Weather {
    constructor() {
        this.element = document.querySelector('.weather');
        this.location = null;
        this.locations = {};
        this.input = this.element.querySelector('.weather__input');

        this.element.querySelector('.weather__form').addEventListener('submit', e => {
            e.preventDefault();

            this.city = 'Toronto';
            this.getCurrentWeather();
            //this.getCurrentWeather(this.input.value)
        }, false);

        localStorage.setItem('WEATHER_LOCATIONS', JSON.stringify(this.locations));

        this.getCurrentWeather = this.getCurrentWeather.bind(this);
        this.getHourlyForecast = this.getHourlyForecast.bind(this);
        this.displayMessage = this.displayMessage.bind(this);
        this.showCurrentConditions = this.showCurrentConditions.bind(this);
        this.getCachedLocations = this.getCachedLocations.bind(this);
        this.getCityId = this.getCityId.bind(this);
        this.getCityWeather = this.getCityWeather.bind(this);
    }

    getCurrentWeather() {
        let locations = this.getCachedLocations();

        if (!locations[this.city.toLowerCase()]) {
            this.getCityId()
                .then(json => {
                    this.getCityWeather(json[0].Key);
                });
        } else {
            this.getCityWeather(locations[this.city.toLowerCase()]);
        }
    }

    getCityId() {
        return fetch(`${API_URL}/locations/v1/cities/search?apikey=${API_KEY}&q=${this.city}`)
            .then(response => { return response.json(); })
            .catch(function (err) {
                console.log(`Error: ${err}`);
                this.displayMessage(API_ERR, 'error');
            });
    }

    getCityWeather(id) {
        this.location = id;
        this.locations[this.city.toLowerCase()] = this.location;

        localStorage.setItem('WEATHER_LOCATIONS', JSON.stringify(this.locations));

        return fetch(`${API_URL}/currentconditions/v1/${this.location}?apikey=${API_KEY}&details=true`)
            .then(response => { return response.json(); })
            .then(data => {
                this.showCurrentConditions(data);
                this.element.querySelector('.weather__get-hourly').classList.remove('weather__get-hourly--hidden');
                this.element.querySelector('.weather__location').innerText = `Weather in ${this.city}`;
                this.element.querySelector('.weather__get-hourly').addEventListener('click', e => {
                    this.getHourlyForecast();
                }, false);
            })
            .catch(function (err) {
                console.log(`Error: ${err}`);
                this.displayMessage(API_ERR, 'error');
            });
    }

    getCachedLocations() {
        let storedLocations = localStorage.getItem('WEATHER_LOCATIONS');
        return JSON.parse(storedLocations);
    }

    getHourlyForecast() {
        fetch(`${API_URL}/forecasts/v1/hourly/12hour/${this.location}?apikey=${API_KEY}&metric=true`)
            .then(response => { return response.json(); })
            .then(data => {
                console.log(data)
                this.displayHourlyForecast(data);
            })
            .catch(function (err) {
                console.log(err);
                this.displayMessage(API_ERR, 'error');
            });
    }

    displayHourlyForecast(data) {
        if (!data || data.length === 0) {
            this.displayMessage('No hourly data available.', 'info');
        }

        let ul = document.createElement('ul');
        for (let i = 0; i < data.length; i++) {
            let li = document.createElement('li');

            let icon = data[i].WeatherIcon < 10 ? 
                `0${data[i].WeatherIcon}` : data[i].WeatherIcon;

            li.innerHTML = `${this.formatDateTimeHourly(data[i].DateTime)}`;
            li.innerHTML += `<img src="img/${icon}-s.png" alt="${data[i].IconPhrase}" />`;
            li.innerHTML += `${data[i].IconPhrase}`;
            li.innerHTML += `<span>${Math.round(data[i].Temperature.Value)} &deg;${data[i].Temperature.Unit}</span>`;

            ul.appendChild(li);
        }

        this.element.querySelector('.weather__hourly').appendChild(ul);
    }

    formatDateTimeHourly(d) {
        const date = new Date(d);
        let hour = date.getHours();
        let am_pm = 'AM';

        if (hour >= 12) {
            am_pm = 'PM';
        }

        if (hour > 12) {
            hour -= 12;
        }

        if (hour === 0) {
            hour = 12;
        }
    
        return (`<span>${WEEKDAY[date.getDay()]}</span><span>${hour}${am_pm}</span>`);
    }

    showCurrentConditions(data) {
        let temperatureElem = this.element.querySelector('.weather__temperature');
        let detailsElem = this.element.querySelector('.weather__details');
        let d = data[0];

        console.log(data);

        temperatureElem.innerHTML = 
            `${Math.round(d.Temperature.Metric.Value)} &deg;${d.Temperature.Metric.Unit}`;
    }

    displayMessage(msg, type) {
        let elem = document.createElement('div');
        elem.innerText = msg;
        elem.classList.add(`weather-${type}`);

        document.querySelector('.weather__form').prepend(elem);
    }
}