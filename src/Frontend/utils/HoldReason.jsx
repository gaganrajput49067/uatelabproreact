import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Input from "../../components/CommonComponent/Input";
import Modal from "../../components/Modal/Modal";
const HoldReason = ({ showHold, setShowHold, handleHold }) => {
  console.log(showHold);
  const { t } = useTranslation();
  return (
    <>
      <Modal
        title={t(`Enter Hold Reason for ( ${showHold?.data?.VisitNo} )`)}
        handleClose={setShowHold}
      >
        <div className="box-body" style={{ width: "500px" }}>
          <div className="row">
            <label className="col-sm-12  col-md-3" htmlFor="Hold Reason">
              {t("Hold Reason")} :
            </label>

            <div className="col-sm-12 col-md-9">
              <Input
                className="select-input-box form-control input-sm"
                type="text"
                value={showHold?.data?.HoldReason}
                onChange={(e) => {
                  setShowHold({
                    ...showHold,
                    data: { ...showHold?.data, HoldReason: e.target.value },
                  });
                }}
              />
            </div>
          </div>
        </div>

        <div className="box-body">
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
                    showHold?.data?.HoldReason?.trim() == "" ||
                    !showHold?.data?.HoldReason
                  )
                    toast.error("Please Enter Hold Reason");
                  else handleHold(showHold?.data, showHold?.index);
                }}
              >
                Hold
              </button>
            </div>
            <div className="col-md-2">
              <button
                type="button"
                className="btn btn-danger btn-block btn-sm"
                onClick={() =>
                  setShowHold({ data: "", show: false, index: -1 })
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

export default HoldReason;
