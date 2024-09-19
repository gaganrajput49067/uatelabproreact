import React, { useEffect } from "react";
import Modal from "../../components/Modal/Modal";

const IframeModal = ({ title, handleClose, children }) => {
  useEffect(() => {}, []);

  return (
    <Modal title={title} handleClose={handleClose} className={"table-xl"}>
      <div style={{ height: "90vh" }}>{children}</div>
    </Modal>
  );
};

export default IframeModal;
