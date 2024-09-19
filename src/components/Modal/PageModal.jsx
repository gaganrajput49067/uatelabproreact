import ReactDOM from "react-dom";
import "./Modal.css";

const PageModal = ({
  title,
  children,
  handleClose,
  zIndex = 2000,
  top,
  className,
}) => {
  return ReactDOM.createPortal(
    <div className="Main-Modal-Container" style={{ zIndex }}>
      <div
        className={`page-main-modal-box ${className}`}
        style={top && top !== "" ? { position: "absolute", top: top } : {}}
      >
        <i className="fa fa-close page-modal-close" onClick={handleClose}></i>
        {children}
      </div>
    </div>,
    document.body // Use React Portal to render outside parent components
  );
};

export default PageModal;
