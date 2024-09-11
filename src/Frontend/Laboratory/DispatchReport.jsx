import React, { useEffect, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import {
  BindEmployeeReports,
  DepartmentWiseItemList,
  getDoctorSuggestion,
  getPaymentModes,
} from "../../utils/NetworkApi/commonApi";
import { axiosInstance } from "../../utils/axiosInstance";
import {
  AddBlankData,
  AllDataDropDownPayload,
  Time,
  autocompleteOnBlur,
  getTrimmedData,
} from "../../utils/helpers";
import PageHead from "../../components/CommonComponent/PageHead";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import Input from "../../components/CommonComponent/Input";
import AutoComplete from "../../components/CustomComponent/AutoComplete";
import { DateTypeSearch, SampleStatus, SearchBy } from "../../utils/Constants";
import DatePicker from "../../components/CommonComponent/DatePicker";
import CustomTimePicker from "../../components/CommonComponent/TimePicker";
import Loading from "../../components/Loading/Loading";
import DispatchReportTable from "../Table/DispatchReportTable";
import MedicialModal from "../utils/MedicialModal";
import UploadFile from "../utils/UploadFIleModal/UploadFile";
const DispatchReport = () => {
  const [CentreData, setCentreData] = useState([]);
  const [RateTypes, setRateTypes] = useState([]);
  const [DepartmentData, setDepartmentData] = useState([]);
  const [toggleDate, setToggleDate] = useState({
    FromDate: false,
    ToDate: false,
  });
  const [user, SetUser] = useState([]);
  const [TestSuggestion, setTestSuggestion] = useState([]);
  const [dispatchData, setDispatchData] = useState([]);
  const [doctorSuggestion, setDoctorSuggestion] = useState([]);
  const [indexMatch, setIndexMatch] = useState(0);
  const [dropFalse, setDropFalse] = useState(true);
  const [show, setShow] = useState({
    modal: false,
    data: "",
    index: -1,
  });
  const [load, setLoad] = useState(false);
  const [Identity, setIdentity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const today = new Date();
  const [formData, setFormData] = useState({
    FromDate: new Date(),
    ToDate: new Date(),
    CentreID: "",
    ItemValue: "",
    RateID: "",
    SelectTypes: "",
    RefundFilter: null,
    FromTime: new Date(today.setHours(0, 0, 0, 0)),
    ToTime: new Date(today.setHours(23, 59, 59, 999)),
    DoctorReferal: "",
    DepartmentID: "",
    DoctorName: "",
    TestName: "",
    DateTypeSearch: "Date",
    User: "",
    IsUrgent: "",
    SampleStatus: "",
    IsCourier: "",
  });

  const handleIndex = (e, name) => {
    switch (name) {
      case "DoctorName":
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
            handleListSearch(doctorSuggestion[indexMatch], name);
            setIndexMatch(0);
            break;
          default:
            break;
        }
        break;
      case "TestName":
        switch (e.which) {
          case 38:
            if (indexMatch !== 0) {
              setIndexMatch(indexMatch - 1);
            } else {
              setIndexMatch(TestSuggestion.length - 1);
            }
            break;
          case 40:
            if (TestSuggestion.length - 1 === indexMatch) {
              setIndexMatch(0);
            } else {
              setIndexMatch(indexMatch + 1);
            }
            break;
          case 13:
            handleListSearch(TestSuggestion[indexMatch], name);
            setIndexMatch(0);
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  };
  const navigate = useNavigate();
  const [show4, setShow4] = useState({
    modal: false,
    data: "",
    index: -1,
  });

  const handleListSearch = (data, name) => {
    switch (name) {
      case "DoctorName":
        setFormData({
          ...formData,
          [name]: data.Name,
          DoctorReferal: data.Name ? data.DoctorReferalID : "",
        });
        setIndexMatch(0);
        setDoctorSuggestion([]);
        setDropFalse(false);
        break;

      case "TestName":
        setFormData({
          ...formData,
          [name]: data.TestName,
        });
        setIndexMatch(0);
        setTestSuggestion([]);
        break;
      default:
        break;
    }
  };

  const handleUploadCount = (name, value, secondName) => {
    let data = [...dispatchData];
    if (name === "UploadDocumentCount") {
      data[show?.index][name] = value;
      data[show?.index][secondName] = value === 0 ? 0 : 1;
      setDispatchData(data);
    } else {
      data[show4?.index][name] = value;
      data[show4?.index][secondName] = value === 0 ? 0 : 1;
      setDispatchData(data);
    }
  };

  useEffect(() => {
    getDoctorSuggestion(formData, setDoctorSuggestion, setFormData);
    if (formData?.DoctorName === "") {
      setDropFalse(true);
    }
  }, [formData?.DoctorName]);

  const validation = () => {
    let error = "";
    if (
      formData?.SelectTypes.trim() !== "" &&
      formData?.ItemValue.trim() === ""
    ) {
      error = { ...error, ItemValue: "Please Choose Value" };
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

  const dateSelect = (value, name) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (event) => {
    const { name, value, checked, type } = event?.target;
    if (name == "CentreID") {
      setFormData({ ...formData, [name]: value, RateTypeID: "" });
      setRateTypes([]);
      if (value == "") {
        fetchRateTypes(CentreData.map((ele) => ele.value));
      } else {
        fetchRateTypes([value]);
      }
    } else if (name === "IsUrgent") {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    } else if (name === "IsCourier") {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getAccessCentres = () => {
    axiosInstance
      .get("Centre/getAccessCentres")
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

  const getDepartment = () => {
    axiosInstance
      .get("Department/getDepartment")
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

  const TableData = (status) => {
    const generatedError = validation();
    if (generatedError === "") {
      setLoading(true);
      const rateTypes = RateTypes.map((item) => {
        return item?.value;
      });
      axiosInstance
        .post(
          "Dispatch/PatientLabSearch",
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
            TestName: formData?.TestName,
            DateTypeSearch: formData?.DateTypeSearch,
            User: formData?.User,
            IsUrgent: formData?.IsUrgent ? 1 : 0,
            IsCourier: formData?.IsCourier ? 1 : 0,
          })
        )
        .then((res) => {
          const data = modifyArray(res?.data?.message);
          setDispatchData(data);
          setLoad(true);
          setLoading(false);
        })
        .catch((err) => setLoading(false));
      setErrors(generatedError);
    } else {
      setErrors(generatedError);
    }
  };

  const handleInnerChecked = (e, newIndex, index) => {
    const { name, checked } = e.target;
    const val = [...dispatchData];
    val[index]["TestDetail"][newIndex][name] = checked;
    setDispatchData(val);
  };

  function createCheckbox(item) {
    console.log(item);
    if (item.status == 5 || item.status == 6) {
      return `<input type=\"checkbox\" onchange={handleCheck}  value=\"${item.TestIdHash}\" id=\"${item.LedgerTransactionID}\" class=${item.LedgerTransactionID} />`;
    } else {
      return "";
    }
  }

  function modifyArray(dataArray) {
    let modifiedArray = [];
    let tempObject = {};

    dataArray.forEach((item) => {
      if (tempObject[item.LedgerTransactionID]) {
        tempObject[item.LedgerTransactionID].Test += `<p class="round Status-${
          item.status
        }">${createCheckbox(item)}${item.Test}</p>`;
      } else {
        tempObject[item.LedgerTransactionID] = { ...item };
        tempObject[item.LedgerTransactionID].Test = `<p class="round Status-${
          item.status
        }">${createCheckbox(item)}${item.Test}</p>`;
      }
    });

    for (let key in tempObject) {
      modifiedArray.push(tempObject[key]);
    }

    return modifiedArray;
  }

  const handleTime = (time, name) => {
    setFormData({ ...formData, [name]: time });
  };
  useEffect(() => {
    getAccessCentres();
    getDepartment();
    BindEmployeeReports(SetUser);
    getPaymentModes("Identity", setIdentity);
  }, []);

  const handleSelectChange1 = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    value != -1 && TableData(value);
  };
  const fetchRateTypes = async (id) => {
    try {
      const res = await axiosInstance.post("Centre/GetRateType", {
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

  useEffect(() => {
    if (formData?.TestName.length > 2) {
      DepartmentWiseItemList(
        formData.DepartmentID,
        formData?.TestName,
        setTestSuggestion
      );
    }
  }, [formData?.TestName]);
  return (
    <>
      <PageHead name="Dispatch Report" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
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

            <div className="col-sm-2  ">
              <SelectBox
                options={AddBlankData(CentreData, "All Centre")}
                lable="Centre"
                id="Centre"
                name="CentreID"
                selectedValue={formData?.CentreID}
                onChange={handleSelectChange}
              />
            </div>

            <div className="col-sm-2 ">
              <SelectBox
                options={[{ label: "All RateType", value: "" }, ...RateTypes]}
                selectedValue={formData?.RateTypeID}
                lable="RateType"
                id="RateType"
                name="RateTypeID"
                onChange={handleSelectChange}
              />
            </div>

            <div className="col-sm-2  ">
              <SelectBox
                options={AddBlankData(DepartmentData, "All Department")}
                lable="Department"
                id="Department"
                selectedValue={formData.DepartmentID}
                name="DepartmentID"
                onChange={handleSelectChange}
              />
            </div>

            <div className="col-sm-2  ">
              <Input
                type="text"
                lable="Refer Doctor"
                id="DoctorName"
                name="DoctorName"
                value={formData.DoctorName}
                onChange={handleChange}
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
                <ul className="suggestion-data">
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

            <div className="col-sm-2  ">
              <Input
                type="text"
                name="TestName"
                lable="Search By Test Name"
                id="TestName"
                value={formData.TestName}
                placeholder=" "
                onChange={handleChange}
                onKeyDown={(e) => handleIndex(e, "TestName")}
              />
              {TestSuggestion.length > 0 && (
                <AutoComplete
                  test={TestSuggestion}
                  handleListSearch={handleListSearch}
                  indexMatch={indexMatch}
                />
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-sm-2">
              <SelectBox
                name="User"
                lable="Employee"
                id="Employee"
                options={[{ label: "Select Employee", value: "" }, ...user]}
                selectedValue={formData?.User}
                onChange={handleChange}
              />
            </div>
            <div className="col-sm-2  ">
              <SelectBox
                options={DateTypeSearch}
                formdata={formData?.DateTypeSearch}
                name="DateTypeSearch"
                lable="DateTypeSearch"
                id="DateTypeSearch"
                onChange={handleSelectChange}
              />
            </div>
            <div className="col-sm-2">
              <DatePicker
                className="custom-calendar"
                name="FromDate"
                value={formData?.FromDate}
                onChange={dateSelect}
                placeholder=" "
                id="FromDate"
                lable="FromDate"
                maxDate={new Date(formData?.ToDate)}
              />
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
            <div className="col-sm-2">
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
            <div className="col-sm-2">
              <SelectBox
                options={[...SampleStatus]}
                onChange={handleSelectChange1}
                name="SampleStatus"
                lable="SampleStatus"
                id="SampleStatus"
                selectedValue={formData.SampleStatus}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-1 d-flex mb-2">
              <input
                id="IsUrgent"
                type="checkbox"
                name="IsUrgent"
                checked={formData?.IsUrgent}
                onChange={handleSelectChange}
              />
              <label htmlFor="IsUrgent" className="ml-2">
                IsUrgent
              </label>
            </div>
            <div className="col-sm-1 d-flex mb-2">
              <input
                type="checkbox"
                name="IsCourier"
                id="IsCourier"
                checked={formData?.IsCourier}
                onChange={handleSelectChange}
              />
              <label htmlFor="IsCourier" className="ml-2">
                IsCourier
              </label>
            </div>
            <div className="col-sm-1">
              <button
                onClick={() =>
                  TableData(document.getElementById("SampleStatus").value)
                }
                className="btn btn-primary btn-sm w-100"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </PageHead>
      {show4?.modal && (
        <MedicialModal
          show={show4.modal}
          handleClose={() => {
            setShow4({
              modal: false,
              data: "",
              index: -1,
            });
          }}
          MedicalId={show4?.data}
          handleUploadCount={handleUploadCount}
        />
      )}

      {show?.modal && (
        <UploadFile
          show={show?.modal}
          handleClose={() => {
            setShow({ modal: false, data: "", index: -1 });
          }}
          options={Identity}
          documentId={show?.data}
          pageName="Patient Registration"
          handleUploadCount={handleUploadCount}
        />
      )}

      <div className="card mt-2">
        {loading ? (
          <Loading />
        ) : (
          <>
            <DispatchReportTable
              dispatchData={dispatchData}
              show={setShow4}
              show2={setShow}
              handleInnerChecked={handleInnerChecked}
            />
          </>
        )}
      </div>
    </>
  );
};

export default DispatchReport;
