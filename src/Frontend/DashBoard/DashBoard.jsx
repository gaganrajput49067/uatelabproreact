import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../../zStyles/DashBoard.css";
import DatePicker from "../../components/CommonComponent/DatePicker";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import { getGreeting } from "../util/Commonservices";
import greeticon from "../../assets/image/dashuser.png";
import {
  ChartData,
  fetchuserdata,
  getChart,
  getDashBoardData,
} from "./utitlity";
import { useNavigate } from "react-router-dom";
import { getAccessCentres } from "../../utils/NetworkApi/commonApi";
import MultiAxisLineChart from "./modules/MultiAxisLineChart";
import RevenueChart from "./modules/RevenueChart";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const MainDaashBoard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userWiseDashBoard, setUserWiseDashBoard] = useState([]);
  const [userDashBoardData, setDashBoardData] = useState([]);
  const [accessCentre, setAccessCentre] = useState([]);
  const [payload, setPayload] = useState({
    CentreID: "",
    FromDate: new Date(),
    FromTime: "00:00:00",
    ToDate: new Date(),
    ToTime: "23:59:59",
  });

  useEffect(() => {
    getAccessCentres({
      state: setAccessCentre,
      callbackFun: (field, values) => {
        let data = { ...payload };
        data.CentreID = values;
        getDashBoardData(field, values, data, setUserWiseDashBoard);
        fetchuserdata(data, setDashBoardData);
      },
    });
  }, []);

  return (
    <>
      <div className="header-main-menu-container m-2">
        <span className="header-dashboard">DashBoard</span>
        <div className="header-option row">
          <div className="col-sm-4 mt-1">
            <SelectBox
              className="required-fields"
              placeholderName="Select Centre"
              options={accessCentre}
              value={payload.CentreID}
              name="CentreID"
              onChange={(e) =>
                setPayload({ ...payload, [name]: e.target.value })
              }
              lable="Centre"
            />
          </div>
          <div className="col-sm-4 mt-1">
            <DatePicker
              className="custom-calendar"
              name="DOB"
              placeholder=" "
              value={new Date()}
              id="DOB"
              lable="From Date"
            />
          </div>
          <div className="col-sm-4 mt-1">
            <DatePicker
              className="custom-calendar"
              name="To Date"
              placeholder=" "
              value={new Date()}
              id="DOB"
              lable="To Date"
            />
          </div>
        </div>
      </div>
      <div class="main-dashboard-outlet">
        <div class="main-cont-welcom">
          <div className="dashboard-welcome-cont">
            <div>
              <span>{getGreeting("greeting")}</span>
              <span>{getGreeting("date")}</span>
              <span>Welcome Back Mr. Prakhar Pandey</span>
            </div>
            <img
              src={greeticon}
              alt=""
              style={{ width: "150px", height: "150px" }}
            />
          </div>
        </div>
        <div class="div2 dashboard-Chart pt-3">
          <DataSet />
        </div>
        <div class="SalesCollection dashboard-Chart">
          <span>Sales Collection</span>
          <SalesCollection userWiseDashBoard={userWiseDashBoard} />
        </div>
        <div class="div4 dashboard-Chart"> d</div>
        <div class="MultiAxisLineChart dashboard-Chart">
          <span>Registration wise Revenue</span>
          <MultiAxisLineChart />
        </div>
        <div class="RevenueCollection dashboard-Chart">
          <span>Revenue Collection</span>
          <RevenueCollection userWiseDashBoard={userWiseDashBoard} />
        </div>
        <div class="sample-data-chart dashboard-Chart">
          <span>Sample Collection Status</span>
          <SampleCollection userWiseDashBoard={userWiseDashBoard} />
        </div>
      </div>
    </>
  );
};

export default MainDaashBoard;

function SampleCollection({ userWiseDashBoard }) {
  const [state, setState] = useState("Pie Chart");

  function getPosition() {
    if (state === "Pie Chart") {
      return { top: "50px", left: "25px" };
    } else {
      return { top: "10px", left: "60%" };
    }
  }

  return (
    <>
      <div className="sample-collection-selectbox" style={{ ...getPosition() }}>
        <SelectBox
          className="required-fields"
          placeholderName="Chart Type"
          name="state"
          options={ChartData}
          value={state}
          onChange={(e) => setState(e.target.value)}
          lable="Chart Type"
        />
      </div>
      {getChart(state, userWiseDashBoard)}
    </>
  );
}

function RevenueCollection({ userWiseDashBoard }) {
  let data = {
    Cash: userWiseDashBoard.Cash || 0,
    Online: userWiseDashBoard.TotalOnlinepayment || 0,
    Cheque: userWiseDashBoard.Cheque || 0,
  };

  return <>{<RevenueChart state={data} />}</>;
}

function SalesCollection({ userWiseDashBoard }) {
  const month = getGreeting("month");
  const SalesCollection = {
    labels: [month[2], month[1], month[0]],
    datasets: [
      {
        label: "Sales Data",
        data: [
          userWiseDashBoard?.PreviousMonth2 || 0, // Provide a default value if data is undefined
          userWiseDashBoard?.PreviousMonth || 0,
          userWiseDashBoard?.CurrentMonth || 0,
        ],
        backgroundColor: [
          userWiseDashBoard?.PreviousMonth2 >= userWiseDashBoard?.PreviousMonth
            ? "#0ba318"
            : "red",
          userWiseDashBoard?.PreviousMonth >= userWiseDashBoard?.PreviousMonth2
            ? "#0ba318"
            : "red",
          "yellow",
        ],
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the legend if there's only one dataset
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) =>
            `${tooltipItem.dataset.label}: ${tooltipItem.raw}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 14, // Adjust the font size for x-axis labels
          },
        },
      },
      y: {
        ticks: {
          beginAtZero: true,
          font: {
            size: 14, // Adjust the font size for y-axis labels
          },
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Bar data={SalesCollection} options={options} />
    </div>
  );
}

function DataSet({ userWiseDashBoard }) {
  return (
    <>
      <div className="data-set-cont">
        <label>Total</label>
        <p>
          <p>Registration</p> <p> 24</p>
        </p>
        <p>
          <p>Revenue</p> <p> 24</p>
        </p>
      </div>
      <div className="data-set-cont">
        <label>Registration</label>
        <p>
          <p>Today</p> <p> 24</p>
        </p>
        <p>
          <p>August</p> <p> 24</p>
        </p>
      </div>
      <div className="data-set-cont">
        <label>Revenue</label>
        <p>
          <p>Today</p> <p> 24</p>
        </p>
        <p>
          <p>August</p> <p> 24</p>
        </p>
      </div>
    </>
  );
}
