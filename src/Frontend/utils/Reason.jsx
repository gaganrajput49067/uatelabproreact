import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Modal from "../../components/Modal/Modal";
import Input from "../../components/CommonComponent/Input";

const Reason = ({
  show,
  reason,
  setReason,
  handleNotApproveRemark,
  handleResultSubmit,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <Modal
        title={`Please Provide ${reason?.type} Reason for "${reason?.Hdata?.PackageName}"`}
        className="table-sm"
        handleClose={setReason}
      >
        <div className="">
          <div className="row">
            <label className="col-sm-12  col-md-3" htmlFor="Cancel Reason">
              {t("Reason")} :
            </label>

            <div className="col-sm-12 col-md-9">
              <Input
                className="select-input-box form-control input-sm"
                type="text"
                name={
                  reason?.type == "Hold" ? "HoldReason" : "NotApproveRemark"
                }
                id={reason?.type == "Hold" ? "HoldReason" : "NotApproveRemark"}
                value={
                  reason?.type == "Hold"
                    ? reason?.Hdata?.HoldReason
                    : reason?.Hdata?.NotApproveRemark
                }
                onChange={(e) => handleNotApproveRemark(e, reason?.Hdata)}
              />
            </div>
          </div>

          <div
            className="row"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <div className="col-md-3">
              <button
                type="button"
                className="btn btn-primary btn-block btn-sm"
                onClick={() => {
                  if (
                    reason?.Hdata?.HoldReason ||
                    reason?.Hdata?.NotApproveRemark
                  ) {
                    handleResultSubmit(reason?.type, reason?.Hdata);
                    setReason({
                      ...reason,
                      HoldShow: false,
                      Hdata: "",
                      type: "",
                    });
                  } else {
                    toast.error(`${reason?.type} Reason is Required`);
                  }
                }}
              >
                {reason?.type}
              </button>
            </div>
            <div className="col-md-3">
              <button
                type="button"
                className="btn btn-primary btn-block btn-sm"
                onClick={() =>
                  setReason({
                    ...reason,
                    HoldShow: false,
                    Hdata: "",
                    type: "",
                  })
                }
              >
                {t("Cancel")}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Reason;
