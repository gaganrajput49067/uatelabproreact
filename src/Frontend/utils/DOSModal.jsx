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
      .post("Booking/GetDosDetails", {
        InvestigationId: id,
        CentreID: LTData?.CentreID,
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
              <th>S.no</th>
              <th>Location Name</th>
              <th>TestCode</th>
              <th>Department Name</th>
              <th>Investigation Name</th>
              <th>Machine Name</th>
              <th>Method</th>
              <th>In_Out_House</th>
              <th>DeleveryDate</th>
              <th>Process Lab</th>
              <th>DayType</th>
              <th>Technician Procesing</th>
              <th>Delevery</th>
              <th>Booking cutoff</th>
              <th>SRA cutoff</th>
              <th>Reporting cutoff</th>
            </tr>
          </thead>
          <tbody>
            {tableData?.map((data, index) => (
              <tr key={index}>
                <td data-title={t("S.no")}>{index + 1}</td>
                <td data-title={t("Location Name")}>
                  {data?.LocationName}&nbsp;
                </td>
                <td data-title={t("TestCode")}>{data?.TestCode}&nbsp;</td>
                <td data-title={t("Department Name")}>
                  {data?.Department}&nbsp;
                </td>
                <td data-title={t("Investigation Name")}>
                  {data?.Testname}&nbsp;
                </td>
                <td data-title={t("Machine Name")}>{data?.Machine}&nbsp;</td>
                <td data-title={t("Method")}>{data?.Method}&nbsp;</td>
                <td data-title={t("In_Out_House")}>
                  {data?.In_Out_House}&nbsp;
                </td>
                <td data-title={t("DeleveryDate")}>
                  {data?.DeleveryDate}&nbsp;
                </td>
                <td data-title={t("Process Lab")}>{data?.ProcessLab}&nbsp;</td>
                <td data-title={t("DayType")}>{data?.DayType}&nbsp;</td>
                <td data-title={t("Technician Procesing")}>
                  {data?.TechnicianProcesing}&nbsp;
                </td>
                <td data-title={t("Delevery")}>{data?.DeleveryDate}&nbsp;</td>
                <td data-title={t("Booking cutoff")}>
                  {data?.Bookingcutoff}&nbsp;
                </td>
                <td data-title={t("SRA cutoff")}>{data?.SRAcutoff}&nbsp;</td>
                <td data-title={t("Reporting cutoff")}>
                  {data?.Reportingcutoff}&nbsp;
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="card-body">
          <div className="row">
            <div className="col-sm-1">
              <button
                type="button"
                className="btn btn-block btn-danger btn-sm"
                onClick={onHandleShow}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Modal>{" "}
    </>
  ) : (
    <Loading />
  );
}

export default DOSModal;
