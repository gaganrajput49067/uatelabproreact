import React from "react";
import Modal from "../../components/Modal/Modal";
function InvestigationCommentMasterModal({ show, handleShow }) {
  return (
    <Modal handleClose={handleShow} title="Investigation Comments">
      <div className="card">
        <div className="col-12">{show?.data}</div>
      </div>
    </Modal>
  );
}

export default InvestigationCommentMasterModal;
