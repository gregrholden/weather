import React, { Component } from 'react';
import Content from '../components/Content';
import Chart from '../components/Chart';
import ForecastDetails from '../components/ForecastDetails';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const CHART_SIZE = { width: 800, height: 300 };
const CHART_AXIS = { x: { type: 'category', tick: { fit: true }}};
const BAR_PADDING = { padding: 3 };
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
      chartData: [
        {
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
        },
        // Placeholder array for forecastDetails data.
        []
      ]
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
    var chartData = [
      {
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
      },
      // Placeholder array for ForecastDetails data.
      []
    ];
    if (forecastData) {
      let high = 0;
      let low = 0;
      let count = 1;
      // Create 'data' values for chart.
      for (let i = 0; i < forecastData.length; i++) {
        let currentTemp = Math.round(forecastData[i].main.temp);
        let localTime = new Date(forecastData[i].dt_txt + ' UTC');
        let thisDay = DAYS_OF_WEEK[localTime.getDay()];
        if (i === 0) {
          // Set the initial values.
          high = currentTemp;
          low = currentTemp;
          chartData[0].columns[2][count] = thisDay;
          chartData[1][count-1] = [thisDay, forecastData[i]];
        }
        if (i > 0 && i < forecastData.length - 1) {
          let prevTime = new Date(forecastData[i-1].dt_txt + ' UTC');
          let prevDay = DAYS_OF_WEEK[prevTime.getDay()];
          // When a new day begins:
          if (thisDay !== prevDay) {
            // Push previous day's values to array:
            chartData[0].columns[0][count] = high;
            chartData[0].columns[1][count] = low;
            // Iterate counter and set values for a new day:
            count++;
            high = currentTemp;
            low = currentTemp;
            chartData[0].columns[2][count] = thisDay;
            chartData[1][count-1] = [thisDay, forecastData[i]];
          }
          // If not a new day, check for high/low temp changes:
          else {
            high = (currentTemp > high) ? currentTemp : high;
            low = (currentTemp < low) ? currentTemp : low;
            // And push value to ForecastDetails array:
            chartData[1][count-1].push(forecastData[i]);
          }
        }
        // For last entry in loop:
        else if (i === forecastData.length - 1) {
          let prevTime = new Date(forecastData[i-1].dt_txt + ' UTC');
          let prevDay = DAYS_OF_WEEK[prevTime.getDay()];
          // If a new day begins on the last entry:
          if (thisDay !== prevDay) {
            // Set yesterday's high and low:
            chartData[0].columns[0][count] = high;
            chartData[0].columns[1][count] = low;
            // Create the final day's entry:
            count++;
            high = currentTemp;
            low = currentTemp;
            chartData[0].columns[0][count] = high;
            chartData[0].columns[1][count] = low;
            chartData[0].columns[2][count] = thisDay;
            chartData[1][count-1] = [thisDay, forecastData[i]];
          }
        }
      }
      // Add remaining values to last entry in forecast (if any):
      chartData[0].columns[0][count] = high;
      chartData[0].columns[1][count] = low;
    }
    return chartData;
  }

  render() {
    return(
      <div>
        <Content classname="forecastTitle" content={this.state.title} />
        <Chart
          data={this.state.chartData[0]}
          axis={CHART_AXIS}
          grid={CHART_GRID}
          size={CHART_SIZE}
          bar={BAR_PADDING}
        />
        <ForecastDetails forecastData={this.state.chartData[1]} />
      </div>
    );
  }
}

export default CurrentForecast;