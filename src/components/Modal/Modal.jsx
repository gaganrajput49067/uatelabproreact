import ReactDOM from "react-dom";
import "./Modal.css";

const Modal = ({
  title,
  children,
  handleClose,
  zIndex = 1000,
  top,
  className,
}) => {
  return ReactDOM.createPortal(
    <div className="Main-Modal-Container" style={{ zIndex }}>
      <div
        className={`main-modal-box ${className}`}
        style={top && top !== "" ? { position: "absolute", top: top } : {}}
      >
        <div className="main-modal-header">
          <h5 className="m-0 fw-bold">{title ?? "Modal Title"}</h5>
          <i className="fa fa-close modal-close" onClick={handleClose}></i>
        </div>
        <div className="main-modal-content">{children}</div>
      </div>
    </div>,
    document.body // Use React Portal to render outside parent components
  );
};

export default Modal;
