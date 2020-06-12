import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import './App.css';
import Geolocation from './components/Geolocation';

class App extends Component {
  render() {
    return(
      <div className="App">
        <h1 className="title">Local Weather</h1>
        <div className="container">
          <Geolocation />
        </div>
      </div>
    );
  }
}

export default hot(module)(App);