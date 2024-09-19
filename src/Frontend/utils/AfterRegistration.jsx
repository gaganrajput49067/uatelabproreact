import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import Table from "../../components/Table/Table";
import { Link } from "react-router-dom";
import IframeModal from "./IframeModal";
import EditPatientDetails from "../Laboratory/EditPatientDetails";
import PageModal from "../../components/Modal/PageModal";
import EditPatientInfo from "../Laboratory/EditPatientInfo";
import { axiosInstance, axiosReport } from "../../utils/axiosInstance";
// import IframeModal from "./IframeModal";

const AfterRegistration = ({ handleClose, data }) => {
  const [showTest, setShowTest] = useState(false);
  const [editDetails, setEditDetails] = useState(false);
  const [infoData, setInfoData] = useState(null);

  useEffect(() => {
    axiosInstance
      .post("PatientRegistration/getDataEditByLabNo", {
        LabNo: data?.VisitNo,
      })
      .then((res) => {
        setInfoData(res?.data?.message);
      });
  }, []);

  const getConcern = (id) => {
    axiosInstance
      .post("ConcentFormMaster/generateConcentForm", {
        LedgerTransactionIDHash: id,
      })
      .then((res) => {
        window.open(res?.data?.Url, "_blank");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
      });
  };

  const getPndtForm = (id) => {
    axiosInstance
      .post("PndtFormMaster/generatPndtForm", {
        LedgerTransactionIDHash: id,
      })
      .then((res) => {
        window.open(res?.data?.Url, "_blank");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
      });
  };

  function printReport() {
    axiosReport
      .post("getReceipt", {
        LedgerTransactionIDHash: data?.ledgertransactionID,
      })
      .then((res) => {
        window.open(res?.data?.Url, "_blank");
      })
      .catch((err) => {
        toast.error(
          err?.data?.response?.message
            ? err?.data?.response?.message
            : t("Error Occured")
        );
      });
  }
  return (
    <>
      <Modal
        title={"Patient Registration Successfull"}
        handleClose={handleClose}
        className={"table-lg"}
      >
        {showTest && (
          <PageModal
            title={"Edit Test Details"}
            data={data?.ledgertransactionID}
            handleClose={() => {
              setShowTest(false);
            }}
          >
            <EditPatientDetails modalData={data} />
          </PageModal>
        )}
        {editDetails && (
          <PageModal
            title={"Edit Test Details"}
            data={data?.ledgertransactionID}
            handleClose={() => {
              setEditDetails(false);
            }}
          >
            <EditPatientInfo modalData={data} />
          </PageModal>
        )}
        <div className="card">
          <p className="reg-check-para">
            <i class="fa fa-check-circle" aria-hidden="true">
              &nbsp;
            </i>
            Thank you for registering with our Lab. Your patient ID is:{" "}
            <strong>{data?.VisitNo}</strong>
          </p>
          <label className="reg-check-label">Patient Details</label>
          <div className="row">
            <p className="col-sm-3">
              <strong>Name:</strong>&nbsp;&nbsp;
              {infoData?.patientDetail[0]?.FirstName} &nbsp;{" "}
              {infoData?.patientDetail[0]?.LastName}
            </p>

            <p className="col-sm-3">
              <strong>Age:</strong>&nbsp;&nbsp;
              {infoData?.patientDetail[0]?.Age}&nbsp;/&nbsp;
              {infoData?.patientDetail[0]?.Gender}
            </p>

            <p className="col-sm-3">
              <strong>Mobile No:</strong>&nbsp;&nbsp;
              {infoData?.patientDetail[0]?.Mobile}
            </p>

            <p className="col-sm-3">
              <strong>Address:</strong>
              {infoData?.patientDetail?.Age}
            </p>
          </div>
          <div className="row">
            <Table>
              <thead>
                <tr>
                  <th>Test Name</th>
                  <th>Rate</th>
                </tr>
              </thead>
              <tbody>
                {infoData?.PLO.map((test, index) => (
                  <tr>
                    <td>{test?.ItemName}</td>
                    <td>{Number(test?.Rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="row d-flex justify-content-end">
            <div className="col-sm-2">
              <button
                className="btn btn-sm btn-success  d-flex align-items-center"
                onClick={() => setShowTest(true)}
              >
                <i class="fa fa-edit reg-check-label">&nbsp;</i>
                <strong>Edit Info</strong>
              </button>
            </div>
            <div className="col-sm-2">
              <button
                className="btn btn-sm btn-primary d-flex align-items-center"
                onClick={() => setEditDetails(true)}
              >
                <i
                  title="Edit Patient Info"
                  class="fa fa-pencil-square reg-check-label"
                  aria-hidden="true"
                >
                  &nbsp;
                </i>
                <strong>Edit Test</strong>
              </button>
            </div>
            <div className="col-sm-2">
              <button
                className="btn btn-sm btn-warning d-flex align-items-center"
                onClick={() => printReport()}
              >
                <i class="fa fa-print reg-check-label">&nbsp;</i>
                <strong>Reciept</strong>
              </button>
            </div>
            {data?.IsPndt == 1 && (
              <div className="col-sm-2">
                <button
                  className="btn btn-sm btn-primary d-flex align-items-center"
                  onClick={() => getConcern(data?.ledgertransactionID)}
                >
                  <i class="fa fa-print reg-check-label">&nbsp;</i>
                  <strong>PNDT</strong>
                </button>
              </div>
            )}
            {data?.IsConcern == 1 && (
              <div className="col-sm-2">
                <button
                  className="btn btn-sm btn-primary d-flex align-items-center"
                  onClick={() => getPndtForm(data?.ledgertransactionID)}
                >
                  <i class="fa fa-print reg-check-label">&nbsp;</i>
                  <strong>Concent</strong>
                </button>
              </div>
            )}
            <div className="col-sm-2">
              <button className="btn btn-sm btn-danger" onClick={handleClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AfterRegistration;
