import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Input from "../../components/CommonComponent/Input";
import logoitdose from "../../assets/image/logoitdose.png";
import "../../zStyles/login.css";
import Loading from "../../components/Loading/Loading";
import { signInAction } from "../../store/reducers/loginSlice/loginSlice";

const Login = () => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loadingSlice.loading);

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signInAction(credentials));
  };

  return (
    <div className="main-login-outer-Container">
      <div className="main-login-inner-container">
        <div className="login-form-container">
          <div className="login-form">
            <Link to="/">
              <img className="logoStyle" src={logoitdose} alt="logo" />
            </Link>
            <h5 className="logo-title"> Sign in to start your session</h5>

            <div className="main-login-input">
              <div className="icondiv">
                <i className="fas fa-user-alt" />
              </div>
              <div className="maindiv">
                <Input
                  type="text"
                  className="form-control"
                  name="username"
                  lable={t("username")}
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
                  className="form-control"
                  name="password"
                  lable={t("Password")}
                  placeholder=" "
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="main-login-button">
              <button
                className="btn btn-sm btn-primary btn-block login-button"
                onClick={handleSubmit}
                disabled={loading}
              >
              </button>
              <span className="forgetpassword"> Forget Password</span>
            </div>
          </div>
        </div>
        <div className="login-style-container">efwf</div>
      </div>
    </div>
  );
};

export default Login;
