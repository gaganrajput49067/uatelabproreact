import "../../zStyles/login.css";
import logoitdose from "../../assets/image/logoitdose.png";
import { Link } from "react-router-dom";
import Input from "../../components/CommonComponent/Input";
import { useTranslation } from "react-i18next";

const Login = () => {
  const [t] = useTranslation();
  return (
    <div className="main-login-outer-Container">
      <div className="main-login-inner-container">
        <div className="login-form-container">
          <div className="login-form">
            <Link to="/">
              <img className="logoStyle" src={logoitdose} />
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
                  id="text"
                  name="userName"
                  lable={t("Username")}
                  placeholder=" "
                  // value={values?.userName}
                  // onChange={handleChange}
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
                  className="form-control"
                  id="text"
                  name="password"
                  lable={t("Password")}
                  placeholder=" "
                  // value={values?.userName}
                  // onChange={handleChange}
                />
              </div>
            </div>
            <div className="main-login-button">
              <button
                className=" btn btn-sm btn-primary btn-block login-button"
                // onClick={handleSubmit}
              >
                Login
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
