import React, { Component } from 'react';
import Content from '../components/Content';

class CurrentWeather extends Component {
  render() {
    return(
      <div className="currentWeather">
        <Content className="location" content={this.props.city} />
        <Content className="temp" content={this.props.temp} />
        <Content className="hum" content={this.props.hum} />
        <Content className="type" content={this.props.type} />
        <img className="icon" src={this.props.iconSrc} />
      </div>
    );
  }
}

export default CurrentWeather;