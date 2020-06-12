import React, { Component } from 'react';
// Required for async functions.
import regeneratorRuntime from "regenerator-runtime";
import CurrentWeather from './CurrentWeather';
import CurrentForecast from './CurrentForecast';

// This component gathers JSON data from the OpenWeather API.
// If browser geolocation data is available, it uses lat/long.
// Otherwise, it waits for user input in another component.
class GetWeatherByLatLon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      temp: '',
      hum: '',
      type: '',
      desc: '',
      icon: 'http://openweathermap.org/img/wn/10d@2x.png'
    };
  };

  // Use async to await results.
  async componentDidMount() {
    if (this.props.lat && this.props.lon) {
      let request = await fetch(`api.openweathermap.org/data/2.5/weather?lat=${this.props.lat}&lon=${this.props.lon}&units=imperial&appid=dd2b7c8e91051456d52d9bf3c3ed46cd`);
      console.log(request);
      let weather = await request.json();
      this.setState({
        temp: weather.main.temp,
        hum: weather.main.humidity,
        type: weather.weather[0].main,
        desc: weather.weather[0].description,
        icon: 'http://openweathermap.org/img/wn/' + weather.weather[0].icon + '@2x.png'
      });
    }
  };

  render() {
    return(
      <div>
        <CurrentWeather temp={this.state.temp} hum={this.state.hum} type={this.state.type} desc={this.state.desc} icon={this.state.icon} />
        <CurrentForecast temp={this.state.temp} hum={this.state.hum} type={this.state.type} desc={this.state.desc} icon={this.state.icon} />
      </div>
    );
  };
}

export default GetWeatherByLatLon;