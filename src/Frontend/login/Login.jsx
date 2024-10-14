import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Input from "../../components/CommonComponent/Input";
import logoitdose from "../../assets/image/logo elabpro bg.png";
import lab from "../../assets/image/logoitdose.png";
import "../../zStyles/login.css";
import { signInAction } from "../../store/reducers/loginSlice/loginSlice";
import {
  forgetPasswordAction,
  resetState,
} from "../../store/reducers/forgetPasswordSlice/forgetPasswordSlice";
import OtpInput from "./OtpInput";
import { toast } from "react-toastify";
import { encryptData } from "../../Navigation/Storage";

const Login = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isRightPanelActive, setRightPanelActive] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [cShowPass, setCShowPass] = useState(false);
  const handleSignUpClick = () => {
    setRightPanelActive(true);
  };

  const handleSignInClick = () => {
    setRightPanelActive(false);
  };
  const IsForgot = useSelector((state) => state.forgetPasswordSlice.success);
  const { user, loading, error, success, token } = useSelector(
    (state) => state.loginSlice
  );

  useEffect(() => {
    if (success) {
      const userData = {
        ModifyRegDate: user.ModifiedRegDate,
        Username: user.Username,
        DefaultCentre: user.DefaultCentreID,
        ShowDashboard: user.ShowDashboard,

        SkipMicLabEntry: user.SkipMicLabEntry,
      };

      window.localStorage.setItem("token", token);
      const encryptedUserData = encryptData(userData, "yourSecretKey");
      window.localStorage.setItem("user_Data", encryptedUserData);
      navigate("/");
    }
  }, [success]);

  const [credentials, setCredentials] = useState({
    UserName: "",
    username: "",
    Mobile: "",
    OTP: "",
    Password: "",
    ConfirmPassword: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const validate = () => {
    const newErrors = {};

    if (!credentials?.username?.trim()) {
      newErrors.username = "Username is required";
    }
    if (!credentials?.password?.trim()) {
      newErrors.password = "Password is required";
    }

    if (
      !credentials?.password?.trim() &&
      !credentials?.ConfirmPassword?.trim() &&
      credentials?.password?.trim() !== credentials?.ConfirmPassword?.trim()
    ) {
      toast.error("Confirm Password is not same as password");
      newErrors.password = "Password Does not match";
    }

    setErrors(newErrors);
    return Object?.keys(newErrors)?.length === 0;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "UserName" || name === "username") {
      setCredentials({
        ...credentials,
        UserName: value,
        username: value,
      });
    } else {
      setCredentials({
        ...credentials,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      dispatch(
        signInAction({
          username: credentials.username,
          password: credentials.password,
        })
      );
    }
  };

  const handleForget = (e) => {
    e.preventDefault();
    const Api = "ForgetPasswordController/ForgetPassword";
    dispatch(forgetPasswordAction({ credentials, Api }));
  };
  const handleKeyDown = (e) => {
    if (e?.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleReset = (e) => {
    e.preventDefault();
    const Api = "ForgetPasswordController/ResetPassword";
    dispatch(forgetPasswordAction({ credentials, Api }));
    navigate("/login");
  };

  const handleOtpChange = (newOtp) => {
    setCredentials({
      ...credentials,
      OTP: newOtp,
    });
  };

  return (
    <div className="main-login-outer-Container">
      <div
        className={`container ${
          isRightPanelActive ? "right-panel-active" : ""
        }`}
        id="container"
      >
        <div className="form-container sign-up-container">
          {isRightPanelActive && (
            <div className="login-form">
              {!IsForgot ? (
                <div className="login-form">
                  <Link to="/">
                    <img
                      className="logoStyle mb-4"
                      src={logoitdose}
                      alt="logo"
                    />
                  </Link>
                  <h5 className="logo-title mb-4"> Enter Details to get OTP</h5>

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
                      className="btn btn-sm btn-primary btn-block login-button mb-3"
                      onClick={handleForget}
                      disabled={loading}
                    >
                      Send OTP
                    </button>
                    <span
                      className="forgetpassword"
                      onClick={() => {
                        handleSignInClick();
                      }}
                    >
                      Back to login
                    </span>
                  </div>
                </div>
              ) : (
                <div className="login-form">
                  <Link to="/">
                    <img
                      className="logoStyle mb-4"
                      src={logoitdose}
                      alt="logo"
                    />
                  </Link>
                  <h5 className="logo-title mb-3">
                    Enter OTP and updated password
                  </h5>

                  <div className="main-login-input">
                    <div className="icondiv">
                      <i
                        className="fas fa-key mt-2"
                        style={{ rotate: "135deg", transform: "scale(1,-1)" }}
                      />
                    </div>
                    <div className="maindiv">
                      <OtpInput length={4} onChange={handleOtpChange} />
                    </div>
                  </div>
                  <div className="main-login-input">
                    <div className="icondiv">
                      <i className="fas fa-lock" />
                    </div>
                    <div className="maindiv">
                      <Input
                        type={showPass ? "test" : "password"}
                        id="Password"
                        className="form-control"
                        name="Password"
                        value={credentials?.Password}
                        lable={t("Password")}
                        placeholder=" "
                        onChange={handleChange}
                      />
                      <i
                        class={`fa ${
                          showPass ? "fa-eye" : "fa-eye-slash"
                        } key-icon`}
                        onClick={() => setShowPass(!showPass)}
                      ></i>
                    </div>
                  </div>
                  <div className="main-login-input">
                    <div className="icondiv">
                      <i className="fas fa-lock" />
                    </div>
                    <div className="maindiv">
                      <Input
                        type={cShowPass ? "test" : "password"}
                        id="ConfirmPassword"
                        className="form-control"
                        name="ConfirmPassword"
                        value={credentials?.ConfirmPassword}
                        lable={t("ConfirmPassword")}
                        placeholder=" "
                        onChange={handleChange}
                      />
                      <i
                        class={`fa ${
                          cShowPass ? "fa-eye" : "fa-eye-slash"
                        } key-icon`}
                        onClick={() => setCShowPass(!cShowPass)}
                      ></i>
                    </div>
                  </div>

                  <div className="main-login-button">
                    <button
                      className="btn btn-sm btn-primary btn-block login-button mb-3"
                      onClick={handleReset}
                      disabled={loading}
                    >
                      Change Password
                    </button>
                    <span
                      className="forgetpassword"
                      onClick={() => {
                        handleSignInClick();
                        dispatch(resetState());
                      }}
                    >
                      Back to login
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="form-container sign-in-container">
          {!isRightPanelActive && (
            <div className="login-form">
              <img className="logoStyle mb-4" src={logoitdose} alt="logo" />

              <h5 className="logo-title mb-4">Sign in to start your session</h5>

              <div className="main-login-input">
                <div className="icondiv">
                  <i className="fas fa-user-alt" />
                </div>
                <div className="maindiv">
                  <Input
                    type="text"
                    id="username"
                    className="form-control required-fields"
                    name="username"
                    value={credentials?.username}
                    lable={t("Username")}
                    placeholder=" "
                    onChange={handleChange}
                  />
                  {errors?.username && credentials?.username?.trim() === "" && (
                    <div className="error-message">{errors?.username}</div>
                  )}
                </div>
              </div>
              <div className="main-login-input">
                <div className="icondiv">
                  <i className="fas fa-lock" />
                </div>
                <div className="maindiv-login">
                  <Input
                    type={showPass ? "test" : "password"}
                    id="password"
                    className="form-control required-fields"
                    name="password"
                    value={credentials?.password}
                    lable={t("Password")}
                    placeholder=" "
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                  />
                  <i
                    class={`fa ${
                      showPass ? "fa-eye" : "fa-eye-slash"
                    } key-icon`}
                    onClick={() => setShowPass(!showPass)}
                  ></i>
                  {errors?.password && credentials?.password?.trim() === "" && (
                    <div className="error-message">{errors?.password}</div>
                  )}
                </div>
              </div>
              <div className="main-login-button">
                <button
                  className="btn btn-sm btn-primary btn-block login-button mb-3"
                  onClick={handleSubmit}
                >
                  Login
                </button>
                <span className="forgetpassword" onClick={handleSignUpClick}>
                  Forget Password
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <img className="login-form-img" src={lab} alt="logo" />
            </div>
            <div className="overlay-panel overlay-right">
              <img className="login-form-img" src={lab} alt="logo" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
