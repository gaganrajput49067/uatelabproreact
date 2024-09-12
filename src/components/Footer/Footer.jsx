import React from "react";

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-left">
          <strong>
            Copyright © {new Date().getFullYear()}{" "}
            <a href="http://uat.elabpro.in" target="_blank" rel="noopener noreferrer">
              <b>eLabPro.IN</b>
            </a>
            . All rights reserved.
          </strong>
        </div>
        <div className="footer-right">
          <b>Version</b> 1.0.0
        </div>
      </div>
    </footer>
  );
};

export default Footer;
