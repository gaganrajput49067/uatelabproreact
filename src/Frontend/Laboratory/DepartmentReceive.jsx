import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import {
  AddBlankData,
  AllDataDropDownPayload,
  Time,
  getTrimmedData,
} from "../../utils/helpers";
import { getDoctorSuggestion } from "../../utils/NetworkApi/commonApi";
import { SearchBy, stateIniti } from "../../utils/Constants";
import { axiosInstance } from "../../utils/axiosInstance";
import PageHead from "../../components/CommonComponent/PageHead";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import Input from "../../components/CommonComponent/Input";
import DatePicker from "../../components/CommonComponent/DatePicker";
import CustomTimePicker from "../../components/CommonComponent/TimePicker";
import Loading from "../../components/Loading/Loading";
import moment from "moment";
import DepartmentReceiveTable from "../Table/DepartmentReceiveTable";

const DepartmentReceive = () => {
  const [CentreData, setCentreData] = useState([]);
  const [RateTypes, setRateTypes] = useState([]);
  const [DepartmentData, setDepartmentData] = useState([]);
  const [toggleDate, setToggleDate] = useState({
    FromDate: false,
    ToDate: false,
  });
  const [drdata, setDrData] = useState([]);
  const [searchstatus, setSearchStatus] = useState([]);
  const [saveTestId, setSaveTestId] = useState([]);
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState(stateIniti);
  const [collecteddataexist, SetCollectedDataExist] = useState([]);
  const [show4, setShow4] = useState({
    modal: false,
    data: "",
    index: -1,
  });

  const [show, setShow] = useState({
    modal: false,
    data: "",
    index: -1,
  });
  const [doctorSuggestion, setDoctorSuggestion] = useState([]);
  const [indexMatch, setIndexMatch] = useState(0);
  const [dropFalse, setDropFalse] = useState(true);
  const [pageType, setpageType] = useState("");

  const [formData, setFormData] = useState({
    FromDate: new Date(),
    ToDate: new Date(),
    CentreID: "",
    ItemValue: "",
    RateTypeID: "",
    SelectTypes: "",
    RefundFilter: null,
    FromTime: new Date(),
    ToTime: new Date(),
    DoctorReferal: "",
    DepartmentID: "",
    DoctorName: "",
  });
  const [accessNavLink, setAccessNavLink] = useState([]);

  const navigate = useNavigate();
  const handleIndex = (e) => {
    switch (e.which) {
      case 38:
        if (indexMatch !== 0) {
          setIndexMatch(indexMatch - 1);
        } else {
          setIndexMatch(doctorSuggestion.length - 1);
        }
        break;
      case 40:
        if (doctorSuggestion.length - 1 === indexMatch) {
          setIndexMatch(0);
        } else {
          setIndexMatch(indexMatch + 1);
        }
        break;
      case 13:
        handleListSearch(doctorSuggestion[indexMatch], "DoctorName");
        setIndexMatch(0);
        break;
      default:
        break;
    }
  };
  const totalPatient = () => {
    const visitNos = drdata?.map((item) => item?.VisitNo);
    const uniqueVisitNos = new Set(visitNos);
    return uniqueVisitNos?.size;
  };
  const handleListSearch = (data, name) => {
    switch (name) {
      case "DoctorName":
        setFormData({
          ...formData,
          [name]: data?.Name,
          DoctorReferal: data?.Name ? data?.DoctorReferalID : "",
        });
        setIndexMatch(0);
        setDoctorSuggestion([]);
        setDropFalse(false);
        break;
      default:
        break;
    }
  };

  const validation = () => {
    let error = "";
    if (
      formData?.SelectTypes.trim() !== "" &&
      formData?.ItemValue.trim() === ""
    ) {
      error = { ...error, ItemValue: t("Please Choose Value") };
    }
    if (formData.SelectTypes === "Mobile") {
      if (formData?.SelectTypes !== "" && formData?.ItemValue === "") {
        error = { ...error, ItemValue: t("This Field is Required") };
      } else if (formData.ItemValue.length !== 10) {
        error = { ...error, ItemValue: t("Invalid Mobile Number") };
      }
    }

    return error;
  };

  const handleToggle = (name) => {
    setToggleDate({ ...toggleDate, [name]: !toggleDate[name] });
  };

  const dateSelect = (value, name) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (event) => {
    const { name, value } = event?.target;
    if (name == "CentreID") {
      setFormData({ ...formData, [name]: value, RateTypeID: "" });
      setRateTypes([]);
      if (value == "") {
        fetchRateTypes(CentreData.map((ele) => ele.value));
      } else {
        fetchRateTypes([value]);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBarcodeReceive = (e) => {
    const keypress = [9, 13];
    if (keypress.includes(e.which)) {
      DirectReceivedByBarcode();
    }
  };

  const handleBarcodeNo = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };
  const DirectReceivedByBarcode = () => {
    if (state.BarcodeNo.length > 0) {
      axiosInstance
        .post("DepartmentReceive/SampleReceiveBarcode", {
          BarcodeNo: state.BarcodeNo,
        })
        .then((res) => {
          toast.success("Barcode Received Successfully");
          setState({ ...state, BarcodeNo: "" });
          TableData("2");
        })
        .catch((err) => console.log(err));
    }
  };

  const getAccessCentres = () => {
    axiosInstance
      .get("/Centre/getAccessCentres")
      .then((res) => {
        let data = res.data.message;
        let CentreDataValue = data.map((ele) => {
          return {
            value: ele.CentreID,
            label: ele.Centre,
          };
        });
        let allValues = CentreDataValue.map((ele) => ele.value);
        setCentreData(CentreDataValue);

        fetchRateTypes(allValues);
      })
      .catch((err) => console.log(err));
  };
  const handleTime = (time, name) => {
    setFormData({ ...formData, [name]: time });
  };

  const getDepartment = () => {
    axiosInstance
      .get("/Department/getDepartment")
      .then((res) => {
        let data = res.data.message;
        let DeptDataValue = data.map((ele) => {
          return {
            value: ele.DepartmentID,
            label: ele.Department,
          };
        });
        setDepartmentData(DeptDataValue);
      })
      .catch((err) => console.log(err));
  };

  const SaveSampleReceiveDepartment = () => {
    const UpdateData = drdata?.filter((ele) =>
      ele?.IsChecked == 1 ? true : false
    );
    if (UpdateData?.length > 0) {
      axiosInstance
        .post("/DepartmentReceive/SampleReceiveDepartment", {
          data: UpdateData,
        })
        .then((res) => {
          toast.success(res.data.message);
          TableData("2");
          setDrData([]);
        })
        .catch((err) => {
          if (err.response.status === 504) {
            toast.error(t("Something Went Wrong"));
          }
          if (err.response.status === 401) {
            toast.error(err.response.data.message);
          }
        });
    } else {
      toast.error("Please select atlease one item to continue");
    }
  };

  useEffect(() => {
    getDoctorSuggestion(formData, setDoctorSuggestion, setFormData);
    if (formData?.DoctorName === "") {
      setDropFalse(true);
    }
  }, [formData?.DoctorName]);

  const TableData = (status) => {
    setpageType(status);

    setSearchStatus(status);
    const generatedError = validation();
    if (generatedError === "") {
      setLoading(true);
      const rateTypes = RateTypes.map((item) => {
        return item?.value;
      });
      axiosInstance
        .post(
          "/DepartmentReceive/DepartmentReceive",
          getTrimmedData({
            CentreID: AllDataDropDownPayload(
              formData.CentreID,
              CentreData,
              "value"
            ),
            SelectTypes: formData.SelectTypes,
            ItemValue: formData.ItemValue.trim(),
            RateTypeID:
              formData?.RateTypeID == null || formData?.RateTypeID == ""
                ? rateTypes
                : [formData?.RateTypeID],
            DoctorReferal: formData.DoctorReferal,
            FromDate: moment(formData.FromDate).format("DD/MMM/YYYY"),
            ToDate: moment(formData.ToDate).format("DD/MMM/YYYY"),
            FromTime: Time(formData.FromTime),
            ToTime: Time(formData.ToTime),
            DepartmentID: AllDataDropDownPayload(
              formData.DepartmentID,
              DepartmentData,
              "value"
            ),
            SampleStatus: status,
          })
        )
        .then((res) => {
          const data = res?.data?.message?.map((ele) => {
            return {
              ...ele,
              IsChecked: 0,
            };
          });
          setDrData(data);
          SetCollectedDataExist(res?.data?.message.some((v) => v.Status === 2));
          setLoad(true);
          setLoading(false);
        })
        .catch((err) => setLoading(false));
      setErrors(generatedError);
    } else {
      setErrors(generatedError);
    }
  };

  const handleUploadCount = (name, value, secondName) => {
    let data = [...drdata];
    if (name === "UploadDocumentCount") {
      data[show?.index][name] = value;
      data[show?.index][secondName] = value === 0 ? 0 : 1;
      setDrData(data);
    } else {
      data[show4?.index][name] = value;
      data[show4?.index][secondName] = value === 0 ? 0 : 1;
      setDrData(data);
    }
  };

  useEffect(() => {
    getAccessCentres();
    getDepartment();
  }, []);
  const fetchRateTypes = async (id) => {
    try {
      const res = await axiosInstance.post("/Centre/GetRateType", {
        CentreId: id,
      });
      const list = res?.data?.message.map((item) => ({
        label: item?.RateTypeName,
        value: item?.RateTypeID,
      }));
      setRateTypes(list);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <PageHead name="Department Receive" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2 ">
              <div className="d-flex" style={{ display: "flex" }}>
                <div style={{ width: "50%" }}>
                  <SelectBox
                    options={SearchBy}
                    id="SelectTypes"
                    lable="SelectTypes"
                    selectedValue={formData.SelectTypes}
                    name="SelectTypes"
                    onChange={handleSelectChange}
                  />
                </div>

                <div style={{ width: "50%" }}>
                  {formData?.SelectTypes === "Mobile" ? (
                    <div style={{ width: "100%" }}>
                      <Input
                        className="select-input-box form-control input-sm"
                        type="number"
                        name="ItemValue"
                        max={10}
                        value={formData.ItemValue}
                        onChange={handleChange}
                        onInput={(e) => number(e, 10)}
                      />
                      {errors?.ItemValue && (
                        <div className="golbal-Error">{errors?.ItemValue}</div>
                      )}
                    </div>
                  ) : (
                    <div style={{ width: "100%" }}>
                      <Input
                        className="select-input-box form-control input-sm"
                        type="text"
                        name="ItemValue"
                        max={20}
                        value={formData.ItemValue}
                        onChange={handleChange}
                      />
                      {errors?.ItemValue && (
                        <div className="golbal-Error">{errors?.ItemValue}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-sm-2">
              <SelectBox
                options={AddBlankData(CentreData, "All Centre")}
                lable="Centre"
                id="Centre"
                selectedValue={formData?.CentreID}
                name="CentreID"
                onChange={handleSelectChange}
              />
            </div>
            <div className="col-sm-2">
              <SelectBox
                options={[{ label: "All RateTypes", value: "" }, ...RateTypes]}
                lable="RateType"
                id="RateType"
                name="RateTypeID"
                onChange={handleSelectChange}
                selectedValue={formData?.RateTypeID}
              />
            </div>

            <div className="col-sm-2 ">
              <SelectBox
                options={AddBlankData(DepartmentData, "All Department")}
                lable="Department"
                id="Department"
                formdata={formData.DepartmentID}
                name="DepartmentID"
                onChange={handleSelectChange}
              />
            </div>

            <div className="col-sm-2  ">
              <Input
                lable="DoctorName"
                id="DoctorName"
                type="text"
                name="DoctorName"
                value={formData.DoctorName}
                onChange={handleChange}
                onKeyDown={handleIndex}
                placeholder=" "
                onBlur={(e) => {
                  autocompleteOnBlur(setDoctorSuggestion);
                  setTimeout(() => {
                    const data = doctorSuggestion.filter(
                      (ele) => ele?.Name === e.target.value
                    );
                    if (data.length === 0) {
                      setFormData({ ...formData, DoctorName: "" });
                    }
                  }, 500);
                }}
                autoComplete="off"
              />
              {dropFalse && doctorSuggestion.length > 0 && (
                <ul
                  className="suggestion-data"
                  style={{ top: "26px", right: "0px" }}
                >
                  {doctorSuggestion.map((data, index) => (
                    <li
                      onClick={() => handleListSearch(data, "DoctorName")}
                      className={`${index === indexMatch && "matchIndex"}`}
                      key={index}
                    >
                      {data?.Name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="col-sm-2">
              <Input
                lable="BarcodeNo"
                id="BarcodeNo"
                name="BarcodeNo"
                placeholder=" "
                onKeyDown={handleBarcodeReceive}
                value={state.BarcodeNo}
                onChange={handleBarcodeNo}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-2">
              <DatePicker
                className="custom-calendar"
                name="FromDate"
                placeholder=" "
                id="FromDate"
                lable="FromDate"
                value={formData?.FromDate}
                onChange={dateSelect}
                maxDate={new Date(formData?.ToDate)}
              />

              {errors?.FromDate && (
                <span className="golbal-Error">{errors?.FromDate}</span>
              )}
            </div>
            <div className="col-sm-1">
              <CustomTimePicker
                name="FromTime"
                placeholder="FromTime"
                value={formData?.FromTime}
                id="FromTime"
                lable="FromTime"
                onChange={handleTime}
              />
            </div>
            <div className="col-sm-2 ">
              <DatePicker
                className="custom-calendar"
                name="ToDate"
                value={formData?.ToDate}
                onChange={dateSelect}
                placeholder=" "
                id="ToDate"
                lable="ToDate"
                maxDate={new Date()}
                minDate={new Date(formData?.FromDate)}
              />

              {errors?.ToDate && (
                <span className="golbal-Error">{errors?.ToDate}</span>
              )}
            </div>
            <div className="col-sm-1">
              <CustomTimePicker
                name="ToTime"
                placeholder="ToTime"
                value={formData?.ToTime}
                id="ToTime"
                lable="ToTime"
                onChange={handleTime}
              />
            </div>
            <div className="col-sm-1">
              <button
                type="button"
                className="btn btn-block btn-info btn-sm"
                onClick={() => TableData(2)}
              >
                {"Search"}
              </button>
            </div>
            <div className="col-sm-1">
              <button
                type="button"
                className="btn btn-block btn-success btn-sm"
                onClick={() => TableData(3)}
              >
                {"Received"}
              </button>
            </div>
            <div className="col-sm-1">
              <button
                type="button"
                className="btn btn-block btn-danger btn-sm"
                onClick={() => TableData(4)}
              >
                {"Rejected"}
              </button>
            </div>
            <div className="col-sm-1">
              <button
                type="button"
                className="btn btn-block Status-16 btn-sm"
                onClick={() => TableData(16)}
              >
                {"Hold"}
              </button>
            </div>
          </div>
        </div>
      </PageHead>

      <div className="card mt-2">
        {loading ? (
          <Loading />
        ) : (
          load && (
            <>
              <DepartmentReceiveTable
                  drdata={drdata}
                  setSaveTestId={setSaveTestId}
                  saveTestId={saveTestId}
                  show={setShow4}
                  show2={setShow}
                  TableData={TableData}
                  setDrData={setDrData}
                  pageType={pageType}
                />
              <div className="row" style={{ float: "right" }}>
                {drdata.length > 0 &&
                  (searchstatus == "2" || collecteddataexist) && (
                    <div className="col-sm-1 ms-auto">
                      <button
                        className="btn btn-info btn-sm mx-2"
                        onClick={() => SaveSampleReceiveDepartment()}
                      >
                        {"Receive"}
                      </button>
                    </div>
                  )}
              </div>
            </>
          )
        )}
      </div>
    </>
  );
};

export default DepartmentReceive;
