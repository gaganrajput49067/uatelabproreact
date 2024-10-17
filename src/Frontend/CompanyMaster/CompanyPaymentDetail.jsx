import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { toast } from "react-toastify";
import { axiosInstance, axiosReport } from "../../utils/axiosInstance";
import PageHead from "../../components/CommonComponent/PageHead";
import DatePicker from "../../components/CommonComponent/DatePicker";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import Loading from "../../components/Loading/Loading";
import Table from "../../components/Table/Table";
import Input from "../../components/CommonComponent/Input";

const CompanyPaymentDetail = () => {
  const [payload, setPayload] = useState({
    CompanyName: "",
    CompanyId: "",
    Amount: "",
    PaymentType: "Debit",
    DueDate: new Date(),
    load: false,
  });
  const [loads, setLoads] = useState({
    name: "",
    loading: -1,
  });
  const [company, setCompany] = useState([]);
  const [tableData, setTableData] = useState([]);

  const handleChange = (e) => {
    const { name, value, selectedIndex } = e.target;
    const label = e.target?.children[selectedIndex]?.text;
    if (name == "CompanyId" && value == "") {
      setPayload({
        ...payload,
        CompanyId: "",
        CompanyName: "",
        Amount: "",
        PaymentType: "Debit",
        DueDate: new Date(),
      });
      setTableData([]);
    } else if (name == "CompanyId") {
      setPayload({
        ...payload,
        CompanyName: label,
        [name]: value,
        Amount: "",
        PaymentType: "Debit",
        DueDate: new Date(),
      });
      companyData(value);
    } else {
      setPayload({
        ...payload,
        [name]: value,
      });
    }
  };
  const companyData = (value) => {
    axiosInstance
      .post("CompanyMaster/GetCompanyPaymentDetail", {
        CompanyId: value,
      })
      .then((res) => {
        setTableData(res?.data?.message);
      })
      .catch((err) =>
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        )
      );
  };
  const handleSave = () => {
    if (payload.Amount != 0 && payload.Amount != "") {
      setPayload({
        ...payload,
        load: true,
      });
      if (payload?.PaymentType == "Debit" && tableData?.length > 0) {
        const dueDate = new Date(payload.DueDate);
        const currentMonth = dueDate.getMonth();
        const currentYear = dueDate.getFullYear();

        let found = false;

        for (let i = 0; i < tableData?.length; i++) {
          if (tableData[i]?.isActive == 1) {
            const tableDueDate = new Date(tableData[i]?.DueDate);
            const tableMonth = tableDueDate.getMonth();
            const tableYear = tableDueDate.getFullYear();

            if (tableMonth === currentMonth && tableYear === currentYear) {
              found = true;
              break;
            }
          }
        }

        if (found) {
          toast.error("Debit Amount for this month already added");
          setPayload({
            ...payload,
            load: false,
          });
          return;
        }
      }

      axiosInstance
        .post("CompanyMaster/SaveCompanyPaymentDetail", {
          ...payload,
          Amount:
            payload?.PaymentType == "Credit"
              ? payload?.Amount * -1
              : payload?.Amount,
          DueDate: moment(payload?.DueDate).format("DD-MMM-YYYY"),
        })
        .then((res) => {
          if (payload?.PaymentType == "Credit") {
            handleDebitEntry();
          } else {
            toast.success(res?.data?.message);
            companyData(payload?.CompanyId);
            setPayload({
              ...payload,
              load: false,
              Amount: "",
              PaymentType: "Debit",
              DueDate: new Date(),
            });
          }
        })
        .catch((err) => {
          setPayload({
            ...payload,
            load: false,
          });
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something Went Wrong"
          );
        });
    } else {
      toast.error("Amount can't be blank or zero");
    }
  };
  const dateSelect = (value, name) => {
    setPayload({
      ...payload,
      [name]: value,
    });
  };
  const { t } = useTranslation();

  const getCompanyName = () => {
    axiosInstance
      .get("CompanyMaster/getCompanyName")
      .then((res) => {
        let data = res?.data?.message;
        let Company = data?.map((ele) => {
          return {
            value: ele?.CompanyId,
            label: ele?.CompanyName,
          };
        });
        Company.unshift({ label: "Select Company", value: "" });
        setCompany(Company);
      })
      .catch((err) =>
        console.log(err?.res?.data ? err?.res?.data : "Something Went Wrong")
      );
  };

  const handleGetReport = (ele, index, name) => {
    setLoads({ loading: index, name: name });
    axiosReport
      .post("commonReports/CompanyPaymentData", {
        details: ele,
      })
      .then((res) => {
        setLoads({ loading: -1, name: "" });
        window.open(res?.data?.Url, "_blank");
      })
      .catch((err) => {
        setLoads({ loading: -1, name: "" });
        toast.error(
          err?.data?.message ? err?.data?.message : "Something Went Wrong"
        );
      });
  };
  useEffect(() => {
    getCompanyName();
  }, []);

  const handleRemove = (ele) => {
    axiosInstance
      .post("CompanyMaster/InActivePaymentDetail", {
        PaymentDetailID: ele?.PaymentDetailID,
        CompanyId: ele?.CompanyId,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        companyData(payload?.CompanyId);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };
  const handleDebitEntry = () => {
    axiosInstance
      .post("CompanyMaster/SaveCompanyPaymentDetail", {
        ...payload,
        PaymentType: "Debit",
        Amount: payload?.Amount,
        DueDate: moment(payload?.DueDate).add(1, "month").format("DD-MMM-YYYY"),
      })
      .then((res) => {
        toast.success(res?.data?.message);
        companyData(payload?.CompanyId);
        setPayload({
          ...payload,
          load: false,
          Amount: "",
          PaymentType: "Debit",
          DueDate: new Date(),
        });
      })
      .catch((err) => {
        setPayload({
          ...payload,
          load: false,
        });
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };

  return (
    <>
      <PageHead name="Company Payment Detail" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <SelectBox
                id="Company Name"
                lable="Company Name"
                name="CompanyId"
                onChange={handleChange}
                options={company}
                selectedValue={payload?.CompanyId}
              />
            </div>
          </div>
        </div>{" "}
        <div className="card">
          {payload?.CompanyName != "" && (
            <div className="row">
              <div className="col-sm-2">
                <Input
                  lable="Amount"
                  placeholder=" "
                  name="Amount"
                  id="Amount"
                  onInput={(e) => number(e, 8)}
                  onChange={handleChange}
                  value={payload?.Amount}
                />
              </div>
              <label className="col-sm-1">PaymentType :</label>
              <div className="col-sm-2">
                <span className="col-sm-3">Debit</span>
                <span className="col-sm-3">
                  <input
                    type="radio"
                    value="Debit"
                    name="PaymentType"
                    onChange={handleChange}
                    checked={payload?.PaymentType == "Debit"}
                  />
                </span>
                <span className="col-sm-3">Credit</span>
                <span className="col-sm-3">
                  <input
                    type="radio"
                    value="Credit"
                    name="PaymentType"
                    onChange={handleChange}
                    npm
                    run
                    test
                    checked={payload?.PaymentType == "Credit"}
                  />
                </span>
              </div>

              <div className="col-sm-2">
                <DatePicker
                  className="custom-calendar"
                  placeholder=" "
                  id="Due Date"
                  lable="Due Date"
                  name="DueDate"
                  onChange={dateSelect}
                  value={payload?.DueDate}
                />
              </div>

              {payload?.load ? (
                <Loading />
              ) : (
                <div className="col-sm-1">
                  <button
                    className="btn btn-block btn-success btn-sm"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </PageHead>
      <div className="card">
        {/* {tableData?.length > 0
          ? "TotalOutstandingAmt : " + tableData[0]?.TotalOutStandingAmt
          : ""} */}
        <div className="row">
          <label
            style={{
              color: `${
                tableData[0]?.TotalOutStandingAmt >= 0 ? "red" : "green"
              }`,
            }}
          >
            {tableData?.length > 0
              ? "Total Outstanding Amount : " +
                tableData[0]?.TotalOutStandingAmt
              : ""}
          </label>
        </div>

        <Table>
          <thead
            className="cf text-center"
            style={{ position: "sticky", zIndex: 0, top: 0 }}
          >
            <tr>
              <th className="text-center">{t("SNo.")}</th>
              <th className="text-center">{t("CompanyName")}</th>
              <th className="text-center">{t("Amount")}</th>
              <th className="text-center">{t("DueDate")}</th>
              <th className="text-center">{t("PaymentType")}</th>

              <th className="text-center">{t("Order Id")}</th>
              <th className="text-center">{t("Payment Id")}</th>
              <th className="text-center">{t("EntryDate")}</th>
              <th className="text-center">{t("CreatedBy")}</th>
              <th className="text-center">{t("Status")}</th>
              <th className="text-center">{t("Remove")}</th>

              <th className="text-center">{t("PDF")}</th>
            </tr>
          </thead>
          <tbody>
            {tableData?.map((ele, index) => (
              <>
                <tr>
                  <td data-title={index + 1} className="text-center">
                    {index + 1}
                  </td>
                  <td data-title="CompanyName" className="text-center">
                    {ele?.CompanyName}
                  </td>
                  <td
                    style={{ textAlign: "right" }}
                    data-title="Amount"
                    className="text-center"
                  >
                    {ele?.Amount}
                  </td>
                  <td data-title="DueDate" className="text-center">
                    {ele?.DueDate}
                  </td>
                  <td data-title="PaymentType" className="text-center">
                    {ele?.PaymentType}
                  </td>
                  <td data-title="OrderId" className="text-center">
                    {ele?.orderId}
                  </td>
                  <td data-title="Payment" className="text-center">
                    {ele?.PaymentID}
                  </td>
                  <td data-title="dtentry" className="text-center">
                    {ele?.dtentry}
                  </td>
                  <td data-title="CreatedBy" className="text-center">
                    {ele?.CreatedBy}
                  </td>
                  <td data-title="Status" className="text-center">
                    {ele?.ActiveStatus}
                  </td>
                  <td data-title="PaymentType" className="text-center">
                    {ele?.ShowIsActive == "0" ||
                    ele?.ActiveStatus != "Active" ? (
                      ""
                    ) : (
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => handleRemove(ele)}
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          border: "none",
                          padding: "2px 7px",
                          fontSize: "12px",
                          cursor: "pointer",
                          borderRadius: "4px",
                        }}
                      >
                        X
                      </button>
                    )}
                  </td>
                  <td data-title="Pdf" style={{ textAlign: "center" }}>
                    {loads?.name === "print" && loads?.loading === index ? (
                      <Loading />
                    ) : (
                      ele.PaymentType == "Credit" && (
                        <i
                          className="pi pi-file-pdf"
                          style={{
                            fontSize: "15px",
                            color: "red",
                            cursor: "pointer",
                          }}
                          onClick={() => handleGetReport(ele, index, "print")}
                        ></i>
                      )
                    )}
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default CompanyPaymentDetail;
