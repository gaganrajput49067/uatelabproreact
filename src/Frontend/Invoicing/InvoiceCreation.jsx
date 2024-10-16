import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import moment from "moment";

import DatePicker from "../../components/CommonComponent/DatePicker";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import { ExportToExcel } from "../../utils/helpers";
import Table from "../../components/Table/Table";
import PageHead from "../../components/CommonComponent/PageHead";
import Loading from "../../components/Loading/Loading";
import { axiosInstance } from "../../utils/axiosInstance";
import { isChecked } from "../util/Commonservices";
import InvoiceCreationModal from "./InvoiceCreationModal";
import NoRecordFound from "../../components/CommonComponent/NoRecordFound";

const InvoiceCreation = () => {
  const [tableData, setTableData] = useState([]);
  const [patientType, setPatientType] = useState([]);
  const [show, setShow] = useState({
    modal: false,
    id: "",
  });
  const [load, setLoad] = useState({
    name: "",
    loading: false,
  });
  const [CentreData, setCentreData] = useState([]);
  const [payload, setPayload] = useState({
    FromDate: new Date(),
    ToDate: new Date(),
    CentreID: "",
    InvoiceDate: new Date(),
    PatientTypes: "",
    IsChecked: "",
  });
  const [excelLoad, setExcelLoad] = useState({
    index: -1,
    load: false,
  });
  const getPatientType = () => {
    axiosInstance
      .get("centre/getCentreType")
      .then((res) => {
        let data = res?.data?.message;
        let PatientTypeList = data?.map((ele) => {
          return {
            value: ele?.id,
            label: ele?.Centretype,
          };
        });
        setPatientType(PatientTypeList);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCheck = (e, index) => {
    const { checked, name } = e.target;
    if (index >= 0) {
      const data = [...tableData];
      data[index][name] = checked;
      setTableData(data);
    } else {
      const data = tableData.map((ele) => {
        return {
          ...ele,
          [name]: checked,
        };
      });
      setTableData(data);
    }
  };

  const saveInvoice = () => {
    const filteredData = tableData.filter((ele) => ele.IsChecked === true);
    if (filteredData.length > 0) {
      setLoad({
        name: "SaveLoading",
        loading: true,
      });
      const val = filteredData.map((ele) => {
        return ele.ClientID;
      });

      axiosInstance
        .post("api/v1/Accounts/InvoiceCreation", {
          FromDate: moment(payload?.FromDate).format("YYYY-MM-DD"),
          ToDate: moment(payload?.ToDate).format("YYYY-MM-DD"),
          InvoiceDate: moment(payload?.InvoiceDate).format("YYYY-MM-DD"),
          InvoiceTo: val,
        })
        .then((res) => {
          setLoad({
            name: "",
            loading: false,
          });
          InvoiceCreationSearch();
          toast.success(res?.data?.message);
        })
        .catch(() => {
          setLoad({
            name: "",
            loading: false,
          });
        });
    } else {
      toast.error("Please select atleast one.");
    }
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    if (name === "PatientTypes") {
      setPayload({ ...payload, [name]: value, CentreID: "" });
      getAccessCentres(value);
    } else {
      setPayload({ ...payload, [name]: value });
    }
  };

  const dateSelect = (value, name) => {
    setPayload({
      ...payload,
      [name]: value,
    });
    setTableData([]);
  };
  const InvoiceCreationSearch = () => {
    if (payload?.PatientTypes) {
      setLoad({
        name: "searchLoading",
        loading: true,
      });

      axiosInstance
        .post("Accounts/InvoiceCreationSearch", {
          ...payload,
          InvoiceTo: payload?.CentreID,
          FromDate: moment(payload?.FromDate).format("DD-MMM-YYYY"),
          ToDate: moment(payload?.ToDate).format("DD-MMM-YYYY"),
        })
        .then((res) => {
          setLoad({
            name: "",
            loading: false,
          });
          if (res?.data.success) {
            if (res?.data?.message.length > 0) {
              setTableData(res?.data?.message);
            } else {
              toast.error("No Record Found");
              setTableData([]);
            }
          } else {
            toast.error("No Record Found");
            setTableData([]);
          }
        })
        .catch((err) => {
          setLoad({
            name: "",
            loading: false,
          });
          toast.error("Something went wrong");
        });
    } else {
      toast.error("Please Select Any Centre Type");
    }
  };
  const downloadExcel = (ele, index) => {
    setExcelLoad({
      index: index,
      load: true,
    });
    axiosInstance
      .post("Accounts/InvoiceDetails", {
        FromDate: moment(payload?.FromDate).format("DD-MMM-YYYY"),
        ToDate: moment(payload?.ToDate).format("DD-MMM-YYYY"),
        InvoiceDate: moment(payload?.InvoiceDate).format("DD-MMM-YYYY"),
        ClientID: ele?.ClientID,
      })
      .then((res) => {
        setExcelLoad({
          index: index,
          load: false,
        });
        toast.success("Successfully Download");
        let data = res.data.message;
        ExportToExcel(data);
      })
      .catch((err) => {
        setExcelLoad({
          index: index,
          load: false,
        });
        console.log(err);
      });
  };
  const handleModalState = (data) => {
    setShow({
      modal: true,
      id: {
        FromDate: moment(payload?.FromDate).format("DD-MMM-YYYY"),
        ToDate: moment(payload?.ToDate).format("DD-MMM-YYYY"),
        InvoiceDate: moment(payload?.InvoiceDate).format("DD-MMM-YYYY"),
        ClientID: data?.ClientID,
      },
    });
  };

  const handleModalClose = () => {
    setShow({
      modal: false,
      id: "",
    });
  };

  const getAccessCentres = (value) => {
    axiosInstance
      .post("Accounts/GetRateTypeByGlobalCentreById", {
        TypeId: value,
      })
      .then((res) => {
        let data = res.data.message;
        let CentreDataValue = data.map((ele) => {
          return {
            value: ele.RateTypeID,
            label: ele.RateTypeName,
          };
        });

        setCentreData(CentreDataValue);
      })
      .catch((err) => {
        setCentreData([]);
        console.log(err);
      });
  };

  const CheckedBox = () => {
    const value = tableData?.filter((ele) => {
      return ele?.IsChecked === true;
    });
    return value.length > 0;
  };

  useEffect(() => {
    getPatientType();
  }, []);
  return (
    <>
      <PageHead name="Invoice Creation" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <SelectBox
                options={[{ label: "Select", value: "" }, ...patientType]}
                name="PatientTypes"
                lable="Centre Type"
                id="Centre Type"
                selectedValue={payload?.PatientTypes}
                onChange={handleSelectChange}
              />
            </div>

            <div className="col-sm-2">
              <SelectBox
                options={[{ label: "Select", value: "" }, ...CentreData]}
                name="CentreID"
                lable="Rate Type"
                id="Rate Type"
                selectedValue={payload?.CentreID}
                onChange={handleSelectChange}
              />
            </div>
            <div className="col-sm-2">
              <div>
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
            </div>
            <div className="col-sm-2">
              <div>
                <DatePicker
                  className="custom-calendar"
                  placeholder=" "
                  id="ToDate"
                  lable="ToDate"
                  name="ToDate"
                  value={payload?.ToDate}
                  onChange={dateSelect}
                  minDate={new Date(payload.FromDate)}
                />
              </div>
            </div>
            <div className="col-sm-2">
              <div>
                <DatePicker
                  className="custom-calendar"
                  placeholder=" "
                  id="InvoiceDate"
                  lable="InvoiceDate"
                  name="InvoiceDate"
                  value={payload?.InvoiceDate}
                  onChange={dateSelect}
                  maxDate={new Date()}
                />
              </div>
            </div>
            <div className="col-sm-1">
              <button
                className="btn btn-block btn-info btn-sm"
                onClick={InvoiceCreationSearch}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </PageHead>

      {load?.name === "searchLoading" && load?.loading ? (
        <Loading />
      ) : tableData?.length > 0 ? (
        <div className="card">
          <>
            <Table>
              <thead className="text-center cf" style={{ zIndex: 99 }}>
                <tr>
                  <th>View</th>
                  <th>S.No</th>
                  <th>Code</th>
                  <th>Client Name</th>
                  <th>Share Amt.</th>
                  <th>Net Amt.</th>
                  <th>
                    <input
                      type="checkbox"
                      name="IsChecked"
                      onChange={(e) => {
                        handleCheck(e);
                      }}
                      checked={
                        tableData.length > 0
                          ? isChecked("IsChecked", tableData, true).includes(
                              false
                            )
                            ? false
                            : true
                          : false
                      }
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData?.map((ele, index) => (
                  <tr key={index}>
                    <td data-title="View">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                        }}
                      >
                        <i
                          className="fa fa-search"
                          onClick={() => handleModalState(ele)}
                        />
                        {excelLoad.load && excelLoad.index == index ? (
                          <Loading />
                        ) : (
                          <i
                            className="fa fa-file-excel-o"
                            onClick={() => downloadExcel(ele, index)}
                          />
                        )}
                      </div>
                    </td>
                    <td data-title="S.No">{index + 1}&nbsp;</td>
                    <td data-title="Code">{ele.ClientCode}&nbsp;</td>
                    <td data-title="Client Name">{ele.ClientName}&nbsp;</td>
                    <td data-title="Share Amt.">{ele.ShareAmt}&nbsp;</td>
                    <td data-title="Net Amount.">{ele.Amount}&nbsp;</td>
                    <td data-title="Action">
                      <input
                        type="checkbox"
                        name="IsChecked"
                        onChange={(e) => {
                          handleCheck(e, index);
                        }}
                        checked={ele?.IsChecked}
                      ></input>
                    </td>
                  </tr>
                ))}
              </tbody>

              {CheckedBox() && (
                <div className="row">
                  {load?.name === "SaveLoading" && load?.loading ? (
                    <Loading />
                  ) : (
                    <div className="col-sm-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-success btn-block"
                        onClick={saveInvoice}
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              )}
            </Table>
          </>
        </div>
      ) : (
        <div className="card">
          <NoRecordFound />
        </div>
      )}

      {show?.modal && (
        <InvoiceCreationModal
          show={show?.modal}
          data={show?.id}
          onClose={handleModalClose}
        />
      )}
    </>
  );
};

export default InvoiceCreation;
