import React, { Component } from 'react';
import BillboardChart from 'react-billboardjs';
import 'react-billboardjs/lib/billboard.css';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const CHART_LEGEND = { show: true };
const CHART_SIZE = { width: 800, height: 300 };
const CHART_AXIS = { x: { type: 'category', tick: { fit: true }}};
const BAR_OPTIONS = { padding: 3 };
const CHART_GRID = { y: { lines: [
      {value: -20}, {value: 20}, {value: 40},
      {value: 60}, {value: 80}, {value: 100}
  ]}
};

class CurrentForecast extends Component {
  constructor(props) {
    super(props);
    this.getChartData = this.getChartData.bind(this);
    this.state = {
      title: '',
      chartData: {
        x: 'Day',
        type: 'bar',
        columns: [
          ['High'],
          ['Low'],
          ['Day']
        ],
        empty: {
          label: {
            text: "No forecast data."
          }
        }
      }
    }
  }

  componentDidMount() {
    if (this.props.forecastData) {
      this.setState({
        chartData: this.getChartData(this.props.forecastData)
      });
    }
  }

  componentDidUpdate(prevProps) {
    // If the city value changed:
    if (prevProps.city && prevProps.city !== this.props.city) {
      this.setState({
        title: '5 Day Forecast for ' + this.props.city
      });
    }
    // If the city value is not yet set:
    else if (!prevProps.city && this.props.city) {
      this.setState({
        title: '5 Day Forecast for ' + this.props.city
      });
    }
    // If the forecast data changed:
    if (prevProps.forecastData && prevProps.forecastData !== this.props.forecastData) {
      this.setState({
        chartData: this.getChartData(this.props.forecastData)
      });
    }
    // If the forecast data is not yet set:
    else if (!prevProps.forecastData && this.props.forecastData) {
      this.setState({
        chartData: this.getChartData(this.props.forecastData)
      });
    }
  }

  getChartData(forecastData) {
    var chartData = {
      x: 'Day',
      type: 'bar',
      columns: [
        ['High'],
        ['Low'],
        ['Day']
      ],
      colors: {
        High: '#FF7524',
        Low: '#008765'
      },
      empty: {
        label: {
          text: "No forecast data."
        }
      }
    };
    if (forecastData) {
      let high = 0;
      let low = 0;
      let count = 1;
      // Get today's day of the week:
      const TODAY = DAYS_OF_WEEK[new Date().getDay()];
      // Create 'data' values for chart.
      for (let i = 0; i < forecastData.length; i++) {
        let currentTemp = Math.round(forecastData[i].main.temp);
        let localTime = new Date(forecastData[i].dt_txt + ' UTC');
        let thisDay = DAYS_OF_WEEK[localTime.getDay()];
        if (thisDay !== TODAY) {
          if (i === 0) {
            // Set the initial values.
            high = currentTemp;
            low = currentTemp;
            chartData.columns[2][count] = thisDay;
          }
          if (i > 0 && i < forecastData.length - 1) {
            let prevTime = new Date(forecastData[i-1].dt_txt + ' UTC');
            let prevDay = DAYS_OF_WEEK[prevTime.getDay()];
            // First day of forecast if not set:
            if (thisDay !== prevDay && prevDay === TODAY) {
              // Set initial values:
              high = currentTemp;
              low = currentTemp;
              chartData.columns[2][count] = thisDay;
            }
            // New non-first day in forecast:
            else if (thisDay !== prevDay && prevDay !== TODAY) {
              // Push previous day's values to array:
              chartData.columns[0][count] = high;
              chartData.columns[1][count] = low;
              // Iterate counter and start a new day:
              count++;
              high = currentTemp;
              low = currentTemp;
              chartData.columns[2][count] = thisDay;
            }
            // If not a new day, check for high/low temp changes:
            else {
              high = (currentTemp > high) ? currentTemp : high;
              low = (currentTemp < low) ? currentTemp : low;
            }
          }
          // For last entry in loop:
          else if (i === forecastData.length - 1) {
            let prevTime = new Date(forecastData[i-1].dt_txt + ' UTC');
            let prevDay = DAYS_OF_WEEK[prevTime.getDay()];
            // If a new day begins on the last entry:
            if (thisDay !== prevDay) {
              // Set yesterday's high and low:
              chartData.columns[0][count] = high;
              chartData.columns[1][count] = low;
              // Create the final day's entry:
              count++;
              high = currentTemp;
              low = currentTemp;
              chartData.columns[0][count] = high;
              chartData.columns[1][count] = low;
              chartData.columns[2][count] = thisDay;
            }
          }
        }
      }
      // Add remaining values to last entry in forecast (if any):
      chartData.columns[0][count] = high;
      chartData.columns[1][count] = low;
    }
    return chartData;
  }

  render() {
    return(
      <div>
        <h2 className='forecastTitle'>{this.state.title}</h2>
        <BillboardChart
          unloadBeforeLoad
          data={this.state.chartData}
          axis={CHART_AXIS}
          grid={CHART_GRID}
          bar={BAR_OPTIONS}
          legend={CHART_LEGEND}
          size={CHART_SIZE}
        />
      </div>
    );
  }
}

export default CurrentForecast;