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
import {
  getDashboardAccessCentres,
  getQuickLinks,
} from "../../utils/NetworkApi/commonApi";
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
import { Dock } from "primereact/dock";
import { RadioButton } from "primereact/radiobutton";
import BlockComponent from "./BlockComponent";
import RazorPay from "../../Payment/RazorPay";
import { getLabelUrl, getLabIcons } from "../../utils/helpers";
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

  const [linkState, setLinkState] = useState([]);
  useEffect(() => {
    gsap.fromTo(
      [elementRef.current],
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1, ease: "power2.out", stagger: 0.3 }
    );
  }, []);
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
  useEffect(() => {
    getQuickLinks(setLinkState);
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
      <RazorPay />
      <div>
        <div className="header-main-menu-container m-2">
          <span className="header-dashboard">DashBoard</span>
          <div className="header-option">
            <div className="col-sm-3 mt-1">
              <SelectBox
                className="required-fields"
                placeholderName="Select Centre"
                options={[{ label: "All Centre", value: [0] }, ...accessCentre]}
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
          </div>{" "}
        </div>
        <div className="w-100 ss-none" style={{ margin: "" }}>
          {/* <BlockComponent
            userDashBoardData={userDashBoardData}
            userWiseDashBoard={userWiseDashBoard}
          /> */}
        </div>
        <div class="main-dashboard-outlet">
          <div class="main-cont-welcom piece" ref={elementRef}>
            <div className="dashboard-welcome-cont piece">
              <div>
                <span>{getGreeting("greeting")}</span>
                <span>{getGreeting("date")}</span>
                <span>Welcome Back Mr. ITODSE INFOSYSTEMS</span>
              </div>
            </div>
          </div>
          <div class="div2 dashboard-Chart pt-3">
            <DataSet data={userDashBoardData} />
          </div>
          <div class="SalesCollection dashboard-Chart">
            <span>Sales Collection</span>
            <SalesCollection userWiseDashBoard={userDashBoardData} />
          </div>
          <div class="div4 dashboard-Chart2">
            {" "}
            <div
              className="innerCardDayswise"
              style={{ height: "auto" }}
              ref={elementRef}
            >
              <span>Quick Links</span>
              {linkState?.map((ele, index) => (
                <h6
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    margin: "8.5px 2px",
                    padding: 0,
                  }}
                >
                  <a>{getLabIcons(ele)}</a>
                  <a href={ele} >
                    {getLabelUrl(ele)}
                  </a>
                </h6>
              ))}
            </div>
          </div>
          <div class="MultiAxisLineChart dashboard-Chart">
            <span>Registration wise Revenue</span>
            <MultiAxisLineChart
              data1={userDashBoardData?.totalBookeddata}
              data2={userDashBoardData?.totalBookeddata}
            />
          </div>
          <div class="RevenueCollection dashboard-Chart">
            <span>Revenue Collection</span>
            <RevenueCollection userWiseDashBoard={userDashBoardData} />
          </div>
          <div class="sample-data-chart dashboard-Chart">
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
    cash: userWiseDashBoard.cash || 0,
    Online: userWiseDashBoard.totalOnlinepayment || 0,
    cheque: userWiseDashBoard.cheque || 0,
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
          userWiseDashBoard?.previousMonth2 || 0, // Provide a default value if data is undefined
          userWiseDashBoard?.previousMonth || 0,
          userWiseDashBoard?.currentMonth || 0,
        ],
        backgroundColor: [
          userWiseDashBoard?.previousMonth2 >= userWiseDashBoard?.previousMonth
            ? "#0ba318"
            : "red",
          userWiseDashBoard?.previousMonth >= userWiseDashBoard?.previousMonth2
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
  const totalDasRef = useRef(null);
  const totalRegRef = useRef(null);
  const totalRevRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      [totalDasRef.current, totalRegRef.current, totalRevRef.current],
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1, ease: "power2.out", stagger: 0.3 }
    );
  }, []);

  return (
    <>
      <div
        ref={totalDasRef}
        className="data-set-cont TotalDas"
        style={{
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <label style={{ fontWeight: "bold", fontSize: "18px" }}>Total</label>
        <p>
          <p>Registration</p>
          <p>
            {data?.totalBookeddata
              ? data?.totalBookeddata?.filter(
                  (ele) => ele?.Date === moment(new Date()).format("YYYY-MM-DD")
                )[0]?.TotalReceiptBooked || 0
              : 0}
          </p>
        </p>
        <p>
          <p>Revenue</p>
          <p>
            {data?.totalBookeddata
              ? Number(
                  data?.totalBookeddata?.filter(
                    (ele) =>
                      ele?.Date === moment(new Date()).format("YYYY-MM-DD")
                  )[0]?.TotalNetAmount || 0
                ).toFixed(2)
              : 0.0}
          </p>
        </p>
      </div>

      <div
        ref={totalRegRef}
        className="data-set-cont TotalReg"
        style={{
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <label style={{ fontWeight: "bold", fontSize: "18px" }}>
          Registration
        </label>
        <p>
          <p>Today</p>
          <p>
            {data?.totalBookeddata
              ? data?.totalBookeddata?.filter(
                  (ele) => ele?.Date === moment(new Date()).format("YYYY-MM-DD")
                )[0]?.TotalReceiptBooked || 0
              : 0}
          </p>
        </p>
        <p>
          <p>August</p>
          <p>{data?.monthwisedata || 0}</p>
        </p>
      </div>

      <div
        ref={totalRevRef}
        className="data-set-cont TotalRev"
        style={{
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <label style={{ fontWeight: "bold", fontSize: "18px" }}>Revenue</label>
        <p>
          <p>Today</p>
          <p>
            {data?.totalBookeddata
              ? Number(
                  data?.totalBookeddata?.filter(
                    (ele) =>
                      ele?.Date === moment(new Date()).format("YYYY-MM-DD")
                  )[0]?.TotalNetAmount || 0
                ).toFixed(2)
              : 0.0}
          </p>
        </p>
        <p>
          <p>August</p>
          <p>
            {data?.monthCollection
              ? Number(data?.monthCollection).toFixed(2)
              : 0}
          </p>
        </p>
      </div>
    </>
  );
}
