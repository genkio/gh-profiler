import { ChartOptions } from "chart.js";
import React from "react";
import { Radar } from "react-chartjs-2";

const options: ChartOptions = {
  plugins: {
    legend: {
      align: "end",
      display: false,
      position: "bottom",
    },
  },
};

interface IProps {
  labels: string[];
  data: number[];
}

export const RadarChart: React.FC<IProps> = ({ labels, data }) => (
  <div className="p-2 mt-3">
    <Radar
      data={{
        labels,
        datasets: [
          {
            label: "# of Projects",
            data,
            fill: true,
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgb(54, 162, 235)",
            borderWidth: 2,
            pointBackgroundColor: "rgb(54, 162, 235)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgb(54, 162, 235)",
          },
        ],
      }}
      options={options}
      type="radar"
    />
  </div>
);
