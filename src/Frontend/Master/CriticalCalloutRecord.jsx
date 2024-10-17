import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import moment from "moment";

import { axiosInstance } from "../../utils/axiosInstance";
import SampleRemark from "../utils/SampleRemark";
import DatePicker from "../../components/CommonComponent/DatePicker";
import ExportFile from "../../components/CommonComponent/ExportFile";
import Loading from "../../components/Loading/Loading";
import Table from "../../components/Table/Table";
import PageHead from "../../components/CommonComponent/PageHead";
const CriticalCalloutRecord = () => {
  const { t } = useTranslation();

  const [searchData, setSearchData] = useState({
    IsCommunicate: 0,
    IsFollowUp: 0,
    FromDate: new Date(),
    ToDate: new Date(),
  });
  const [communicate, setCommunicate] = useState(false);
  const [searchLoad, setSearchLoad] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const dateSelect = (value, name) => {
    setSearchData({ ...searchData, [name]: value });
  };
  const getColor = () => {
    if (searchData?.IsCommunicate == 1) return "#47cd47";
    if (searchData?.IsFollowUp == 1) return "#f19dac";
  };
  const handleSearch = (Communicate, FollowUp) => {
    setSearchData({
      ...searchData,
      IsCommunicate: Communicate,
      IsFollowUp: FollowUp,
    });
    setSearchLoad(true);
    axiosInstance
      .post("TestData/getCriticalRecord", {
        FromDate: moment(searchData?.FromDate).format("YYYY-MM-DD"),
        ToDate: moment(searchData?.ToDate).format("YYYY-MM-DD"),
        IsCommunicate: Communicate,
        IsFollowUp: FollowUp,
      })
      .then((res) => {
        setTableData(res?.data?.message);
        setSearchLoad(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
        setTableData([]);
        setSearchLoad(false);
      });
  };
  const handleCommunicate = (ele, comm, follow) => {
    setSelectedRow({ ...ele, IsCommunicate: comm, IsFollowUp: follow });
    setCommunicate((prev) => !prev);
  };
  const handleSave = (data) => {
    console.log(data);
    if (data != "") {
      axiosInstance
        .post("TestData/SaveCriticalRecord", {
          ...selectedRow,
          InformedTo: data,
        })
        .then((res) => {
          toast.success(res?.data?.message);
          handleCommunicate({});
          handleSearch(searchData?.IsCommunicate, searchData?.IsFollowUp);
        })
        .catch((err) =>
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something Went Wrong"
          )
        );
    } else {
      toast.error("Please enter Follow Up..");
    }
  };
  return (
    <>
      {communicate && (
        <SampleRemark
          show={communicate}
          PageName={selectedRow?.InformedTo}
          handleShow={handleCommunicate}
          state={selectedRow}
          handleSave={handleSave}
          title={"Enter Communicate"}
        />
      )}
      <PageHead name="Critical Record" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <DatePicker
                className="custom-calendar"
                placeholder=" "
                id="From Date"
                lable="From Date"
                name="FromDate"
                value={searchData?.FromDate}
                onChange={dateSelect}
                maxDate={new Date(searchData?.ToDate)}
              />
            </div>

            <div className="col-sm-2">
              <DatePicker
                className="custom-calendar"
                placeholder=" "
                id="To Date"
                lable="To Date"
                name="ToDate"
                value={searchData?.ToDate}
                maxDate={new Date()}
                minDate={new Date(searchData.FromDate)}
                onChange={dateSelect}
              />
            </div>
            <div className="col-sm-1">
              <button
                type="Search"
                className="btn btn-block btn-info btn-sm"
                onClick={() => handleSearch(0, 0)}
              >
                {t("Search")}
              </button>
            </div>

            <div className="col-sm-1">
              <ExportFile dataExcel={tableData} />
            </div>
            <div className="col-sm-1">
              <button
                type="button"
                className="btn btn-block btn-primary btn-sm"
                onClick={() => handleSearch(0, 0)}
              >
                {t("Pending")}
              </button>
            </div>
            <div className="col-sm-1">
              <button
                type="button"
                className="btn btn-block btn-sm"
                style={{ backgroundColor: "#47cd47", color: "white" }}
                onClick={() => handleSearch(1, 0)}
              >
                {t("Communicate")}
              </button>
            </div>
            <div className="col-sm-1">
              <button
                type="button"
                className="btn btn-block btn-sm"
                style={{ backgroundColor: "#f19dac", color: "white" }}
                onClick={() => handleSearch(0, 1)}
              >
                {t("Follow Up")}
              </button>
            </div>
          </div>
        </div>
      </PageHead>

      <div className="card">
        {searchLoad ? (
          <Loading />
        ) : (
          <Table>
            <thead className="cf">
              <tr>
                <th>S.No</th>
                <th>Patient ID</th>
                <th>LabNo.</th>
                <th>PatientName</th>
                <th>Request Date</th>
                <th>Parameters</th>
                <th>Result</th>
                <th>Mobile No.</th>

                <th>Ref. Doctor</th>
                <th>Centre</th>
                <th>Marked By</th>
                <th>Communicate</th>
                <th>Follow Up</th>
                <th>Inform Date</th>
                <th>Informed To</th>
                <th>Informed By</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr key={index} style={{ backgroundColor: getColor() }}>
                  <td data-title="S.No">{index + 1}</td>
                  <td data-title="Patient ID">{row?.PatientCode}</td>
                  <td data-title="LabNo.">{row?.LedgertransactionNo}</td>

                  <td data-title="PatientName">{row?.PatientName}</td>
                  <td data-title="Request Date">
                    {moment(row?.ApprovedDate).format("DD-MM-YYYY")}
                  </td>
                  <td data-title="Parameters">{row?.Parameters}</td>
                  <td data-title="Result">{row?.Result}</td>
                  <td data-title="Mobile No.">{row?.Mobile}</td>

                  <td data-title="Ref. Doctor">{row?.ReferDoctor}</td>
                  <td data-title="Centre">{row?.centre}</td>
                  <td data-title="Marked By">{row?.MarkedBy}</td>

                  <td data-title="Communicate">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleCommunicate(row, 1, row?.IsFollowUp)}
                    >
                      Communicate
                    </button>
                  </td>

                  <td data-title="Follow Up">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() =>
                        handleCommunicate(row, row?.IsCommunicate, 1)
                      }
                    >
                      FollowUp
                    </button>
                  </td>

                  <td data-title="Inform Date">
                    {row?.InformedDate != "" &&
                      moment(row?.InformedDate).format("DD-MM-YYYY")}
                  </td>
                  <td data-title="Informed To">{row?.InformedTo}</td>
                  <td data-title="Informed By">{row?.InformedBy}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </>
  );
};

export default CriticalCalloutRecord;
