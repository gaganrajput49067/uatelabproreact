import axios from "axios";
import React from "react";
import { useState } from "react";
import Modal from "../../components/Modal/Modal";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Table from "../../components/Table/Table";
import Loading from "../../components/Loading/Loading";
import { axiosInstance } from "../../utils/axiosInstance";
function DOSModal({ show, onHandleShow, id, LTData }) {
  const [tableData, setTableData] = useState([]);
  const { t } = useTranslation();

  const fetch = () => {
    axiosInstance
      .post("PatientRegistration/GetTestInfo", {
        InvestigationId: id,
      })
      .then((res) => {
        setTableData(res?.data?.message);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetch();
  }, [id]);

  return tableData?.length > 0 ? (
    <>
      <Modal title={"DOS Information"} top={"10%"} handleClose={onHandleShow}>
        <Table>
          <thead className="cf">
            <tr>
              <th>Investigation Name</th>
              <th>Test Name</th>
              <th>Test/Profile</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {tableData?.map((data, index) => (
              <tr key={index}>
                <td data-title={t("Investigation Name")}>{data?.TestName}</td>
                <td data-title={t("Test Name")}>{data?.TestName}&nbsp;</td>
                <td data-title={t("Test/Profile")}>{data?.DataType}&nbsp;</td>
                <td data-title={t("Department")}>{data?.Department}&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="row">
          <div className="col-sm-3">
            <button
              type="button"
              className="btn btn-block btn-danger btn-sm"
              onClick={onHandleShow}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  ) : (
    <Loading />
  );
}

export default DOSModal;
