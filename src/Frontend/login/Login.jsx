import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Input from "../../components/CommonComponent/Input";
import logoitdose from "../../assets/image/logoitdose.png";
import lab from "../../assets/image/Lab.jpg";
import "../../zStyles/login.css";
import { signInAction } from "../../store/reducers/loginSlice/loginSlice";

const Login = () => {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, loading, error, success } = useSelector(
    (state) => state.loginSlice
  );

  useEffect(() => {
    if (success) {
      window.localStorage.setItem("Username", user.Username);
      navigate("/");
    }
  }, [success, navigate]);

  const [credentials, setCredentials] = useState({
    username: "",
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

    setErrors(newErrors);
    return Object?.keys(newErrors)?.length === 0;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      dispatch(signInAction(credentials));
    }
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
                  id="username"
                  className="form-control required-fields"
                  name="username"
                  value={credentials?.username}
                  lable={t("Username")}
                  placeholder=" "
                  onChange={handleChange}
                  error={
                    errors?.username && credentials?.username?.trim() === ""
                  }
                  errorMessage={errors?.username}
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
                  id="password"
                  className="form-control required-fields"
                  name="password"
                  value={credentials?.password}
                  lable={t("Password")}
                  placeholder=" "
                  onChange={handleChange}
                  error={
                    errors?.password && credentials?.password?.trim() === ""
                  }
                  errorMessage={errors?.password}
                />
              </div>
            </div>
            <div className="main-login-button">
              <button
                className="btn btn-sm btn-primary btn-block login-button"
                onClick={handleSubmit}
                disabled={loading}
              >
                Login
              </button>
              <span
                className="forgetpassword"
                onClick={() => navigate("/ForgetPassword")}
              >
                Forget Password
              </span>
            </div>
          </div>
        </div>
        <div className="login-style-container">
          <img className="login-form" src={lab} alt="logo" />
        </div>
      </div>
    </div>
  );
};

export default Login;
