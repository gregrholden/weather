import React, { Component } from 'react';
import LocationForm from '../forms/LocationForm';

// This component gathers lat/long data via the user's browser.
// If the browser can't retrieve the geolocation, an error message is sent.
class Geolocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: null,
      lon: null,
      failMsg: null
    }
    this.geoSuccess = this.geoSuccess.bind(this);
    this.geoFailure = this.geoFailure.bind(this);
  }

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.geoSuccess,
        this.geoFailure, {
          enableHighAccuracy: true,
          timeout: 2000,
          maximumAge: 0
        }
      );
    }
  };

  geoSuccess(position) {
    this.setState({
      lat: position.coords.latitude,
      lon: position.coords.longitude
    });
  };

  geoFailure(error) {
    this.setState({
      failMsg: 'ERROR: Geolocation service: ' + error.message
    });
  };

  render () {
    return(
      // Pass browser's geolocation data to the LocationForm component.
      <div>
        <LocationForm lat={this.state.lat} lon={this.state.lon} failMsg={this.state.failMsg} />
      </div>
    );
  }
}

export default Geolocation;