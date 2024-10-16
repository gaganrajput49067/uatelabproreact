import React from "react";
import { useState, useEffect } from "react";
import DatePicker from "../../components/CommonComponent/DatePicker";
import { useTranslation } from "react-i18next";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import { ExportToExcel } from "../../utils/helpers";
import PageHead from "../../components/CommonComponent/PageHead";
import { GetRateTypeByGlobalCentre } from "../../utils/NetworkApi/commonApi";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import moment from "moment";

const LedgerReport = () => {
  const InitialData = {
    CentreId: "",
    FromDate: new Date(),
    ToDate: new Date(),
  };
  const [searchData, setSearchData] = useState(InitialData);
  const [reportType, setReportType] = useState("Summary");
  const [client, setClient] = useState([]);
  const { t } = useTranslation();
  const dateSelect = (value, name) => {
    if (name === "FromDate") {
      const updateDate =
        new Date(searchData?.ToDate) - value < 0 ? value : searchData.ToDate;
      setSearchData((searchData) => ({
        ...searchData,
        [name]: value,
        ToDate: updateDate,
      }));
    } else if (name === "ToDate") {
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
  useEffect(() => {
    GetRateTypeByGlobalCentre(setClient);
  }, []);
  const handleRadioChange = (e) => {
    setReportType(e.target.value);
  };

  const handleReport = () => {
    if (searchData?.CentreId != "") {
      axiosInstance
        .post("Accounts/getReportdata", {
          ...searchData,
          FromDate: moment(searchData.FromDate).format("YYYY-MM-DD"),
          ToDate: moment(searchData.ToDate).format("YYYY-MM-DD"),
          ReportType: reportType,
        })
        .then((res) => {
          const data = res?.data?.message;
          toast.success("Report Found");

          ExportToExcel(data);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something Went Wrong"
          );
        });
    } else {
      toast.error("Please Select Any Rate Type");
    }
  };
  return (
    <>
      <PageHead name="Ledger Report" showDrop={"true"}>
        <div className="card">
          <div className="row">
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
              <DatePicker
                className="custom-calendar"
                placeholder=" "
                id="FromDate"
                lable="FromDate"
                name="FromDate"
                value={
                  searchData?.FromDate
                    ? new Date(searchData?.FromDate)
                    : new Date()
                }
                onChange={dateSelect}
              />
            </div>

            <div className="col-sm-2">
              <DatePicker
                className="custom-calendar"
                placeholder=" "
                id="ToDate"
                lable="ToDate"
                name="ToDate"
                value={
                  searchData?.ToDate ? new Date(searchData?.ToDate) : new Date()
                }
                minDate={searchData?.FromDate}
                onChange={dateSelect}
              />
            </div>
          </div>
        </div>
      </PageHead>
      <div className="card">
        <div className="row">
          <div className="col-sm-3" style={{ display: "flex" }}>
            <input
              type="radio"
              name="Summary"
              value="Summary"
              checked={reportType == "Summary" ? true : false}
              onChange={handleRadioChange}
            />
            &nbsp;
            <label>{t("Summary (Not More Than 6 Month)")}</label>
          </div>

          <div className="col-sm-3" style={{ display: "flex" }}>
            <input
              type="radio"
              name="Detail"
              value="Detail"
              checked={reportType == "Detail" ? true : false}
              onChange={handleRadioChange}
            />
            &nbsp;
            <label>{t("Detail (Not More Than 31 Days)")}</label>
          </div>

          <div className="col-sm-1">
            <button
              type="button"
              className="btn btn-block btn-success btn-sm"
              onClick={handleReport}
            >
              {t("Get Report")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LedgerReport;
