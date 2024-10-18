import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import errorpage from "./errorpage.png";
import "./BlankPage.css"; // Assuming you have a separate CSS file

function BlankPage() {
  const navigate = useNavigate();

  return (
    <div className="warpper">
      <div className="content-wrapper">
        <div
          style={{
            height: "100%",
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div className="row">
            <div className="col-sm-12">
              <div className="errorContainer">
                <img src={errorpage} alt="Error" />
                <p className="error_content">404!</p>
                <p className="error_content">Uh Ohh ..Page Not Found!</p>
                <p className="errorParacontent">
                  Sorry, the page you are looking for does not exist or has been
                  moved.
                </p>
                <Link className="backLink" onClick={() => navigate(-1)}>
                  Back To Last Page
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlankPage;
