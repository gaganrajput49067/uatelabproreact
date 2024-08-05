import React, { useState } from "react";

const SubPageHead = ({ children, drop = true }) => {
  const [showContent, setShowContent] = useState(true);
  return (
    <div className="main-sub-page-head-container">
      <div className="main-subpage-heading">
        <h6 className="mb-0">Patient Registration</h6>
        <div className="main-heading-content ">
          {drop && (
            <i
              class={`fa ${
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

export default SubPageHead;
