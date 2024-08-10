import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import DatePicker from "../../Components/DatePicker";
import { SelectBox } from "../../../ChildComponents/SelectBox";
import InfoCard from "./InfoCard";
import BarChart from "../Dashboard/BarChart";

const DocDashboard = () => {
  const { t } = useTranslation();
  const [state, setState] = useState({});

  return (
    <>
      <div className="box-header with-border">
        <div className="col-sm-3">
          <div className="dashCard">
            <p style={{ textAlign: "center", padding: "0px" }}>
              Doctor Patient Seen Status
            </p>
            <div className="row">
              <div className="col-sm-7">
                <div className="innerCard" style={{ height: "140px" }}>
                  <InfoCard
                    title="Total Patient Visited"
                    value="00"
                    trendUp={true}
                    lastLine1="00"
                    lastLine2="00%"
                  />
                </div>
              </div>
              <div className="col-sm-5">
                <div className="DocAvail">
                  <div className="InnerVal">
                    <InfoCard
                      title="Total Patient Visited"
                      value="00"
                      trendUp={true}
                      lastLine1="00"
                      lastLine2="00%"
                    />
                  </div>
                  <div className="InnerVal" style={{ marginTop: "10px" }}>
                    <InfoCard
                      title="Total Patient Visited"
                      value="00"
                      trendUp={true}
                      lastLine1="00"
                      lastLine2="00%"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-5">
          <div className="dashCard">
            <p style={{ textAlign: "center", padding: "0px" }}>
              Doctor Patient Seen Status
            </p>
            <div className="row">
              <div className="col-sm-3">
                <div className="innerCard" style={{ height: "140px" }}>
                  <InfoCard
                    title="Total Patient Visited"
                    value="00"
                    trendUp={true}
                    lastLine1="00"
                    lastLine2="00%"
                  />
                </div>
              </div>
              <div className="col-sm-3">
                <div className="innerCard" style={{ height: "140px" }}>
                  <InfoCard
                    title="Total Patient Visited"
                    value="00"
                    trendUp={true}
                    lastLine1="00"
                    lastLine2="00%"
                  />
                </div>
              </div>
              <div className="col-sm-3">
                <div className="innerCard" style={{ height: "140px" }}>
                  <InfoCard
                    title="Total Patient Visited"
                    value="00"
                    trendUp={true}
                    lastLine1="00"
                    lastLine2="00%"
                  />
                </div>
              </div>
              <div className="col-sm-3">
                <div className="innerCard" style={{ height: "140px" }}>
                  <InfoCard
                    title="Total Patient Visited"
                    value="00"
                    trendUp={true}
                    lastLine1="00"
                    lastLine2="00%"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="box-header with-border">
        <div className="col-sm-3">
          <div className="dashCard">
            <p style={{ textAlign: "center", padding: "0px" }}>
              Specialization Wise Patient Count
            </p>
            <div className="innerCard">
              <BarChart state={state} />
            </div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="dashCard">
            <p style={{ textAlign: "center", padding: "0px" }}>
              Department Wise Patient Queue
            </p>
            <div className="innerCard">
              <BarChart state={state} />
            </div>
          </div>
        </div>
        <div className="col-sm-5">
          <div className="dashCard">
            <p style={{ textAlign: "center", padding: "0px" }}>
              Avg.Time Tanken By Doctor in (mins.)
            </p>
            <div className="innerCard">
              <BarChart state={state} />
            </div>
          </div>
        </div>
      </div>
      <div className="box-header with-border">
        <div className="col-sm-4">
          <div className="dashCard">
            <p style={{ textAlign: "center", padding: "0px" }}>
              Doctor Wise IPD Referral
            </p>
            <div className="innerCard">
              <BarChart state={state} />
            </div>
          </div>
        </div>
        <div className="col-sm-5">
          <div className="dashCard">
            <p style={{ textAlign: "center", padding: "0px" }}>
              Doctor Advice Converted to Booking
            </p>
            <div className="innerCard">
              <BarChart state={state} />
            </div>
          </div>
        </div>
        <div className="col-sm-3">
          <div className="dashCard">
            <p style={{ textAlign: "center", padding: "0px" }}>
              Doctor wise Discount Allowed
            </p>
            <div className="innerCard">
              <BarChart state={state} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocDashboard;

const BoxDetails = ({ className }) => {
  return (
    <div className={`${className} BoxDetails`}>
      <p className="BoxDetailsText">Total Doctor</p>
      <p>00</p>
      <div className="card-flex-row">
        <span className="BoxDetailsText">00</span>
        <span className="BoxDetailsText">00%</span>
      </div>
    </div>
  );
};

const SmallBoxDetails = ({ className }) => {
  return (
    <div className={`${className} SmallBoxDetails`}>
      <p className="SmallBoxDetailsText">Total Doctor</p>
      <p>00</p>
      <div className="card-flex-row">
        <span className="SmallBoxDetailsText">00</span>
        <span className="SmallBoxDetailsText">00%</span>
      </div>
    </div>
  );
};
