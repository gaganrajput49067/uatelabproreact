import React, { useState } from "react";
import { Link } from "react-router-dom";

const LinkPageHead = ({
  children,
  showDrop,
  name,
  border = true,
  link,
  title,
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
            <a href={link} style={{ float: "right" }}>
              {title}
            </a>
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
