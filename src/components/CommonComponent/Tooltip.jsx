import React from "react";
import "../../zStyles/Tooltip.css";

const Tooltip = ({ label, children }) => {
  return (
    <div className="tooltip-container">
      <span className="tooltip">{label}</span>
      {children}
    </div>
  );
};

export default Tooltip;
