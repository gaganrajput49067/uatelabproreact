import { Dock } from "primereact/dock";
import React from "react";

import { useNavigate } from "react-router-dom";
const Footer = () => {
  
  const navigate = useNavigate();
  const items = [
    {
      label: "PatientRegister",
      icon: () => (
        <img
          alt="PatientRegister"
          src="https://img.icons8.com/3d-fluency/94/microscope.png"
          className="dock-item"
        />
      ),
      command: () => navigate("/PatientRegister"),
    },
    {
      label: "SampleCollection",
      icon: () => (
        <img
          alt="SampleCollection"
          src="https://img.icons8.com/arcade/64/blood-sample.png"
          className="dock-item"
        />
      ),
      command: () => navigate("/SampleCollection"),
    },
    {
      label: "DepartmentReceive",
      icon: () => (
        <img
          alt="DepartmentReceive"
          src="https://img.icons8.com/emoji/48/department-store.png"
          className="dock-item"
        />
      ),
      command: () => navigate("/DepartmentReceive"),
    },
    {
      label: "ResultEntry",
      icon: () => (
        <img
          alt="ResultEntry"
          src="https://img.icons8.com/arcade/64/report-card.png"
          className="dock-item"
        />
      ),
      command: () => navigate("/ResultEntry"),
    },
    {
      label: "DispatchReport",
      icon: () => (
        <img
          alt="Dispatch Report"
          src="https://img.icons8.com/flat-round/50/graph-report.png"
          className="dock-item"
        />
      ),
      command: () => navigate("/DispatchReport"),
    },
    {
      label: "ReceiptReprint",
      icon: () => (
        <img
          alt="ReceiptReprint"
          src="https://img.icons8.com/fluency/48/cash-receipt.png"
          className="dock-item"
        />
      ),
      command: () => navigate("/ReceiptReprint"),
    },
  ];
  return (
    <footer className="main-footer">
      {/* <Dock model={items} position={"bottom"} className="Dock ss-none" /> */}
      <div className="footer-left">
        <strong>
          Copyright © {new Date().getFullYear()}{" "}
          <a
            href="http://uat.elabpro.in"
            target="_blank"
            rel="noopener noreferrer"
          >
            <b>eLabPro.IN</b>
          </a>
          &nbsp; | &nbsp;All rights reserved.
        </strong>
      </div>
      <div className="footer-right">
        <b>Version</b> 1.0.0
      </div>
    </footer>
  );
};

export default Footer;
