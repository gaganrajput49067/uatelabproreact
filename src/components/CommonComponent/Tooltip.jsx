import React from "react";
import "../../zStyles/Tooltip.css";

const Tooltip = ({ label, children, className, position = "top" }) => {
  return (
    <div className={`tooltip-container ${className}`}>
      {children}
      <div
        className={`tooltip ${
          position === "bottom" ? "tooltip-bottom" : "tooltip-top"
        }`}
      >
        {label}
      </div>
    </div>
  );
};

export default Tooltip;
