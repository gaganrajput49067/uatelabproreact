import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import moment from "moment";
import { axiosInstance } from "../../utils/axiosInstance";
import { GetRateTypeByGlobalCentre } from "../../utils/NetworkApi/commonApi";
import Loading from "../../components/Loading/Loading";
import { SelectBoxWithCheckbox } from "../../components/CommonComponent/MultiSelectBox";
import DatePicker from "../../components/CommonComponent/DatePicker";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import { ExportToExcel } from "../../utils/helpers";
import Table from "../../components/Table/Table";
import PageHead from "../../components/CommonComponent/PageHead";
import { TypeData } from "../../utils/Constants";

const LedgerStatusAsOnDate = () => {
  const [RateType, setRateType] = useState([]);
  const [TableData, setTableData] = useState({});
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    RateTypeId: [],
    AsOnDate: new Date(),
    AsOnTime: "00:00:00",
    FromDate: new Date(),
    ToDate: new Date(),
    DateType: "1",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };
  const handleSelectMultiChange = (select, name, value) => {
    if (name === "RateTypeId") {
      const val = select.map((ele) => {
        return ele?.value;
      });
      setPayload({ ...payload, [name]: val });
    }
  };

  const dateSelect = (value, name) => {
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const handleSearch = () => {
    if (payload?.RateTypeId?.length > 0) {
      const formattedPayload = {
        AsOnDate: moment(payload?.AsOnDate, "DD-MM-YYYY").format("DD-MMM-YYYY"),
        AsOnTime: payload?.AsOnTime,
        FromDate: moment(payload?.FromDate, "DD-MM-YYYY").format("DD-MMM-YYYY"),
        ToDate: moment(payload?.ToDate, "DD-MM-YYYY").format("DD-MMM-YYYY"),
        DateType: payload?.DateType,
        RateTypeId: payload?.RateTypeId,
      };
      setLoading(true);
      axiosInstance
        .post("Accounts/LedgerStatusAsOnDateReport", formattedPayload)
        .then((res) => {
          const data = res?.data?.message;
          const obj = {
            DateType: payload?.DateType,
            details: data,
          };
          setTableData(obj);

          setLoading(false);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
          setLoading(false);
        });
    } else {
      toast.error("Please Select Rate Type");
    }
  };
  useEffect(() => {
    GetRateTypeByGlobalCentre(setRateType);
  }, []);
  return (
    <>
      <PageHead name="Ledger Status As On Date Report" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <SelectBoxWithCheckbox
                options={RateType}
                placeholder=" "
                lable="RateType"
                id="RateType"
                name="RateTypeId"
                value={payload?.RateTypeId}
                onChange={handleSelectMultiChange}
              />
            </div>
            <div className="col-sm-2">
              <SelectBox
                options={TypeData}
                name="DateType"
                lable="Type"
                id="Type"
                selectedValue={payload?.DateType}
                onChange={handleChange}
              />
            </div>
            {payload?.DateType === "1" && (
              <>
                <div className="col-sm-2">
                  <DatePicker
                    className="custom-calendar"
                    placeholder=" "
                    id="AsOnDate"
                    lable="As On Date"
                    name="AsOnDate"
                    value={payload?.AsOnDate}
                    onChange={dateSelect}
                    maxDate={new Date()}
                  />
                </div>
              </>
            )}
            {payload?.DateType === "2" && (
              <>
                <div className="col-sm-2">
                  <DatePicker
                    className="custom-calendar"
                    placeholder=" "
                    id="FromDate"
                    lable="FromDate"
                    name="FromDate"
                    value={payload?.FromDate}
                    onChange={dateSelect}
                    maxDate={new Date()}
                  />
                </div>
                <div className="col-sm-2">
                  <DatePicker
                    className="custom-calendar"
                    placeholder=" "
                    id="ToDate"
                    lable="ToDate"
                    name="ToDate"
                    value={payload?.ToDate}
                    onChange={dateSelect}
                    maxDate={new Date()}
                    minDate={new Date(payload.FromDate)}
                  />
                </div>
              </>
            )}
            {payload?.DateType === "3" && (
              <>
             
                <div className="col-sm-2">
                  <DatePicker
                    className="custom-calendar"
                    placeholder=" "
                    id="FromDate"
                    lable="FromDate"
                    name="FromDate"
                    value={payload?.FromDate}
                    onChange={dateSelect}
                    maxDate={new Date()}
                  />
                </div>
                <div className="col-sm-2">
                  <DatePicker
                    className="custom-calendar"
                    placeholder=" "
                    id="ToDate"
                    lable="ToDate"
                    name="ToDate"
                    value={payload?.ToDate}
                    onChange={dateSelect}
                    maxDate={new Date()}
                    minDate={new Date(payload.FromDate)}
                  />
                </div>
              </>
            )}
          </div>
          <div className="row">
            <div className="col-sm-1">
              <button
                className="btn btn-block btn-sm btn-primary"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
            <div className="col-sm-1">
              <button
                className="btn btn-block  btn-sm btn-success"
                onClick={() => ExportToExcel(TableData.details)}
                disabled={!TableData.details || TableData.details.length === 0}
              >
                Report
              </button>
            </div>
          </div>
        </div>
      </PageHead>

      {loading ? (
        <Loading />
      ) : (
        <>
          {TableData.details && TableData.details.length > 0 && (
            <>
              {TableData?.DateType === "1" && (
                <div className="card">
                  <>
                    <Table>
                      <thead className="cf">
                        <tr>
                          <th>S.No.</th>
                          <th>Code</th>
                          <th>Client Name</th>
                          <th>Zone</th>
                          <th>State</th>
                          <th>City</th>
                          <th>Contact No.</th>
                          <th>Date</th>
                          <th>Opening Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {TableData.details.map((ele, index) => (
                          <tr key={index}>
                            <td data-title="S.No.">{index + 1}</td>
                            <td data-title="Code">{ele?.PanelCode}</td>
                            <td data-title="Client Name">{ele?.PanelName}</td>
                            <td data-title="Zone">{ele?.Zone}</td>
                            <td data-title="State">
                              {ele?.State == "------SELECT-----"
                                ? ""
                                : ele?.State}
                            </td>
                            <td data-title="City">
                              {ele?.City == "-----SELECT----" ? "" : ele?.City}
                            </td>
                            <td data-title="Contact No.">{ele?.Mobile}</td>
                            <td data-title="Date">{ele?.AsOnDate}</td>
                            <td
                              data-title="Opening Balance"
                              style={{ textAlign: "right" }}
                            >
                              {ele?.OpeningBalance}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </>
                </div>
              )}
            </>
          )}
          {TableData.details && TableData.details.length > 0 && (
            <>
              {TableData?.DateType === "2" && (
                <div className="card">
                  <>
                    <Table>
                      <thead className="cf">
                        <tr>
                          <th>S.No.</th>
                          <th>Code</th>
                          <th>Client Name</th>
                          <th>Creation Date</th>
                          <th>Zone</th>
                          <th>State</th>
                          <th>City</th>
                          <th>Contact No.</th>
                          <th>Date</th>
                          <th>Opening Balance</th>
                          <th>IsBookingLock</th>
                          <th>Paid Amt</th>
                          <th>Balance Amt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {TableData.details.map((ele, index) => (
                          <tr key={index}>
                            <td data-title="S.No.">{index + 1}</td>
                            <td data-title="Code">{ele?.PanelCode}</td>
                            <td data-title="Client Name">{ele?.PanelName}</td>
                            <td data-title="Creation Date">
                              {ele?.CreatorDate}
                            </td>
                            <td data-title="Zone">{ele?.Zone}</td>
                            <td data-title="State">{ele?.State}</td>
                            <td data-title="City">{ele?.City}</td>
                            <td data-title="Contact No.">{ele?.Mobile}</td>
                            <td data-title="Date">{ele?.AsOnDate}</td>
                            <td data-title="Opening Balance">
                              {ele?.OpeningBalance}
                            </td>
                            <td data-title="IsBookingLock">
                              {ele?.IsBlockPanelBooking == 0 ? "No" : "Yes"}
                            </td>
                            <td data-title="Paid Amt">{ele?.ReceivedAmount}</td>
                            <td data-title="Balance Amt">
                              {ele?.TotalOutstanding}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </>
                </div>
              )}
            </>
          )}
          {TableData.details && TableData.details.length > 0 && (
            <>
              {TableData?.DateType === "3" && (
                <div className="card">
                  <>
                    <Table>
                      <thead className="cf">
                        <tr>
                          <th>S.No.</th>
                          <th>Code</th>
                          <th>Client Name</th>
                          <th>Zone</th>
                          <th>State</th>
                          <th>City</th>
                          <th>Contact No.</th>
                          <th>Date</th>
                          <th>Opening Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {TableData.details.map((ele, index) => (
                          <tr key={index}>
                            <td data-title="S.No.">{index + 1}</td>
                            <td data-title="Code">{ele?.PanelCode}</td>
                            <td data-title="Client Name">{ele?.PanelName}</td>
                            <td data-title="Zone">{ele?.Zone}</td>
                            <td data-title="State">{ele?.State}</td>
                            <td data-title="City">{ele?.City}</td>
                            <td data-title="Contact No.">{ele?.Mobile}</td>
                            <td data-title="Date">{ele?.AsOnDate}</td>
                            <td
                              data-title="Opening Balance"
                              style={{ textAlign: "right" }}
                            >
                              {ele?.OpeningBalance}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </>
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default LedgerStatusAsOnDate;
