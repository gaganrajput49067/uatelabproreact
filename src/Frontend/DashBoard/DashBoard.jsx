import React, { useEffect, useRef, useState } from "react";
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
import { getDashboardAccessCentres } from "../../utils/NetworkApi/commonApi";
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
import { gsap } from "gsap";
import moment from "moment";

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
  const elementRef = useRef(null);
  // useEffect(() => {
  //   // Select the pieces of the chart using the class name
  //   const pieces = gsap.utils.toArray(".piece");

  //   // Subtle break effect (gently displacing the pieces)
  //   gsap.fromTo(
  //     pieces,
  //     {
  //       opacity: 1,
  //       x: 0,
  //       y: 0,
  //       scale: 1,
  //       rotation: 0,
  //       skewX: 0,
  //       skewY: 0,
  //     },
  //     {
  //       opacity: 0.9,
  //       x: (i) => gsap.utils.random(-30, 30), // Very minimal scatter
  //       y: (i) => gsap.utils.random(-30, 30),
  //       scale: (i) => gsap.utils.random(0.95, 1.05), // Barely noticeable scaling
  //       rotation: (i) => gsap.utils.random(-5, 5), // Minor rotation
  //       skewX: (i) => gsap.utils.random(-2, 2), // Tiny skew distortion
  //       skewY: (i) => gsap.utils.random(-2, 2),
  //       duration: 0.4, // Fast, subtle scatter
  //       ease: "power1.out", // Soft ease for simple effect
  //       stagger: 0.04,
  //       onComplete: mergePieces,
  //     }
  //   );

  //   // Function to merge pieces back together with background color change
  //   function mergePieces() {
  //     // Change background color before merging
  //     gsap.to(".chart-container", {
  //       backgroundColor: "#e0f7fa", // Soft background color during merge
  //       duration: 0.6, // Smooth transition
  //     });

  //     // Merge the pieces back together
  //     gsap.to(pieces, {
  //       x: 0,
  //       y: 0,
  //       opacity: 1,
  //       scale: 1,
  //       rotation: 0,
  //       skewX: 0,
  //       skewY: 0,
  //       duration: 0.6, // Smooth and light merge back
  //       ease: "power1.inOut", // Subtle ease for merging effect
  //       stagger: 0.04,
  //       onComplete: resetBackground, // Reset background after merge
  //     });
  //   }

  //   // Reset background color after merge completes
  //   function resetBackground() {
  //     gsap.to(".chart-container", {
  //       backgroundColor: "#ffffff", // Revert to original background color
  //       duration: 0.6, // Smooth transition back
  //     });
  //   }
  // }, []);

  useEffect(() => {
    getDashboardAccessCentres({
      state: setAccessCentre,
      callbackFun: (field, values) => {
        let data = { ...payload };
        data.CentreID = values;
        getDashBoardData(field, values, data, setUserWiseDashBoard);
        fetchuserdata(data, setDashBoardData);
      },
    });
  }, []);

  const getOutput = (name, value) => {
    const data = { ...payload };
    if (Array.isArray(payload.CentreID) || payload.CentreID == "") {
      data.CentreID = accessCentre?.map((ele) => ele?.value);
    }
    data[name] = value;
    getDashBoardData(name, value, data, setUserWiseDashBoard);
    fetchuserdata(data, setDashBoardData);
  };

  return (
    <>
      <div ref={elementRef}>
        <div className="header-main-menu-container m-2 piece">
          <span className="header-dashboard">DashBoard</span>
          <div className="header-option piece">
            <div className="col-sm-3 mt-1">
              <SelectBox
                className="required-fields"
                placeholderName="Select Centre"
                options={accessCentre}
                value={payload.CentreID}
                name="CentreID"
                onChange={(e) => {
                  setPayload({ ...payload, CentreID: e.target.value });
                  getOutput(e.target.name, e.target.value);
                }}
                lable="Centre"
              />
            </div>
            <div className="col-sm-3 mt-1">
              <DatePicker
                className="custom-calendar"
                name="FromDate"
                placeholder=" "
                value={new Date(payload.FromDate)}
                id="DOB"
                lable="From Date"
                onChange={(value, name) => {
                  setPayload((ele) => ({ ...ele, [name]: value }));
                  getOutput(name, value);
                }}
              />
            </div>
            <div className="col-sm-3 mt-1">
              <DatePicker
                className="custom-calendar"
                name="ToDate"
                placeholder=" "
                value={new Date(payload.ToDate)}
                id="DOB"
                lable="To Date"
                onChange={(value, name) => {
                  setPayload((ele) => ({ ...ele, [name]: value }));
                  getOutput(name, value);
                }}
              />
            </div>
          </div>
        </div>
        <div class="main-dashboard-outlet piece">
          <div class="main-cont-welcom piece">
            <div className="dashboard-welcome-cont piece">
              <div>
                <span>{getGreeting("greeting")}</span>
                <span>{getGreeting("date")}</span>
                <span>Welcome Back Mr. ITODSE INFOSYSTEMS</span>
              </div>
            </div>
          </div>
          <div class="div2 dashboard-Chart pt-3 piece">
            <DataSet data={userDashBoardData} />
          </div>
          <div class="SalesCollection dashboard-Chart piece">
            <span>Sales Collection</span>
            <SalesCollection userWiseDashBoard={userDashBoardData} />
          </div>
          <div class="div4 dashboard-Chart piece"> d</div>
          <div class="MultiAxisLineChart dashboard-Chart piece">
            <span>Registration wise Revenue</span>
            <MultiAxisLineChart
              data1={userDashBoardData?.TotalBookeddata}
              data2={userDashBoardData?.TotalBookeddata}
            />
          </div>
          <div class="RevenueCollection dashboard-Chart piece">
            <span>Revenue Collection</span>
            <RevenueCollection userWiseDashBoard={userDashBoardData} />
          </div>
          <div class="sample-data-chart dashboard-Chart piece">
            <span>Sample Collection Status</span>
            <SampleCollection userWiseDashBoard={userWiseDashBoard} />
          </div>
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
  console.log(userWiseDashBoard, "ds");
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
            size: 12, // Adjust the font size for x-axis labels
          },
        },
      },
      y: {
        ticks: {
          beginAtZero: true,
          font: {
            size: 12, // Adjust the font size for y-axis labels
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

function DataSet({ data }) {
  return (
    <>
      <div className="data-set-cont">
        <label>Total</label>
        <p>
          <p>Registration</p>
          <p>
            {data?.TotalBookeddata
              ? data?.TotalBookeddata?.filter(
                  (ele) => ele?.Date == moment(new Date()).format("YYYY-MM-DD")
                )[0].TotalReceiptBooked
              : 0}
          </p>
        </p>
        <p>
          <p>Revenue</p>
          <p>
            {data?.TotalBookeddata
              ? Number(
                  data?.TotalBookeddata?.filter(
                    (ele) =>
                      ele?.Date == moment(new Date()).format("YYYY-MM-DD")
                  )[0].TotalNetAmount
                ).toFixed(2)
              : 0.0}
          </p>
        </p>
      </div>
      <div className="data-set-cont">
        <label>Registration</label>
        <p>
          <p>Today</p>
          <p>
            {data?.TotalBookeddata
              ? data?.TotalBookeddata?.filter(
                  (ele) => ele?.Date == moment(new Date()).format("YYYY-MM-DD")
                )[0].TotalReceiptBooked
              : 0}
          </p>
        </p>
        <p>
          <p>August</p>
          <p>{data?.Monthwisedata || 0}</p>
        </p>
      </div>
      <div className="data-set-cont">
        <label>Revenue</label>
        <p>
          <p>Today</p>
          <p>
            {data?.TotalBookeddata
              ? Number(
                  data?.TotalBookeddata?.filter(
                    (ele) =>
                      ele?.Date == moment(new Date()).format("YYYY-MM-DD")
                  )[0].TotalNetAmount
                ).toFixed(2)
              : 0.0}
          </p>
        </p>
        <p>
          <p>August</p>
          <p>
            {data?.MonthCollection
              ? Number(data?.MonthCollection).toFixed(2)
              : 0}
          </p>
        </p>
      </div>
    </>
  );
}
