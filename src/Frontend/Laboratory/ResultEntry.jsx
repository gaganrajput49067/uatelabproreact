import React, { useEffect, useRef, useState } from "react";
import PageHead from "../../components/CommonComponent/PageHead";
import {
  DateTypeSearch,
  Flag,
  Order,
  SampleStatus,
  SearchBy,
} from "../../utils/Constants";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import Input from "../../components/CommonComponent/Input";
import {
  AddBlankData,
  AllDataDropDownPayload,
  DyanmicStatusResponse,
  Time,
  autocompleteOnBlur,
  getTrimmedData,
} from "../../utils/helpers";
import AutoComplete from "../../components/CustomComponent/AutoComplete";
import { axiosInstance, axiosReport } from "../../utils/axiosInstance";
import {
  DepartmentWiseItemList,
  getDoctorSuggestion,
  getPaymentModes,
} from "../../utils/NetworkApi/commonApi";
import { useNavigate } from "react-router-dom";
import DatePicker from "../../components/CommonComponent/DatePicker";
import CustomTimePicker from "../../components/CommonComponent/TimePicker";
const ResultEntry = () => {
  const navigate = useNavigate();
  const [TestSuggestion, setTestSuggestion] = useState([]);
  const [CentreData, setCentreData] = useState([]);
  const [doctorAdmin, setDoctorAdmin] = useState([]);
  const [RateTypes, setRateTypes] = useState([]);
  const [DepartmentData, setDepartmentData] = useState([]);
  const [ResultTestData, setResultTestData] = useState([]);
  const [ResultData, setResultData] = useState([]);
  const [HiddenDropDownHelpMenu, setHiddenDropDownHelpMenu] = useState(false);
  const [indexMatch, setIndexMatch] = useState(0);
  const [buttonsData, setButtonsData] = useState([]);
  const [helpmenu, setHelpMenu] = useState([]);
  const [DlcCheckChecked, setDlcCheckChecked] = useState(false);
  const [dropFalse, setDropFalse] = useState(true);
  const [doctorSuggestion, setDoctorSuggestion] = useState([]);
  const [statusValue, setStatusValue] = useState("");
  const [modalpayload, setmodalPayload] = useState({});
  const [machine, setMachine] = useState([]);
  const [machineId, setMachineId] = useState([]);
  const [show, setShow] = useState({
    moadal: false,
    data: {},
  });
  const [approve, setshowApprove] = useState({
    msg: "",
    show: false,
  });
  const [PreviousTestResult, setPreviousTestResult] = useState([]);
  const [headerTestResult, setHeaderTestResult] = useState([]);
  const [show2, setShow2] = useState({
    moadal: false,
    data: {},
  });
  const [PrintReportLoading, setPrintReportLoading] = useState(false);
  const [showAdvanceFilter, setShowAdvanceFilter] = useState({
    show: false,
    data: "",
  });

  const [show3, setShow3] = useState({
    modal: false,
    data: {},
  });

  const [show4, setShow4] = useState({
    modal: false,
    data: "",
    index: -1,
  });

  const [show5, setShow5] = useState({
    modal: false,
    data: "",
  });

  const [mouseHover, setMouseHover] = useState({
    index: -1,
    data: [],
  });
  const [testHeaderHover, setTestHeaderHover] = useState({
    index: -1,
    data: [],
  });

  const [toggleDate, setToggleDate] = useState({
    FromDate: false,
    ToDate: false,
  });
  const [showRemark, setShowRemark] = useState(false);
  const [showPrickRemark, setShowPrickRemark] = useState(false);
  const [redata, SetReData] = useState([]);
  const [showdetails, setshowDetails] = useState(true);
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [Identity, setIdentity] = useState([]);
  const [showAuditTrail, setShowAuditTrail] = useState({
    show: false,
    data: "",
    testname: "",
  });
  const [show6, setShow6] = useState({
    modal: false,
    data: "",
    index: -1,
  });

  const [show7, setShow7] = useState({
    modal: false,
    data: "",
    index: -1,
  });
  const [showFilter, setshowFilter] = useState(true);

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
    TestName: "",
    SampleStatus: "3",
    DateTypeSearch: "Date",
    IsUrgent: "",
    MachineID: 0,
    IsTat: 0,
    Order: "DESC",
    Flag: "",
    moreFilter: 0,
    parameterId: "",
    valueCheck: "=",
    valueToSearch: "",
    valueRangeFrom: "",
    valueRangeTo: "",
  });
  // i18n start
  const [reason, setReason] = useState({
    HoldShow: false,
    Hdata: "",
    type: "",
  });
  const [isPreviousResultAvailable, setIsPreviousResultAvailable] =
    useState(false);
  const [showOldReportModal, setShowOldReportModal] = useState({
    show: false,
    data: "",
  });
  const [showPH, setShowPH] = useState(false);

  const BindMachineName = () => {
    axiosInstance
      .get("MachineGroup/BindMachineName")
      .then((res) => {
        let data = res?.data?.message;

        let val = data?.map((ele) => {
          return {
            value: ele?.MachineId,
            label: ele?.MachineName,
          };
        });

        val.unshift({ label: "All Machine", value: 0 });
        setMachineId(val);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occur"
        );
      });
  };
  const getMachine = () => {
    axiosInstance
      .get("Investigations/BindMachineList")
      .then((res) => {
        let data = res.data.message;
        let Machine = data.map((ele) => {
          return {
            value: ele.MachineId,
            label: ele.MachineName,
          };
        });
        setMachine(Machine);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getMachine();
    BindMachineName();
  }, []);

  const handleIndexNew = (e, name) => {
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
            handleListSearchNew(doctorSuggestion[indexMatch], name);
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
            handleListSearchNew(TestSuggestion[indexMatch], name);
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

  useEffect(() => {
    if (formData?.TestName.length > 2) {
      DepartmentWiseItemList(
        formData.DepartmentID,
        formData?.TestName,
        setTestSuggestion
      );
    }
  }, [formData?.TestName]);

  const handleListSearchNew = (data, name) => {
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

  const myRefs = useRef([]);

  const handleKeyUp = (e, targetElem, index) => {
    if (e.key === "Enter" && targetElem) {
      targetElem.focus();
    }
  };

  const handleToggle = (name) => {
    setToggleDate({ ...toggleDate, [name]: !toggleDate[name] });
  };

  const dateSelect = (value, name) => {
    setFormData({
      ...formData,
      [value]: date,
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
    } else if (name == "IsUrgent") {
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

  const handleSave = (data, modal) => {
    if (modal === "Edit") {
      if (Number(data?.MinValue) >= Number(data?.MaxValue)) {
        toast.error(t("Please Enter Correct Min and Max Value"));
      } else {
        let val = ResultData.map((ele) => {
          if (ele.labObservationID == data?.labObservationID) {
            return {
              ...ele,
              DisplayReading: data?.DisplayReading,
              MinValue: data?.MinValue,
              MaxValue: data?.MaxValue,
              ReadingFormat: data?.ReadingFormat,
              SaveRangeStatus: 1,
            };
          } else {
            return ele;
          }
        });
        setResultData(val);
        setShow({ moadal: false, data: {} });
      }
    }

    if (modal === "AddComment") {
      if (data?.pageName === "Single") {
        let val = ResultData.map((ele) => {
          if (ele.labObservationID == data?.labObservationID) {
            return {
              ...ele,
              COMMENT: data?.COMMENT,
              SaveRangeStatus: 1,
            };
          } else {
            return ele;
          }
        });
        setResultData(val);
        setShow2({ moadal: false, data: {} });
      } else {
        let val = ResultTestData.map((ele) => {
          if (ele.TestID == data?.TestID) {
            return {
              ...ele,
              COMMENT: data?.COMMENT,
              SaveRangeStatus: 1,
              labObservationID: -1,
            };
          } else {
            return ele;
          }
        });
        setResultTestData(val);
        setShow2({ moadal: false, data: {} });
      }
    }

    if (modal === "TemplateMaster") {
      let val = ResultData.map((ele) => {
        if (ele.labObservationID == data?.labObservationID) {
          return {
            ...ele,
            COMMENT: data?.COMMENT,
            CommentID: data?.CommentID,
          };
        } else {
          return ele;
        }
      });
      setResultData(val);
      setShow3({ moadal: false, data: {} });
    }
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
      const rateTypes = RateTypes.map((item) => {
        return item?.value;
      });
      setLoading(true);
      axiosInstance
        .post(
          "RE/GetResultEntry",
          getTrimmedData({
            CentreID: AllDataDropDownPayload(
              formData.CentreID,
              CentreData,
              "value"
            ),
            SelectTypes: formData.SelectTypes,
            ItemValue: formData.ItemValue,
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
            IsUrgent: formData?.IsUrgent ? 1 : 0,
            MachineID: formData?.MachineID,
            IsTat: formData?.IsTat,
            Order: formData?.Order,
            Flag: formData?.Flag,
            moreFilter: formData?.moreFilter,
            parameterId: formData?.parameterId,
            valueCheck: formData?.valueCheck,
            valueToSearch: formData?.valueToSearch,
            valueRangeFrom: formData?.valueRangeFrom,
            valueRangeTo: formData?.valueRangeTo,
          })
        )
        .then((res) => {
          SetReData(res?.data?.message);
          setStatusValue(status === "" ? status : parseInt(status));
          setLoad(true);
          setLoading(false);
          setShowAdvanceFilter({ show: false, data: "" });
        })
        .catch((err) => setLoading(false));
      setErrors(generatedError);
    } else {
      setErrors(generatedError);
    }
  };

  const getIsDocumentUpload = (documentId, pageName) => {
    return axiosInstance
      .post("CommonController/GetDocument", {
        Page: pageName,
        Guid: documentId,
      })
      .then((res) => {
        return res?.data?.message.length > 0 ? true : false;
      })
      .catch((err) => {
        console.log(err?.data?.message);
      });
  };

  const setArrangeMentOfData = (data, subData) => {
    let mainData = [];
    subData.map((ele, index) => {
      data.map((eleInner, indexInner) => {
        if (ele?.TestID === eleInner?.TestID) {
          eleInner.Printwithhead = eleInner.Printwithhead
            ? eleInner.Printwithhead
            : 0;
          mainData = [...mainData, eleInner];
        }
      });
    });
    setResultData(mainData);
  };

  const GetResultEntry = (payload, index, loading) => {
    loading && loading(true);
    axiosInstance
      .post("RE/GetResultEntryData", {
        ...payload,
        MacID: payload?.MacID != "" ? payload?.MacID : machine[0]?.value,
      })
      .then((res) => {
        const data = res?.data?.message;
        if (data.length > 0) {
          const val = data.map((ele) => {
            return {
              ...ele,
              isChecked: true,
              RerunIscheck: false,
              SaveRangeStatus: 0,
              currentIndex: index,
              Mobile: payload?.Mobile,
              MinValue: ele?.MinValue == null ? "0" : ele?.MinValue,
              MaxValue: ele?.MaxValue == null ? "0" : ele?.MaxValue,
              //  MinValue: "",
              // MaxValue:"",

              PEmail: payload?.PEmail,
              MachineId:
                payload?.MacID != "" ? payload?.MacID : machine[0]?.value,
            };
          });

          const dataTestHeader = res?.data?.TestHeader;
          let isPreviousResult = false;
          const valTestHeader = dataTestHeader?.map((ele) => {
            if (ele?.OldValueDate && ele?.OldValueDate !== "") {
              isPreviousResult = true;
            }
            return {
              ...ele,
              isChecked: true,
              outSource: 1,
              isDocumentUpload: 0,
              TestCenterId: val[0]?.TestCentreID,
              Mobile: payload?.Mobile,
              PEmail: payload?.PEmail,
              MachineId:
                payload?.MacID != "" ? payload?.MacID : machine[0]?.value,
              labObservationID: ele?.InvestigationID,
              Printwithhead: ele?.Printwithhead ? ele?.Printwithhead : 0,
              // ApprovedBy:""
            };
          });
          setIsPreviousResultAvailable(isPreviousResult);
          setArrangeMentOfData(val, valTestHeader);
          setResultTestData(valTestHeader);
          loading && loading(false);
        } else {
          toast.error(t("No Data Found"));
          loading && loading(false);
        }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : t("No Record Found")
        );
        loading && loading(false);
      });
  };

  const handleDoctorName = (e) => {
    const { name, value } = e.target;
    const data = ResultTestData?.map((ele) => {
      return {
        ...ele,
        [name]: value,
      };
    });

    setResultTestData(data);
  };

  const ApplyFormula = (testid) => {
    if (ResultData.length) {
      for (let i = 0; i < ResultData.length; i++) {
        var Formula = "";
        Formula = ResultData[i].Formula;
        if (Formula != "" && ResultData[i].TestID === testid) {
          for (var j = 0; j < ResultData.length; j++) {
            try {
              var aa = Number(ResultData[j].Value);
              if (aa == "") {
                aa = "0";
              }
              if (ResultData[i].ReportType == "1") {
                Formula = Formula.replace(
                  ResultData[j].labObservationID + "&",
                  aa
                );
              }
            } catch (e) {}
          }

          try {
            var vv = Math.round(eval(Formula) * 100) / 100;
            if (vv == "0" || isNaN(vv)) {
              ResultData[i].Value = "0";
            } else {
              ResultData[i].Value = vv;
            }
          } catch (e) {
            ResultData[i].Value = "";
          }
          var ans = ResultData[i].Value;
          if (
            (parseFloat(ResultData[i]["MaxValue"]) != 0 &&
              parseFloat(ResultData[i]["MinValue"]) != 0) ||
            parseFloat(ResultData[i]["MaxValue"]) > 0 ||
            parseFloat(ResultData[i]["MinValue"]) > 0 ||
            parseFloat(ResultData[i]["MaxValue"]) < 0 ||
            parseFloat(ResultData[i]["MinValue"] < 0)
          ) {
            if (
              parseFloat(ResultData[i].Value) >
              parseFloat(ResultData[i]["MaxValue"])
            ) {
              ResultData[i]["Flag"] = "High";
            }
            if (
              parseFloat(ResultData[i].Value) <
              parseFloat(ResultData[i]["MinValue"])
            ) {
              ResultData[i]["Flag"] = "Low";
            }

            if (
              parseFloat(ResultData[i].Value) >=
                parseFloat(ResultData[i]["MinValue"]) &&
              parseFloat(ResultData[i].Value) <=
                parseFloat(ResultData[i]["MaxValue"])
            ) {
              ResultData[i]["Flag"] = "Normal";
            }
          }
          if (ResultData[i].Value === "") {
            ResultData[i]["Flag"] = "";
          }

          if (isNaN(ans) || ans == "Infinity") {
            ResultData[i].Value = "";
          }
        }
      }
    }
  };
  function isValidDecimal(value) {
    if (
      (value.match(/</g) || []).length + (value.match(/>/g) || []).length >
      1
    ) {
      return false;
    }
    const afterSign =
      value.includes("<") || value.includes(">")
        ? value.split(/[<>]/)[1]
        : value;

    const decimalRegex = /^\d*\.?\d*$/;
    return decimalRegex.test(afterSign);
  }

  const handleCheckbox = (e, index, testid) => {
    const data = [...ResultData];
    const dataTestHeader = [...ResultTestData];
    const { value, checked, type, name } = e.target;
    if (index >= 0) {
      if (name === "Value") {
        if (isValidDecimal(value, data[index]["RoundOff"])) {
          data[index][name] = value;
        } else {
          data[index][name] = value;
          data[index]["Flag"] = "Normal";
        }
      }

      if (type === "checkbox") {
        data[index][name] = checked;
      }
      if (name === "isOmit" || name === "IsCriticalCheck") {
        data[index][name] = checked ? 1 : 0;
      }
      if (name === "Value" && type === "text") {
        let modifiedValue = value;
        if (value.includes("<")) {
          modifiedValue = parseFloat(value?.split("<")[1]) - 0.1;
        } else if (value.includes(">")) {
          modifiedValue = parseFloat(value?.split(">")[1]) + 0.1;
        } else {
          modifiedValue = value;
        }

        if (
          (parseFloat(data[index]["MaxValue"]) != 0 &&
            parseFloat(data[index]["MinValue"]) != 0) ||
          parseFloat(data[index]["MaxValue"]) > 0 ||
          parseFloat(data[index]["MinValue"]) > 0 ||
          parseFloat(data[index]["MaxValue"]) < 0 ||
          parseFloat(data[index]["MinValue"]) < 0
        ) {
          if (parseFloat(modifiedValue) > parseFloat(data[index]["MaxValue"])) {
            data[index]["Flag"] = "High";
          }
          if (parseFloat(modifiedValue) < parseFloat(data[index]["MinValue"])) {
            data[index]["Flag"] = "Low";
          }

          if (
            parseFloat(modifiedValue) >= parseFloat(data[index]["MinValue"]) &&
            parseFloat(modifiedValue) <= parseFloat(data[index]["MaxValue"])
          ) {
            data[index]["Flag"] = "Normal";
          }
        }

        if (value === "") {
          data[index]["Flag"] = "";
        }
      }

      setResultData(data);
    } else {
      const val = data.map((ele) => {
        if (testid === ele?.TestID) {
          return {
            ...ele,
            [name]: checked,
          };
        } else {
          return ele;
        }
      });

      const valTestHeader = dataTestHeader?.map((ele) => {
        if (testid === ele?.TestID) {
          return {
            ...ele,
            isChecked: checked,
          };
        } else {
          return ele;
        }
      });
      setResultTestData(valTestHeader);
      setResultData(val);
    }
    ApplyFormula(testid);
  };

  const getHelpMenuData = (e, labObservationId) => {
    if (e?.which !== 13) {
      setHiddenDropDownHelpMenu(true);
      axiosInstance
        .post("RE/getHelpMenuInvestigationWise", {
          InvestigationID: labObservationId,
        })
        .then((res) => {
          setHelpMenu(res.data?.message);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleIndex = (e, index) => {
    const { name } = e.target;
    switch (name) {
      case "Value":
        switch (e.which) {
          case 38:
            if (indexMatch !== 0) {
              setIndexMatch(indexMatch - 1);
            } else {
              setIndexMatch(helpmenu.length - 1);
            }
            break;
          case 40:
            if (helpmenu.length - 1 === indexMatch) {
              setIndexMatch(0);
            } else {
              setIndexMatch(indexMatch + 1);
            }
            break;
          case 13:
            if (HiddenDropDownHelpMenu) {
              handleListSearch(helpmenu[indexMatch], name, index);
              setIndexMatch(0);
            }
            break;
          default:
            break;
        }
        break;

      default:
        break;
    }
  };

  const handleListSearch = (data, name, index) => {
    const val = [...ResultData];
    val[index][name] = data?.label;
    setResultData(val);
    setHelpMenu([]);
    setHiddenDropDownHelpMenu(false);
  };

  const fetchApi = (field, payload, headerData) => {
    setLoading(true);
    // console.log(payload);
    const ModifiedHeaderData = headerData?.map((ele) => {
      return {
        ...ele,
        IsHold: ele?.IsHold ?? 0,
      };
    });
    if (field == "Approved") {
      const details = {
        data: payload,
        ResultStatus: field,
        IsCritical: 0,
        HeaderInfo: ModifiedHeaderData,
      };
      setmodalPayload({ ...details, IsCritical: 1 });
      axiosInstance
        .post("RE/SaveResultEntry", details)
        .then((res) => {
          setLoading(false);
          if (res?.data?.CriticalValue == "1") {
            setshowApprove({ ...approve, show: true, msg: res?.data?.message });
          } else {
            handleReport("Yes", headerData);
            setResultData([]);
            toast.success(res?.data?.message);
            setDlcCheckChecked(false);
          }
        })
        .catch((err) => {
          if (err.response.status === 504) {
            toast.error(t("Something Went Wrong"));
          }
          if (err.response.status === 401) {
            toast.error(err.response.data.message);
          }
          if (err.response.status === 400) {
            toast.error(err.response.data.message);
          }
          setLoading(false);
          // setResultData([]);
        });
    } else {
      axiosInstance
        .post("RE/SaveResultEntry", {
          data: payload,
          ResultStatus: field,
          HeaderInfo: ModifiedHeaderData,
        })
        .then((res) => {
          setLoading(false);
          toast.success(res.data.message);
          // setResultData([]);
          setDlcCheckChecked(false);
          const testidhash = ResultTestData.map((obj) => obj.TestID);
          (field === "Hold" || field === "Unhold") &&
            GetResultEntry({
              TestID: testidhash,
              LedgerTransactionID: "",
              DepartmentID: "",
              symbol: "",
              Mobile: payload[0]?.Mobile,
              VisitNo: payload[0]?.VisitNo,
              PEmail: payload[0]?.PEmail,
              MacID: "",
            });
        })
        .catch((err) => {
          if (err.response.status === 504) {
            toast.error(t("Something Went Wrong"));
          }
          if (err.response.status === 401) {
            toast.error(err.response.data.message);
          }
          setLoading(false);
          setResultData([]);
        });
    }
  };

  // const handleStatusFilter = (status) => {
  //   const data = ResultTestData.filter(
  //     (ele) => ele?.Status === status && ele?.isChecked === true
  //   );
  //   return data;
  // };

  const validateData = (field, payload, message, headerData) => {
    if (payload?.length > 0) {
      if (["Save", "Hold", "Unhold", "Not Approved"].includes(field)) {
        fetchApi(field, payload, headerData);
      } else {
        let showMessage = t("All Required fields are mandatory");
        let flag = 1;
        let DlcSum = 0;
        let dlc = false;
        for (var i = 0; i < payload.length > 0; i++) {
          if (payload[i].dlcCheck == "1" && DlcCheckChecked) {
            dlc = true;
            DlcSum =
              parseFloat(DlcSum) +
              parseFloat(payload[i].Value === "" ? 0 : payload[i].Value);
          }
          if (payload[i].ReportType === "1") {
            if (payload[i].isMandatory === 1 && payload[i].Value == "") {
              flag = 0;
            }
            if (payload[i].AMRMin > 0 || payload[i].AMRMax > 0) {
              if (
                payload[i].Value > payload[i].AMRMax ||
                payload[i].Value < payload[i].AMRMin
              ) {
                toast.error(
                  payload[i].TestName +
                    " value is greater or less than" +
                    payload[i].AMRMin +
                    " or " +
                    payload[i].AMRMax
                );
                return;
              }
            }
          }
          if (["2", "3"].includes(payload[i].ReportType)) {
            if (
              payload[i].isMandatory === 1 &&
              (payload[i].COMMENT == "" || payload[i].COMMENT == null)
            ) {
              flag = 0;
            }
          }
        }

        for (let i = 0; i < headerData.length; i++) {
          if (headerData[i]["ApprovedBy"] == "0") {
            flag = 0;
            showMessage = t("Kindly Select Doctor");
            break;
          }
        }

        if (flag == 1) {
          if (DlcCheckChecked && dlc) {
            if (DlcSum !== 100) {
              toast.error(t("Dlc Count Should be equal to 100"));
            } else {
              fetchApi(field, payload, headerData);
            }
          } else {
            fetchApi(field, payload, headerData);
          }
        } else {
          toast.error(showMessage);
        }
      }
    } else {
      toast.error(message);
    }
  };

  const handleResultSubmit = (field, headData) => {
    const errorToast = `This Test is ${DyanmicStatusResponse(ResultTestData)}`;
    if (field === "Approved") {
      const data = ResultData.filter(
        (ele) =>
          [3, 10, 14, 13].includes(ele?.Status) && ele?.isChecked === true
      );
      const val = ResultTestData.filter(
        (ele) =>
          [3, 10, 14, 13].includes(ele?.Status) && ele?.isChecked === true
      );
      validateData(field, data, errorToast, val);
    } else if (field === "Save") {
      const data = ResultData.filter(
        (ele) =>
          [3, 10, 14, 13].includes(ele?.Status) && ele?.isChecked === true
      );
      const val = ResultTestData.filter(
        (ele) =>
          [3, 10, 14, 13].includes(ele?.Status) && ele?.isChecked === true
      );
      validateData(field, data, errorToast, val);
    } else if (field === "Not Approved") {
      const data = ResultData.filter((ele) => ele.TestID === headData.TestID);
      const val = ResultTestData.filter(
        (ele) => ele?.TestID === headData.TestID
      );
      validateData(field, data, "This test is Not Approved", val);
    } else if (field === "Hold") {
      const payload = ResultData.filter(
        (ele) => ele.Status !== 5 && ele.isChecked === true
      );
      const val = ResultTestData.filter(
        (ele) => ele.Status !== 5 && ele.isChecked === true
      );
      validateData(field, payload, errorToast, val);
    } else if (field === "Unhold") {
      const data = ResultData.filter((ele) => ele.TestID === headData.TestID);
      const val = ResultTestData.filter(
        (ele) => ele?.TestID === headData.TestID
      );
      const UnholdData = val?.map((ele) => {
        return {
          ...ele,
          IsHold: 0,
        };
      });

      validateData(field, data, t("This Test is not Hold"), UnholdData);
    } else {
      const payload = ResultData.filter((ele) => ele.isChecked === true);
      validateData(field, payload);
      // } else {
      //   if (field === "Not Approved") {
      //     const payload = ResultData.filter((ele) => ele.isChecked === true);
      //     fetchApi(field, payload);
      //   } else {
      //     toast.error(
      //       `This already approved ${ResultTestData[statusMatchIndex]["PackageName"]}, Please Uncheck to continue or unhold to continue`
      //     );
      //   }
      // }
    }
  };

  const DeltaResponse = (data) => {
    axiosInstance
      .post("RE/DeltaCheck", {
        TestID: data?.TestID,
        LabObservation_ID: data?.labObservationID,
      })
      .then((res) => {
        const data = res.data.message;
        if (data.length > 0) {
          setPreviousTestResult(data);
        } else {
          setPreviousTestResult([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const TestHeaderResponce = (data) => {
    axiosInstance
      .post("RE/TestWiseDeltaValue", {
        TestID: data?.TestID,
        LabObservation_ID: data?.labObservationID,
      })
      .then((res) => {
        const data = res.data.message;
        if (data.length > 0) {
          setHeaderTestResult(data);
        } else {
          setHeaderTestResult([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const AuditTrailResponce = async (data) => {
    await axiosInstance
      .post("RE/TestWiseDeltaValue", {
        TestID: data?.TestID,
        LabObservation_ID: data?.labObservationID,
      })
      .then((res) => {
        const resData = res.data.message;
        if (resData.length > 0) {
          setShowAuditTrail({
            show: true,
            data: resData,
            testname: data?.PackageName,
          });
        } else {
          setShowAuditTrail({ show: false, data: "", testname: "" });
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setShowAuditTrail({ show: false, data: "", testname: "" });
      });
  };

  const handleAuditTrailModal = () => {
    setShowAuditTrail({ show: false, data: "", testname: "" });
  };

  const handleApproveReport = (Url, headerData) => {
    axiosInstance
      .post("RE/SendReport", {
        LedgerTransactionNo: headerData[0]?.LedgerTransactionNo,
        PatientName: headerData[0]?.PatientName,
        MobileNo: headerData[0]?.Mobile,
        LedgerTransactionID: headerData[0]?.LedgerTransactionID,
        PEmail: headerData[0]?.PEmail,
        URL: Url,
      })
      .then((res) => console.log(res?.data?.message))
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };
  const handleReport = (key, headerData) => {
    const data = ResultTestData.filter((ele) => ele?.isChecked === true);
    let TestIDHash = data.map((ele) => {
      return ele?.TestIDHash;
    });

    setPrintReportLoading(true);
    axiosInstance
      .post(`/reports/v1/commonReports/GetLabReport`, {
        TestIDHash: TestIDHash,
        PrintColour: "0",
      })
      .then((res) => {
        if (key == "Yes") {
          handleApproveReport(res?.data?.Url, headerData);
          setPrintReportLoading(false);
        } else {
          window.open(res?.data?.Url, "_blank");
          setPrintReportLoading(false);
        }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
        setPrintReportLoading(false);
      });
  };

  const getButtondata = () => {
    axiosInstance
      .get("api/v1/RE/EmployeeAccessDetails")
      .then((res) => {
        setButtonsData(res.data.message);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : t("Something Went Wrong")
        );
      });
  };

  const handleInnerChecked = (e, newIndex, index) => {
    const { name, checked } = e.target;
    const val = [...redata];
    val[index]["TestDetail"][newIndex][name] = checked;
    SetReData(val);
  };
  const getGradientClass = () => {
    let condition = localStorage.getItem("Theme");
    switch (condition) {
      case "Default":
        return "gradient-lightblue";
      case "light Green":
        return "gradient-lightgreen";
      case "Peach":
        return "gradient-peach";
      case "Pale Pink":
        return "gradient-pink";
      case "Red":
        return "gradient-red";
      case "SkyBlue":
        return "gradient-skyblue";
      case "Grey":
        return "gradient-grey";
      default:
        return "";
    }
  };

  const handleTime = (time, name) => {
    setFormData({ ...formData, [name]: time });
  };
  const BindApprovalDoctor = () => {
    axiosInstance
      .get("CommonController/BindApprovalDoctor")
      .then((res) => {
        // console.log(res)
        let data = res.data.message;
        let doctorData = data.map((ele) => {
          return {
            value: ele?.employeeid,
            label: ele?.name,
          };
        });
        setDoctorAdmin(doctorData);
      })
      .catch((err) => console.log(err));
  };

  const handleSelectChange1 = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    value != -1 && TableData(value);
  };

  const handleApifromModal = () => {
    setshowApprove({ ...approve, show: false });
    axiosInstance
      .post("RE/SaveResultEntry", modalpayload)
      .then((res) => {
        setLoading(false);

        handleReport("Yes", modalpayload?.HeaderInfo);
        setResultData([]);
        toast.success(res?.data?.message);
        setDlcCheckChecked(false);
      })
      .catch((err) => {
        if (err.response.status === 504) {
          toast.error(t("Something Went Wrong"));
        }
        toast.error(err.response.data.message);
        setLoading(false);
        // setResultData([]);
      });
  };

  useEffect(() => {
    getAccessCentres();
    getDepartment();
    BindApprovalDoctor();
    getPaymentModes("Identity", setIdentity);
    getButtondata();
  }, []);

  const handleDeltaCheckReport = (parameterData) => {
    const payloadData = parameterData.reduce(
      (acc, current) => {
        if (!acc.Patientcode) {
          acc.Patientcode = current?.PatientCode;
        }

        acc.testid.push(current.TestID);

        return acc;
      },
      {
        Patientcode: "",
        testid: [],
      }
    );

    axiosReport
      .post("commonReports/DeltaCheckData", payloadData)
      .then((res) => {
        window.open(res?.data?.Url, "_blank");
      })
      .catch((err) => {
        console.log(err);
      });
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

  const handleShowRemark = () => {
    setShowRemark(false);
  };
  const handleShowPrickRemarks = () => {
    setShowPrickRemark(false);
  };

  const handleUploadCount = (name, value, secondName) => {
    let data = [...redata];
    if (name === "UploadDocumentCount") {
      data[show6?.index][name] = value;
      data[show6?.index][secondName] = value === 0 ? 0 : 1;
      SetReData(data);
    } else {
      data[show4?.index][name] = value;
      data[show4?.index][secondName] = value === 0 ? 0 : 1;
      SetReData(data);
    }
  };

  const handleNotApproveRemark = (e, data) => {
    const { name, value } = e.target;
    const TestHeader = [...ResultTestData];
    const index = ResultTestData.indexOf(data);
    TestHeader[index][name] = value;
    if (name == "HoldReason") TestHeader[index]["IsHold"] = 1;
    setResultTestData(TestHeader);
  };

  const printHeader = (isPrint, guid) => {
    let newResultTestData = [...ResultTestData].map((ele) => {
      return {
        ...ele,
        Printwithhead: ele?.TestIDHash === guid ? isPrint : ele?.Printwithhead,
      };
    });
    setResultTestData(newResultTestData);
    let newResultData = [...ResultData].map((ele) => {
      return {
        ...ele,
        Printwithhead: ele?.TestIDHash === guid ? isPrint : ele?.Printwithhead,
      };
    });
    setResultData(newResultData);
  };

  return (
    <PageHead name="Result Entry" showDrop={"true"}>
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
              options={[
                { label: "Registration Date", value: "Date" },
                ...DateTypeSearch,
              ]}
              selectedValue={formData?.DateTypeSearch}
              name="DateTypeSearch"
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
          <div className="col-sm-2   ">
            <SelectBox
              options={machineId ?? []}
              selectedValue={formData?.MachineID}
              className="input-sm"
              lable="MachineID"
              id="MachineID"
              name="MachineID"
              onChange={handleSelectChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-2   ">
            <SelectBox
              options={[
                { label: "TAT Report - All", value: 0 },
                { label: "In TAT", value: 1 },
                { label: "Out TAT", value: 2 },
              ]}
              selectedValue={formData?.IsTat}
              lable="IsTat"
              id="IsTat"
              name="IsTat"
              onChange={handleSelectChange}
            />
          </div>
          <div className="col-sm-2">
            <SelectBox
              options={[{ label: "Select Flag", value: "" }, ...Flag]}
              name="Flag"
              lable="Flag"
              id="Flag"
              onChange={handleSelectChange}
              selectedValue={formData?.Flag}
            />
          </div>
          <div className="col-sm-2">
            <SelectBox
              options={[{ label: "Select Order", value: "" }, ...Order]}
              name="Order"
              lable="Order"
              id="Order"
              onChange={handleSelectChange}
              selectedValue={formData?.Order}
            />
          </div>
        </div>
      </div>
    </PageHead>
  );
};

export default ResultEntry;
