import React, { useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../utils/axiosInstance";
import { getTrimmedData } from "../../utils/helpers";
import Modal from "../../components/Modal/Modal";
const HelpMenuModal = ({
  show,
  handleClose,
  Edit,
  Value,
  getHelpMenu,
  state,
  data,
}) => {
  const [formData, setFormData] = useState(
    Edit
      ? {
          MenuName: state?.MenuName,
          IsActive: "1",
          MenuId: state?.HelpMenuId,
          isBold: "0",
        }
      : {
          MenuName: "",
          IsActive: "1",
          isBold: "0",
        }
  );

  const { t } = useTranslation();
  const AddHelp = () => {
    axiosInstance
      .post(
        Edit
          ? "Investigations/UpdateHelpMenu"
          : "Investigations/InsertHelpMenu",
        getTrimmedData(formData)
      )
      .then((res) => {
        if (res.data.message) {
          toast.success(res.data.message);
          handleClose();
          getHelpMenu();
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };

  return (
    <Modal
      title={Edit ? t("Update Help Menu") : t("Add New Help Menu")}
      handleClose={handleClose}
    >
      <div className="modal-card">
        <div className="row">
          <h3 style={{ fontWeight: "bold" }}>
            Test Name:{data}
          </h3>
        </div>
        <div className="card">
          <div className="row">
            <div className="col-sm-12">
              <textarea
                style={{ height: "200px",width:"200px",padding:"10px" }}
                maxLength={200}
                type="text"
                placeholder={t("Please Enter Help Menu")}
                onChange={handleChange}
                name="MenuName"
                value={formData?.MenuName}
              ></textarea>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <input
                type="checkbox"
                name="isBold"
                onChange={handleChange}
                checked={formData?.isBold === "1" ? true : false}
              />
              <label className="ml-2">IsBold</label>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            {Edit ? (
              <button
                type="button"
                className="btn btn-block btn-success btn-sm"
                id="btnSave"
                onClick={AddHelp}
              >
                {t("Update")}
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-block btn-success btn-sm"
                id="btnSave"
                onClick={AddHelp}
              >
                {t("Save")}
              </button>
            )}
          </div>
          <div className="col-sm-6">
            <button
              type="button"
              className="btn btn-block btn-danger btn-sm"
              id="btnSave"
              onClick={() => handleClose()}
            >
              {t("Close")}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default HelpMenuModal;
