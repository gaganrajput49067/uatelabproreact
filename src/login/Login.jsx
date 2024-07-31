import React from "react";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
const Login = () => {
  return (
    <>
      <div className="card">
        <div className="flex flex-column md:flex-row">
          <div className="w-full md:w-5 flex flex-column align-items-center justify-content-center gap-3 py-5">
            <div className="flex flex-wrap justify-content-center align-items-center gap-2">
              <label className="w-6rem">Username</label>
              <InputText id="username" type="text" className="w-12rem" />
            </div>
            <div className="flex flex-wrap justify-content-center align-items-center gap-2">
              <label className="w-6rem">Password</label>
              <InputText id="password" type="password" className="w-12rem" />
            </div>
            <Button
              label="Login"
              icon="pi pi-user"
              className="w-10rem mx-auto"
            ></Button>
          </div>
         
        </div>
      </div>
    </>
  );
};

export default Login;
