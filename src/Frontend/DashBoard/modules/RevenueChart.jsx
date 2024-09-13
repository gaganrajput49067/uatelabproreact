import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

function RevenueChart({ state }) {
  console.log(state);
  const { t } = useTranslation();
  const data = {
    labels: [
      `${t("Cash")} : ${state?.Cash}`,
      `${t("Cheque")} : ${state?.Cheque}`,
      `${t("Online")} : ${state?.Online}`,
    ],
    datasets: [
      {
        data: [state?.Cash, state?.Cheque, state?.Online],
        backgroundColor: [
          "rgba(252, 186, 3,0.8)",
          "rgba(237, 21, 21,0.8)",
          "rgba(51, 122, 183)",
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
            size: 12, // Increase font size of the labels
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

export default RevenueChart;
