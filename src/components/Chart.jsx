import React from 'react';
import BillboardChart from "react-billboardjs";
import "react-billboardjs/lib/billboard.css";

const Chart = (props) => {
  return(
    <BillboardChart
      unloadBeforeLoad
      data={props.data}
      axis={props.axis}
      size={props.size}
      grid={props.grid}
      bar={props.bar_options}
      legend={props.legend}
    />
  );
}

Chart.defaultProps = {
  data: null,
  axis: null,
  size: null,
  grid: null,
  bar_options: { padding: 3 },
  legend: { show: true }
};

export default Chart;