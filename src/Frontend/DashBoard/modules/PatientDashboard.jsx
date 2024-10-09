import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import InfoCard from "./InfoCard";
import BarChart from "../Dashboard/BarChart";
import axios from "axios";
import moment from "moment";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  BarElement,
  Tooltip,
  PointElement,
  LineElement,
  Legend,
} from "chart.js";

const PatientDashBoard = ({ Data, centreData }) => {
  const { t } = useTranslation();
  const [data, setData] = useState();


  const fetchPatientData = () => {
    axios.post("/api/v1//CommonController/PatientwiseDashboard", {
      FromDate: moment(Data?.FromDate).format("YYYY-MM-DD"),
      ToDate: moment(Data?.ToDate).format("YYYY-MM-DD"),
      CentreID: Data?.CentreID == "" || Data?.CentreID == [""] ? centreData?.map((ele) => ele?.value) : Data?.CentreID,
      FromTime: Data?.FromTime,
      ToTime: Data?.ToTime,
    }).then((res) => {
      setData(res?.data?.message);
    }).catch((err) => {
      console.log(err)
    })
  }

  useEffect(() => {
    fetchPatientData()
  }, [Data])

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    BarElement,
    Tooltip,
    LineElement,
    Legend
  );

  const chartData = {
    labels: [t("NewPatient"), t("Revisited")],

    datasets: [
      {
        label: "Bar Chart",
        borderRadius: 1,
        borderWidth: 5,

        data: [data?.NewPatientCount, data?.RevisitPatientCount],
        backgroundColor: ["rgba(252, 186, 3)", "rgba(128,0,128)"],
      },
    ],
  };
  const chartDataPanel = {
    labels: [t("SampleNotCollected"), t("Rejected")],

    datasets: [
      {
        label: "Bar Chart",
        borderRadius: 1,
        borderWidth: 5,

        data: [data?.NewPatientCount, data?.RevisitPatientCount],
        backgroundColor: ["#32a852", "#8126d1"],
      },
    ],
  };

  const chartData2 = {
    labels: [t("Walk-In"), t("OPD"), t("HLM")],
    datasets: [
      {
        label: "Line Chart",
        data: [data?.Walk_In, data?.OPD, data?.HLM],
        backgroundColor: [
          "rgba(252, 186, 3)",
          "rgba(128,0,128)",
          "rgba(2, 146, 242)",
        ],
      },
    ],
  };
  console.log("datashelp", data)
  const chartData3 = {
    labels: [t("Total Booking"), t("Sample Collected"), t("SampleNotCollected"), t("Dept.Received"), t("Rejected"), t("Approved")],
    datasets: [
      {
        label: "Line Chart",
        data: [data?.TotalPatient, data?.sampleCollectionCount, data?.notCollectedCount, data?.departmentReceiveCount, data?.rejectedCount, data?.approvedCount],
        backgroundColor: [
          "#b802e0",
          "#f1c40f",
          "#757575",
          "#3498db",
          "#e74c3c",
          "#07bc0c"
        ]

      },
    ],

  };

  const calculatePer = (val) => {
    const value = parseInt((val * 100) / data?.TotalPatient);
    return data?.TotalPatient !== 0 ? value : 0;
  };


  const getColor = () => {
    const theme = localStorage.getItem('Theme');
    switch (theme) {
      case 'Default': return '#ada9fc';
      case 'light Green': return 'lightgreen';
      case 'Peach': return '#ffdab9';
      case 'Pale Pink': return '#fc9de4';
      case 'Red': return '#FFCCCB';
      case 'SkyBlue': return '#6dd2e3';
      case 'Grey': return 'lightgrey';
      default: return 'white';
    }
  };
  return (
    <>
      <div className="box-header with-border">
        <div className="box-body">
          <div className="row">
            <div className="col-sm-6">
              <div className="dashCard" style={{ backgroundColor: getColor() }}>
                <p style={{ textAlign: "center", padding: "0px", fontWeight: "700" }}>
                  Region Wise Collection
                </p>
                <div className="innerCard">
                  <Line
                    data={chartData3}
                    options={{
                      maintainAspectRatio: false,
                      responsive: true,
                    }}
                    style={{ fontSize: "5px" }}
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="dashCard" style={{ backgroundColor: getColor() }}>
                <p style={{ textAlign: "center", padding: "0px", fontWeight: "700" }}>
                  Centre Wise Collection
                </p>
                <div className="innerCard">
                  <Bar
                    data={chartData3}
                    options={{
                      maintainAspectRatio: false,
                      responsive: true,
                    }}
                    style={{ fontSize: "5px" }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6">
              <div className="dashCard" style={{ backgroundColor: getColor() }}>
                <p style={{ textAlign: "center", padding: "0px", fontWeight: "700" }}>
                 User Wise Collection
                </p>
                <div className="innerCard">
                  <Line
                    data={chartData3}
                    options={{
                      maintainAspectRatio: false,
                      responsive: true,
                    }}
                    style={{ fontSize: "5px" }}
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="dashCard" style={{ backgroundColor: getColor() }}>
                <p style={{ textAlign: "center", padding: "0px", fontWeight: "700" }}>
                  Collection Comparison
                </p>
                <div className="innerCard">
                  <Line
                    data={chartData3}
                    options={{
                      maintainAspectRatio: false,
                      responsive: true,
                    }}
                    style={{ fontSize: "5px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientDashBoard;
