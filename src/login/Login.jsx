import React from "react";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import logoitdose from "../assets/image/logoitdose.png"
import BlueBanner from "../assets/image/BlueBanner.jpg"
import './Login.css'; // Make sure to create and import this CSS file

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-box card" style={{backgroundImage:BlueBanner}}>
        <div className="logo-section">
          <img src={logoitdose} alt="itdoseinfosystem logo" className="logo-image" />
          <h1 className="logo-text">ELABPRO</h1>
        </div>
        <div className="login-content">
          <div className="login-field">
            <label className="login-label">Username</label>
            <InputText id="username" type="text" className="login-input" />
          </div>
          <div className="login-field">
            <label className="login-label">Password</label>
            <InputText id="password" type="password" className="login-input" />
          </div>
          <Button
            label="Login"
            icon="pi pi-user"
            className="login-button"
          ></Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
