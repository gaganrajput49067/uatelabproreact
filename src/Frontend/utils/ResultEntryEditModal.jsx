import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../../components/Modal/Modal";
import Table from "../../components/Table/Table";
import Input from "../../components/CommonComponent/Input";

function ResultEntryEditModal({ show, handleClose, handleSave }) {
  const [EditData, setEditData] = useState(show?.data);
  // i18n start

  const { t } = useTranslation();

  // i18n end
  const handleChange = (e) => {
    const { name, value } = e.target;
    let data = EditData?.DisplayReading
      ? EditData?.DisplayReading.split("-")
      : ["", ""];

    if (name === "MinValue") {
      data[0] = value;
      const val = `${data[0]}-${data[1]}`;
      setEditData({ ...EditData, [name]: value, DisplayReading: val });
    }
    if (name === "MaxValue") {
      data[1] = value;
      const val = `${data[0]}-${data[1]}`;
      setEditData({ ...EditData, [name]: value, DisplayReading: val });
    }
    if (name === "ReadingFormat") {
      setEditData({ ...EditData, [name]: value });
    }
  };

  return (
    <Modal title={"Change Paramenter Value"} handleClose={handleClose}>
      <div className="card">
        <div className="box-body">
          <Table>
            <thead className="cf">
              <tr>
                <th>{t("Min Value")}</th>
                <th>{t("Max Value")}</th>
                <th>{t("Unit Type")}</th>
                <th>{t("Display Reading")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td data-title={t("Min Value")}>
                  <Input
                    type="text"
                    className="select-input-box form-control input-sm"
                    name="MinValue"
                    value={EditData?.MinValue}
                    onChange={handleChange}
                  />
                </td>
                <td data-title={t("Max Value")}>
                  <Input
                    type="text"
                    className="select-input-box form-control input-sm"
                    name="MaxValue"
                    value={EditData?.MaxValue}
                    onChange={handleChange}
                  />
                </td>
                <td data-title={t("Unit Type")}>
                  <Input
                    type="text"
                    className="select-input-box form-control input-sm"
                    name="ReadingFormat"
                    value={EditData?.ReadingFormat}
                    onChange={handleChange}
                  />
                </td>
                <td data-title={t("Display Reading")}>
                  <Input
                    type="text"
                    className="select-input-box form-control input-sm"
                    name="DisplayReading"
                    value={EditData?.DisplayReading}
                    onChange={handleChange}
                    readOnly
                  />
                </td>
              </tr>
            </tbody>
          </Table>
        </div>

        <div className="row">
          <div className="col-sm-2">
            <button
              type="button"
              className="btn btn-success btn-sm"
              onClick={() => handleSave(EditData, "Edit")}
            >
              {t("Save")}
            </button>
          </div>
          <div className="col-sm-2">
            <button
              type="button"
              className="btn btn-danger btn-sm"
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

export default ResultEntryEditModal;
