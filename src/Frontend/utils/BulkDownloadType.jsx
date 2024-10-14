import React, { useState } from "react";
import Modal from "../../components/Modal/Modal";

function BulkDownloadType({ show, onHide, onSubmit }) {
  const [dataForEmail, setDataForEmail] = useState({
    letterHead: 0,
    Signature: 0,
  });

  return (
    <Modal title="BulkDownloadType" handleClose={onHide}>
      <div className="card">
        <div className="row">
          <div className="col-sm-3">
            <label htmlFor="letterHead">With LetterHead</label>
            <input
              type={"checkbox"}
              checked={dataForEmail?.letterHead}
              name="letterHead"
              id="letterHead"
              onChange={(e) => {
                setDataForEmail({
                  ...dataForEmail,
                  [e.target.name]: e.target.checked ? 1 : 0,
                });
              }}
            />
          </div>
        </div>

        <div className="row">
          <button
            className="btn btn-sm btn-success mx-2"
            onClick={() => onSubmit(dataForEmail)}
          >
            Download
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default BulkDownloadType;
