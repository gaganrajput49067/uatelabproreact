import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "../../components/Modal/Modal";
import AuditTrailDataTable from "../Table/AuditTrailDataTable";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
function CustomModal({ visitID, show, onHide }) {
  const [optionData, setOptionData] = useState([]);

  const [auditValue, setAuditValue] = useState({
    VisitNo: visitID,
    ItemId: "",
  });

  const [tableData, setTableData] = useState([]);
  // i18n start

  const { t } = useTranslation();
  // i18n end

  const handleChange = (e) => {
    setAuditValue({
      ...auditValue,
      ItemId: e.target.value,
    });
  };

  const selectOption = () => {
    axiosInstance
      .post("TestData/BindTest", { VisitNo: visitID })
      .then((res) => {
        setOptionData(res?.data?.message);
      })
      .catch((err) => console.log(err));
  };

  const auditApiData = () => {
    axiosInstance
      .post("TestData/GetAuditTrailData", auditValue)
      .then((res) => {
        console.log(res?.data?.message.length);
        if (res?.data?.message.length > 0) {
          setTableData(res?.data?.message);
        } else {
          onHide();
          toast.error("No Data Available");
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    selectOption();
  }, [visitID]);

  useEffect(() => {
    auditApiData();
  }, [auditValue.ItemId]);
  return (
    <Modal title={tableData[0]?.pname} handleClose={onHide}>
      <div className="row mb-2" style={{ width: "800px !important" }}>
        <div className="col-sm-12 w-100">
          <select
            className="select-input-box form-control input-sm"
            onChange={handleChange}
          >
            <option value="">{t("All Test")}...</option>
            {optionData.map((data, index) => (
              <option value={data.ItemId} key={index}>
                {data.ItemName}
              </option>
            ))}
          </select>
        </div>
      </div>
      <AuditTrailDataTable tableData={tableData} />

      <div className="row">
        <div className="col-sm-2">
          <button className="btn btn-block btn-danger btn-sm" onClick={onHide}>
            {t("Close")}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default CustomModal;
