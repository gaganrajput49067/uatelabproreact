import React from "react";
import nodata from "../../assets/image/nodata.jpg";

const NoRecordFound = () => {
  return (
    <div className="no-record-found">
      <img src={nodata} alt="" />
    </div>
  );
};

export default NoRecordFound;
