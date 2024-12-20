import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Table from "../../components/Table/Table";
import PageHead from "../../components/CommonComponent/PageHead";
import { axiosInstance } from "../../utils/axiosInstance";
import { GetRateTypeByGlobalCentre } from "../../utils/NetworkApi/commonApi";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import DatePicker from "../../components/CommonComponent/DatePicker";
import Input from "../../components/CommonComponent/Input";
import Loading from "../../components/Loading/Loading";
const InvoiceCancel = () => {
  const InitialData = {
    InvoiceNo: "",
    CentreId: "",
    InvoiceDateFrom: new Date(),
    InvoiceDateTo: new Date(),
  };

  const [searchData, setSearchData] = useState(InitialData);
  const [client, setClient] = useState([]);
  const [searchLoad, setSearchLoad] = useState(false);
  const [tableData, setTableData] = useState([]);

  const { t } = useTranslation();
  const dateSelect = (value, name) => {
    if (name === "InvoiceDateFrom") {
      const updateDate =
        new Date(searchData?.InvoiceDateTo) - value < 0
          ? value
          : searchData.InvoiceDateTo;
      setSearchData((searchData) => ({
        ...searchData,
        [name]: value,
        InvoiceDateTo: updateDate,
      }));
    } else if (name === "InvoiceDateTo") {
      setSearchData((searchData) => ({
        ...searchData,
        [name]: value,
      }));
    } else {
      setSearchData((searchData) => ({
        ...searchData,
        [name]: value,
      }));
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchData({
      ...searchData,
      [name]: value,
    });
  };

  const handleSearch = () => {
    setTableData([]);
    if (searchData?.CentreId != "") {
      axiosInstance
        .post(
          "Accounts/GetInvoiceDataToCancel",

          {
            ...searchData,
            InvoiceDateFrom: moment(searchData.InvoiceDateFrom).format(
              "DD-MMM-YYYY"
            ),
            InvoiceDateTo: moment(searchData.InvoiceDateTo).format(
              "DD-MMM-YYYY"
            ),
          }
        )
        .then((res) => {
          setTableData(res?.data?.message);
          setSearchLoad(false);
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message);
          setTableData([]);
          setSearchLoad(false);
        });
    } else {
      toast.error("Please Select Any Rate Type");
    }
    console.log(searchData);
  };

  const handleInvoiceCancel = (ele) => {
    if (ele?.CancelReason) {
      axiosInstance
        .post("Accounts/CancelInvoice", {
          CancelInvoice: [
            {
              InvoiceNo: ele?.InvoiceNo,
              CancelReason: ele?.CancelReason,
            },
          ],
        })
        .then((res) => {
          toast.success(res?.data?.message);
          handleSearch();
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message);
        });
    } else {
      toast.error("Please Enter Cancel Reason");
    }
  };

  const handleReason = (e, index) => {
    const { name, value } = e.target;
    const data = [...tableData];
    data[index][name] = value;
    setTableData(data);
  };

  useEffect(() => {
    GetRateTypeByGlobalCentre(setClient);
  }, []);

  return (
    <>
      <PageHead name="Invoice Cancel" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <DatePicker
                className="custom-calendar"
                placeholder=" "
                id="From Date"
                lable="From Date"
                name="InvoiceDateFrom"
                value={
                  searchData?.InvoiceDateFrom
                    ? new Date(searchData?.InvoiceDateFrom)
                    : new Date()
                }
                onChange={dateSelect}
              />
            </div>

            <div className="col-sm-2">
              <DatePicker
                className="custom-calendar"
                placeholder=" "
                id="To Date"
                lable="To Date"
                name="InvoiceDateTo"
                value={
                  searchData?.InvoiceDateTo
                    ? new Date(searchData?.InvoiceDateTo)
                    : new Date()
                }
                minDate={searchData?.InvoiceDateFrom}
                onChange={dateSelect}
              />
            </div>

            <div className="col-sm-2">
              <SelectBox
                options={[{ label: "Select RateType", value: "" }, ...client]}
                name="CentreId"
                lable="Rate Type"
                id="Rate Type"
                selectedValue={searchData?.CentreId}
                onChange={handleSearchChange}
              />
            </div>

            <div className="col-sm-2">
              <Input
                id="Invoice Number"
                lable="Invoice Number"
                placeholder=" "
                type="text"
                name="InvoiceNo"
                value={searchData?.InvoiceNo}
                onChange={handleSearchChange}
              />
            </div>
            <div className="col-sm-1">
              {searchLoad ? (
                <Loading />
              ) : (
                <button
                  type="button"
                  className="btn btn-block btn-info btn-sm"
                  onClick={handleSearch}
                >
                  {t("Search")}
                </button>
              )}
            </div>
            <div className="col-sm-1">
              <button
                type="button"
                className="btn btn-block btn-danger btn-sm"
                onClick={handleInvoiceCancel}
              >
                {t("Invoice Cancel")}
              </button>
            </div>
          </div>
        </div>
      </PageHead>

      <div className="card">
        <Table>
          <thead className="cf text-center" style={{ zIndex: 99 }}>
            <tr>
              <th className="text-center">{t("S.No")}</th>
              <th className="text-center">{t("Invoice No.")}</th>
              <th className="text-center">{t("Client Name")}</th>
              <th className="text-center">{t("Invoice Date")}</th>
              <th className="text-center">{t("Created By")}</th>

              <th className="text-center">{t("Invoice Amount")}</th>
              <th className="text-center">{t("Cancel Reason")}</th>
              <th className="text-center">{t("Cancel")}</th>
            </tr>
          </thead>

          <tbody>
            <>
              {tableData.map((ele, index) => (
                <tr>
                  <td data-title="S.No" className="text-center">
                    &nbsp;{index + 1}
                  </td>
                  <td data-title="Invoice No." className="text-center">
                    &nbsp;{ele?.InvoiceNo}
                  </td>
                  <td data-title="Client Name" className="text-center">
                    &nbsp;{ele?.Centre}
                  </td>
                  <td data-title="Invoice Date" className="text-center">
                    &nbsp;
                    {moment
                      .utc(ele?.InvoiceDate)
                      .utcOffset(new Date().getTimezoneOffset())
                      .format("DD-MMM-YYYY")}
                  </td>
                  <td data-title="Created By" className="text-center">
                    &nbsp;{ele?.CreatedByName}
                  </td>
                  <td data-title="NetAmount" className="text-center">
                    &nbsp;{ele?.NetAmount}
                  </td>

                  <td data-title="CancelReason" className="text-center">
                    <div>
                      <Input
                        type="text"
                        name="CancelReason"
                        max={40}
                        value={ele?.CancelReason}
                        onChange={(e) => handleReason(e, index)}
                      />
                    </div>
                  </td>
                  <td data-title={t("IsCancel")} className="text-center">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleInvoiceCancel(ele)}
                    >
                      Cancel
                    </button>
                    &nbsp;
                  </td>
                </tr>
              ))}
            </>
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default InvoiceCancel;
