import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Modal from "../../components/Modal/Modal";
import Input from "../../components/CommonComponent/Input";
import { ReportEmailValidation } from "../../utils/Schema";
import { axiosInstance, axiosReport } from "../../utils/axiosInstance";

function SendEmailModalReprint({ data, handleClose }) {
  let RADIO_BUTTON;

  if (data?.Status === 5 || data?.Status === 6) {
    RADIO_BUTTON = [
      {
        label: "Bill Receipt",
        value: "1",
      },
      {
        label: "Lab Report",
        value: "2",
      },
    ];
  } else {
    RADIO_BUTTON = [
      {
        label: "Bill Receipt",
        value: "1",
      },
    ];
  }
  const [formdata, setFormdata] = useState({
    To: "",
    CC: "",
    BCC: "",
    URL: "",
  });
  const [err, setErr] = useState({});
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const handlechangeForm = (e) => {
    const { name, value } = e.target;
    setFormdata({ ...formdata, [name]: value });
  };

  const [radio, setRadio] = useState("Bill Receipt");
  const handleChange = (e) => {
    const { name, value } = e?.target;
    if (value == "2") {
      getReport();
    } else if (value == "1") {
      getReceipt();
    }
    setRadio(radio == "Bill Receipt" ? "Lab Report" : "Bill Receipt");
  };

  const getReport = () => {
    axiosReport
      .post("commonReports/GetLabReport", {
        PHead: 1,
        TestIDHash: data?.TestIdHash,
      })
      .then((res) => {
        setFormdata({ ...formdata, URL: res?.data?.Url });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const sendEmail = () => {
    const generatedError = ReportEmailValidation(formdata);
    if (generatedError == "") {
      const payload = {
        ReportType: radio == "Bill Receipt" ? 1 : 2,
        Url: formdata?.URL,
        Email: formdata?.To,
        EmailCC: formdata?.CC,
        EmailBCC: formdata?.BCC,
        LedgerTransactionId: data?.LedgerTransactionID,
      };
      axiosInstance
        .post("Lab/SendEmail", payload)
        .then((res) => {
          toast.success(res?.data?.message);
          handleClose();
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message);
        });
    } else {
      setErr(generatedError);
    }
  };

  const getReceipt = () => {
    axios
      .post("/reports/v1/getReceipt", {
        LedgerTransactionIDHash: data?.LedgertransactionIDHash,
      })
      .then((res) => {
        setFormdata({ ...formdata, URL: res?.data?.Url });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getReceipt();
  }, []);
  return (
    <Modal title={"Send Email"} handleClose={handleClose} top={"25%"}>
      <div className="card">
        <div className="row">
          {RADIO_BUTTON.map((ele, index) => (
            <>
              <div className="card-body d-flex flex-1">
                <div className="flex">
                  <input
                    type="radio"
                    id={ele?.label}
                    name="type"
                    checked={radio == ele?.label}
                    onChange={handleChange}
                    value={ele?.value}
                  />
                  <label htmlFor={ele?.label} className="ml-2">{ele?.label}</label>
                </div>
              </div>
            </>
          ))}
        </div>

        <div className="row">
          <label className="col-sm-4">To :</label>
          <div className="col-sm-8">
            <Input
              className="select-input-box form-control input-sm "
              name="To"
              value={formdata?.To}
              type="text"
              onChange={handlechangeForm}
            />
            {!emailRegex.test(formdata?.To) && (
              <span className="error-message">{err?.To}</span>
            )}
          </div>
        </div>
        <div className="row">
          <label className="col-sm-4">CC :</label>
          <div className="col-sm-8">
            <Input
              className="select-input-box form-control input-sm "
              type="text"
              name="CC"
              value={formdata?.CC}
              onChange={handlechangeForm}
            />
            {formdata?.CC.trim().length > 0 &&
              !emailRegex.test(formdata?.CC) && (
                <span className="error-message">{err?.CC}</span>
              )}
          </div>
        </div>
        <div className="row">
          <label className="col-sm-4">BCC :</label>
          <div className="col-sm-8">
            <Input
              className="select-input-box form-control input-sm "
              name="BCC"
              type="text"
              value={formdata?.BCC}
              onChange={handlechangeForm}
            />
            {formdata?.BCC.trim().length > 0 &&
              !emailRegex.test(formdata?.BCC) && (
                <span className="error-message">{err?.BCC}</span>
              )}
          </div>
        </div>
      </div>
      <div className="row"></div>
      <div className="row">
        <div className="col-sm-6">
          <button
            type="button"
            className="btn btn-block btn-danger btn-sm"
            onClick={handleClose}
          >
            Close
          </button>
        </div>

        <div className="col-sm-6">
          <button
            type="button"
            className="btn btn-block btn-success btn-sm"
            disabled={!formdata?.URL}
            onClick={sendEmail}
          >
            Send Email
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default SendEmailModalReprint;
