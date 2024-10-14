import React, { useState } from "react";
import { Link } from "react-router-dom";

const LinkPageHead = ({
  children,
  showDrop,
  name,
  border = true,
  to,
  title,
  state,
}) => {
  return (
    <div
      className="main-page-head-container"
      style={border ? { border: "0px" } : {}}
    >
      <div className="main-page-heading-link">
        <h6 className="mb-0">{name}</h6>
        {showDrop && (
          <div className="main-heading-content-link">
            <Link to={to} style={{ float: "right" }} state={state}>
              {title}
            </Link>
          </div>
        )}
      </div>

      <div
        className="main-page-content"
        style={border ? { padding: "5px 0 0 0" } : {}}
      >
        {children}
      </div>
    </div>
  );
};

export default LinkPageHead;
