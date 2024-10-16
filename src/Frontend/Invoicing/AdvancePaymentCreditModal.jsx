import React, { useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import Loading from "../../components/Loading/Loading";
import Input from "../../components/CommonComponent/Input";
import Modal from "../../components/Modal/Modal";
const AdvancePaymentCreditModal = ({
  onhandleClose,
  CreditModalShow,
  setCreditModalShow,
}) => {
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    CreditDebitNoteType: "",
  });

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setPayload({ ...payload, [name]: value });
  };

  const handleSave = () => {
    if (payload?.CreditDebitNoteType == "") {
      toast.error("Please Enter CreditDebitCardType.");
    } else {
      setLoading(true);
      axiosInstance
        .post("Accounts/SaveCreditDebitNote", {
          CreditDebitNote: payload?.CreditDebitNoteType,
        })
        .then((res) => {
          toast.success(res?.data?.message);
          setCreditModalShow(false);
          onhandleClose();
          setLoading(false);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something went wrong"
          );
        });
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        title="New Credit/Debit Note Type"
        handleClose={() => setCreditModalShow(false)}
      >
        <div className="card" style={{ width: "500px" }}>
          <div className="row">
            <div className="col-sm-12">
              <Input
                id="CreditDebitNoteType"
                lable="Credit Debit Note Type"
                placeholder=" "
                name="CreditDebitNoteType"
                max={30}
                value={payload?.CreditDebitNoteType}
                onChange={handleChange}
              />
            </div>{" "}
          </div>
          <div className="row">
            {loading ? (
              <Loading />
            ) : (
              <div className="col-sm-3">
                <button
                  className="btn btn-block btn-sm btn-success"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};
export default AdvancePaymentCreditModal;
