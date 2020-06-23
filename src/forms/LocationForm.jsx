import React, { Component } from 'react';
// Required for async functions.
import regeneratorRuntime from "regenerator-runtime";
import CurrentWeather from '../components/CurrentWeather';
import CurrentForecast from '../components/CurrentForecast';

class LocationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: null,
      lon: null,
      failMsg: null,
      value: '',
      temp: null,
      hum: null,
      type: null,
      iconSrc: null,
      city: null,
      forecastData: null
    }
    this.getWeatherData = this.getWeatherData.bind(this);
    this.getForecastData = this.getForecastData.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    if (this.props.lat && this.props.lon) {
      // Asynchronous fetch.
      let request = await fetch(`api.openweathermap.org/data/2.5/weather?lat=${this.props.lat}&lon=${this.props.lon}&units=imperial&appid=dd2b7c8e91051456d52d9bf3c3ed46cd`);
      let result = await request.json();
      this.setState({
        temp: result.main.temp,
        hum: result.main.humidity,
        type: result.weather[0].main,
        desc: result.weather[0].description,
        iconSrc: 'http://openweathermap.org/img/wn/' + result.weather[0].icon + '@2x.png',
        city: result.name
      });

      // Synchronous fetch.
      /*fetch('http://api.openweathermap.org/data/2.5/weather?lat=' + this.props.lat + '&lon=' + this.props.lon + '&units=imperial&appid=dd2b7c8e91051456d52d9bf3c3ed46cd')
      .then(res => res.json())
      .then(result => {
        this.setState({
          temp: result.main.temp,
          hum: result.main.humidity,
          type: result.weather[0].main,
          desc: result.weather[0].description,
          iconSrc: 'http://openweathermap.org/img/wn/' + result.weather[0].icon + '@2x.png',
          city: result.name
        });
      });*/
    }
  };

  getWeatherData(zip) {
    // Gather JSON data on current, local weather.
    fetch("http://api.openweathermap.org/data/2.5/weather?zip=" + zip + "&units=imperial&appid=dd2b7c8e91051456d52d9bf3c3ed46cd")
    .then(res => res.json())
    .then(result => {
      this.setState({
        temp: result.main.temp,
        hum: result.main.humidity,
        type: result.weather[0].main,
        desc: result.weather[0].description,
        iconSrc: 'http://openweathermap.org/img/wn/' + result.weather[0].icon + '@2x.png',
        city: result.name
      });
    });
    // Then call getForecastData().
    this.getForecastData(zip);
  }

  getForecastData(zip) {
    fetch("http://api.openweathermap.org/data/2.5/forecast?zip=" + zip + "&units=imperial&appid=dd2b7c8e91051456d52d9bf3c3ed46cd")
    .then(res => res.json())
    .then(result => {
      this.setState({
        forecastData: result.list
      });
    });
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.getWeatherData(this.state.value);
  }

  render() {
    return(
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Zip Code:
            <input type='text' value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type='submit' value="Submit" />
        </form>
        <CurrentWeather city={this.state.city} temp={this.state.temp} hum={this.state.hum} type={this.state.type} iconSrc={this.state.iconSrc} />
        <CurrentForecast city={this.state.city} forecastData={this.state.forecastData} />
      </div>
    );
  }
}

export default LocationForm;