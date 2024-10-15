import React, { useEffect, useState } from "react";
import DatePicker from "../../components/CommonComponent/DatePicker";
import { axiosInstance, axiosReport } from "../../utils/axiosInstance";
import Loading from "../../components/Loading/Loading";
import { toast } from "react-toastify";
import { SelectBoxWithCheckbox } from "../../components/CommonComponent/MultiSelectBox";
import { useTranslation } from "react-i18next";
import moment from "moment";
import Table from "../../components/Table/Table";
import PageHead from "../../components/CommonComponent/PageHead";
import Input from "../../components/CommonComponent/Input";
import NoRecordFound from "../../components/CommonComponent/NoRecordFound";
const InvoiceReprint = () => {
  const [center, setCentre] = useState([]);
  const [load, setLoad] = useState(false);
  const [loads, setLoads] = useState({
    name: "",
    loading: -1,
  });

  const [invoiceReprintData, setinvoiceReprintData] = useState([]);
  const [payload, setPayload] = useState({
    InvoiceNo: "",
    DateTypeSearch: "1",
    InvoiceFromDate: new Date(),
    InvoiceFromTime: "00:00",
    InvoiceToDate: new Date(),
    InvoiceToTime: "23:59",
    centreID: [],
  });
  const [fileLoad, setFileLoad] = useState({
    Excel: false,
    PDF: false,
    loading: -1,
  });

  const { t } = useTranslation();

  const handleSelectchange = (select, name) => {
    const data = select.map((ele) => ele.value);
    setPayload({ ...payload, [name]: data });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const dateSelect = (value, name) => {
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const getAccessCentres = () => {
    axiosInstance
      .get("Accounts/GetRateTypeByGlobalCentre")
      .then((res) => {
        let data = res.data.message;
        let CentreDataValue = data.map((ele) => {
          return {
            value: ele.RateTypeID,
            label: ele.RateTypeName,
          };
        });

        setCentre(CentreDataValue);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAccessCentres();
  }, []);

  const handleSearch = () => {
    setLoad(true);
    axiosInstance
      .post("Accounts/InvoiceReprint1", {
        ...payload,
        InvoiceFromDate: moment(payload?.InvoiceFromDate).format("DD-MMM-YYYY"),
        InvoiceToDate: moment(payload?.InvoiceToDate).format("DD-MMM-YYYY"),
      })
      .then((res) => {
        setLoad(false);
        setinvoiceReprintData(res?.data?.message);
      })
      .catch((err) => {
        setLoad(false);
        toast.error(
          err?.data?.message ? err?.data?.message : "Something Went Wrong"
        );
      });
  };

  const exportExcelDataApi = (id, callFor, index, name) => {
    setFileLoad({
      ...fileLoad,
      [name]: true,
      loading: index,
    });

    axiosReport
      .post(
        "commonReports/ExportInvoiceReprintData",
        {
          InvoiceNo: id,
          DocumentType: callFor?.toString(),
        },
        callFor == 1 && { method: "GET", responseType: "blob" }
      )
      .then((res) => {
        setFileLoad({
          ...fileLoad,
          [name]: false,
          index: -1,
        });
        if (callFor == 1) {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `Invoice.xlsx`);
          document.body.appendChild(link);
          link.click();
        }
        if (callFor == 2) {
          window.open(res?.data?.Url, "_blank");
        }
      })
      .catch((err) => {
        setFileLoad({
          ...fileLoad,
          [name]: false,
          index: -1,
        });
        setLoads({ loading: -1, name: "" });
        toast.error(
          err?.data?.message ? err?.data?.message : "Something Went Wrong"
        );
      });
  };

  const handleGetReport = (id, index, name) => {
    setLoads({ loading: index, name: name });
    axiosReport
      .post("commonReports/InvoiceReceiptData", {
        DocumentType: "2",
        InvoiceNo: id,
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

  return (
    <>
      <PageHead name="Invoice Reprint" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2 ">
              <DatePicker
                name="InvoiceFromDate"
                value={payload?.InvoiceFromDate}
                className="custom-calendar"
                placeholder=" "
                id="From Date"
                lable="From Date"
                onChange={dateSelect}
                maxDate={new Date()}
              />
            </div>

            <div className="col-sm-2 ">
              <DatePicker
                name="InvoiceToDate"
                value={payload?.InvoiceToDate}
                className="custom-calendar"
                placeholder=" "
                id="To Date"
                lable="To Date"
                onChange={dateSelect}
                maxDate={new Date()}
                minDate={new Date(payload?.InvoiceFromDate)}
              />
            </div>

            <div className="col-sm-2 ">
              <Input
                value={payload?.InvoiceNo}
                onChange={handleChange}
                id="InvoiceNo"
                name="InvoiceNo"
                lable="Invoice Number"
                placeholder=" "
                required
              />
            </div>
            <div className="col-sm-2 ">
              <SelectBoxWithCheckbox
                options={center}
                name="centreID"
                placeholder=" "
                lable="Rate Type"
                id="Rate Type"
                value={payload?.centreID}
                onChange={handleSelectchange}
              />
            </div>
            <div className="col-sm-1">
              {load ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-block btn-sm btn-info"
                  onClick={handleSearch}
                >
                  {t("Search")}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          {invoiceReprintData?.length > 0 ? (
            <>
              <Table>
                <thead className="text-center cf" style={{ zIndex: 99 }}>
                  <tr>
                    <th>S.No</th>
                    <th>Invoice No</th>
                    <th>Code</th>
                    <th>Client Name</th>
                    <th>Share Amt.</th>
                    <th>Export Excel</th>
                    <th>PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceReprintData?.map((ele, index) => (
                    <tr key={index}>
                      <td data-title="S.No">{index + 1}&nbsp;</td>
                      <td data-title="ClientCode">{ele.InvoiceNo}&nbsp;</td>
                      <td data-title="ClientCode">{ele.CentreCode}&nbsp;</td>
                      <td data-title="Client Name">{ele.PanelName}&nbsp;</td>
                      <td
                        data-title="InvoiceAmt"
                        style={{ textAlign: "right" }}
                      >
                        {ele.ShareAmt}&nbsp;
                      </td>
                      <td data-title="InvoiceAmt">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-evenly",
                          }}
                        >
                          {fileLoad?.Excel && fileLoad?.loading === index ? (
                            <Loading />
                          ) : (
                            <i>
                              <span
                                className="pi pi-file-excel"
                                style={{
                                  width: "15px",
                                  height: "15px",
                                  color: "green",
                                }}
                                onClick={() =>
                                  exportExcelDataApi(
                                    ele?.InvoiceNo,

                                    1,
                                    index,
                                    "Excel"
                                  )
                                }
                              />
                            </i>
                          )}
                          {fileLoad?.PDF && fileLoad?.loading === index ? (
                            <Loading />
                          ) : (
                            <i>
                              <span
                                className="pi pi-file-pdf"
                                style={{
                                  width: "15px",
                                  height: "15px",
                                  color: "red",
                                }}
                                onClick={() =>
                                  exportExcelDataApi(
                                    ele?.InvoiceNo,

                                    2,
                                    index,
                                    "PDF"
                                  )
                                }
                              />
                            </i>
                          )}
                        </div>
                      </td>
                      <td data-title="InvoiceAmt">
                        {loads?.name === "print" && loads?.loading === index ? (
                          <Loading />
                        ) : (
                          <i>
                            <span
                              className="pi pi-file-pdf"
                              style={{
                                width: "15px",
                                height: "15px",
                                color: "red",
                              }}
                              onClick={() =>
                                handleGetReport(ele?.InvoiceNo, index, "print")
                              }
                            />
                          </i>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          ) : (
            <NoRecordFound />
          )}
        </div>
      </PageHead>
    </>
  );
};

export default InvoiceReprint;
