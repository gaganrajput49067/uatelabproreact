import "./Modal.css";

import { useRef } from "react";
const Modal = ({ title, children, handleClose, top, className }) => {
  const modalBoxRef = useRef(null);

  const handleClickOutside = (e) => {
    if (modalBoxRef.current && !modalBoxRef.current.contains(e.target)) {
      handleClose();
    }
  };
  return (
    <div className="Main-Modal-Container" onClick={handleClickOutside}>
      <div
        ref={modalBoxRef}
        className={`main-modal-box ${className}`}
        style={top && top !== "" ? { position: "absolute", top: top } : {}}
      >
        <div className="main-modal-header">
          <h5 className="m-0 fw-bold">{title ?? "Modal Title"}</h5>
          <i className="fa fa-close modal-close" onClick={handleClose}></i>
        </div>
        <div className="main-modal-content">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
