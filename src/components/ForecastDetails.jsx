import React, { Component } from 'react';
import Content from '../components/Content';
import Chart from '../components/Chart';
import moment from 'moment';
const CHART_AXIS = { x: { type: 'timeseries', tick: { fit: true, format: '%X %a' }}};
const CHART_SIZE = { width: 800, height: 200 };

class ForecastDetails extends Component {
  constructor(props) {
    super(props);
    this.addDetails = this.addDetails.bind(this);
    this.getDetail = this.getDetail.bind(this);
    this.addChart = this.addChart.bind(this);
    this.getHottest = this.getHottest.bind(this);
    this.getColdest = this.getColdest.bind(this);
    this.getAvgHumidity = this.getAvgHumidity.bind(this);
    this.getCloudiness = this.getCloudiness.bind(this);
    this.getAvgWind = this.getAvgWind.bind(this);
    this.state = {
      details: []
    };
  };

  componentDidUpdate(prevProps) {
    if (prevProps.forecastData !== this.props.forecastData) {
      this.setState({
        details: this.addDetails(this.props.forecastData)
      });
    }
  }

  addDetails(data) {
    let arr = [];
    for (let i = 0; i < data.length; i++) {
      let day = data[i][0];
      let detail = this.getDetail(day, data[i], i);
      arr.push(detail);
    }
    return arr;
  }

  getDetail(day, data, key) {
    return(
      <div className="detail" key={key}>
        <Content className="forecastDetail__title" content={day} />
        <Chart data={this.addChart(data)} axis={CHART_AXIS} size={CHART_SIZE} />
        <Content className="forecastDetail__hotTime" content={this.getHottest(data)} />
        <Content className="forecastDetail__coldTime" content={this.getColdest(data)} />
        <Content className="forecastDetail__humidity" content={this.getAvgHumidity(data)} />
        <Content className="forecastDetail__clouds" content={this.getCloudiness(data)} />
        <Content className="forecastDetail__wind" content={this.getAvgWind(data)} />
      </div>
    );
  }

  addChart(arr) {
    let data = {
      x: 'x',
      columns: [
        ['x'],
        ['Temperature'],
        ['Feels Like']
      ],
      type: 'spline',
      colors: {
        'Temperature': '#FF7524',
        'Feels Like': '#008765'
      },
    };
    // Start at 1 since first entry is the day of the week, not data.
    for (let i = 1; i < arr.length; i++) {
      let localTime = new Date(arr[i].dt_txt + ' UTC');
      data.columns[0].push(localTime);
      data.columns[1].push(Math.round(arr[i].main.temp));
      data.columns[2].push(Math.round(arr[i].main.feels_like));
    }
    return data;
  }

  getHottest(data) {
    let hottest = null;
    let hottestFeel = null;
    let time = null;
    // Start at 1 since first entry is the day of the week, not data.
    for (let i = 1; i < data.length; i++) {
      if (!hottest) {
        hottest = (data[i].main.temp > data[i].main.feels_like) ? data[i].main.temp : data[i].main.feels_like;
        time = data[i].dt_txt + ' UTC';
      }
      else {
        let newTemp = (data[i].main.temp > data[i].main.feels_like) ? data[i].main.temp : data[i].main.feels_like;
        if (newTemp > hottest) {
          hottest = newTemp;
          time = data[i].dt_txt + ' UTC';
        }
      }
    }
    return ("Hottest Time of Day: " + moment(time).format('LT'));
  }

  getColdest(data) {
    let coldest = null;
    let time = null;
    // Start at 1 since first entry is the day of the week, not data.
    for (let i = 1; i < data.length; i++) {
      if (!coldest) {
        coldest = (data[i].main.temp < data[i].main.feels_like) ? data[i].main.temp : data[i].main.feels_like;
        time = data[i].dt_txt + ' UTC';
      }
      else {
        let newTemp = (data[i].main.temp < data[i].main.feels_like) ? data[i].main.temp : data[i].main.feels_like;
        if (newTemp < coldest) {
          coldest = newTemp;
          time = data[i].dt_txt + ' UTC';
        }
      }
    }
    return ("Coldest Time of Day: " + moment(time).format('LT'));
  }

  getAvgHumidity(data) {
    let total = 0;
    // Start at 1 since first entry is the day of the week, not data.
    for (let i = 1; i < data.length; i++) {
      total += data[i].main.humidity;
    }
    return ("Average Humidity: " + Math.round(total / data.length-1) + "%");
  }

  getCloudiness(data) {
    let total = 0;
    let count = 0;
    // Start at 1 since first entry is the day of the week, not data.
    for (let i = 1; i < data.length; i++) {
      if (data[i].clouds.all) {
        total += data[i].clouds.all;
        count++;
      }
    }
    return ("Average Cloud Cover: " + Math.round(total/count) + "%");
  }

  getAvgWind(data) {
    let total = 0;
    // Start at 1 since first entry is the day of the week, not data.
    for (let i = 1; i < data.length; i++) {
      total += data[i].wind.speed;
    }
    return ("Average Wind Speed: " + Math.round(total / data.length-1) + "mph");
  }

  render() {
    return(
      <div className="forecastDetails">
        {this.state.details}
      </div>
    );
  }
}

export default ForecastDetails;