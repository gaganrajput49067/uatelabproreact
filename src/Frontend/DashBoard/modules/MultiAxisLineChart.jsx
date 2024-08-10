import React from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

function MultiAxisLineChart({ data1, data2 }) {
  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Dataset 1",
        data: data1 || [65, 59, 80, 81, 56, 55, 40],
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        yAxisID: "y-axis-1",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Dataset 2",
        data: data2 || [28, 48, 40, 19, 86, 27, 90],
        borderColor: "rgba(153,102,255,1)",
        backgroundColor: "rgba(153,102,255,0.2)",
        yAxisID: "y-axis-2",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      "y-axis-1": {
        type: "linear",
        position: "left",
        ticks: {
          beginAtZero: true,
        },
      },
      "y-axis-2": {
        type: "linear",
        position: "right",
        ticks: {
          beginAtZero: true,
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Line data={data} options={options} />
    </div>
  );
}

export default MultiAxisLineChart;
