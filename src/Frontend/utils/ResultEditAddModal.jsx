import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../utils/axiosInstance";
import Modal from "../../components/Modal/Modal";
import TextEditor from "../../components/CommonComponent/TextEditor";

function ResultEditAddModal({ show, handleClose, handleSave }) {
  const [EditTable, setEditTable] = useState(false);
  const [EditData, setEditData] = useState(show?.data);
  const [SelectedBox, setSelectedBox] = useState([]);

  const { t } = useTranslation();

  // i18n end
  const getInvestigationsListData = () => {
    axiosInstance
      .post("InvestigationCommentMaster/getInvestigationCommentData", {
        InvestigationID: Array.isArray(show?.data?.labObservationID)?show?.data?.labObservationID:[show?.data?.labObservationID],
        Template: "",
        TemplateText: "",
      })
      .then((res) => {
        if (res.status === 200) {
          setSelectedBox(res.data.message);
        }
        if (res?.data?.message.length === 0) {
          toast.success(t("No Data Found"));
        }
      })
      .catch((err) => console.log(err));
  };

  const handleDropdown = (e) => {
    const { value } = e.target;
    setEditTable(true);
    setEditData({ ...EditData, COMMENT: value });
  };

  useEffect(() => {
    getInvestigationsListData();
  }, []);

  const handleChange = (data) => {
    setEditData({ ...EditData, COMMENT: data });
  };

  return (
    <Modal handleClose={handleClose}>
      <div className="card card-center">
        <div className="row mb-3">
          <label className="col-sm-2">{t("Select Comment")}:</label>
          <div className="col-sm-10 m-0 p-0 ">
            <select
              className="select-input-box form-control input-sm "
              onChange={handleDropdown}
            >
              <option>{t("Select")}</option>
              {SelectedBox?.map((ele) => (
                <option value={ele?.TemplateText}>{ele?.Template}</option>
              ))}
            </select>
          </div>
        </div>
        <TextEditor
          value={EditData?.COMMENT}
          EditTable={EditTable}
          setEditTable={setEditTable}
          setValue={handleChange}
        />
        <div className="row">
          <div className="col-sm-2">
            <button
              type="button"
              className="btn btn-block btn-success btn-sm"
              onClick={() => handleSave(EditData, "AddComment")}
            >
              {t("Save")}
            </button>
          </div>
          <div className="col-sm-2">
            <button
              type="button"
              className="btn btn-block btn-danger btn-sm"
              onClick={handleClose}
            >
              {t("Close")}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ResultEditAddModal;
