import React from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { useTranslation } from "react-i18next";
const RadarChart = (state) => {
  const { t } = useTranslation();
console.log("radar",state)
  ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
  );

  const data = {
    labels: [
      t("Sample Collected"),
      t("Sample Not Collected"),
      t("Sample Received"),
      t("Sample Rejected"),
      t("Sample Approved"),
    ],
    datasets: [
      {
        label: "Radar Chart",
        data: [
          state?.state?.SampleCollectionCount,
          state?.state?.NotCollectedCount,
          state?.state?.DepartmentReceiveCount,
          state?.state?.RejectedCount,
          state?.state?.ApprovedCount,
        ],
        backgroundColor: [
          "rgba(252, 186, 3)",
                    "rgba(99,104,116,0.8)",
                    "rgba(51, 122, 183)",
          "rgba(237, 21, 21)",
          "rgba(25, 163, 18)",
        ],
        borderWidth: 3,
        hoverOffset: 8
      },
    ],
  };

  return (
    <div style={{ width: "100%", height: "90%" }}>
      <Radar
        data={data}
        options={{
          maintainAspectRatio: false,
          responsive: true,
          scales: {
            r: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
              },
            },
          },
        }}
      />
    </div>
  );
};
export default RadarChart;
