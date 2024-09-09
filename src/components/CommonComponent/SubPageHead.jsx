import React, { useState } from "react";

const SubPageHead = ({ title, children, drop = true, smallHeignt = false }) => {
  const [showContent, setShowContent] = useState(true);
  return (
    <>
      <div
        className="main-subpage-heading mt-2"
        // style={{ height: smallHeignt ? "20px" : "50px" }}
      >
        <h6 className="mb-0">{title}</h6>
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
    </>
  );
};

export default SubPageHead;
