import React, { useState } from "react";

const SubPageHead = ({ children, drop = true }) => {
  const [showContent, setShowContent] = useState(true);
  return (
    <>
      <div className="main-subpage-heading mt-4">
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
    </>
  );
};

export default SubPageHead;
