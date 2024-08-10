import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DatePicker from "../../Components/DatePicker";
import { SelectBox } from "../../../ChildComponents/SelectBox";
import BarChart from "./BarChart";
import Chat2 from "./Chat2";
import Linechart from "./Linechart";

const OldPatientDashboard = () => {
  const { t } = useTranslation();
  const [state, setState] = useState({});
  const [payload, setPayload] = useState(null);

  return (
    <>
      <div className="box ">
        <div className="row">
          <div className="col-sm-2">
            <div className="col-sm-12 card-container card-flex-row">
              <BoxDetails
                className={"col-sm-6 innerBox card-flex-column"}
                mainHeader={"Total Patient VIsited"}
                mainValue={"00"}
                value={"00"}
                valuePer={"00%"}
              />
              <div className="col-sm-6 mpZero card-flex-column hightWidth">
                <SmallBoxDetails
                  className={"col-sm-6 innerBox card-flex-column"}
                  mainHeader={"Total Patient VIsited"}
                  mainValue={"00"}
                  value={"00"}
                  valuePer={"00%"}
                />

                <SmallBoxDetails
                  className={"col-sm-6 innerBox card-flex-column marBtn"}
                  mainHeader={"Total Patient VIsited"}
                  mainValue={"00"}
                  value={"00"}
                  valuePer={"00%"}
                />
              </div>
            </div>
          </div>
          <div className="col-sm-3">
            <div className="col-sm-12 card-container card-flex-column">
              <p className="innerText">Today Booking and Admission</p>
              <div className="col-sm-6 mpZero card-flex-row hightWidth">
                <BoxDetails
                  className={"col-sm-6 innerBox card-flex-column"}
                  mainHeader={"Total Patient VIsited"}
                  mainValue={"00"}
                  value={"00"}
                  valuePer={"00%"}
                />
                <BoxDetails
                  className={"col-sm-6 innerBox card-flex-column"}
                  mainHeader={"Total Patient VIsited"}
                  mainValue={"00"}
                  value={"00"}
                  valuePer={"00%"}
                />
                <BoxDetails
                  className={"col-sm-6 innerBox card-flex-column marBtn"}
                  mainHeader={"Total Patient VIsited"}
                  mainValue={"00"}
                  value={"00"}
                  valuePer={"00%"}
                />
              </div>
            </div>
          </div>
          <div className="col-sm-5">
            <div className="col-sm-12 card-container card-flex-row">
              <BoxDetails
                className={"col-sm-6 innerBox card-flex-column"}
                mainHeader={"Total Patient VIsited"}
                mainValue={"00"}
                value={"00"}
                valuePer={"00%"}
              />
              <div className="col-sm-3 mpZero card-flex-column hightWidth">
                <VerySmallBoxDetails
                  className={"col-sm-6 innerBox card-flex-column"}
                  mainHeader={"Total Patient VIsited"}
                  mainValue={"00"}
                  value={"00"}
                  valuePer={"00%"}
                />
                <VerySmallBoxDetails
                  className={"col-sm-6 innerBox card-flex-column"}
                  mainHeader={"Total Patient VIsited"}
                  mainValue={"00"}
                  value={"00"}
                  valuePer={"00%"}
                />
                <VerySmallBoxDetails
                  className={"col-sm-6 innerBox card-flex-column marBtn"}
                  mainHeader={"Total Patient VIsited"}
                  mainValue={"00"}
                  value={"00"}
                  valuePer={"00%"}
                />
              </div>
              <div
                className="col-sm-3 mpZero card-flex-column hightWidth"
                style={{ margin: "0px 2px" }}
              >
                <SmallBoxDetails
                  className={"col-sm-6 innerBox card-flex-column"}
                  mainHeader={"Total Patient VIsited"}
                  mainValue={"00"}
                  value={"00"}
                  valuePer={"00%"}
                />

                <SmallBoxDetails
                  className={"col-sm-6 innerBox card-flex-column marBtn"}
                  mainHeader={"Total Patient VIsited"}
                  mainValue={"00"}
                  value={"00"}
                  valuePer={"00%"}
                />
              </div>
              <div
                className="col-sm-3 mpZero card-flex-column hightWidth"
                style={{ margin: "0px 2px" }}
              >
                <SmallBoxDetails
                  className={"col-sm-6 innerBox card-flex-column"}
                  mainHeader={"Total Patient VIsited"}
                  mainValue={"00"}
                  value={"00"}
                  valuePer={"00%"}
                />

                <SmallBoxDetails
                  className={"col-sm-6 innerBox card-flex-column marBtn"}
                  mainHeader={"Total Patient VIsited"}
                  mainValue={"00"}
                  value={"00"}
                  valuePer={"00%"}
                />
              </div>
            </div>
          </div>
          <div className="col-sm-2">
            <div className="col-sm-12 card-container card-flex-column">
              <p className="innerText">Today Booking and Admission</p>
              <div className="col-sm-6 mpZero card-flex-row hightWidth">
                <BoxDetails
                  className={"col-sm-6 innerBox card-flex-column"}
                  mainHeader={"Total Patient VIsited"}
                  mainValue={"00"}
                  value={"00"}
                  valuePer={"00%"}
                />
                <BoxDetails
                  className={"col-sm-6 innerBox card-flex-column"}
                  mainHeader={"Total Patient VIsited"}
                  mainValue={"00"}
                  value={"00"}
                  valuePer={"00%"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="box ">
        <div className="row">
          <div className="col-sm-4 ">
            <div className="col-sm-12 chart-container card-flex-column">
              <p className="innerText">Bed/Room Availablty</p>
              <div className="innerBox">
                <BarChart state={state} />
              </div>
            </div>
          </div>
          <div className="col-sm-4 ">
            <div className="col-sm-12 chart-container card-flex-column">
              <p className="innerText">Bed/Room Availablty</p>
              <div className="innerBox">
                <BarChart state={state} />
              </div>
            </div>
          </div>
          <div className="col-sm-4 ">
            <div className="col-sm-12 chart-container card-flex-column">
              <p className="innerText">Bed/Room Availablty</p>
              <div className="innerBox">
                <BarChart state={state} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="box ">
        <div className="row">
          <div className="col-sm-2 ">
            <div className="col-sm-12 card-container card-flex-column">
              <span className="innerText">Panel-Group wise Patent Visit</span>
              <div className="innerBox"></div>
            </div>
          </div>
          <div className="col-sm-3 ">
            <div className="col-sm-12 card-container ">
              <div className="innerBox">
                <p className="innerText">Bed/Room Availablty</p>
              </div>
            </div>
          </div>
          <div className="col-sm-2 ">
            <div className="col-sm-12 card-container">
              <div className="innerBox card-flex-column">
                <div className="card-flex-column">
                  <span className="innerText">Patient Conversion</span>
                  <span className="innerText cardBorder"> OPD -- IPD </span>
                  <span className="innerText cardBorder"> OPD -- IPD </span>
                </div>

                <div className="card-flex-column">
                  <span className="innerText">Avg Conversion</span>
                  <span className="innerText cardBorder"> OPD -- IPD </span>
                  <span className="innerText cardBorder"> OPD -- IPD </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-2 ">
            <div className="col-sm-12 card-container">
              <div className="innerBox card-flex-column">
                <div className="card-flex-column">
                  <span className="innerText">Current Bed Occupancy</span>
                  <span className="boldText " style={{ color: "green" }}>
                    11.11 %
                  </span>
                </div>

                <div className="card-flex-column">
                  <span className="innerText">Avg Occupaancy this Month</span>
                  <span className="boldText " style={{ color: "red" }}>
                    11.11 %
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-3 ">
            <div className="col-sm-12 card-container">
              <div className="innerBox card-flex-column">
                <p className="innerText">Avg Length of Stay</p>
                <div className="card-flex-row">
                  <div className="otherinnerBox cardBorder card-flex-column">
                    <p>OPD</p>
                    <p>00</p>
                    <p>Minutes</p>
                  </div>
                  <div className="otherinnerBox cardBorder card-flex-column">
                    <p>OPD</p>
                    <p>00</p>
                    <p>Minutes</p>
                  </div>
                  <div className="otherinnerBox cardBorder card-flex-column">
                    <p>OPD</p>
                    <p>00</p>
                    <p>Minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OldPatientDashboard;

const BoxDetails = ({ className, mainHeader, mainValue, value, valuePer }) => {
  return (
    <div className={`${className} BoxDetails`}>
      <p className="BoxDetailsText">{mainHeader}</p>
      <p>{mainValue}</p>
      <div className="card-flex-row">
        <span className="BoxDetailsText">{value}</span>
        <span className="BoxDetailsText">{valuePer}</span>
      </div>
    </div>
  );
};

const SmallBoxDetails = ({
  className,
  mainHeader,
  mainValue,
  value,
  valuePer,
}) => {
  return (
    <div className={`${className} SmallBoxDetails`}>
      <p className="SmallBoxDetailsText">{mainHeader}</p>
      <p>{mainValue}</p>
      <div className="card-flex-row">
        <span className="SmallBoxDetailsText">{value}</span>
        <span className="SmallBoxDetailsText">{valuePer}</span>
      </div>
    </div>
  );
};

const VerySmallBoxDetails = ({
  className,
  mainHeader,
  mainValue,
  value,
  valuePer,
}) => {
  return (
    <div className={`${className} SmallBoxDetails`}>
      <div className="card-flex-row">
        <span className="SmallBoxDetailsText">{mainHeader}</span>
        <span className="verySmallBox">{mainValue}</span>
      </div>
      <div className="card-flex-row">
        <span className="SmallBoxDetailsText">{value}</span>
        <span className="SmallBoxDetailsText">{valuePer}</span>
      </div>
    </div>
  );
};
