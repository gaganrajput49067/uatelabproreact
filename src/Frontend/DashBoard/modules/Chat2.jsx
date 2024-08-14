import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

function Chat2({ state }) {
  const { t } = useTranslation();
  console.log("props", state);
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
        data: [
          state?.SampleCollectionCount || 23,
          state?.NotCollectedCount || 43,
          state?.DepartmentReceiveCount || 43,
          state?.RejectedCount || 43,
          state?.ApprovedCount || 43,
        ],
        backgroundColor: [
          "rgba(252, 186, 3,0.8)",
          "rgba(99,104,116,0.8)",
          "rgba(51, 122, 183)",
          "rgba(237, 21, 21,0.8)",
          "rgba(25, 163, 18,0.8)",
        ],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "left", // Position the legend to the left
        align: "end", // Align the legend items at the start (top-left)
        labels: {
          boxWidth: 20, // Size of the legend box
          padding: 20, // Spacing between the legend items
          font: {
            size: 16, // Increase font size of the labels
          },
        },
      },
    },
  };

  return (
    <div
      style={{
        width: "100%",
        height: "85%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: "10px",
      }}
    >
      <Doughnut data={data} options={options} />
    </div>
  );
}

export default Chat2;