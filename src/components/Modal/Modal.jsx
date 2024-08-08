import "./Modal.css";

const Modal = ({ title, children, handleClose }) => {
  return (
    <div className="Main-Modal-Container">
      <div className="main-modal-box">
        <div className="main-modal-header">
          <h6 className="m-0">{title ?? "Modal Title"}</h6>
          <i className="fa fa-close modal-close" onClick={handleClose}></i>
        </div>
        <div className="main-modal-content">{children}</div>
      </div>
    </div>
  );
};

export default Modal;