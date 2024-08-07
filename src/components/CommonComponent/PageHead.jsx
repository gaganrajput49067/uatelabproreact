import React, { useState } from "react";

const PageHead = ({ children, drop = true }) => {
  const [showContent, setShowContent] = useState(true);
  return (
    <div className="main-page-head-container">
      <div className="main-page-heading">
        <h6 className="mb-0">Patient Registration</h6>
        <div className="main-heading-content ">
          {drop && (
            <i
              className={`fa ${
                showContent ? "fa-angle-up" : "fa-angle-down"
              } pointer mr-2`}
              onClick={() => setShowContent(!showContent)}
            ></i>
          )}
        </div>
      </div>
      {showContent && drop && (
        <div className="main-page-content">{children}</div>
      )}
    </div>
  );
};

export default PageHead;
