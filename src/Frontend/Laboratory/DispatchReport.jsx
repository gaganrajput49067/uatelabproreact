import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getDoctorSuggestion } from "../../utils/NetworkApi/commonApi";

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
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    FromDate: new Date(),
    ToDate: new Date(),
    CentreID: "",
    ItemValue: "",
    RateID: "",
    SelectTypes: "",
    RefundFilter: null,
    FromTime: "00:00:00",
    ToTime: "23:59:59",
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
    axios
      .get("/api/v1/Centre/getAccessCentres")
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
    axios
      .get("/api/v1/Department/getDepartment")
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
      axios
        .post(
          "/api/v1/Dispatch/PatientLabSearch",
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
            FromTime: formData.FromTime,
            ToTime: formData.ToTime,
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
  }, []);

  const handleSelectChange1 = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    value != -1 && TableData(value);
  };
  const fetchRateTypes = async (id) => {
    try {
      const res = await axios.post("/api/v1/Centre/GetRateType", {
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
    <div>DispatchReport</div>
  )
}

export default DispatchReport