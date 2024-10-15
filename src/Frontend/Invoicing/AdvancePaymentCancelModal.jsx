import Modal from "../../components/Modal/Modal";

function AdvancePaymentCancelModal({
  show,
  handleChange,
  onhide,
  handleCancel,
}) {
  return (
    <Modal handleClose={onhide} size="md" title="Cancel Remark">
      <div className="card" style={{ width: "500px" }}>
        <div className="row">
          <div className="col-sm-12">
            <input
              className="form-control"
              placeholder="Enter Comment to Cancel"
              value={show?.cancelReason}
              name="cancelReason"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-sm-3">
            <button
              className="btn btn-block btn-success btn-sm"
              onClick={handleCancel}
            >
              {"Update"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default AdvancePaymentCancelModal;
