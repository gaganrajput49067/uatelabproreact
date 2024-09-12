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
      <Modal title={title} handleClose={handleShow} top={"25%"}>
        <div className="modal-card">
          <textarea
            style={{ width: "40vw", height: "40vh" }}
            className="form-control-txtarea p-2"
            name="CustomReason"
            onChange={(e) => {
              setPayload(e?.target?.value);
            }}
            value={payload}
            disabled={title === "Remarks" || title === "PricksRemarks"}
          ></textarea>

          {title == "Remarks" || title == "PricksRemarks" ? (
            <></>
          ) : (
            <div className="d-flex justify-content-centre">
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
