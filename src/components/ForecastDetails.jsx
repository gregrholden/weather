import React, { Component } from 'react';
import BillboardChart from 'react-billboardjs';
import 'react-billboardjs/lib/billboard.css';

/**
* 
*/


class ForecastDetails extends Component {
  constructor(props) {
    super(props);
    this.addDay = this.addDay.bind(this);
    this.state = {
      values: []
    }
  };

  addDay() {

  }

  render() {
    return(
      <div>

      </div>
    );
  }
}

export default ForecastDetails;