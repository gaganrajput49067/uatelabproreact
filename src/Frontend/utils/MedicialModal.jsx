import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import { useTranslation } from "react-i18next";
import { GetMedicalHistoryData } from "../../utils/NetworkApi/commonApi";
import { dateConfig } from "../../utils/helpers";
import { axiosInstance } from "../../utils/axiosInstance";

const MedicialModal = ({ MedicalId, ID, handleUploadCount, handleClose }) => {
  const { t } = useTranslation();
  const [history, setHistory] = useState("");
  const [data, setData] = useState({
    PatientGuid: MedicalId,
    LedgerTransactionID: ID ? ID : 0,
    patientmedicalhistoryiesVM: [
      // {
      //   MedicalHistory: "",
      //   LedgerTransactionID: ID ? ID : 0,
      //   PatientMedicalHistoryIDs: "",
      //   date: new Date(),
      // },
    ],
  });

  useEffect(() => {
    setData({ ...data, PatientGuid: MedicalId });
  }, [MedicalId]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const val = [...data?.patientmedicalhistoryiesVM];
    val[index][name] = value;
    setData({ ...data, patientmedicalhistoryiesVM: val });
  };

  const handleDelete = (index) => {
    const val = data?.patientmedicalhistoryiesVM.filter(
      (ele, idx) => idx !== index
    );
    setData({ ...data, patientmedicalhistoryiesVM: val });
    toast.success(t("Successfully Deleted"));
  };

  useEffect(() => {
    GetMedicalHistoryData(MedicalId, setData, data, ID, handleUploadCount);
  }, []);

  const handleUpload = (data) => {
    if (history !== "") {
      axiosInstance
        .post("PatientRegistration/UploadMedicalHistory", data)
        .then((res) => {
          GetMedicalHistoryData(
            MedicalId,
            setData,
            data,
            ID ? ID : 1,
            handleUploadCount
          );
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : t("Error Occured")
          );
        });
    } else {
      toast.error(t("Please Enter Value"));
    }
  };

  const handleAdd = () => {
    if (history !== "") {
      const updateDetails = {
        MedicalHistory: history,
        LedgerTransactionID: 0,
        PatientMedicalHistoryIDs: "",
        date: new Date(),
      };
      let updatedData = { ...data };
      updatedData.patientmedicalhistoryiesVM.push(updateDetails);
      setData(updatedData);
      handleUpload(updatedData);
    } else {
      toast.error(t("Please Enter Any Value"));
    }
  };

  return (
    <Modal title={"Medical History"} handleClose={handleClose}>
      <div className="medical-modal">
        <div
          className="col-md-6 d-flex"
          style={{ flexDirection: "column", width: "50%" }}
        >
          <label htmlFor="medicalHistory">New Medical History</label>
          <textarea
            className="p-1"
            id="medicalHistory"
            rows="4"
            cols="50"
            placeholder="Enter medical history..."
            style={{ height: "200px" }}
            value={history}
            name="MedicalHistory"
            max={200}
            onChange={(e) => {
              setHistory(e.target.value);
            }}
          ></textarea>
          <div className="col-sm-5 m-0 mt-2 p-0">
            <button
              className="btn btn-success p-0 m-0"
              onClick={() => handleAdd()}
            >
              Create New
            </button>
          </div>
        </div>
        <div
          className="d-flex"
          style={{
            flexDirection: "column",
            width: "48%",
          }}
        >
          <label htmlFor="allergies">Previous Medical History</label>
          {data.patientmedicalhistoryiesVM.length > 0 ? (
            <div
              className="d-flex"
              style={{
                flexDirection: "column",
                width: "100%",
                height: "240px",
                overflowX: "auto",
                padding: "5px",
              }}
            >
              {data.patientmedicalhistoryiesVM.map((ele, index) => (
                <React.Fragment key={index}>
                  <MedicalHistorySpan
                    data={ele}
                    index={index}
                    handleDelete={handleDelete}
                  />
                </React.Fragment>
              ))}
            </div>
          ) : (
            <label>No Medical History</label>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default MedicialModal;

function MedicalHistorySpan({ data, index, handleDelete }) {
  return (
    <div
      className="d-flex w-100 simple-box-container"
      style={{
        flexDirection: "column",
      }}
    >
      <div className="d-flex justify-content-between">
        <span className="col-sm-7 small">{dateConfig(data?.date)}</span>
        <i
          className="fa fa-trash pointer pr-1 pt-1"
          title="Remove this medical History"
          style={{ fontSize: "0.9rem", color: "inherit" }}
          onClick={() => handleDelete(index)}
        ></i>
      </div>
      <span className="col-sm-12">{data?.MedicalHistory}</span>
    </div>
  );
}
