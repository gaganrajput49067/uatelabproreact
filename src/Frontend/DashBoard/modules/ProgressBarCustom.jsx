import React from "react";
import { ProgressBar } from "react-bootstrap";

function ProgressBarCustom({ value, total, text, variant }) {
 
  const findPercentage = () => {
    let val = 0;
    let vals = value ? value : 0;
    val = vals === 0 ? vals : (vals / total) * 100;
    return val.toFixed();
  };

  return (
    <div className="progress-bar-container">
      <div className="d-flex justify-content-between"></div>
      <div className="progress-bar-watermark">
        {text} ({`${findPercentage()}%`})
      </div>
      <ProgressBar
        // striped
        now={findPercentage()}
        variant={variant}
        className="progress-bar-custom info-box-5"
      />
    </div>
  );
}

export default ProgressBarCustom;
