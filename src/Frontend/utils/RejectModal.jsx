import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useState } from "react";
import { useEffect } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import Modal from "../../components/Modal/Modal";

function RejectModal({ show, handleShow, data, TableData }) {
  const [dropDown, setDropDown] = useState([]);
  const { t } = useTranslation();
  const [payload, setPayload] = useState({
    Reason: "",
    CustomReason: "",
  });

  const getDropDown = () => {
    axiosInstance
      .post("Global/getGlobalData", {
        Type: "RejectReason",
      })
      .then((res) => {
        let data = res.data.message;

        let selectdata = data.map((ele) => {
          return {
            value: ele.FieldDisplay,
            label: ele.FieldDisplay,
          };
        });
        selectdata.unshift({ label: "other", value: "other" });
        setDropDown(selectdata);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const handleSelect = (event) => {
    const { name, value } = event?.target;
    if (value !== "other") {
      setPayload({ ...payload, [name]: value, CustomReason: "" });
    } else {
      setPayload({ ...payload, [name]: value });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const handleReason = () => {
    return payload?.Reason === "other"
      ? payload?.CustomReason
        ? true
        : false
      : payload?.Reason;
  };

  const handleSubmit = () => {
    if (handleReason()) {
      axiosInstance
        .post("SC/SampleRejection", {
          data: [
            {
              ...data,
              Reason: payload?.Reason,
              CustomReason: payload?.CustomReason,
            },
          ],
        })
        .then((res) => {
          handleShow();
          toast.success(res.data?.message);
          TableData("");
          getRejectCount();
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
        });
    } else {
      toast.error("Please Choose Reason");
    }
  };

  useEffect(() => {
    getDropDown();
  }, []);
  return (
    <Modal
      show={show}
      title={"Select Reason to Reject Sample"}
      top={"10%"}
      handleClose={handleShow}
    >
      <div className="modal-card" style={{ width: "500px" }}>
        <div className="row">
          <div className="col-12">
            <SelectBox
              options={[{ label: "Select", value: "" }, ...dropDown]}
              name="Reason"
              selectedValue={payload?.Reason}
              onChange={handleSelect}
              lable="Select Reason"
            />
          </div>
          {payload?.Reason === "other" && (
            <div className="col-12">
              <textarea
                rows={3}
                className="form-control"
                name="CustomReason"
                onChange={handleChange}
                value={payload?.CustomReason}
              ></textarea>
            </div>
          )}
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-sm-2">
              <button
                type="button"
                className="btn btn-block btn-danger btn-sm "
                onClick={handleSubmit}
              >
                {t("Reject")}
              </button>
            </div>
            <div className="col-sm-2">
              <button
                type="button"
                className="btn btn-block  btn-secondary btn-sm "
                onClick={handleShow}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default RejectModal;
