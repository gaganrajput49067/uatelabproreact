import React, { useState } from "react";

const PageHead = ({
  children,
  showDrop = false,
  drop = true,
  name,
  border = true,
  showbtn = false,
  content,
}) => {
  const [showContent, setShowContent] = useState(true);
  return (
    <div
      className="main-page-head-container"
      style={border ? { border: "0px" } : {}}
    >
      <div className="main-page-heading">
        <h6 className="mb-0 fw-bold" style={{ letterSpacing: "0px" }}>
          {name}
        </h6>
        <div className="main-heading-content ">
          {showbtn && children}
          {showDrop && (
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
        <div
          className="main-page-content"
          style={border ? { padding: "5px 0 0 0" } : {}}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHead;
