import React, { Component } from 'react';

class CurrentWeather extends Component {
  render() {
    return(
      <div className="currentWeather">
        <h2 className="location">{this.props.city}</h2>
        <p className="temp">{this.props.temp}</p>
        <p className="hum">{this.props.hum}</p>
        <p className="type"><img className="icon" src={this.props.iconSrc} />{this.props.type}</p>
        <p className="desc">{this.props.desc}</p>
      </div>
    );
  }
}

export default CurrentWeather;