import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import PageHead from "../../components/CommonComponent/PageHead";

import { axiosInstance } from "../../utils/axiosInstance";
import {
  AddBlankData,
  AllDataDropDownPayload,
  Time,
  autocompleteOnBlur,
} from "../../utils/helpers";
import {
  BindEmployeeReports,
  getDoctorSuggestion,
} from "../../utils/NetworkApi/commonApi";
import { SearchBy } from "../../utils/Constants";
import Input from "../../components/CommonComponent/Input";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import DatePicker from "../../components/CommonComponent/DatePicker";
import CustomTimePicker from "../../components/CommonComponent/TimePicker";
import Loading from "../../components/Loading/Loading";
import ReceiptReprintTable from "../Table/ReceiptReprintTable";
const ReceiptReprint = () => {
  const [RateTypes, setRateTypes] = useState([]);
  const [CentreData, setCentreData] = useState([]);
  const [user, SetUser] = useState([]);
  const [receiptData, setReceiptData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [doctorSuggestion, setDoctorSuggestion] = useState([]);
  const [indexMatch, setIndexMatch] = useState(0);
  const [dropFalse, setDropFalse] = useState(true);
  const [show4, setShow4] = useState({
    modal: false,
    data: "",
    index: -1,
  });
  const [show5, setShow5] = useState({
    modal: false,
    data: "",
    index: -1,
  });
  const navigate = useNavigate();
  const today = new Date();
  const [formData, setFormData] = useState({
    FromDate: new Date(),
    ToDate: new Date(),
    CentreID: "",
    ItemValue: "",
    RateTypeID: "",
    SelectTypes: "",
    FromTime: new Date(today.setHours(0, 0, 0, 0)),
    ToTime: new Date(today.setHours(23, 59, 59, 999)),
    DoctorReferal: "",
    DoctorName: "",
    User: "",
    Status: "",
  });

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
      default:
        break;
    }
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
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
    if (name === "DoctorName") {
      setDropFalse(true);
    }
  };

  const dateSelect = (value, name) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const TableData = (Status) => {
    const generatedError = validation();
    if (generatedError === "") {
      setLoading(true);
      const rateTypes = RateTypes.map((item) => {
        return item?.value;
      });
      axiosInstance
        .post("Lab/getReceiptReprint", {
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
          User: formData?.User,
          Status: Status,
        })
        .then((res) => {
          setReceiptData(res?.data?.message);
          setLoading(false);
        })
        .catch((err) => {
          setReceiptData([]);
          setLoading(false);
        });
      setErrors(generatedError);
    } else {
      setErrors(generatedError);
    }
  };

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

  const handleUploadCount = (name, value, secondName) => {
    let data = [...receiptData];

    if (name === "UploadDocumentCount") {
      data[show5?.index][name] = value;
      data[show5?.index][secondName] = value === 0 ? 0 : 1;
      setReceiptData(data);
    } else {
      data[show4?.index][name] = value;
      data[show4?.index][secondName] = value === 0 ? 0 : 1;
      setReceiptData(data);
    }
  };
  const handleTime = (time, name) => {
    setFormData({ ...formData, [name]: time });
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

  useEffect(() => {
    getAccessCentres();
    BindEmployeeReports(SetUser);
  }, []);

  useEffect(() => {
    getDoctorSuggestion(formData, setDoctorSuggestion, setFormData);
  }, [formData?.DoctorName]);
  return (
    <>
      <PageHead name="Receipt Reprint" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-md-2">
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
                        on
                      />
                      {errors?.ItemValue && (
                        <div className="golbal-Error">{errors?.ItemValue}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-2">
              <SelectBox
                options={AddBlankData(CentreData, "All Centre")}
                selectedValue={formData.CentreID}
                lable="Centre"
                id="Centre"
                name="CentreID"
                onChange={handleSelectChange}
              />
            </div>

            <div className="col-md-2">
              <SelectBox
                options={[{ label: "All RateTypes", value: "" }, ...RateTypes]}
                lable="RateType"
                id="RateType"
                name="RateTypeID"
                onChange={handleSelectChange}
                selectedValue={formData?.RateTypeID}
              />
            </div>

            <div className="col-md-2">
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
                onKeyDown={handleIndex}
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
            <div className="col-md-2">
              <SelectBox
                lable="Employee"
                id="Employee"
                name="User"
                options={[{ label: "Select Employee", value: "" }, ...user]}
                selectedValue={formData?.User}
                onChange={handleSelectChange}
              />
            </div>
          </div>
          <div className="row d-flex" style={{ alignItems: "center" }}>
            <div className="col-md-2">
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
            <div className="col-md-1">
              <CustomTimePicker
                name="FromTime"
                placeholder="FromTime"
                value={formData?.FromTime}
                id="FromTime"
                lable="FromTime"
                onChange={handleTime}
              />
            </div>
            <div className="col-md-2">
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
            <div className="col-md-1">
              <CustomTimePicker
                name="ToTime"
                placeholder="ToTime"
                value={formData?.ToTime}
                id="ToTime"
                lable="ToTime"
                onChange={handleTime}
              />
            </div>
            <div className="col-md-1">
              <input
                type="button"
                value={"Search"}
                id="btnSearch"
                className="btn btn-block btn-info btn-sm input-sm"
                onClick={() => TableData("All")}
              />
            </div>
            <div
              onClick={() => {
                TableData("fullpaid");
              }}
              className="col-md-1"
            >
              <button
              className="statusConfirmed"
              style={{ backgroundColor: "#00FA9A" }}
              ></button>
              <label className="reprintLable" style={{ cursor: "pointer" }}>
                {"Full Paid"}
              </label>
            </div>
            <div
              onClick={() => {
                TableData("partialpaid");
              }}
              className="col-md-1"
            >
              <button
               
                className="statusConfirmed"
                style={{ backgroundColor: "#F6A9D1" }}
              ></button>
              <label className="reprintLable" style={{ cursor: "pointer" }}>
                {"Partial Paid"}
              </label>
            </div>
            <div
              onClick={() => {
                TableData("fullyunpaid");
              }}
              className="col-md-1"
            >
              <button
               
                className="statusConfirmed"
                style={{ backgroundColor: "#FF457C" }}
              ></button>
              <label className="reprintLable" style={{ cursor: "pointer" }}>
                {"Fully Unpaid"}
              </label>
            </div>
            

            <div
              onClick={() => {
                TableData("fullrefund");
              }}
              className="col-md-1"
            >
              <button
                
                className="statusConfirmed"
                style={{ backgroundColor: "#6699ff" }}
              ></button>
              <label className="reprintLable" style={{ cursor: "pointer" }}>
                {"Full Refund"}
              </label>
            </div>
            <div
              onClick={() => {
                TableData("credit");
              }}
              className="col-md-1"
            >
              <button
              
                className="statusConfirmed"
                style={{ backgroundColor: "#b3cdb3" }}
              ></button>
              <label className="reprintLable" style={{ cursor: "pointer" }}>
                {"Credit"}
              </label>
            </div>
          </div>
        </div>
      </PageHead>
      <div className="card mt-2">
        {loading ? (
          <Loading />
        ) : (
          <>
            <ReceiptReprintTable
              show={setShow4}
              show2={setShow5}
              receiptData={receiptData}
            />
          </>
        )}
      </div>
    </>
  );
};

export default ReceiptReprint;
