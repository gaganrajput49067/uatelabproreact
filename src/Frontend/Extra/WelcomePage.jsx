import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import errorpage from "./WelcomePage.jpg";
import "./BlankPage.css"; // Assuming you have a separate CSS file
import { axiosInstance } from "../../utils/axiosInstance";
import Loading from "../../components/Loading/Loading";
import { formatDate } from "../../utils/helpers";
import RazorPay from "../../Payment/RazorPay";

const WelcomePage = () => {
  const [details, setDetails] = useState({});

  const [flag, setFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const getEmployeeDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("Employee/WelcomeDetails");
      setDetails(response?.data?.message[0]);
      setLoading(false);
      setFlag(true);
    } catch (error) {
      setFlag(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    getEmployeeDetails();
  }, []);
  return (
    <>
      {" "}
      {flag && <RazorPay />}{" "}
      <div className="main-login-outer-Container">
        {loading ? (
          <Loading />
        ) : (
          <div className="warpper">
            <div className="content-wrapper">
              <div
                style={{
                  height: "100%",
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "center",
                  width: "auto",
                }}
              >
                <div className="row">
                  <div className="col-sm-12">
                    <div className="errorContainer">
                      {/* <img src={errorpage} alt="Error" /> */}
                      <p className="error_content2">Welcome </p>
                      <p className="error_content3"> {details?.UserName}</p>
                      <p className="errorParacontent">
                        <b className="errorParacontent"> Designation</b> :{" "}
                        {details?.Designation}
                      </p>
                      <p className="errorParacontent">
                        <b className="errorParacontent"> Current Login Time</b>{" "}
                        :{" "}
                        {details?.LoginTime
                          ? formatDate(details?.LoginTime)
                          : "Not Available"}
                      </p>
                      <p className="errorParacontent">
                        <b className="errorParacontent"> Last Logout Time </b>:{" "}
                        {details?.LogoutTime
                          ? formatDate(details?.LogoutTime)
                          : "Not Available"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}{" "}
      </div>{" "}
    </>
  );
};

export default WelcomePage;
