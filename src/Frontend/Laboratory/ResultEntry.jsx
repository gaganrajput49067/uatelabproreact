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
  dateConfig,
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
import { toast } from "react-toastify";
import moment from "moment";
import Loading from "../../components/Loading/Loading";
import RETable from "../Table/BootTable";
import UploadFile from "../utils/UploadFIleModal/UploadFile";
import MedicialModal from "../utils/MedicialModal";
import RSadvanceFilter from "../utils/RSadvanceFilter";
import Modal from "../../components/Modal/Modal";
import { useTranslation } from "react-i18next";
import { isChecked } from "../util/Commonservices";
import Table from "../../components/Table/Table";
import OldReportModal from "../utils/OldReportModal";
import PatientDetailModal from "../utils/PatientDetailModal";
import ResultEntryEditModal from "../utils/ResultEntryEditModal";
import RerunResultEntryModal from "../utils/RerunResultEntryModal";
import Reason from "../utils/Reason";
import ResultEditAddModal from "../utils/ResultEditAddModal";
import SubPageHead from "../../components/CommonComponent/SubPageHead";
import TemplateMasterModal from "../utils/TemplateMasterModal";
const ResultEntry = () => {
  const { t } = useTranslation();
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
console.log(ResultData)
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
  const today = new Date();
  const [formData, setFormData] = useState({
    FromDate: new Date(),
    ToDate: new Date(),
    CentreID: "",
    ItemValue: "",
    RateTypeID: "",
    SelectTypes: "",
    RefundFilter: null,
    FromTime: new Date(today.setHours(0, 0, 0, 0)),
    ToTime: new Date(today.setHours(23, 59, 59, 999)),
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
    parameterId: [],
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
          console.log(data)
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
        const data = res?.data?.message?.message;
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

          const dataTestHeader = res?.data?.message?.testHeader;
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
              LedgertransactionIDHash:payload?.LedgertransactionIDHash,
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
                  new RegExp(ResultData[j].labObservationID + "&", "g"),
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
              ResultData[i].Value = vv.toString();
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
              TestID: testidhash.join(","),
              LedgerTransactionID: "",
              DepartmentID: "",
              symbol: "",
              Mobile: payload[0]?.Mobile,
              VisitNo: payload[0]?.VisitNo,
              PEmail: payload[0]?.PEmail,
              MacID: "",
              LedgertransactionIDHash:payload[0]?.LedgertransactionIDHash
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
        LedgertransactionIDHash:headerData[0]?.LedgertransactionIDHash
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
    axiosReport
      .post(`commonReports/GetLabReport`, {
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
      .get("RE/EmployeeAccessDetails")
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
console.log(payloadData);
    axios
      .post("/reports/v1/commonReports/DeltaCheckData", {
        ...payloadData,
        Patientcode: payloadData?.Patientcode??"",
        testid: Array.isArray(payloadData?.testid)
          ? payloadData?.testid
          : [payloadData?.testid],
      })
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

  const totalPatient = () => {
    const visitNos = redata.map((item) => item.VisitNo);
    const uniqueVisitNos = new Set(visitNos);
    return uniqueVisitNos.size;
  };

  const prop = () => {
    const uniqueTestIDs = new Set();
    redata.forEach((item) => {
      const testIDs = item.TestID.split(",").map((id) => id.trim());
      testIDs.forEach((id) => uniqueTestIDs.add(id));
    });
    return uniqueTestIDs.size;
  };

  const closeAModal = () => {
    setshowApprove({ ...approve, show: false });
  };

  return (
    <>
      {approve?.show && (
        <Modal title={""} handleClose={closeAModal}>
          <div
            className="box-success"
            style={{ marginTop: "200px", backgroundColor: "transparent" }}
          >
            <div className="box-body">
              <div className="row">
                <label className="col-sm-10" htmlFor="PreBooking ID">
                  <span>{approve?.msg}</span>
                </label>
                <div className="col-sm-1">
                  <button
                    type="button"
                    className="btn btn-sm btn-success"
                    onClick={handleApifromModal}
                  >
                    Yes
                  </button>
                </div>
                <div className="col-sm-1">
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => {
                      setshowApprove({ ...approve, show: false });
                    }}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
      {showPH && (
        <PatientDetailModal
          showPH={showPH}
          setShowPH={(data) => {
            setShowPH(false);
            console.log("object");
          }}
          ResultData={ResultData}
        />
      )}
      {ResultData.length === 0 ? (
        <>
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

          {show6?.modal && (
            <UploadFile
              show={show6?.modal}
              handleClose={() => {
                setShow6({ modal: false, data: "", index: -1 });
              }}
              options={Identity}
              documentId={show6?.data}
              pageName="Patient Registration"
              handleUploadCount={handleUploadCount}
              formData={formData}
            />
          )}
          {showAdvanceFilter.show && (
            <RSadvanceFilter
              show={showAdvanceFilter.show}
              handleShow={() => {
                setShowAdvanceFilter({ show: false, data: "" });
                setFormData((data) => ({
                  ...data,
                  parameterId: [],
                  valueCheck: "=",
                  valueToSearch: "",
                  valueRangeFrom: "",
                  valueRangeTo: "",
                  moreFilter: 0,
                }));
              }}
              handleFilterChange={handleChange}
              data={formData}
              handleAdvSearch={() => {
                setFormData((data) => ({
                  ...data,
                  moreFilter: 1,
                }));
                TableData(document.getElementById("SampleStatus").value);
              }}
            />
          )}
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
                            <div className="error-message">
                              {errors?.ItemValue}
                            </div>
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
                            <div className="error-message">
                              {errors?.ItemValue}
                            </div>
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
                    options={[
                      { label: "All RateType", value: "" },
                      ...RateTypes,
                    ]}
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
                <div className="col-sm-1">
                  <SelectBox
                    options={[{ label: "Select Order", value: "" }, ...Order]}
                    name="Order"
                    lable="Order"
                    id="Order"
                    onChange={handleSelectChange}
                    selectedValue={formData?.Order}
                  />
                </div>
                <div className="col-sm-1 d-flex align-items-center">
                  <input
                    id="IsUrgent"
                    type="checkbox"
                    name="IsUrgent"
                    checked={formData?.IsUrgent}
                    onChange={handleSelectChange}
                  />
                  <label htmlFor="IsUrgent">&nbsp;&nbsp;IsUrgent</label>
                </div>
                <div className="col-sm-1 d-flex align-items-center">
                  <button
                    onClick={() =>
                      TableData(document.getElementById("SampleStatus").value)
                    }
                    className="btn btn-primary btn-sm w-100"
                  >
                    Search
                  </button>
                </div>
                <div className="col-sm-1 d-flex align-items-center">
                  <button
                    onClick={() => {
                      setShowAdvanceFilter({ show: true, data: formData });
                    }}
                    className="btn btn-success btn-sm w-100"
                  >
                    More Filter
                  </button>
                </div>
              </div>
            </div>
          </PageHead>
          {loading ? (
            <Loading />
          ) : (
            load && (
              <div className="box mb-4">
                <div
                  className="box-header with-border"
                  style={{ display: "none" }}
                >
                  <div className="row">
                    <div
                      className="col-sm-3"
                      style={{
                        background: "#605ca8",
                        display: "flex",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <span
                        style={{
                          color: "white",
                          padding: "3px",
                          borderRadius: "3px",
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: "15px",
                        }}
                      >
                        {`Total Patient : ${totalPatient()}`}
                      </span>
                      <span
                        style={{
                          color: "white",
                          padding: "3px",
                          borderRadius: "3px",
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: "15px",
                        }}
                      >
                        {`Total Test Count : ${prop()}`}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="">
                  <RETable
                    redata={redata}
                    GetResultEntry={GetResultEntry}
                    show={setShow4}
                    show2={setShow6}
                    handleInnerChecked={handleInnerChecked}
                  />
                </div>
              </div>
            )
          )}
        </>
      ) : (
        <>
          {showOldReportModal.show && (
            <OldReportModal
              show={showOldReportModal.show}
              value={showOldReportModal.data}
              handleClose={() => {
                setShowOldReportModal({ show: false, data: "" });
              }}
            />
          )}
          {show.moadal && (
            <ResultEntryEditModal
              show={show}
              handleClose={() => {
                setShow({ moadal: false, data: {} });
              }}
              handleSave={handleSave}
            />
          )}
          {show2.moadal && (
            <ResultEditAddModal
              show={show2}
              handleClose={() => {
                setShow2({ moadal: false, data: {} });
              }}
              handleSave={handleSave}
            />
          )}
          {show3?.modal && (
            <TemplateMasterModal
              show={show3}
              handleClose={() => {
                setShow3({ modal: false, data: {} });
              }}
              handleSave={handleSave}
            />
          )}
          {show7?.modal && (
            <RerunResultEntryModal
              show={show7?.modal}
              data={show7?.data}
              handleClose={() => {
                setShow7({ modal: false, data: {} });
              }}
            />
          )}
          {reason?.HoldShow && (
            <Reason
              show={reason?.HoldShow}
              reason={reason}
              setReason={setReason}
              handleNotApproveRemark={handleNotApproveRemark}
              handleResultSubmit={handleResultSubmit}
            />
          )}
          {show5?.modal && (
            <UploadFile
              show={show5?.modal}
              handleClose={(data) => {
                setShow5({
                  modal: false,
                  data: "",
                  pageName: "",
                  blockUpload: "",
                });
                printHeader(data, show5.data);
              }}
              documentId={show5.data}
              pageName={show5?.pageName}
              formData={formData}
              isPrintHeader={show5?.Printwithhead}
              blockUpload={show5.blockUpload}
            />
          )}
          {showRemark && (
            <SampleRemark
              show={showRemark}
              handleShow={handleShowRemark}
              state={handleShowRemark}
              PageName={ResultTestData[0]?.Remarks}
              handleSave={handleShowRemark}
              title={"Remarks"}
            />
          )}{" "}
          {showPrickRemark && (
            <SampleRemark
              show={showPrickRemark}
              handleShow={handleShowPrickRemarks}
              state={handleShowPrickRemarks}
              PageName={ResultTestData[0]?.PricksRemarks}
              handleSave={handleShowRemark}
              title={"PricksRemarks"}
            />
          )}
          {showAuditTrail.show && (
            <AuditTrailMoadal
              show={showAuditTrail.show}
              data={showAuditTrail.data}
              testname={showAuditTrail?.testname}
              handleClose={handleAuditTrailModal}
            />
          )}
          {/* <div className={`custom-box-body ${getGradientClass()}`}>
            <div className="custom-row">
              <div className="custom-col custom-col-visit">
                <span className="fa fa-folder custom-text">
                  &nbsp; {ResultData[0]?.LedgerTransactionNo}
                </span>
              </div>
              <div className="custom-col custom-col-visit">
                <span className="fa fa-user-md custom-text">
                  &nbsp; {ResultData[0]?.PName}
                </span>
              </div>
              <div className="custom-col custom-col-visit">
                <span className="fa fa-book custom-text">
                  &nbsp; {ResultData[0]?.PatientCode}
                </span>
              </div>
              <div className="custom-col custom-col-visit">
                <span className="fa fa-calendar-check-o custom-text">
                  &nbsp; {ResultData[0]?.Age}
                </span>
              </div>
              <div className="custom-col custom-col-visit">
                <span className="fa fa-book custom-text">
                  &nbsp; {ResultData[0]?.Gender}
                </span>
              </div>
              <div className="custom-col custom-col-visit">
                <span className="fa fa-h-square custom-text">
                  &nbsp; {ResultData[0]?.Centre}
                </span>
              </div>
              <div className="custom-col custom-col-visit">
                <span className="fa fa-user-md custom-text">
                  &nbsp; {ResultData[0]?.ReferDoctor}
                </span>
              </div>
              <div
                className="custom-col custom-col-visit"
                style={{ width: "300px" }}
              >
                <span
                  className="fa fa-calendar-check-o custom-text"
                  style={{ width: "150px" }}
                >
                  &nbsp; {dateConfig(ResultData[0]?.RegDate)}
                </span>
              </div>
              <div className="custom-col custom-col-visit custom-text">
                <span className="fa fa-plus-square">
                  &nbsp; {ResultData[0]?.RateType}
                </span>
              </div>

              <div className="custom-col custom-end">
                <span
                  className="fa fa-comment custom-icon-large"
                  title="Remarks"
                  onClick={() => setShowRemark(true)}
                  style={{ marginRight: "10px" }}
                ></span>
                <span
                  className="fa fa-eyedropper custom-icon-large"
                  title="Prickremarks"
                  onClick={() => setShowPrickRemark(true)}
                ></span>
              </div>
            </div>
            <div className="row" style={{ margin: 0, padding: 0 }}>
              <div className="d-flex my" style={{ margin: 0, padding: 0 }}>
                {ResultTestData?.map((data, index) => (
                  <div
                    key={index}
                    style={{ cursor: "pointer" }}
                    className={` round font-weight-bold mx-2 my-2 px-3 py-2  Status-${data.Status}`}
                    onMouseEnter={() => {
                      setTestHeaderHover({
                        index: index,
                        data: [],
                      });
                      TestHeaderResponce(data);
                    }}
                    onMouseLeave={() => {
                      setTestHeaderHover({
                        index: -1,
                        data: [],
                      });
                      setHeaderTestResult([]);
                    }}
                  >
                    {data?.PackageName}
                    {testHeaderHover?.index === index &&
                      headerTestResult.length > 0 && (
                        <div
                          style={{
                            position: "absolute",
                            width: "650px",
                            left: "60px",
                            zIndex: 1,
                            height: "auto",
                          }}
                          className="resultEntryCssTable"
                        >
                          <table
                            className="table table-bordered table-hover table-striped tbRecord"
                            cellPadding="{0}"
                            cellSpacing="{0}"
                          >
                            <thead className="cf">
                              <tr>
                                <th>Test</th>
                                <th>Value</th>
                                <th>Unit</th>
                                <th>Min</th>
                                <th>Max</th>
                              </tr>
                            </thead>
                            <tbody>
                              {headerTestResult.map((ele, index) => (
                                <tr
                                  key={index}
                                  style={{
                                    background:
                                      ele?.Flag === "High"
                                        ? "red"
                                        : ele?.Flag === "Low"
                                        ? "yellow"
                                        : "skyblue",
                                  }}
                                >
                                  <td data-title="LabObservationName">
                                    {ele?.LabObservationName
                                      ? ele?.LabObservationName
                                      : "-"}
                                  </td>
                                  <td data-title="Value">
                                    {ele?.Value ? ele?.Value : "-"}
                                  </td>
                                  <td data-title="ReadingFormat">
                                    {ele?.ReadingFormat
                                      ? ele?.ReadingFormat
                                      : "-"}
                                  </td>
                                  <td data-title="MinValue">
                                    {ele?.MinValue ? ele?.MinValue : "-"}
                                  </td>
                                  <td data-title="MaxValue">
                                    {ele?.MaxValue ? ele?.MaxValue : "-"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          </div> */}
          {/* <div className="card pb-0"> */}
          {/* <SubPageHead title={"Result Entry"}> */}
          <div className="custom-box-body mb-3 mt-3">
            <div className="custom-row">
              <div className="custom-col custom-col-visit">
                <span className="fa fa-folder custom-text">
                  &nbsp; <span>{ResultData[0]?.LedgerTransactionNo}</span>
                </span>
              </div>

              <div className="custom-col">
                <span className="fa fa-user custom-text">
                  &nbsp; <span>{ResultData[0]?.PName}</span>
                </span>
              </div>

              <div className="custom-col">
                <span className="fa fa-book custom-text">
                  &nbsp;<span>{ResultData[0]?.PatientCode}</span>
                </span>
              </div>

              <div className="custom-col custom-col-age-gender">
                <span className="fa fa-calendar-check-o custom-text">
                  &nbsp;<span> {ResultData[0]?.Age}</span>
                </span>
                <span className="fa fa-street-view custom-text">
                  &nbsp; <span> {ResultData[0]?.Gender}</span>
                </span>
              </div>

              <div className="custom-col">
                <span className="fa fa-h-square custom-text">
                  &nbsp; <span>{ResultData[0]?.Centre}</span>
                </span>
              </div>

              <div className="custom-col">
                <span className="fa fa-user-md custom-text">
                  &nbsp; <span> {ResultData[0]?.Referdoctor}</span>
                </span>
              </div>

              <div className="custom-col">
                <span className="fa fa-plus-square custom-text">
                  &nbsp;<span> {ResultData[0]?.RateType} </span>
                </span>
              </div>

              <div className="custom-col custom-col-regdate">
                <span className="fa fa-calendar custom-text">
                  &nbsp; <span> {dateConfig(ResultData[0]?.RegDate)}</span>
                </span>
              </div>

              <div className="custom-col custom-end">
                <span
                  className="fa fa-cloud-upload custom-text"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Upload Document"
                  onClick={() => {
                    setShow({
                      modal: true,
                      data: ResultData[0]?.PatientGuid,
                    });
                  }}
                  style={{
                    color:
                      ResultData[0]?.UploadDocumentCount > 0
                        ? "#4ea30c"
                        : "black !important",
                    marginRight: "10px",
                    cursor: "pointer",
                  }}
                >
                  <span>{ResultData[0]?.UploadDocumentCount}</span>
                </span>
                <span
                  className="fa fa-history custom-text"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Medical History"
                  onClick={() => {
                    setShow4({
                      modal: true,
                      data: ResultData[0]?.PatientGuid,
                    });
                  }}
                  style={{
                    color:
                      ResultData[0]?.MedicalHistoryCount > 0
                        ? "#4ea30c"
                        : "black !important",
                    marginRight: "10px",
                    cursor: "pointer",
                  }}
                >
                  <span>{ResultData[0]?.MedicalHistoryCount}</span>
                </span>
                <span
                  className="fa fa-comment custom-icon-large"
                  title="Remarks"
                  onClick={() => setShowRemark(true)}
                  style={{ marginRight: "10px" }}
                ></span>
                <span
                  className="fa fa-eyedropper custom-icon-large"
                  title="Prickremarks"
                  onClick={() => setShowPrickRemark(true)}
                ></span>
              </div>
            </div>
            <div className="custom-row">
              {ResultTestData?.map((data, index) => (
                <div
                  key={index}
                  style={{ cursor: "pointer" }}
                  className={` round font-weight-bold mx-2 mt-1 Status-${data.Status}`}
                  onMouseEnter={() => {
                    setTestHeaderHover({
                      index: index,
                      data: [],
                    });
                    TestHeaderResponce(data);
                  }}
                  onMouseLeave={() => {
                    setTestHeaderHover({
                      index: -1,
                      data: [],
                    });
                    setHeaderTestResult([]);
                  }}
                >
                  {data?.PackageName}
                  {testHeaderHover?.index === index &&
                    headerTestResult.length > 0 && (
                      <div
                        style={{
                          position: "absolute",
                          width: "650px",
                          left: "60px",
                          zIndex: 1,
                          height: "auto",
                        }}
                        className="resultEntryCssTable"
                      >
                        <table
                          className="table table-bordered table-hover table-striped tbRecord"
                          cellPadding="{0}"
                          cellSpacing="{0}"
                        >
                          <thead className="cf">
                            <tr>
                              <th>Test</th>
                              <th>Value</th>
                              <th>Unit</th>
                              <th>Min</th>
                              <th>Max</th>
                            </tr>
                          </thead>
                          <tbody>
                            {headerTestResult.map((ele, index) => (
                              <tr
                                key={index}
                                style={{
                                  background:
                                    ele?.Flag === "High"
                                      ? "red"
                                      : ele?.Flag === "Low"
                                      ? "yellow"
                                      : "skyblue",
                                }}
                              >
                                <td data-title="LabObservationName">
                                  {ele?.LabObservationName
                                    ? ele?.LabObservationName
                                    : "-"}
                                </td>
                                <td data-title="Value">
                                  {ele?.Value ? ele?.Value : "-"}
                                </td>
                                <td data-title="ReadingFormat">
                                  {ele?.ReadingFormat
                                    ? ele?.ReadingFormat
                                    : "-"}
                                </td>
                                <td data-title="MinValue">
                                  {ele?.MinValue ? ele?.MinValue : "-"}
                                </td>
                                <td data-title="MaxValue">
                                  {ele?.MaxValue ? ele?.MaxValue : "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
          {/* </SubPageHead> */}
          {/* </div> */}
          <Table>
            <thead class="cf">
              <tr>
                <th>{t("#")}</th>
                <th>{t("TestName")}</th>
                {isPreviousResultAvailable && <th>{t("Pre. Value")}</th>}
                <th style={{ width: "150px" }}>{t("Value")}</th>
                <th>{t("Comment")}</th>
                <th>{t("Flag")}</th>
                <th>{t("Omit")}</th>
                <th>{t("Critical")}</th>
                <th>{t("Mac Reading")}</th>
                <th>{t("MachineName")}</th>
                <th>{t("Reading 1")}</th>
                <th>{t("Reading 2")}</th>
                <th>{t("Method Name")}</th>
                <th>{t("Ref Range")}</th>
                <th>{t("Unit")}</th>
                <th>{t("Action")}</th>
                <th>{t("Rerun")}</th>
                <th>{t("AuditTrail")}</th>
              </tr>
            </thead>
            <tbody>
              {ResultTestData?.map((Hdata, Hindex) => (
                <>
                  <tr key={Hindex} style={{ backgroundColor: "lightgrey" }}>
                    <td data-title={t("#")}>
                      <input
                        type="checkbox"
                        onChange={(e) => handleCheckbox(e, -1, Hdata.TestID)}
                        checked={
                          ResultData?.length > 0
                            ? isChecked(
                                "isChecked",
                                ResultData,
                                true,
                                Hdata.TestID
                              ).includes(false)
                              ? false
                              : true
                            : false
                        }
                        disabled={Hdata?.Status === 5 ? true : false}
                        name="isChecked"
                      />
                    </td>
                    <td
                      colSpan={`${isPreviousResultAvailable ? 1 : 4}`}
                      data-title={t("TestName")}
                    >
                      <span className="invName">{Hdata?.PackageName}</span>
                    </td>
                    {isPreviousResultAvailable && (
                      <td colSpan={4} data-title={t("Previous Test Date")}>
                        <b>{Hdata.OldValueDate}</b>
                      </td>
                    )}
                    <td data-title={t("Value")} colSpan={3}>
                      <span className="fa fa-barcode">&nbsp;</span>
                      <b>{Hdata?.SINNO}</b>
                    </td>
                    <td colSpan="7" data-title={t("Comment")}>
                      <div className="d-flex justify-content-start">
                        {(Hdata?.Status === 3 ||
                          Hdata.Status === 10 ||
                          Hdata?.Status === 14) && (
                          <>
                            <div className="col-sm-2 m-0 p-0">
                              <button
                                className="btn btn-primary btn-sm"
                                disabled={!Hdata?.isChecked}
                                onClick={() => {
                                  setShow5({
                                    modal: true,
                                    data: Hdata?.TestIDHash,
                                    pageName: "Add Report",
                                    Printwithhead: Hdata?.Printwithhead,
 blockUpload:
                                        Hdata?.Status == 5 || Hdata?.Status == 6
                                          ? true
                                          : false,
                                  });
                                }}
                              >
                                {t("Add Report")}
                              </button>
                            </div>
                            &nbsp;
                            <div className="col-sm-3 m-0 p-0">
                              <button
                                className="btn btn-primary btn-sm"
                                disabled={!Hdata?.isChecked}
                                onClick={() => {
                                  setShow5({
                                    modal: true,
                                    data: Hdata?.TestIDHash,
                                    pageName: "Add Attachment",
blockUpload:
                                        Hdata?.Status == 5 || Hdata?.Status == 6
                                          ? true
                                          : false,
                                  });
                                }}
                              >
                                {t("Add Attachment")}
                              </button>
                            </div>
                            &nbsp;
                            {Hdata?.datatype === "Profile" && (
                              <div className="col-sm-3 m-0 p-0">
                                <button
                                  className="btn btn-success btn-sm"
                                  disabled={!Hdata?.isChecked}
                                  onClick={() =>
                                    setShow2({
                                      moadal: true,
                                      data: { ...Hdata, pageName: "All" },
                                    })
                                  }
                                >
                                  {t("Add Comment")}
                                </button>
                              </div>
                            )}
                            &nbsp;
                          </>
                        )}
                        {[5, 6].includes(Hdata?.Status) &&
                          buttonsData?.map(
                            (ele, index) =>
                              ele?.AccessBy === "Not Approved" && (
                                <>
                                  <div className="col-sm-2 m-0 p-0">
                                    <button
                                      className="btn btn-primary btn-sm"
                                      disabled={!Hdata?.isChecked}
                                      onClick={() => {
                                        setShow5({
                                          modal: true,
                                          data: Hdata?.TestIDHash,
                                          pageName: "Add Report",
                                          Printwithhead: Hdata?.Printwithhead,
    blockUpload:
                                              Hdata?.Status == 5 ||
                                              Hdata?.Status == 6
                                                ? true
                                                : false,
                                        });
                                      }}
                                    >
                                      {Hdata?.Status === 5
                                        ? t("Show Report")
                                        : t("Add Report")}
                                    </button>
                                  </div>
                                  &nbsp;
                                  <div className="col-sm-3 m-0 p-0">
                                    <button
                                      className="btn btn-primary btn-sm"
                                      disabled={!Hdata?.isChecked}
                                      onClick={() => {
                                        setShow5({
                                          modal: true,
                                          data: Hdata?.TestIDHash,
                                          pageName: "Add Attachment",
 blockUpload:
                                              Hdata?.Status == 5 ||
                                              Hdata?.Status == 6
                                                ? true
                                                : false,
                                        });
                                      }}
                                    >
                                      {Hdata?.Status === 5
                                        ? t("Show Attachment")
                                        : t("Add Attachment")}
                                    </button>
                                  </div>
                                  &nbsp; &nbsp;
                                  {loading ? (
                                    <Loading />
                                  ) : (
                                    <div className="col-sm-2 m-0 p-0">
                                      <button
                                        className="btn btn-danger btn-sm"
                                        type="button"
                                        disabled={!Hdata?.isChecked}
                                        id="btnMainList"
                                        key={index}
                                        onClick={() => {
                                          setReason({
                                            ...reason,
                                            HoldShow: true,
                                            Hdata: Hdata,
                                            type: "Not Approved",
                                          });
                                        }}
                                      >
                                        {ele?.AccessBy}
                                      </button>
                                    </div>
                                  )}
                                </>
                              )
                          )}
                        &nbsp;
                        {Hdata?.Status === 11 &&
                          buttonsData?.map(
                            (ele, index) =>
                              ele?.AccessBy === "Unhold" && (
                                <>
                                  {loading ? (
                                    <Loading />
                                  ) : (
                                    <div className="col-sm-2 m-0 p-0">
                                      <button
                                        className="btn btn-success"
                                        type="button"
                                        id="btnMainList"
                                        disabled={!Hdata?.isChecked}
                                        key={index}
                                        onClick={() =>
                                          handleResultSubmit(
                                            ele?.AccessBy,
                                            Hdata
                                          )
                                        }
                                      >
                                        {ele?.AccessBy}
                                      </button>
                                    </div>
                                  )}
                                </>
                              )
                          )}
                        {Hdata?.IsDLCCheck == 1 && (
                          <>
                            <input
                              type="checkbox"
                              checked={DlcCheckChecked}
                              onChange={(e) => {
                                setDlcCheckChecked(e?.target?.checked);
                              }}
                            />
                            <label style={{ alignSelf: "flex-end" }}>
                              {t("DLC Check")}
                            </label>
                          </>
                        )}
                        {![11, 5, 6].includes(Hdata?.Status) &&
                          buttonsData?.map(
                            (ele, index) =>
                              ele?.AccessBy === "Hold" && (
                                <>
                                  {loading ? (
                                    <Loading />
                                  ) : (
                                    <button
                                      className="btn btn-danger btn-sm col-sm-1"
                                      type="button"
                                      id="btnMainList"
                                      key={index}
                                      disabled={!Hdata?.isChecked}
                                      onClick={() => {
                                        setReason({
                                          ...reason,
                                          HoldShow: true,
                                          Hdata: Hdata,
                                          type: "Hold",
                                        });
                                      }}
                                    >
                                      {ele?.AccessBy}
                                    </button>
                                  )}
                                </>
                              )
                          )}
                      </div>
                    </td>
                    <td data-title={t("Flag")}>
                      {[3, 13, 14, 10].includes(Hdata.Status) && (
                        <button
                          className="btn btn-sm btn-warning"
                          disabled={!Hdata?.isChecked}
                          onClick={() => setShow7({ modal: true, data: Hdata })}
                        >
                          Rerun
                        </button>
                      )}
                    </td>
                    <td
                      data-title={t("Audit Trail")}
                      style={{
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      className="text-center text-primary"
                    >
                      <span
                        onClick={() => {
                          AuditTrailResponce(Hdata);
                        }}
                      >
                        View
                      </span>
                    </td>
                  </tr>
                  {ResultData?.map((datanew, index) => (
                    <>
                      {Hdata.TestID === datanew.TestID && (
                        <tr
                          key={index}
                          style={{
                            backgroundColor:
                              datanew?.IsLabOutSource == "True" ? "pink" : "",
                          }}
                        >
                          <td data-title={t("#")}>
                            <input
                              type="checkbox"
                              checked={datanew?.isChecked}
                              onChange={(e) => handleCheckbox(e, index)}
                              name="isChecked"
                              disabled={true}
                            />
                          </td>
                         <td
                                data-title={t("TestName")}
                                style={{
                                  wordWrap: "break-word",
                                  whiteSpace: "normal",
                                }}
                              >
                            <span
                              style={{ cursor: "pointer" }}
                              data-toggle="tooltip"
                              data-placement="top"
                              title={
                                datanew?.isMandatory === 1
                                  ? "Required Field"
                                  : datanew?.dlcCheck === 1
                                  ? "DLC Parameter"
                                  : datanew?.Formula != ""
                                  ? "Calculated Field"
                                  : ""
                              }
                              className={`${
                                datanew?.isMandatory === 1 && "required "
                              } ${datanew?.dlcCheck === 1 && "bg-yellow-new "}`}
                            >
                              <span
                                className={`${
                                  datanew?.Formula != "" && "Formula"
                                } `}
                              >
                                {datanew?.TestName}
                              </span>
                            </span>
                          </td>
                          {isPreviousResultAvailable && (
                            <td data-title={t("Previous Value")}>
                              {datanew.OldValue}
                            </td>
                          )}
                          {datanew?.Header === 0 ? (
                            <>
                              {["2", "3"].includes(datanew?.ReportType) ? (
                                <td
                                  style={{
                                    fontSize: "15px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() =>
                                    setShow3({
                                      modal: true,
                                      data: datanew,
                                    })
                                  }
                                  data-title={t("Action")}
                                >
                                  +
                                </td>
                              ) : datanew?.dlcCheck === 1 ? (
                                datanew?.IsHelpMenu === 0 ? (
                                  <td data-title={t("Value")}>
                                    <Input
                                      type="text"
                                      className={`form-control input-sm ${
                                        (datanew?.MaxValue != "0" ||
                                          datanew?.MinValue != "0") &&
                                        parseFloat(datanew?.Value) >
                                          parseFloat(datanew?.MaxValue)
                                          ? "high"
                                          : parseFloat(datanew?.Value) <
                                            parseFloat(datanew?.MinValue)
                                          ? "low"
                                          : ""
                                      } `}
                                      name="Value"
                                      autoComplete="off"
                                      disabled={
                                        datanew?.CanSaveAmendment
                                          ? false
                                          : datanew?.MacReading
                                          ? true
                                          : false
                                      }
                                      value={datanew?.Value}
                                      onChange={(e) =>
                                        handleCheckbox(
                                          e,
                                          index,
                                          datanew?.TestID,
                                          datanew?.MinValue,
                                          datanew?.MaxValue
                                        )
                                      }
                                      onKeyUp={(e) =>
                                        handleKeyUp(
                                          e,

                                          myRefs.current[
                                            index === ResultData.length - 1
                                              ? 0
                                              : index + 1
                                          ],
                                          index
                                        )
                                      }
                                      ref={(el) => (myRefs.current[index] = el)}
                                    />
                                  </td>
                                ) : (
                                  <td data-title={t("Value")}>
                                    <Input
                                      type="text"
                                      className={`form-control input-sm ${
                                        (datanew?.MaxValue != "0" ||
                                          datanew?.MinValue != "0") &&
                                        parseFloat(datanew?.Value) >
                                          parseFloat(datanew?.MaxValue)
                                          ? "high"
                                          : parseFloat(datanew?.Value) <
                                            parseFloat(datanew?.MinValue)
                                          ? "low"
                                          : ""
                                      }`}
                                      name="Value"
                                      value={datanew?.Value}
                                      disabled={
                                        datanew?.CanSaveAmendment
                                          ? false
                                          : datanew?.MacReading
                                          ? true
                                          : false
                                      }
                                      onChange={(e) =>
                                        handleCheckbox(
                                          e,
                                          index,
                                          datanew?.TestID,
                                          datanew?.MinValue,
                                          datanew?.MaxValue
                                        )
                                      }
                                      onKeyUp={(e) =>
                                        handleKeyUp(
                                          e,
                                          myRefs.current[
                                            index === ResultData.length - 1
                                              ? 0
                                              : index + 1
                                          ],
                                          index
                                        )
                                      }
                                      autoComplete="off"
                                      ref={(el) => (myRefs.current[index] = el)}
                                    />
                                  </td>
                                )
                              ) : datanew?.IsHelpMenu === 0 ? (
                                <td data-title={t("Value")}>
                                  <Input
                                    type="text"
                                    className={`form-control input-sm ${
                                      (datanew?.MaxValue != "0" ||
                                        datanew?.MinValue != "0") &&
                                      parseFloat(datanew?.Value) >
                                        parseFloat(datanew?.MaxValue)
                                        ? "high"
                                        : parseFloat(datanew?.Value) <
                                          parseFloat(datanew?.MinValue)
                                        ? "low"
                                        : ""
                                    }`}
                                    name="Value"
                                    disabled={
                                      datanew?.CanSaveAmendment
                                        ? false
                                        : datanew?.MacReading
                                        ? true
                                        : false
                                    }
                                    value={datanew?.Value}
                                    onChange={(e) =>
                                      handleCheckbox(
                                        e,
                                        index,
                                        datanew?.TestID,
                                        datanew?.MinValue,
                                        datanew?.MaxValue
                                      )
                                    }
                                    onKeyUp={(e) =>
                                      handleKeyUp(
                                        e,
                                        myRefs.current[
                                          index === ResultData.length - 1
                                            ? 0
                                            : index + 1
                                        ],
                                        index
                                      )
                                    }
                                    autoComplete="off"
                                    ref={(el) => (myRefs.current[index] = el)}
                                  />
                                </td>
                              ) : (
                                <td data-title={t("Value")}>
                                  <div style={{ position: "relative" }}>
                                    <Input
                                      type="text"
                                      className={`form-control input-sm ${
                                        (datanew?.MaxValue != "0" ||
                                          datanew?.MinValue != "0") &&
                                        parseFloat(datanew?.Value) >
                                          parseFloat(datanew?.MaxValue)
                                          ? "high"
                                          : parseFloat(datanew?.Value) <
                                            parseFloat(datanew?.MinValue)
                                          ? "low"
                                          : ""
                                      }`}
                                      name="Value"
                                      autoComplete="off"
                                      disabled={
                                        datanew?.CanSaveAmendment
                                          ? false
                                          : datanew?.MacReading
                                          ? true
                                          : false
                                      }
                                      value={datanew?.Value}
                                      onChange={(e) =>
                                        handleCheckbox(
                                          e,
                                          index,
                                          datanew?.TestID,
                                          datanew?.MinValue,
                                          datanew?.MaxValue
                                        )
                                      }
                                      onKeyDown={(e) => {
                                        getHelpMenuData(
                                          e,
                                          datanew?.labObservationID
                                        );
                                        handleIndex(e, index);
                                      }}
                                      onKeyUp={(e) =>
                                        handleKeyUp(
                                          e,
                                          myRefs.current[
                                            index === ResultData.length - 1
                                              ? 0
                                              : index + 1
                                          ],
                                          index
                                        )
                                      }
                                      ref={(el) => (myRefs.current[index] = el)}
                                      onBlur={() =>
                                        setTimeout(() => {
                                          setHiddenDropDownHelpMenu(false);
                                        }, [1000])
                                      }
                                    />

                                    {helpmenu.length > 0 &&
                                      helpmenu[0]?.Value ==
                                        datanew?.labObservationID &&
                                      HiddenDropDownHelpMenu && (
                                        <ul
                                          className="suggestion-data"
                                          style={{
                                            width: "100%",
                                            right: "0px",
                                            border: "1px solid #dddfeb",
                                          }}
                                        >
                                          {helpmenu.map(
                                            (data, helpmenuindex) => (
                                              <li
                                                onClick={() =>
                                                  handleListSearch(
                                                    data,
                                                    "Value",
                                                    index
                                                  )
                                                }
                                                key={helpmenuindex}
                                                className={`${
                                                  helpmenuindex ===
                                                    indexMatch && "matchIndex"
                                                }`}
                                              >
                                                {data?.label}
                                              </li>
                                            )
                                          )}
                                        </ul>
                                      )}
                                  </div>
                                </td>
                              )}
                              {["2", "3"].includes(datanew?.ReportType) ? (
                                <td></td>
                              ) : (
                                <td
                                  style={{ position: "relative" }}
                                  data-title={t("Action")}
                                >
                                  <div className="d-flex align-items-center">
                                    <div
                                      className="mx-2"
                                      style={{
                                        cursor: "pointer",
                                        fontSize: "15px",
                                      }}
                                      onClick={() =>
                                        setShow2({
                                          moadal: true,
                                          data: {
                                            ...datanew,
                                            pageName: "Single",
                                          },
                                        })
                                      }
                                    >
                                      +
                                    </div>
                                    <span
                                      className="fa fa-exclamation-triangle mx-2"
                                      aria-hidden="true"
                                      style={{
                                        cursor: "pointer",
                                        fontSize: "15px",
                                        width: "35px",
                                        padding: "5px 10px",
                                      }}
                                      onMouseEnter={() => {
                                        setMouseHover({
                                          index: index,
                                          data: [],
                                        });
                                        DeltaResponse(datanew);
                                      }}
                                      onMouseLeave={() => {
                                        setMouseHover({
                                          index: -1,
                                          data: [],
                                        });
                                        setPreviousTestResult([]);
                                      }}
                                    >
                                      {mouseHover?.index === index &&
                                        PreviousTestResult.length > 0 && (
                                          <div
                                            style={{
                                              position: "absolute",
                                              width: "650px",
                                              left: "60px",
                                              zIndex: 1,
                                              height: "auto",
                                            }}
                                            className="resultEntryCssTable"
                                          >
                                            <Table>
                                              <thead className="cf">
                                                <tr>
                                                  <th>Booking Date</th>
                                                  <th>Test</th>
                                                  <th>Value</th>
                                                  <th>Unit</th>
                                                  <th>Min</th>
                                                  <th>Max</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {PreviousTestResult.map(
                                                  (ele, index) => (
                                                    <tr
                                                      key={index}
                                                      style={{
                                                        background: "skyBlue",
                                                      }}
                                                    >
                                                      <td
                                                        data-title="BookingDate"
                                                        style={{
                                                          width: "120px",
                                                        }}
                                                      >
                                                        {dateConfig(
                                                          ele?.BookingDate
                                                        )}
                                                      </td>
                                                      <td data-title="LabObservationName">
                                                        {ele?.LabObservationName
                                                          ? ele?.LabObservationName
                                                          : "-"}
                                                      </td>
                                                      <td data-title="Value">
                                                        {ele?.Value
                                                          ? ele?.Value
                                                          : "-"}
                                                      </td>
                                                      <td data-title="ReadingFormat">
                                                        {ele?.ReadingFormat
                                                          ? ele?.ReadingFormat
                                                          : "-"}
                                                      </td>
                                                      <td data-title="MinValue">
                                                        {ele?.MinValue
                                                          ? ele?.MinValue
                                                          : "-"}
                                                      </td>
                                                      <td data-title="MaxValue">
                                                        {ele?.MaxValue
                                                          ? ele?.MaxValue
                                                          : "-"}
                                                      </td>
                                                    </tr>
                                                  )
                                                )}
                                              </tbody>
                                            </Table>
                                          </div>
                                        )}
                                    </span>
                                  </div>
                                </td>
                              )}
                              {["2", "3"].includes(datanew?.ReportType) ? (
                                <td> &nbsp;</td>
                              ) : (
                                <td className="w-50p" data-title={t("Flag")}>
                                  <select value={datanew?.Flag} disabled>
                                    <option hidden></option>
                                    <option value="Normal">Normal</option>
                                    <option value="High">High</option>
                                    <option value="Low">Low</option>
                                  </select>
                                </td>
                              )}
                              <td data-title={t("Omit")}>
                                <input
                                  type="checkbox"
                                  checked={datanew?.isOmit}
                                  onChange={(e) => handleCheckbox(e, index)}
                                  name="isOmit"
                                  // disabled={true}
                                />
                              </td>
                              <td data-title={t("Critical")}>
                                <indexnput
                                  type="checkbox"
                                  checked={datanew?.IsCriticalCheck}
                                  onChange={(e) => handleCheckbox(e, index)}
                                  name="IsCriticalCheck"
                                  // disabled={true}
                                />
                              </td>
                              <td
                                data-title={t("Mac Reading")}
                                className={`Status-${datanew?.Status}`}
                              >
                                {" "}
                                {datanew?.MacReading}&nbsp;
                              </td>
                              <td data-title={t("MachineName")}>
                                {" "}
                                {datanew?.machinename}&nbsp;
                              </td>
                              <td data-title={t("Reading 1")}>
                                {datanew?.Reading1} &nbsp;
                              </td>
                              <td data-title={t("Reading 2")}>
                                {datanew?.Reading2} &nbsp;
                              </td>

                              {["2", "3"].includes(datanew?.ReportType) ? (
                                <td data-title=""> &nbsp;</td>
                              ) : (
                                <td data-title={t("Method Name")} style={{
   
                                      wordWrap: "break-word", 
                                      whiteSpace: "normal",
                                                                  }}>
                                  {datanew?.MethodName} &nbsp;
                                </td>
                              )}
                              {["2", "3"].includes(datanew?.ReportType) ? (
                                <td data-title=""> &nbsp;</td>
                              ) : (
                                <td data-title="DisplayReading">
                                  {datanew?.DisplayReading} &nbsp;
                                </td>
                              )}
                              {["2", "3"].includes(datanew?.ReportType) ? (
                                <td data-title=""> &nbsp;</td>
                              ) : (
                                <td data-title={t("ReadingFormat")}>
                                  {datanew?.ReadingFormat} &nbsp;
                                </td>
                              )}
                              {["2", "3"].includes(datanew?.ReportType) ? (
                                <td data-title=""> &nbsp;</td>
                              ) : (
                                <td data-title={t("Edit")} colSpan={2}>
                                  <div
                                    className="text-primary"
                                    style={{
                                      cursor: "pointer",
                                      textDecoration: "underline",
                                    }}
                                    onClick={() =>
                                      setShow({
                                        moadal: true,
                                        data: datanew,
                                      })
                                    }
                                  >
                                    {t("Edit")}
                                  </div>
                                </td>
                              )}
                            </>
                          ) : (
                            <td colSpan="10" data-title="">
                              {" "}
                              &nbsp;
                            </td>
                          )}
                          <td colSpan="10" data-title="">
                            {" "}
                            &nbsp;
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </>
              ))}
            </tbody>
          </Table>
          <div className="card m-0 p-0 pb-2">
            <div className="row mt-3" style={{ textWrap: "avoid" }}>
              {loading ? (
                <div className="mx-3">
                  <Loading />
                </div>
              ) : (
                <>
                  <div className="col-sm-1">
                    <button
                      className="previous roundarrow btn-success mx-2"
                      onClick={() => {
                        ResultData.length > 0 &&
                          GetResultEntry(
                            {
                              TestID:
                                redata[ResultData[0]?.currentIndex - 1]?.TestID,
                              LedgerTransactionID: "",
                              DepartmentID: "",
                              symbol: "",
                              Mobile:
                                redata[ResultData[0]?.currentIndex - 1]?.Mobile,
                              VisitNo:
                                redata[ResultData[0]?.currentIndex - 1]
                                  ?.VisitNo,
                              PEmail:
                                redata[ResultData[0]?.currentIndex - 1]?.PEmail,
                              MacID: "",
                              LedgertransactionIDHash:redata[ResultData[0]?.currentIndex - 1]?.LedgertransactionIDHash
                            },
                            ResultData[0]?.currentIndex - 1
                          );
                      }}
                      disabled={
                        ResultData[0]?.currentIndex === 0 ? true : false
                      }
                    >
                      ‹
                    </button>
                    <button
                      className="next roundarrow btn-success mx-2"
                      onClick={() => {
                        ResultData.length > 0 &&
                          GetResultEntry(
                            {
                              TestID:
                                redata[ResultData[0]?.currentIndex + 1]?.TestID,
                              LedgerTransactionID: "",
                              DepartmentID: "",
                              symbol: "",

                              Mobile:
                                redata[ResultData[0]?.currentIndex + 1]?.Mobile,
                              VisitNo:
                                redata[ResultData[0]?.currentIndex + 1]
                                  ?.VisitNo,
                              PEmail:
                                redata[ResultData[0]?.currentIndex + 1]?.PEmail,
                              MacID: "",
                              LedgertransactionIDHash:
                                redata[ResultData[0]?.currentIndex + 1]?.LedgertransactionIDHash,
                            },
                            ResultData[0]?.currentIndex + 1
                          );
                      }}
                      disabled={
                        ResultData[0]?.currentIndex === redata.length - 1
                          ? true
                          : false
                      }
                    >
                      ›
                    </button>
                  </div>
                  <div className="col-sm-1 ">
                    {["", 3, 10, 11, 13, 14, 15].includes(statusValue) && (
                      <button
                        className="btn btn-info mx-2 my-1 my btn-sm"
                        onClick={() => handleResultSubmit("Save")}
                      >
                        save
                      </button>
                    )}
                  </div>
                  <div className="col-sm-1">
                    <button
                      className="btn btn-dark mx-2 my-1 my btn-sm"
                      type="button"
                      id="btnMainList"
                      onClick={() => {
                        setResultData([]);
                        setResultTestData([]);
                      }}
                    >
                      {t("Main List")}
                    </button>
                  </div>
                  <div className="col-sm-2 pt-1">
                    <SelectBox
                      options={doctorAdmin}
                      id="ApprovedBy"
                      lable="Doctor"
                      selectedValue={formData.SelectTypes}
                      name="ApprovedBy"
                      onChange={handleDoctorName}
                    />
                  </div>
                  <div className="col-sm-2 pt-1">
                    <SelectBox
                      options={machine}
                      id="Machine"
                      name="Machine"
                      selectedValue={ResultData[0]?.MachineId}
                      onChange={(e) =>
                        GetResultEntry(
                          {
                            TestID: redata[ResultData[0]?.currentIndex]?.TestID,
                            LedgerTransactionID: "",
                            DepartmentID: "",
                            symbol: "",
                            Mobile: redata[ResultData[0]?.currentIndex]?.Mobile,
                            VisitNo:
                              redata[ResultData[0]?.currentIndex]?.VisitNo,
                            PEmail: redata[ResultData[0]?.currentIndex]?.PEmail,
                            MacID: e?.target?.value,
                            LedgertransactionIDHash: redata[ResultData[0]?.currentIndex]?.LedgertransactionIDHash,
                          },
                          ResultData[0]?.currentIndex
                        )
                      }
                      lable={"Machine"}
                    />
                  </div>
                  <div className="col-sm-1">
                    {PrintReportLoading ? (
                      <Loading />
                    ) : (
                      <button
                        className="btn btn-secondary btn-sm mx-2 my-1 my"
                        type="button"
                        id="btnMainList"
                        onClick={() => handleReport("no", "")}
                      >
                        {t("Preview")}
                      </button>
                    )}
                  </div>
                  <div className="col-sm-1">
                    {buttonsData?.map(
                      (ele, index) =>
                        ele?.AccessBy !== "Not Approved" &&
                        ele?.AccessBy !== "Unhold" &&
                        ele?.AccessBy !== "Discount Approval" &&
                        ele?.AccessBy !== "Hold" && (
                          <button
                            className="btn btn-success btn-sm mx-2 my-1 my"
                            type="button"
                            id="btnMainList"
                            key={index}
                            onClick={() => handleResultSubmit(ele?.AccessBy)}
                          >
                            {ele?.AccessBy === "Approved"
                              ? t("Approve")
                              : ele?.AccessBy}
                          </button>
                        )
                    )}
                  </div>
                  <div className="col-sm-1">
                    <button
                      className="btn btn-warning btn-sm mx-2 my-1"
                      type="button"
                      id="btnMainList"
                      onClick={() => handleDeltaCheckReport(ResultTestData)}
                    >
                      DeltaCheck
                    </button>
                  </div>
                  <div className="col-sm-1">
                    <button
                      className="btn btn-success mx-2 btn-sm my-1 my"
                      onClick={() => {
                        setShowPH(true);
                      }}
                    >
                      {t("Patient Details")}
                    </button>
                  </div>
                  <div className="col-sm-1">
                    <button
                      className="btn btn-danger btn-sm mx-2 my-1"
                      type="button"
                      id="btnMainList"
                      onClick={() =>
                        setShowOldReportModal({
                          show: true,
                          data: ResultData[0]?.PatientCode,
                        })
                      }
                    >
                      Old Report
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ResultEntry;
