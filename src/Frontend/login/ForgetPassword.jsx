import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Input from "../../components/CommonComponent/Input";
import logoitdose from "../../assets/image/logoitdose.png";
import lab from "../../assets/image/Lab.jpg";
import "../../zStyles/login.css";
import {
  forgetPasswordAction,
  resetState,
} from "../../store/reducers/forgetPasswordSlice/forgetPasswordSlice";

const ForgetPassword = () => {
  const [t] = useTranslation();
  const loading = useSelector((state) => state.loadingSlice.loading);
  const IsForgot = useSelector((state) => state.forgetPasswordSlice.success);
  console.log(IsForgot);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({
    UserName: "",
    Mobile: "",
    OTP: "",
    Password: "",
    ConfirmPassword: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
    
  };
  const handleReset = (e) => {
    e.preventDefault();
    const Api = "ForgetPasswordController/ResetPassword";
    dispatch(forgetPasswordAction({ credentials, Api }));
    navigate("/login");
  };
  const handleForget = (e) => {
    e.preventDefault();
    const Api = "ForgetPasswordController/ForgetPassword";
    dispatch(forgetPasswordAction({ credentials, Api }));
  };
  return (
    <div className="main-login-outer-Container">
      <div className="main-login-inner-container">
        <div className="login-form-container">
          {!IsForgot ? (
            <div className="login-form">
              <Link to="/">
                <img className="logoStyle" src={logoitdose} alt="logo" />
              </Link>
              <h5 className="logo-title"> Enter Details to get OTP</h5>

              <div className="main-login-input">
                <div className="icondiv">
                  <i className="fas fa-user-alt" />
                </div>
                <div className="maindiv">
                  <Input
                    type="text"
                    id="username"
                    className="form-control"
                    name="UserName"
                    value={credentials?.UserName}
                    lable={t("Username")}
                    placeholder=" "
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="main-login-input">
                <div className="icondiv">
                  <i className="fas fa-lock" />
                </div>
                <div className="maindiv">
                  <Input
                    type="text"
                    id="Mobile"
                    className="form-control"
                    name="Mobile"
                    value={credentials?.Mobile}
                    lable={t("Registered Mobile Number")}
                    placeholder=" "
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="main-login-button">
                <button
                  className="btn btn-sm btn-primary btn-block login-button"
                  onClick={handleForget}
                  disabled={loading}
                >
                  Send OTP
                </button>
                <span
                  className="forgetpassword"
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Back to login
                </span>
              </div>
            </div>
          ) : (
            <div className="login-form">
              <Link to="/">
                <img className="logoStyle" src={logoitdose} alt="logo" />
              </Link>
              <h5 className="logo-title"> Enter OTP and updated password</h5>

              <div className="main-login-input">
                <div className="icondiv">
                  <i className="fas fa-user-alt" />
                </div>
                <div className="maindiv">
                  <Input
                    type="number"
                    id="OTP"
                    className="form-control"
                    name="OTP"
                    value={credentials?.OTP}
                    lable={t("OTP")}
                    placeholder=" "
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="main-login-input">
                <div className="icondiv">
                  <i className="fas fa-lock" />
                </div>
                <div className="maindiv">
                  <Input
                    type="password"
                    id="Password"
                    className="form-control"
                    name="Password"
                    value={credentials?.Password}
                    lable={t("Password")}
                    placeholder=" "
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="main-login-input">
                <div className="icondiv">
                  <i className="fas fa-lock" />
                </div>
                <div className="maindiv">
                  <Input
                    type="password"
                    id="ConfirmPassword"
                    className="form-control"
                    name="ConfirmPassword"
                    value={credentials?.ConfirmPassword}
                    lable={t("ConfirmPassword")}
                    placeholder=" "
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="main-login-button">
                <button
                  className="btn btn-sm btn-primary btn-block login-button"
                  onClick={handleReset}
                  disabled={loading}
                >
                  Change Password
                </button>
                <span
                  className="forgetpassword"
                  onClick={() => {
                    dispatch(resetState());
                    navigate("/login");
                  }}
                >
                  Back to login
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="login-style-container">
          <img className="login-form" src={lab} alt="logo" />
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
