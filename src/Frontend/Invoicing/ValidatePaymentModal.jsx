import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import moment from "moment";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import Modal from "../../components/Modal/Modal";
import Input from "../../components/CommonComponent/Input";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import Table from "../../components/Table/Table";
import DatePicker from "../../components/CommonComponent/DatePicker";
import TableSelectBox from "../../components/TableComponent/TableSelectBox";
import Loading from "../../components/Loading/Loading";
function ValidatePaymentModal({ showValidateModal, handleClose }) {
  console.log(showValidateModal);

  const { t } = useTranslation();
  const [BankName, setBankName] = useState([]);
  const [PaymentMode, setPaymentMode] = useState([]);
  const [load, setLoad] = useState(false);

  const [formData, setFormData] = useState({
    PaymentUpdateRemark: showValidateModal?.data?.remarks ?? "",
    PaymentMode: showValidateModal?.data?.PaymentMode ?? "",
    PaymentModeId: showValidateModal?.data?.PaymentMode ?? "",
    AdvAmount: showValidateModal?.data?.ReceivedAmt ?? "",
    CardNo: showValidateModal?.data?.CardNo ?? "",
    CardDate: showValidateModal?.data?.CardDate
      ? new Date(showValidateModal?.data?.CardDate)
      : new Date(),
    BankName: showValidateModal?.data?.BankName ?? "",
    Id: showValidateModal?.data?.ID ?? "",
  });

  const handleSelectChange = (event) => {
    const { name, value, selectedIndex } = event.target;
    if (name === "PaymentModeId") {
      setFormData({
        ...formData,
        [name]: value,
        PaymentMode: value,

        CardNo: "",
        CardDate: new Date(),
        BankName: "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const dateSelect = (value, name) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = () => {
    const { disable, message } = validate(
      formData["PaymentUpdateRemark"],
      formData["PaymentMode"],
      formData.AdvAmount
    );
    if (!disable) {
      setLoad(true);
      axiosInstance
        .post("Accounts/UpdateAdvPayment", {
          ...formData,
          CardDate: moment(formData?.CardDate).format("DD-MMM-YYYY"),
        })
        .then((res) => {
          toast.success(res?.data?.message);
          setLoad(false);

          handleClose();
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something Went Wrong"
          );
          setLoad(false);
        });
    } else {
      setLoad(false);
      toast.error(message);
    }
  };
  const validate = (condition1, condition, InvoiceAmt) => {
    let disable = false;
    let message = "";
    if (condition === "") {
      disable = true;
      message = "Please Choose Payment Mode";
    } else if (["Paytm", "Online Payment"].includes(condition)) {
    } else if (["Debit Card", "Credit Card"].includes(condition)) {
      if (formData["BankName"] === "") {
        disable = true;
        message = "Please Choose BankName";
      } else if (formData["CardNo"].length < 15) {
        disable = true;
        message = `Please Enter Valid ${condition} Number`;
      }
    } else if (["Cheque"].includes(condition)) {
      if (formData["BankName"] === "") {
        disable = true;
        message = "Please Choose BankName";
      } else if (formData["CardNo"].length < 15) {
        disable = true;
        message = `Please Enter Valid ${condition} Number`;
      }
    }

    if (condition) {
      if (InvoiceAmt === "" || InvoiceAmt == 0) {
        disable = true;
        message = "Please Enter InvoiceAmt";
      }
      if (condition1 === "") {
        disable = true;
        message = "Please Enter Remarks";
      }
    }
    return {
      disable: disable,
      message: message,
    };
  };

  const getPaymentMode = (name, state) => {
    axiosInstance
      .post("Global/getGlobalData", { Type: name })
      .then((res) => {
        let data = res.data.message;
        let value = data.map((ele) => {
          return {
            value: ["PaymentMode", "BankName"].includes(name)
              ? ele.FieldDisplay
              : ele.FieldID,
            label: ele.FieldDisplay,
          };
        });
        state(value);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };
  useEffect(() => {
    getPaymentMode("PaymentMode", setPaymentMode);
    getPaymentMode("BankName", setBankName);
  }, []);

  return (
    <Modal handleClose={handleClose} title="">
      <div className="card">
        <div className="row">
          <div className="col-sm-3">
            <Input
              id="Client Name"
              lable="Client Name"
              placeholder=" "
              value={showValidateModal?.data?.centre}
              disabled={true}
            />
          </div>
          <div className="col-sm-3">
            <Input
              id="Paid Date"
              lable="Paid Date"
              placeholder=" "
              value={showValidateModal?.data?.EntryDate}
              disabled={true}
            />
          </div>
          <div className="col-sm-3">
            <SelectBox
              options={[
                { label: "Select Payment Mode", value: "" },
                ...PaymentMode,
              ]}
              onChange={handleSelectChange}
              name="PaymentModeId"
              lable="Select Payment Mode"
              id="Select Payment Mode"
              selectedValue={(PaymentMode, formData?.PaymentModeId)}
            />
          </div>
          <div className="col-sm-3">
            <Input
              type="text"
              id="Update Remarks"
              lable="Update Remarks"
              placeholder=" "
              name="PaymentUpdateRemark"
              value={formData?.PaymentUpdateRemark}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-2">
            <Input
              value="0"
              id="CUR.Round"
              lable="CUR.Round"
              placeholder=" "
              disabled={true}
            />
          </div>

          <div className="col-sm-2">
            <Input
              id="Invoice Number"
              lable="Invoice Number"
              placeholder=" "
              value={showValidateModal?.data?.invoiceNo}
              disabled={true}
            />
          </div>

          <div className="col-sm-2">
            <Input
              id="Invoice Amount"
              lable="Invoice Amount"
              placeholder=" "
              value={formData?.AdvAmount}
              disabled={true}
            />
          </div>
        </div>

        <div className="card">
          <Table>
            <thead class="cf">
              <tr>
                {[
                  "Payment Mode",
                  "Paid Amt.",
                  "Currency",
                  "Base",
                  ["Cheque", "Credit Card", "Debit Card"].includes(
                    formData?.PaymentMode
                  )
                    ? t("Cheque/Card No.")
                    : "",
                  ["Cheque", "Credit Card", "Debit Card"].includes(
                    formData?.PaymentMode
                  )
                    ? "Cheque/Card Date"
                    : "",
                  ["Cheque", "Credit Card", "Debit Card"].includes(
                    formData?.PaymentMode
                  )
                    ? t("Bank Name")
                    : "",
                ].map((ele, index) => ele !== "" && <th key={index}>{ele}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td data-title={t("PaymentMode")}>
                  {formData?.PaymentMode == ""
                    ? "Select Payment Mode"
                    : formData?.PaymentMode}
                  &nbsp;
                </td>
                <td data-title={t("Paid Amt.")}>
                  <Input
                    className="w-100"
                    type="number"
                    name="AdvAmount"
                    onInput={(e) => number(e, 7)}
                    value={formData?.AdvAmount}
                    onChange={handleChange}
                  />
                </td>
                <td data-title={t("Currency")}>INR</td>
                <td data-title={t("Base")}>0</td>
                {["Cheque"].includes(formData?.PaymentMode) && (
                  <td data-title={t("Cheque No")}>
                    <Input
                      type="number"
                      onInput={(e) => number(e, 16)}
                      name="CardNo"
                      value={formData?.CardNo}
                      onChange={handleChange}
                    />
                  </td>
                )}

                {["Credit Card", "Debit Card"].includes(
                  formData?.PaymentMode
                ) && (
                  <td data-title={t("CardNo")}>
                    <Input
                      className="select-input-box form-control input-sm"
                      type="number"
                      onInput={(e) => number(e, 16)}
                      name="CardNo"
                      value={formData?.CardNo}
                      onChange={handleChange}
                    />
                  </td>
                )}
                {["Cheque", "Credit Card", "Debit Card"].includes(
                  formData?.PaymentMode
                ) && (
                  <td data-title={t("CardDate")}>
                    <DatePicker
                      name="CardDate"
                      className="custom-calendar"
                      value={formData?.CardDate}
                      onChange={dateSelect}
                    />
                  </td>
                )}
                {["Cheque", "Credit Card", "Debit Card"].includes(
                  formData?.PaymentMode
                ) && (
                  <td data-title={t("BankName")}>
                    <TableSelectBox
                      options={[
                        { label: "Select Bank", value: "" },
                        ...BankName,
                      ]}
                      name="BankName"
                      selectedValue={formData?.BankName}
                      onChange={handleChange}
                    ></TableSelectBox>
                  </td>
                )}
              </tr>
            </tbody>
          </Table>
        </div>

        <div className="row">
          <div>
            {load ? (
              <Loading />
            ) : (
              <>
                <div className="row">
                  <div className="col-sm-3">
                    <button
                      className="btn btn-block btn-success btn-sm"
                      onClick={() => handleSave()}
                    >
                      {t("Update")}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ValidatePaymentModal;
