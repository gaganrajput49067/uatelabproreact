import React from "react";
import Modal from "../../components/Modal/Modal";

const MedicalHistory = ({ handleClose }) => {
  return (
    <Modal title={"Medical History"} handleClose={handleClose}>
      <div className="row" style={{ width: "800px" }}>
        <div
          className="col-md-6 d-flex"
          style={{ flexDirection: "column", width: "50%" }}
        >
          <label htmlFor="medicalHistory">New Medical History</label>
          <textarea
            className="p-1"
            id="medicalHistory"
            rows="4"
            cols="50"
            placeholder="Enter medical history..."
            style={{ height: "200px" }}
          ></textarea>
          <div className="col-sm-5 m-0 mt-2 p-0">
            <button className="btn btn-success p-0 m-0">Create New</button>
          </div>
        </div>
        <div
          className="d-flex"
          style={{
            flexDirection: "column",
            width: "48%",
          }}
        >
          <label htmlFor="allergies">Previous Medical History</label>
          <div
            className="d-flex"
            style={{
              flexDirection: "column",
              width: "100%",
              height: "240px",
              overflowX: "auto",
              padding: "5px",
            }}
          >
            <MedicalHistorySpan />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MedicalHistory;

function MedicalHistorySpan() {
  return (
    <div
      className="d-flex w-100 simple-box-container"
      style={{
        flexDirection: "column",
      }}
    >
      <div className="d-flex justify-content-between">
        <span className="col-sm-7 small">28-Aug-2023 </span>
        <i
          class="fa fa-trash pointer pr-1 pt-1"
          title="Remove this medical History"
          style={{ fontSize: "0.9rem", color: "inherit" }}
        ></i>
      </div>
      <span className="col-sm-12">Medical History</span>
    </div>
  );
}
