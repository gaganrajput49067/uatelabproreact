import React, { useState } from "react";
import Modal from "../../components/Modal/Modal";

const SampleRemark = ({
  show,
  handleShow,
  state,
  PageName,
  handleSave,
  title,
}) => {
  const [payload, setPayload] = useState(PageName);
  return (
    <>
      <Modal title={title} handleClose={handleShow}>
        <div className="modal-card">
          <div className="row">
            <div className="col-md-12">
              <textarea
           
                className="form-control-txtarea"
                name="CustomReason"
                onChange={(e) => {
                  setPayload(e?.target?.value);
                }}
                value={payload}
                disabled={title === "Remarks" || title === "PricksRemarks"}
              ></textarea>
            </div>
          </div>

       
            {title == "Remarks" || title == "PricksRemarks" ? (
              <></>
            ) : (
              <div className="row">
                <div className="col-sm-6">
                  <button
                    type="button"
                    className="btn btn-block btn-success btn-sm"
                    onClick={() => {
                      handleSave(payload, state?.index, state?.SINNo);
                    }}
                  >
                    Save
                  </button>
                </div>
                <div className="col-sm-6">
                  <button
                    type="button"
                    className="btn btn-block btn-danger btn-sm"
                    onClick={handleShow}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          
        </div>
      </Modal>
    </>
  );
};

export default SampleRemark;
