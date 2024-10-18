import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  getAccessCentres,
  getDepartment,
} from "../../utils/NetworkApi/commonApi";
import { getAccessRateType, getBillingCategory } from "../util/Commonservices";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import PageHead from "../../components/CommonComponent/PageHead";
import DatePicker from "../../components/CommonComponent/DatePicker";
import { SelectBoxWithCheckbox } from "../../components/CommonComponent/MultiSelectBox";
import Input from "../../components/CommonComponent/Input";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import { number } from "../../utils/helpers";
import NoRecordFound from "../../components/CommonComponent/NoRecordFound";
import Loading from "../../components/Loading/Loading";

const DoctorMisReportPage = () => {
  const [tabledata, setTableData] = useState([]);
  const [tabledata1, setTableData1] = useState([]);
  const [tabledata2, setTableData2] = useState([]);
  const [Category, setCategory] = useState([]);
  const [DoctorData, setDoctorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(-1);
  const [loading2, setLoading2] = useState(-1);
  const [DepartmentData, setDepartmentData] = useState([]);
  const [RateType, setRateType] = useState([]);
  const [Speclization, setSpeclization] = useState([]);
  const [CentreData, setCentreData] = useState([]);
  const [payload, setPayload] = useState({
    CentreID: "",
    PanelID: "",
    DtFrom: moment(new Date()).format("DD-MMM-YYYY"),
    DtTo: moment(new Date()).format("DD-MMM-YYYY"),
    ProID: "",
    DoctorID: "",
    CategoryID: "",
    HeadDepartmentID: "",
    DepartmentID: "",
    Parm1: "",
    Val1: "",
    Parm2: "",
    Val2: "",
    ShareAmount1: "",
    ShareAmount2: "",
    Speclization: "",
    IsReff: "BOTH",
    DoctorMobile: "",
    LabNo: "",
    downLoadData: "EXCEL",
  });

  const patientCountOptions = [
    { value: "", label: "Select" },
    { value: "=", label: "=" },
    { value: ">=", label: ">=" },
    { value: "<=", label: "<=" },
    { value: ">", label: ">" },
    { value: "<", label: "<" },
    { value: "between", label: "between" },
  ];

  const dateSelect = (date, name) => {
    const dates = moment(date).format("DD-MMM-YYYY");
    setPayload({
      ...payload,
      [name]: dates,
    });
  };

  const handleTime = (time, secondName) => {
    let TimeStamp = "";
    TimeStamp = time?.Hour + ":" + time?.Minute + ":" + time?.second;

    setPayload({ ...payload, [secondName]: TimeStamp });
  };

  const handleChanges = (select, name) => {
    let val = select.map((ele) => ele?.value);

    console.log(val);
    setPayload({ ...payload, [name]: val });
  };

  // const handleSelectChange = (e) => {
  //   const { name, value } = e.target;
  //   setPayload({ ...payload, [name]: value });
  // };

  const handleSelectChange = (select, name) => {
    let val = "";
    for (let i = 0; i < select.length; i++) {
      val = val === "" ? `${select[i].value}` : `${val},${select[i].value}`;
    }
    setPayload({ ...payload, [name]: val });
  };

  const handleShow = (e) => {
    const { name, checked } = e.target;
    setPayload({ ...payload, [name]: checked });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const hideSelectBox = () => {
    const val = tabledata?.filter((item) => item?.isSelect === true);
    return val.length === tabledata.length ? false : true;
  };

  const handlePatientCount = () => {
    let count = 0;
    for (let i = 0; i < tabledata?.length; i++) {
      count = count + tabledata[i]["Total"];
    }

    return count;
  };

  const handlePatientShareAmount = () => {
    let count = 0;
    for (let i = 0; i < tabledata?.length; i++) {
      count = count + tabledata[i]["SharedAmount"];
    }

    return count.toFixed(2);
  };

  const handleChangeNew = (e, index) => {
    const { name, checked } = e.target;
    if (index >= 0) {
      const updateData = [...tabledata];
      updateData[index][name] = checked;
      setTableData(updateData);
    } else {
      const updateData = tabledata.map((item) => {
        return {
          ...item,
          isSelect: checked,
        };
      });
      setTableData(updateData);
    }
  };

  const handleRef = (e, id, name) => {
    console.log(id);
    const { checked } = e.target;
    setLoading(true);
    axiosInstance
      .post(`/DoctorMis/${name}`, {
        IsCheck: checked ? "1" : "0",
        DoctorID: id,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        handleSave();
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.data?.message ? err?.data?.message : "Error Occured");
      });
  };

  const DoctorSelectedHandle = (e, index) => {
    const { name, checked } = e.target;
    const data = [...tabledata];
    data[index][name] = checked;
    setTableData(data);
  };

  const table1data = (index, id) => {
    setLoading1(index);

    const payLoadData = { ...payload };
    payLoadData.DoctorID = id;
    axiosInstance
      .post("DoctorMis/showPatientData", payLoadData)
      .then((res) => {
        if (res?.data?.message.length > 0) {
          setTableData1(res?.data?.message);
        } else {
          toast.error("No Data Found");
          setTableData1([]);
        }

        setLoading1(-1);
      })
      .catch(() => {
        toast.error("error occured");
        setLoading1(-1);
      });
  };

  const handleSearchTest = (e, data) => {
    const { checked } = e.target;

    axiosInstance
      .post("DoctorMis/updateDocshare", {
        IsCheck: checked ? "1" : "0",
        LedgerTransactionNo: data?.LedgerTransactionNo,
        ItemId: data?.ItemId,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        table2data(data?.LedgerTransactionNo);
      })
      .catch((err) => {
        toast.error(err?.data?.message ? err?.data?.message : "Error occured");
      });
  };

  const getDropDownData = (name) => {
    axiosInstance
      .post("Global/getGlobalData", { Type: name })
      .then((res) => {
        let data = res.data.message;
        console.log(data);
        let value = data.map((ele) => {
          return {
            value: ele.FieldID,
            label: ele.FieldDisplay,
          };
        });

        switch (name) {
          case "Specialization":
            setSpeclization(value);
            break;
          case "IsReff":
            // setIsRef(value);
            break;
          default:
            break;
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSave = () => {
    setLoading(true);
    axiosInstance
      .post("DoctorMis/SearchDoctorSummary", {
        ...payload,
        DtFrom: moment(payload?.DtFrom).format("DD-MMM-YYYY"),
        DtTo: moment(payload?.DtTo).format("DD-MMM-YYYY"),
      })
      .then((res) => {
        const data = res?.data?.message;
        if (data.length > 0) {
          const val = data.map((ele) => {
            return {
              ...ele,
              isSelect: false,
            };
          });
          setTableData(val);
        } else {
          toast.error("No Data Found");
          setTableData([]);
        }
        setTableData1([]);
        setTableData2([]);

        setLoading(false);
      })
      .catch(() => {
        toast.error("error occured");
        setLoading(false);
      });
  };

  const table2data = (id) => {
    setLoading2(id);
    axiosInstance
      .post("DoctorMis/showTestData", {
        LabNo: id,
      })
      .then((res) => {
        const data = res?.data?.message?.map((ele) => {
          return {
            ...ele,
          };
        });
        setTableData2(data);
        setLoading2(-1);
      })
      .catch(() => {
        toast.error("Error Occured");
        setLoading2(-1);
      });
  };

  const getDoctorSuggestion = () => {
    axiosInstance
      .post("DoctorReferal/getDoctorDataBind")
      .then((res) => {
        const data = res?.data?.message;

        const val = data?.map((ele) => {
          return {
            label: ele?.DoctorName,
            value: ele?.DoctorID,
          };
        });
        setDoctorData(val);
      })
      .catch((err) => console.log(err));
  };
  const handleDownLoadExcel = (id) => {
    const payLoadData = { ...payload };
    payLoadData.DoctorID = id;
    axiosInstance
      .post("DoctorMis/ReportDoctorSummary", payload)
      .then((res) => {
        toast.success(res?.data?.message);
        window.open(res?.data?.Url, "_blank");
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
    getAccessCentres(setCentreData);
    getBillingCategory(setCategory);
    getDepartment(setDepartmentData);
    getAccessRateType(setRateType);
    getDoctorSuggestion();
    getDropDownData("Specialization");
    getDropDownData("Doctor");
    getDropDownData("IsRef");
  }, []);
  return (
    <>
      <PageHead name="Doctor MIS Report" showDrop="true">
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <DatePicker
                name="DtFrom"
                value={new Date(payload?.DtFrom)}
                onChange={dateSelect}
                maxDate={new Date()}
                lable="From Date"
              />
            </div>
            <div className="col-sm-2">
              <DatePicker
                name="DtTo"
                value={new Date(payload?.DtTo)}
                onChange={dateSelect}
                maxDate={new Date()}
                minDate={new Date(payload.DtFrom)}
                lable="To Date"
              />
            </div>
            <div className="col-sm-2">
              <SelectBoxWithCheckbox
                options={CentreData}
                value={payload?.CentreID}
                name="CentreID"
                id="CentreID"
                placeholder=""
                onChange={handleSelectChange}
                lable="Centre"
              />
            </div>
            <div className="col-sm-2">
              <SelectBoxWithCheckbox
                options={RateType}
                value={payload.PanelID}
                name="PanelID"
                id="PanelID"
                placeholder=""
                onChange={handleSelectChange}
                lable="RateType"
              />
            </div>
            <div className="col-sm-2">
              <SelectBoxWithCheckbox
                options={Category}
                name={"CategoryID"}
                id="CategoryID"
                placeholder=""
                value={payload?.CategoryID}
                onChange={handleSelectChange}
                lable="Category"
              />
            </div>
            <div className="col-sm-2">
              <SelectBoxWithCheckbox
                onChange={handleSelectChange}
                name={"DepartmentID"}
                id="DepartmentID"
                placeholder=""
                value={payload?.DepartmentID}
                options={DepartmentData}
                lable="Department"
              />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-sm-2">
              <SelectBoxWithCheckbox
                onChange={handleSelectChange}
                name={"DoctorID"}
                id="DoctorID"
                placeholder=""
                value={payload?.DoctorID}
                options={DoctorData}
                lable="Doctor"
              />
            </div>
            <div className="col-sm-1 d-flex align-items-center">
              <input
                type="checkbox"
                name="isChecked"
                id="isChecked"
                placeholder=""
                checked={payload?.isChecked}
                onChange={handleShow}
              />
              <label className="col-sm-10">Show More</label>
            </div>
            {/* <div className="col-sm-2 d-flex align-items-center">
              <input
                type="checkbox"
                name="isChecked"
                id="isChecked"
                placeholder=""
                checked={payload?.isChecked}
                onChange={handleShow}
              />
            </div> */}
            {payload.isChecked ? (
              <>
                <div className="col-sm-2">
                  <div className="d-flex align-items-center">
                    <div style={{ width: "40%" }}>
                      <SelectBox
                        className="form-control "
                        options={patientCountOptions}
                        style={{ width: "50%" }}
                        name="Parm1"
                        value={payload?.Parm1}
                        onChange={handleChange}
                        lable="PatientCount"
                        placeholder=""
                      />
                    </div>{" "}
                    <div style={{ width: "60%" }}>
                      <Input
                        className="form-control ml-2"
                        style={{ width: "50%" }}
                        type="number"
                        name="Val1"
                        value={payload?.Val1}
                        onChange={handleChange}
                        placeholder=""
                        lable="Value"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-sm-2">
                  <div className="d-flex align-items-center">
                    <div style={{ width: "40%" }}>
                      <SelectBox
                        className="select_control"
                        options={patientCountOptions}
                        style={{ width: "50%" }}
                        name="Parm1"
                        value={payload?.Parm1}
                        onChange={handleChange}
                        lable="Ref Amount"
                        placeholder=""
                      />
                    </div>
                    <div style={{ width: "60%" }}>
                      <Input
                        className="select-input-box form-control input-sm"
                        style={{ width: "50%" }}
                        type="number"
                        name="ShareAmount2"
                        id="ShareAmount2"
                        value={payload?.ShareAmount2}
                        onChange={handleChange}
                        placeholder=""
                        lable="Value"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-sm-1">
                  <Input
                    type="number"
                    name="DoctorMobile"
                    id="DoctorMobile"
                    placeholder=""
                    onInput={(e) => number(e, 10)}
                    value={payload?.DoctorMobile}
                    onChange={handleChange}
                    lable="Mobile No"
                  />
                </div>
                <div className="col-sm-2">
                  <SelectBoxWithCheckbox
                    onChange={handleSelectChange}
                    options={Speclization}
                    name="Speclization"
                    id="Speclization"
                    placeholder=""
                    value={payload?.Speclization}
                    lable="Doctor Spl"
                  />
                </div>
                <div className="col-sm-2">
                  <SelectBox
                    options={[
                      { value: "IsRef", label: "IsRef" },
                      { value: "both", label: "BOTH" },
                      { value: "Y", label: "Y" },
                      { value: "N", label: "N" },
                    ]}
                    className="select_control"
                    name="IsReff"
                    id="IsReff"
                    placeholder=""
                    value={payload?.IsReff}
                    onChange={handleChange}
                    lable="IsReff"
                  />
                </div>
              </>
            ) : (
              ""
            )}
            <div className="row">
              {loading ? (
                <Loading />
              ) : (
                <div className="col-sm-1">
                  <button
                    type="button"
                    className="btn btn-block btn-primary btn-sm"
                    onClick={handleSave}
                  >
                    Search
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </PageHead>
      <div className="card">
        <div className="row">
          <div className="col-sm-2 d-flex align-items-center">
            <input
              type="radio"
              value="Patient Wise"
              checked="true"
              placeholder=""
              className="control-label"
            />
            <label className="col-sm-10">Patient Wise</label>
          </div>
          <div className="col-sm-2 d-flex align-items-center">
            <input
              type="radio"
              value="PDF"
              onChange={handleChange}
              className="control-label"
              name="downLoadData"
              id="downLoadChoice1"
            />
            <label className="col-sm-10">PDF</label>
          </div>
          <div className="col-sm-2 d-flex align-items-center">
            <input
              type="radio"
              value="EXCEL"
              checked={payload?.downLoadData === "EXCEL"}
              onChange={handleChange}
              className="control-label"
              name="downLoadData"
              id="downLoadChoice2"
            />
            <label className="col-sm-10">EXCEL</label>
          </div>
          <div className="col-sm-2">
            {payload?.downLoadData === "EXCEL" ? (
              <button
                className="btn btn-block btn-success btn-sm"
                type="submit"
                onClick={() => ExportToExcel(tabledata)}
              >
                Download Excel
              </button>
            ) : (
              <button
                className="btn btn-block btn-success btn-sm"
                type="submit"
                onClick={handleDownLoadExcel}
              >
                Download PDF
              </button>
            )}
          </div>
        </div>
      </div>
      {tabledata.length > 0 && (
        <div className="box">
          <div className="box-header with-border">
            {hideSelectBox() && (
              <div className="col-md-2">
                <select className="select_control" name="">
                  <option hidden> Select </option>
                  {tabledata?.map(
                    (ele, index) =>
                      ele?.isSelect && (
                        <option key={index} value={ele?.Doctor}>
                          {ele?.Doctor}
                        </option>
                      )
                  )}
                </select>
              </div>
            )}
            <div className={hideSelectBox() ? "col-md-10" : "col-md-12"}>
              <h6 style={{ textAlign: "end" }} className="text-primary">
                Total Doctor Count : {tabledata?.length} , Toatl Patient Count :{" "}
                {handlePatientCount()} , Total Shared Amount :{" "}
                {handlePatientShareAmount()}
              </h6>
            </div>
          </div>
          <div
            className={`box-body divResult table-responsive ${
              tabledata.length > 8 && "boottable"
            }`}
            id="no-more-tables"
          >
            <div className="row">
              <div className="col-12">
                <table
                  className="table table-bordered table-hover table-striped tbRecord"
                  cellPadding="{0}"
                  cellSpacing="{0}"
                >
                  <thead className="cf">
                    <tr>
                      <th>S.No</th>
                      <th>Ref</th>
                      <th>Count</th>

                      <th>
                        {/* Select */}
                        <div>
                          <Input
                            type="checkbox"
                            name="isSelect"
                            checked={
                              tabledata.length > 0
                                ? isChecked(
                                    "isSelect",
                                    tabledata,
                                    true
                                  ).includes(false)
                                  ? false
                                  : true
                                : false
                            }
                            onChange={(e, index) => {
                              handleChangeNew(e, index);
                            }}
                          />
                        </div>
                      </th>

                      <th>Doc Name</th>
                      <th>Master Share</th>
                      <th>Phone</th>
                      <th>Mobile</th>
                      <th>Share Amount</th>
                      <th>Added On</th>
                      <th>Show</th>
                    </tr>
                  </thead>
                  {tabledata?.map((item, index) => (
                    <tbody>
                      <tr key={index}>
                        <td data-title={"S.No"}>{index + 1}</td>
                        <td data-title={"Ref"}>
                          <Input
                            type="checkbox"
                            checked={
                              item?.Referal.toLowerCase() === "y" ? true : false
                            }
                            onChange={(e) =>
                              handleRef(e, item?.DoctorID, "DoctorRefferal")
                            }
                          />
                        </td>
                        <td data-title={"Count"}>{item.Total}</td>
                        <td data-title={"#"}>
                          <Input
                            type="checkbox"
                            checked={item?.isSelect}
                            name="isSelect"
                            onChange={(e) => DoctorSelectedHandle(e, index)}
                            disabled={item?.isChecked ? true : false}
                          />
                        </td>
                        <td data-title={"Count"}>{item?.Doctor}</td>
                        <td data-title={"Master Share"}>
                          <Input
                            type="checkbox"
                            checked={
                              item?.MasterShare.toLowerCase() === "y"
                                ? true
                                : false
                            }
                            onChange={(e) =>
                              handleRef(e, item?.DoctorID, "ShareMasterUpdate")
                            }
                          />
                        </td>
                        <td data-title={"Phone"}>{item?.Phone}</td>
                        <td data-title={"Mobile"}>{item?.Mobile}</td>
                        <td data-title={"Share Amount"}>
                          {item?.SharedAmount}
                        </td>
                        <td data-title={"Added On"}>{item.AddedDate}</td>
                        <td
                          data-title={"Show"}
                          onClick={() => table1data(index, item?.DoctorID)}
                        >
                          {loading1 === index ? (
                            <Loading />
                          ) : (
                            <i className="fa fa-search" />
                          )}
                        </td>
                      </tr>
                    </tbody>
                  ))}
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-sm-8">
          {tabledata1.length > 0 && (
            <div className="box">
              <div className="box-header with-border">
                <h1 className="box-title"> Patient Detail</h1>
              </div>
              <div
                className={`box-body divResult table-responsive ${
                  tabledata.length > 8 && "boottable"
                }`}
                id="no-more-tables"
              >
                <div className="row">
                  <div className="col-12">
                    <table
                      className="table table-bordered table-hover table-striped tbRecord"
                      cellPadding="{0}"
                      cellSpacing="{0}"
                    >
                      <thead className="cf">
                        <tr>
                          <th>S.No</th>
                          <th>LabNo.</th>
                          <th>VisitDate</th>
                          <th>Patient</th>
                          <th>GrossAmount</th>
                          <th>Discount</th>
                          <th>NetAmount</th>
                          <th>PaidAmount</th>
                          <th>Balance</th>
                          <th>Show</th>
                        </tr>
                      </thead>
                      {tabledata1?.map((item, index) => (
                        <tbody>
                          <tr key={index}>
                            <td data-title={"S.No"}>{index + 1}</td>
                            <td data-title={"LabNo."}>
                              {item?.LedgerTransactionNo}
                            </td>
                            <td data-title={"VisitDate"}>{item?.dtEntry}</td>
                            <td data-title={"Patient"}>{item?.Patient}</td>
                            <td data-title={"GrossAmount"}>
                              {item?.GrossAmount}
                            </td>
                            <td data-title={"Discount"}>
                              {item?.DiscountOnTotal}
                            </td>
                            <td data-title={"NetAmount"}>{item?.NetAmount}</td>
                            <td data-title={"PaidAmount"}>
                              {item?.PaidAmount}
                            </td>
                            <td data-title={"Balance"}>{item?.Balance}</td>
                            <td
                              data-title={"Show"}
                              onClick={() => {
                                table2data(item?.LedgerTransactionNo);
                              }}
                            >
                              {loading2 === item?.LedgerTransactionNo ? (
                                <Loading />
                              ) : (
                                <i className="fa fa-search" />
                              )}
                            </td>
                          </tr>
                        </tbody>
                      ))}
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="col-sm-4">
          {tabledata2.length > 0 && (
            <div className="box">
              <div className="box-header with-border">
                <h1 className="box-title">Test Detail</h1>
              </div>
              <div
                className={`box-body divResult table-responsive ${
                  tabledata.length > 8 && "boottable"
                }`}
                id="no-more-tables"
              >
                <div className="row">
                  <div className="col-12">
                    <table
                      className="table table-bordered table-hover table-striped tbRecord"
                      cellPadding="{0}"
                      cellSpacing="{0}"
                    >
                      <thead className="cf">
                        <tr>
                          <th>S.No</th>
                          <th>Test Name.</th>
                          <th>ShareAmt</th>
                          <th>Amount</th>
                          <th>#</th>
                        </tr>
                      </thead>
                      {tabledata2?.map((item, index) => (
                        <tbody>
                          <tr key={index}>
                            <td data-title={"S.No"}>{index + 1}</td>
                            <td data-title={"Test Name."}>{item?.Item}</td>
                            <td data-title={"ShareAmt"}>{item?.DoctorShare}</td>
                            <td data-title={"Amount"}>{item?.Rate}</td>
                            <td data-title={"#"}>
                              <Input
                                type="checkbox"
                                onChange={(e) => handleSearchTest(e, item)}
                              />
                            </td>
                          </tr>
                        </tbody>
                      ))}
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DoctorMisReportPage;
