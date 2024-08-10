import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  BarElement,
  Tooltip,
} from "chart.js";
import { useTranslation } from "react-i18next";

const UserCartBar = ({ state }) => {
  const { t } = useTranslation();
  ChartJS.register(CategoryScale, LinearScale, Title, BarElement, Tooltip);
  console.log("first", state);

  const data = {
    labels: [
      t("TotalReceiptBooked"),
      t("Tests"),
      t("Packages"),
      //   t("Collection"),
    ],
    datasets: [
      {
        label: "Bar Chart",
        borderRadius: 10,
        borderWidth: 5,
        barPercentage: 0.2,

        data: [
          state?.TotalReceiptBooked,
          state?.Tests,
          state?.Packages,
          //   state?.Collection,
        ],
        backgroundColor: [
          "rgba(252, 186, 3)",
          "rgba(128, 0, 128)",
          "rgba(2, 146, 242)",
          //   "rgba(237, 21, 21)",
        ],
      },
    ],
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          margin: "0px",
          padding: "0px",
        }}
      >
        <Bar
          data={data}
          options={{
            maintainAspectRatio: false,
            responsive: true,
          }}
        />
      </div>
    </>
  );
};

export default UserCartBar;
