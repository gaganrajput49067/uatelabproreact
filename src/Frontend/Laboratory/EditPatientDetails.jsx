import React, { useEffect, useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import {
  checkDuplicateBarcode,
  getAccessCentres,
  getAccessDataRate,
  getBindDiscApproval,
  getBindDiscReason,
  getBindReportDeliveryMethod,
  getCollectionBoy,
  getPaymentModes,
  getVisitType,
} from "../../utils/NetworkApi/commonApi";

import MyImage from "../../assets/image/Gagan.jpg";
import PageHead from "../../components/CommonComponent/PageHead";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import Input from "../../components/CommonComponent/Input";
import RegisterationTable from "../Table/RegisterationTable";
import {
  PreventNumber,
  PreventSpecialCharacter,
  autocompleteOnBlur,
  getTrimmedData,
  number,
  selectedValueCheck,
} from "../../utils/helpers";
import Loading from "../../components/Loading/Loading";

import MedicialModal from "../utils/MedicialModal";
import UploadFile from "../utils/UploadFIleModal/UploadFile";
import MobileDataModal from "../utils/MobileDataModal";
import { LTDataIniti, stateIniti } from "../../utils/Constants";
import { PatientRegisterSchema } from "../../utils/Schema";
import { useFormik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SlotBookModal from "../utils/SlotBookModal";
import DatePicker from "../../components/CommonComponent/DatePicker";
import { axiosInstance } from "../../utils/axiosInstance";
import PatientRegisterModal from "../utils/PatientRegisterModal";
import { Button } from "primereact/button";
import SubPageHead from "../../components/CommonComponent/SubPageHead";
import { Image } from "primereact/image";
import Tooltip from "../../components/CommonComponent/Tooltip";
import Table from "../../components/Table/Table";

const EditPatientDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [Gender, setGender] = useState([]);
  const [Title, setTitle] = useState([]);
  const [Identity, setIdentity] = useState([]);
  const [PaymentMode, setPaymentMode] = useState([]);
  const [BankName, setBankName] = useState([]);
  const [CollectionBoy, setCollectionBoy] = useState([]);
  const [visibleFields, setVisibleFields] = useState([]);
  const [RateType, setRateType] = useState([]);
  const [CentreData, setCentreData] = useState([]);
  const [PatientSource, setPatientSource] = useState([]);
  const [PatientType, setPatientType] = useState([]);
  const [suggestion, setSuggestion] = useState([]);
  const [doctorSuggestion, setDoctorSuggestion] = useState([]);
  const [VisitType, setVisitType] = useState([]);
  const [throughMobileData, setThroughMobileData] = useState(false);
  const [paid, setPaid] = useState(0);
  const [BindDiscApproval, setBindDiscApproval] = useState([]);
  const [BindDiscReason, setBindDiscReason] = useState([]);
  const [BindReportDeliveryMethod, setBindReportDeliveryMethod] = useState([]);
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [disAmt, setdisAmt] = useState("");
  const [documentId, setDocumentID] = useState("");
  const [BarcodeLogic, setBarcodeLogic] = useState(0);
  const [show5, setShow5] = useState({
    modal: false,
    index: -1,
  });

  const { t } = useTranslation();
  const [searchTest, setSearchTest] = useState("TestName");
  const [mobleData, setMobileData] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [searchForm, setSearchForm] = useState({
    TestName: "",
    CentreID: "",
    InvestigationID: "",
  });
  const [UploadDoumentType, setUploadDoumentType] = useState([""]);
  const [dropFalse, setDropFalse] = useState(true);
  const [show, setShow] = useState({
    show: false,
    Type: "",
  });
  const [tableData, setTableData] = useState([]);
  const [indexMatch, setIndexMatch] = useState(0);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);
  const [RequiredShow, setRequiredShow] = useState({
    show: false,
    FieldIDs: "",
  });
  const [formData, setFormData] = useState({
    DoctorName: "",
  });
  const [state, setState] = useState(stateIniti);
  const [LTData, setLTData] = useState(LTDataIniti);

  useEffect(() => {
    setLTData({ ...LTData, Adjustment: paid });
  }, [paid]);

  const [PLO, setPLO] = useState([]);

  const [RcData, setRcData] = useState([
    {
      PayBy: "Patient",
      ReceiptNo: "",
      ledgerNoCr: "",
      RateTypeId: state?.RateID,
      PaymentMode: "Cash",
      PaymentModeID: 134,
      Amount: "",
      BankName: "",
      CardDate: "",
      CardNo: "",
      CentreID: state?.CentreID,
    },
  ]);
  const [slotOpen, setSlotOpen] = useState({
    show: false,
    data: "",
  });
  const [Pndt, setPndt] = useState({
    PNDT: false,
    NoOfChildren: "",
    NoOfSon: "",
    NoOfDaughter: "",
    Pregnancy: "",
    AgeOfSon: "",
    AgeOfDaughter: "",
    PNDTDoctor: "",
    Husband: "",
  });
  const [DoctorData, setDoctorData] = useState([]);
  const handlePNDT = () => {
    setPndt({
      ...Pndt,
      PNDT: Pndt?.PNDT ? false : true,
      NoOfChildren: "",
      NoOfSon: "",
      NoOfDaughter: "",
      Pregnancy: "",
      AgeOfSon: "",
      AgeOfDaughter: "",
      PNDTDoctor: "",
      Husband: "",
    });
  };
  const handleDatePNDT = (date, name) => {
    setPndt({
      ...Pndt,
      [name]: date,
    });
  };
  const handlePNDTChange = (e) => {
    const { name, value } = e.target;
    setPndt({
      ...Pndt,
      [name]: value,
    });
  };
  const BindDoctorData = () => {
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
        val.unshift({ label: "Select Doctor", value: "" });
        setDoctorData(val);
      })
      .catch((err) => {
        toast.error(
          err?.data?.message ? err?.data?.message : "SomeThing Went Wrong"
        );
      });
  };

  useEffect(() => {
    if (RcData.length === 1) {
      let data = RcData.map((ele) => {
        return { ...ele, Amount: LTData?.NetAmount ? LTData?.NetAmount : "" };
      });
      setRcData(data);
    }
  }, [LTData?.NetAmount]);

  useEffect(() => {
    setLTData({
      ...LTData,
      PName:
        state?.Title +
        " " +
        state?.FirstName +
        " " +
        state?.MiddleName +
        " " +
        state?.LastName,
      Age: state?.Age,
      Gender: state?.Gender,
      RateTypeId: state?.RateID,
      VIP: state?.isVIP,
    });

    const data = RcData.map((ele) => {
      return { ...ele, CentreID: state?.CentreID, RateTypeId: state?.RateID };
    });
    setRcData(data);
  }, [state]);

  const handleMainChange = (e) => {
    const { name, value, type, checked } = e.target;

    setState({
      ...state,
      [name]:
        type === "checkbox"
          ? checked
            ? 1
            : 0
          : ["FirstName", "MiddleName", "LastName"].includes(name)
          ? value.toUpperCase()
          : value,
    });
  };

  useEffect(() => {
    if (state?.isVIP === 0) {
      setState({ ...state, IsMask: 0 });
    }
  }, [state?.isVIP]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSearchForm({ ...searchForm, [name]: value });
  };

  const handleSelectChange = (event) => {
    const { name, value, selectedIndex } = event?.target;
    const label = event?.target?.children[selectedIndex].text;
    if (name === "CentreID") {
      setSearchForm({ ...searchForm, [name]: value });
      setLTData({ ...LTData, [name]: event.value, CentreName: label });
    }

    if (name === "PatientIDProof") {
      setLTData({ ...LTData, [name]: value });
    }

    if (name === "VisitType") {
      setLTData({ ...LTData, [name]: value });
      fetchFields(event.value);
    }

    if (name === "ReportDeliveryMethodId") {
      setLTData({ ...LTData, [name]: value });
    }

    if (name === "DiscountApprovedBy") {
      setLTData({ ...LTData, [name]: value });
    }

    if (name === "DiscountReason") {
      setLTData({ ...LTData, [name]: value });
    }

    if (name === "CollectionBoyId") {
      setLTData({ ...LTData, [name]: value });
    } else {
      setState({
        ...state,
        [name]: value,
      });
    }
  };

  useEffect(() => {
    fetchFields(LTData?.VisitType);
  }, []);

  const findGender = () => {
    const male = ["Mr.", "Baba", "Dr.(Mrs)"];
    const female = ["Miss.", "Mrs.", "Baby", "Dr.(Miss)", "Ms."];

    if (male.includes(state?.Title)) {
      setState({ ...state, Gender: "Male" });
    }

    if (female.includes(state?.Title)) {
      setState({ ...state, Gender: "Female" });
    }
  };

  useEffect(() => {
    findGender();
  }, [state?.Title]);

  const dateSelect = (value, name) => {
    var diff = moment(moment(), "milliseconds").diff(
      moment(value).format("YYYY-MM-DD")
    );
    var duration = moment.duration(diff);
    setState({
      ...state,
      [name]: value,
      AgeYear: duration?._data?.years,
      AgeMonth: duration._data?.months,
      AgeDays: duration?._data?.days,
      TotalAgeInDays: moment(moment().format("YYYY-MM-DD")).diff(value, "days"),
      Age: `${duration?._data?.years} Y ${duration._data?.months} M ${duration?._data?.days} D`,
    });

    setTableData([]);
    setRcData([
      {
        PayBy: "Patient",
        ReceiptNo: "",
        ledgerNoCr: "",
        RateTypeId: state?.RateID,
        PaymentMode: "Cash",
        PaymentModeID: 134,
        CardDate: "",
        CardNo: "",
        BankName: "",
        Amount: "",
        CentreID: state?.CentreID,
      },
    ]);
  };

  const handleIndex = (e) => {
    const { name } = e.target;
    switch (name) {
      case "TestName":
        switch (e.which) {
          case 38:
            if (indexMatch !== 0) {
              setIndexMatch(indexMatch - 1);
            } else {
              setIndexMatch(suggestion.length - 1);
            }
            break;
          case 40:
            if (suggestion.length - 1 === indexMatch) {
              setIndexMatch(0);
            } else {
              setIndexMatch(indexMatch + 1);
            }
            break;
          case 13:
            handleListSearch(suggestion[indexMatch], name);
            setIndexMatch(0);
            break;
          default:
            break;
        }
        break;
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
      default:
        break;
    }
  };

  const EditPatientDetail = (editID) => {
    axiosInstance
      .post("PatientRegistration/getDataEditByLabNo", {
        LabNo: editID,
      })
      .then((res) => {
        setState({
          ...res?.data?.message?.patientDetail[0],
          HideAmount: res?.data?.message?.ltData[0]?.HideAmount,
          DOB: new Date(res?.data?.message?.patientDetail[0]?.DOB),
        });

        setPndt({
          PNDT: res?.data?.message?.ltData[0]?.IsPndt == 1 ? true : false,
          NoOfChildren: res?.data?.message?.ltData[0]?.NoOfChildren,
          NoOfSon: res?.data?.message?.ltData[0]?.NoOfSon,
          NoOfDaughter: res?.data?.message?.ltData[0]?.NoOfDaughter,
          Pregnancy:
            res?.data?.message?.ltData[0]?.Pregnancy == "01-Jan-0001"
              ? "0001-01-01"
              : new Date(res?.data?.message?.ltData[0]?.Pregnancy),
          AgeOfSon: res?.data?.message?.ltData[0]?.AgeOfSon,
          AgeOfDaughter: res?.data?.message?.ltData[0]?.AgeOfDaughter,
          PNDTDoctor: res?.data?.message?.ltData[0]?.PNDTDoctor,
          Husband: res?.data?.message?.ltData[0]?.Husband,
        });
        setLTData({
          ...res?.data?.message?.ltData[0],
          LedgertransactionID:
            res?.data?.message?.ltData[0]?.LedgerTransactionID,
          BTB: res?.data?.message?.ltData[0]?.BTB,
        });
        let data = res?.data?.message?.plo;
        data = data.map((ele) => {
          return {
            ...ele,
            isDisable: true,
            UpdateModalityId: "0",
            OldUpdateModalityId: "0",
            OldStartEndTimeSlot: ele?.OldStartEndTimeSlot,
            OldBookingDate: ele?.OldBookingDate
              ? moment(ele?.OldBookingDate).format("YYYY-MM-DD")
              : moment(new Date()).format("YYYY-MM-DD"),
            OldModalityID: ele?.OldModalityID,
            SetMRP: ele?.SetMRP,
          };
        });
        const val = data.map((ele) => {
          return {
            SetMRP: ele?.SetMRP,
            IsSampleCollected: ele?.IsSampleCollected,
            IsSampleRequired: ele?.IsSampleRequired,
            Status: ele?.Status,
            IsUrgent: ele?.IsUrgent,
            sampleTypeID: ele?.SampleTypeID,
            SampleTypeName: ele?.SampleTypeName,
            ItemId: ele?.InvestigationID,
            ItemName: ele?.TestName,
            InvestigationID: ele?.InvestigationID,
            InvestigationName: ele?.TestName,
            ReportType: ele?.ReportType,
            IsPackage: ele?.IsPackage,
            Rate: ele?.Rate,
            Amount: ele?.NetAmount,
            Quantity: 1,
            PCCDiscAmt: 0,
            PCCDiscPer: 0,
            RateTypeId: ele?.RateTypeId,
            DiscountAmt: ele?.Discount,
            DiscountApprovedBy: ele?.DiscountApprovedBy,
            DiscountReason: ele?.DiscountReason,
            IsReporting: "1",
            ageInDays: ele?.ageInDays,
            Gender: ele?.Gender,
            CentreID: ele?.CentreID,
            SampleBySelf: "1",
            sampleCollectionBy: 0,
            DeliveryDate: "",
            BarcodeNo: ele?.BarcodeNo,
            UrgentDateTime: ele?.UrgentDateTime,
            DepartmentID: ele?.DepartmentID,
            isHistoryReq: 0,
            PackageCode: "",
            PackageName: "",
            TestCode: ele?.TestCode,
            TestIdHash: ele?.TestIdHash,
            isLabOutSource: ele?.isLabOutSource,
            SrfId: ele?.SrfId,
            IcmrId: ele?.IcmrId,
            IsCulture: ele?.IsCulture,
            Radiology: ele?.Radiology,
            UpdateModalityId: 0,
            OldUpdateModalityId: 0,
            IsCovid: ele?.IsCovid,
          };
        });
        setPLO(val);

        setTableData(data);
        setRcData(res?.data?.message?.rcData);
        setFormData({
          ...formData,
          DoctorName: res?.data?.message?.ltData[0]?.DoctorName,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    BindDoctorData();
    EditPatientDetail(location?.state?.data);
  }, []);

  const handleListSearch = (data, name) => {
    switch (name) {
      case "TestName":
        setSearchForm({
          ...searchForm,
          TestName: "",
          InvestigationID: data.InvestigationID,
        });
        setIndexMatch(0);
        setSuggestion([]);
        getTableData(data);
        break;
      case "DoctorName":
        setFormData({ ...formData, [name]: data.Name });
        setLTData({
          ...LTData,
          [name]: data.Name,
          DoctorID: data.DoctorReferalID,
          ReferLabId: data.DoctorReferalID,
          ReferLabName: data.Name,
        });
        setIndexMatch(0);
        setDoctorSuggestion([]);
        setDropFalse(false);
        break;
      default:
        break;
    }
  };

  const handleFileValidationUpload = () => {
    let requiredDocument = [];
    let DocumentFlag = true;
    let message = "";
    tableData.map((ele) => {
      if (ele.RequiredAttachment !== "") {
        requiredDocument.push(ele.RequiredAttachment);
      }
    });

    for (let i = 0; i < requiredDocument.length; i++) {
      if (!UploadDoumentType.includes(requiredDocument[i])) {
        DocumentFlag = false;
        message = requiredDocument[i];
        break;
      }
    }

    return {
      DocumentFlag,
      message,
    };
  };

  const handleLTData = (e) => {
    const { name, value } = e.target;
    setLTData({
      ...LTData,
      [name]: value,
    });
  };

  const getBarcode = (id) => {
    let barcode = "";
    if (BarcodeLogic === 3) {
      barcode = tableData[0]?.BarcodeNo;
    } else if (BarcodeLogic === 4) {
      tableData?.map((ele) => {
        if (ele?.SampleTypeID === id) {
          barcode = ele?.BarcodeNo;
        }
      });
    }
    return barcode;
  };

  const FindBarcode = (id) => {
    let disable = false;
    for (let i = 0; i < tableData?.length; i++) {
      if (tableData[i]["Status"] === 3 && tableData[i]["SampleTypeID"] === id) {
        disable = true;
      }
    }

    return disable;
  };

  useEffect(() => {
    if (state.RateID !== "" && RateType.length > 0) {
      const data = RateType?.find((ele) => ele.value == state?.RateID);
      console.log(RateType);
      setBarcodeLogic(Number(data?.BarcodeLogic));
    }
  }, [state?.RateID, RateType]);

  const handleSelectSlot = (data, slotData, testData) => {
    toast.success("Slot Added Successfully");
    const index = tableData?.findIndex(
      (item) => item.InvestigationID === testData.InvestigationID
    );

    if (index !== -1) {
      const updatedTableData = [...tableData];
      updatedTableData[index] = {
        ...updatedTableData[index],
        StartTime: slotData?.StartTime,
        EndTime: slotData?.EndTime,
        StartEndTimeSlot: slotData?.StartEndTimeSlot,
        status: slotData?.status,
        color: slotData?.color,
        isSelected: slotData?.isSelected,
        InvestigationDate: data?.InvestigationDate,
        ModalityId: data?.ModalityId,
        SelectedTimeSlot: data?.SelectedTimeSlot,
        ModalityName: data?.ModalityName,
        ShiftName: data?.ShiftName,
        UpdateModalityId: "1",
        OldUpdateModalityId: "1",
      };

      setTableData(updatedTableData);
    } else {
      setTableData([
        ...tableData,
        {
          ...data,
          ...slotData,
          ...testData,
          Discount: data?.Discount
            ? ((Number(testData.Rate) * data?.Discount) / 100).toFixed(2)
            : "",
          Rate: Number(testData.Rate).toFixed(2),
          NetAmount: data?.Discount
            ? (
                testData.Rate -
                (Number(testData.Rate) * data?.Discount) / 100
              ).toFixed(2)
            : Number(testData.Rate).toFixed(2),
          IsSampleCollected: "N",
          Status: 1,
          IsUrgent: 0,
          UrgentDateTime: "",
          BarcodeNo: getBarcode(testData?.SampleTypeID),
          isLabOutSource: testData?.isLabOutSource,
          IsCulture: testData?.IsCulture,
          UpdateModalityId: "1",
          OldUpdateModalityId: "0",
        },
      ]);
    }
  };
  const getSuggestion = () => {
    if (searchForm.CentreID || LTData?.CentreID) {
      if (searchForm.TestName.length >= 3) {
        axiosInstance
          .post("TestData/BindBillingTestData", {
            TestName: searchForm.TestName,
            CentreID: LTData?.RateTypeId,
            SearchBy: searchTest,
          })
          .then((res) => {
            setSuggestion(res?.data?.message);
          })
          .catch((err) => {
            toast.error(err?.response?.data?.message);
          });
      } else {
        setSuggestion([]);
      }
    } else {
      if (searchForm.TestName !== "") {
        toast.error("please Select center");
      }
    }
  };

  const getTableData = (data) => {
    const ItemIndex = tableData.findIndex(
      (e) => e.InvestigationID === data.InvestigationID
    );
    if (ItemIndex === -1) {
      axiosInstance
        .post("TestData/BindSingleTestData", {
          InvestigationID: data.InvestigationID,
          CentreID: data?.CentreID,
          IsPromotional: 0,
          PromotionalID: 0,
        })
        .then((res) => {
          const { genderCheck, ageCheck, message } = CheckageTest(
            res?.data?.message[0]?.Gender,
            res?.data?.message[0]?.ToAge,
            res?.data?.message[0]?.FromAge
          );
          if (genderCheck && ageCheck) {
            if (res?.data?.message[0]?.Radiology == 1) {
              //  if (1 == 1) {
              setSlotOpen({
                data: res?.data?.message[0],
                show: true,
              });
            } else
              setTableData([
                ...tableData,
                {
                  ...res?.data?.message[0],
                  Discount: 0,
                  Rate: Number(res?.data?.message[0].Rate).toFixed(2),
                  NetAmount: Number(res?.data?.message[0].Rate).toFixed(2),
                  IsSampleCollected: "N",
                  Status: 1,
                  IsUrgent: 0,
                  UrgentDateTime: "",
                  BarcodeNo: getBarcode(res?.data?.message[0]?.SampleTypeID),
                  IsCulture: res?.data?.message[0]?.IsCulture,
                  isPrimary: true,
                  TestIdHash: "",
                  Del_Date: res?.data?.message[0]?.deleiveryDate,
                },
              ]);
          } else {
            !genderCheck &&
              toast.error("This Test is Not for " + state?.Gender);
            !ageCheck && toast.error(message);
          }
        })
        .catch((err) => console.log(err));
    } else {
      toast.error("Duplicate Text Found");
    }
  };

  const handlePLOChange = (e, index) => {
    const { name, checked } = e.target;
    if (index >= 0) {
      const data = [...tableData];
      if (name === "Status") {
        data[index][name] = checked ? 2 : 1;
        data[index]["IsSampleCollected"] = checked ? "S" : "N";
        if ([3, 4].includes(BarcodeLogic)) {
          if (checked) {
            setShow5({ modal: true, index: index });
          } else {
            setShow5({ modal: false, index: index });
          }
        }
      } else {
        data[index][name] = checked ? 1 : 0;
        if (!checked) {
          data[index]["UrgentDateTime"] = "";
        }
      }
      setTableData(data);
    } else {
      const val = tableData.map((ele) => {
        return {
          ...ele,
          Status: checked ? 2 : 1,
          IsSampleCollected: checked ? "S" : "N",
        };
      });
      setTableData(val);
    }
  };

  const handleChangePloBarCode = (e, sampletypeId) => {
    const { value } = e.target;
    if (BarcodeLogic === 3) {
      const data = tableData.map((ele) => {
        return {
          ...ele,
          BarcodeNo: value,
        };
      });
      setTableData(data);
    }
    if (BarcodeLogic === 4) {
      let flag = true;
      for (let i = 0; i < tableData.length; i++) {
        if (
          tableData[i]?.SampleTypeID !== sampletypeId &&
          value !== "" &&
          value === tableData[i]?.BarcodeNo
        ) {
          flag = false;
          break;
        }
      }
      if (flag) {
        const data = tableData.map((ele) => {
          if (ele?.SampleTypeID === sampletypeId) {
            return {
              ...ele,
              BarcodeNo: value,
            };
          } else {
            return ele;
          }
        });
        setTableData(data);
      } else {
        toast.error("This BarCode is Already Given");
      }
    }
  };

  const CheckageTest = (gender, ToAge, FromAge) => {
    let genderCheck = false;
    let ageCheck = true;
    let message = "";
    genderCheck = [state?.Gender, "Both"].includes(gender) ? true : false;

    if (state?.TotalAgeInDays > ToAge) {
      ageCheck = false;
      message = "Your age is greater than this test maximum age";
    }

    if (state?.TotalAgeInDays < FromAge) {
      ageCheck = false;
      message = "Your age is Less than this test Minimum age";
    }

    return {
      genderCheck: genderCheck,
      ageCheck: ageCheck,
      message: message,
    };
  };

  const handleUrgent = (value, index) => {
    const data = [...tableData];
    data[index]["UrgentDateTime"] = value;
    setTableData(data);
  };

  const handleDiscount = (value, index) => {
    if (disAmt === "" && discountPercentage === "") {
      const data = [...tableData];
      data[index]["Discount"] = value;
      data[index]["NetAmount"] = data[index]["Rate"] - value;
      setTableData(data);
    } else {
      toast.error("Discount already given");
    }
  };

  useEffect(() => {
    let total = tableData.reduce((acc, item) => acc + Number(item.Rate), 0);
    let NetTotal = tableData.reduce(
      (acc, item) => acc + Number(item.NetAmount) || acc + Number(item.Rate),
      0
    );

    setLTData({
      ...LTData,
      GrossAmount: total,
      NetAmount: NetTotal,
      DiscountOnTotal: total > 0 && NetTotal > 0 ? total - NetTotal : "",
      SrfId: checkCovid() ? LTData?.SrfId : "",
      IcmrId: checkCovid() ? LTData?.IcmrId : "",
    });
  }, [tableData]);

  const fetchFields = (visitType) => {
    axiosInstance
      .post("ManageFieldMaster/getAllManageFieldMasterData", {
        VisitTypeID: visitType,
      })
      .then((res) => {
        let data = res?.data?.message;
        data.map((ele) => {
          return {
            ...ele,
            isError: false,
            message: "",
          };
        });

        setVisibleFields(res?.data?.message);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  useEffect(() => {
    getSuggestion();
  }, [searchForm.TestName]);

  const getDropDownData = (name) => {
    const match = ["Title", "Gender", "BankName"];
    axiosInstance
      .post("Global/getGlobalData", { Type: name })
      .then((res) => {
        let data = res.data.message;
        let value = data.map((ele) => {
          return {
            value: match.includes(name) ? ele.FieldDisplay : ele.FieldID,
            label: ele.FieldDisplay,
          };
        });

        switch (name) {
          case "Gender":
            setGender(value);
            break;
          case "Title":
            setTitle(value);
            break;

          case "PaymentMode":
            setPaymentMode(value);
            break;
          case "BankName":
            setBankName(value);
            break;
          default:
            break;
        }
      })
      .catch((err) => console.log(err));
  };

  //Modal show

  const handleClose = () =>
    setShow({
      Type: "",
      show: false,
    });
  const handleShow = (Type) =>
    setShow({
      Type: Type,
      show: true,
    });

  const handleFilter = (data) => {
    // InvestigationID
    if (data?.Status !== 3) {
      const value = tableData.filter(
        (ele) => ele.InvestigationID !== data.InvestigationID
      );
      setTableData(value);
      toast.success("successfully Removed");
    } else {
      toast.error("Already Received");
    }
  };

  useEffect(() => {
    let data = tableData.map((ele) => {
      return {
        SetMRP: ele?.SetMRP,
        OldStartEndTimeSlot: ele?.OldStartEndTimeSlot ?? "",
        OldBookingDate: ele?.OldBookingDate ?? "",
        OldModalityID: ele?.OldModalityID ?? "",
        UpdateModalityId: ele?.UpdateModalityId,
        OldUpdateModalityId: ele?.OldUpdateModalityId,
        InvestigationDate: ele?.InvestigationDate
          ? moment(ele?.InvestigationDate).format("YYYY-MM-DD")
          : "",
        ModalityId: ele?.ModalityId ? ele?.ModalityId : 0,
        ShiftName: ele?.ShiftName ? ele?.ShiftName : "",
        EndTime: ele?.EndTime ? ele?.EndTime : "",
        StartTime: ele?.StartTime ? ele?.StartTime : "",
        StartEndTimeSlot: ele?.StartEndTimeSlot ? ele?.StartEndTimeSlot : "",
        IsRadiology: ele?.Radiology,
        IsSampleCollected: ele?.IsSampleCollected,
        IsSampleRequired: ele?.IsSampleRequired,
        Status: ele?.Status,
        IsUrgent: ele?.IsUrgent,
        sampleTypeID: ele?.SampleTypeID,
        SampleTypeName: ele?.SampleName || ele?.SampleTypeName,
        ItemId: ele?.InvestigationID,
        ItemName: ele?.TestName,
        InvestigationID: ele?.InvestigationID,
        InvestigationName: ele?.TestName,
        ReportType: ele?.ReportType,
        IsPackage: ele?.DataType === "Package" ? 1 : 0,
        Rate: ele?.Rate,
        Amount: ele?.NetAmount,
        Quantity: 1,
        PCCDiscAmt: 0,
        PCCDiscPer: 0,
        RateTypeId: state?.RateID,
        DiscountAmt: ele?.Discount,
        DiscountApprovedBy: LTData?.DiscountApprovedBy,
        DiscountReason: LTData?.DiscountReason,
        IsReporting: "1",
        ageInDays: state?.TotalAgeInDays,
        Gender: state?.Gender,
        CentreID: state?.CentreID,
        SampleBySelf: "1",
        sampleCollectionBy: 0,
        DeliveryDate: "",
        BarcodeNo: getBarcode(ele?.SampleTypeID),
        UrgentDateTime: ele?.UrgentDateTime,
        DepartmentID: ele?.DepartmentID,
        isHistoryReq: 0,
        PackageCode: "",
        PackageName: "",
        TestCode: ele?.TestCode,
        TestIdHash: ele?.TestIdHash,
        IsCulture: ele?.IsCulture,
        IsCovid: ele?.IsCovid,
        UrgentdeleiveryDate: ele?.UrgentdeleiveryDate,
      };
    });
    setPLO(data);
  }, [tableData]);

  const getReceipt = (id) => {
    axiosInstance
      .post("/reports/v1/getReceipt", {
        LedgerTransactionIDHash: id,
      })
      .then((res) => {
        window.open(res?.data?.Url, "_blank");
      })
      .catch((err) => {
        toast.error(
          err?.data?.response?.message
            ? err?.data?.response?.message
            : "Error Occured"
        );
      });
  };

  useEffect(() => {
    getAccessCentres(setCentreData);
    getCollectionBoy(setCollectionBoy);
    getDropDownData("Gender");
    getDropDownData("Title");
    getDropDownData("PaymentMode");
    getDropDownData("BankName");
    getVisitType(setVisitType);
    getBindDiscApproval(setBindDiscApproval);
    getBindDiscReason(setBindDiscReason);
    getBindReportDeliveryMethod(setBindReportDeliveryMethod);
    getPaymentModes("Source", setPatientSource);
    getPaymentModes("PatientType", setPatientType);
    getRequiredAttachment();
  }, []);

  useEffect(() => {
    console.log(LTData);
    if (!isSubmit) {
      LTData?.CentreID && getAccessDataRate(setRateType, LTData?.CentreID);
    }
  }, [LTData?.CentreID]);

  const handleSelectNew = (event) => {
    const { name, value } = event.target;
    setLTData({ ...LTData, [name]: value });
  };

  useEffect(() => {
    let totaldiscount = (LTData.GrossAmount * discountPercentage) / 100;
    let disamount = LTData.GrossAmount - totaldiscount;
    let DiscountAmt = totaldiscount / tableData.length;

    setLTData({
      ...LTData,
      NetAmount: disamount,
      DiscountOnTotal: totaldiscount,
    });
    const data = PLO.map((ele) => {
      return {
        ...ele,
        Amount: ele.Rate - DiscountAmt,
        DiscountAmt: DiscountAmt,
      };
    });
    setPLO(data);
  }, [discountPercentage]);

  useEffect(() => {
    setLTData({ ...LTData, NetAmount: LTData.GrossAmount - disAmt });
  }, [disAmt]);

  const Match = () => {
    let match = false;
    for (var i = 0; i < tableData.length; i++) {
      if (tableData[i].Discount !== "") {
        match = true;
        break;
      }
    }
    return match;
  };

  const handlePaymentChange = (event) => {
    let match = false;
    for (var i = 0; i < RcData.length; i++) {
      if (RcData[i].PaymentMode === event.label) {
        match = true;
        break;
      }
    }
    if (!match) {
      setRcData([
        ...RcData,
        {
          PayBy: "Patient",
          ReceiptNo: "",
          ledgerNoCr: "",
          RateTypeId: state?.RateID,
          PaymentMode: event.label,
          PaymentModeID: event.value,
          CardNo: "",
          CardDate: "",
          BankName: "",
          Amount: "",
          CentreID: state?.CentreID,
        },
      ]);
    } else {
      toast.error("Payment Mode is Already Added");
    }
  };

  const handleFilterPayment = (index) => {
    if (RcData.length > 1) {
      const data = RcData.filter((ele, i) => index !== i);
      setRcData(data);
      toast?.success("Removed Successfully");
    }
  };
  const calculate = (value, index) => {
    let data = [...RcData];
    data[index]["Amount"] = value;
    const sum = data.reduce((a, item) => Number(item.Amount) + a, 0);
    setPaid(sum);
    return sum;
  };

  useEffect(() => {
    if (RcData.length >= 1) {
      const sum = RcData.reduce((a, item) => Number(item.Amount) + a, 0);
      setPaid(sum);
    }
  }, [RcData]);

  const handleClose2 = () => {
    setShow2(false);
  };

  const handleClose3 = () => {
    setShow3(!show3);
  };

  const getDataByMobileNo = () => {
    if (state?.Mobile.length === 10) {
      axiosInstance
        .post("Booking/getDataByMobileNo", {
          Mobile: state?.Mobile,
        })
        .then((res) => {
          setMobileData(res.data.message);
          setShow4(true);
        })
        .catch((err) => console.log(err));
    }
  };

  const handlePatientData = (e) => {
    const keypress = [9, 13];
    if (keypress.includes(e.which)) {
      e.preventDefault();
      getDataByMobileNo();
    }
  };

  const handleClose4 = () => {
    setShow4(false);
  };

  const getRequiredAttachment = () => {
    axiosInstance
      .post("Global/GetGlobalData", {
        Type: "RequiredAttachment",
      })
      .then((res) => {
        let data = res.data.message;
        let RequiredAttachment = data.map((ele) => {
          return {
            value: ele.FieldDisplay,
            label: ele.FieldDisplay,
          };
        });
        return setIdentity(RequiredAttachment);
      })
      .catch((err) => console.log(err));
  };

  const handleSelctData = (data) => {
    const centreName = CentreData?.find((ele) => ele.value === data.CentreID);
    setState({
      ...state,
      Title: data.Title,
      FirstName: data.FirstName,
      LastName: data?.LastName,
      MiddleName: data?.MiddleName,
      CentreID: data?.CentreID,
      RateID: data?.RateTypeId,
      Gender: data?.Gender,
      DOB: new Date(data?.DOB),
      Age: data?.Age,
      PatientCode: data?.PatientCode,
      Email: data?.Email,
      PinCode: data?.Pincode,
      AgeDays: data?.AgeDays,
      AgeMonth: data?.AgeMonth,
      AgeYear: data?.AgeYear,
      HouseNo: data?.HouseNo,
      City: data?.City,
      State: data?.State,
      Country: data?.Country,
      StreetName: data?.StreetName,
      IsMask: data?.IsMask,
      isVIP: data?.IsVIP,
      Locality: data?.Locality,
      IcmrId: data?.IcmrId,
      SrfId: data?.SrfId,
    });

    setLTData({
      ...LTData,
      CentreName: centreName.label,
      CentreID: centreName.value,
    });
    handleClose4();
    setMobileData([]);
  };

  const DynamicFieldValidations = () => {
    const data = visibleFields.map((ele) => {
      if (
        ele["IsMandatory"] == 1 &&
        ele["IsVisible"] == 1 &&
        LTData[ele["FieldType"]] === ""
      ) {
        return {
          ...ele,
          isError: true,
          message: `${ele["FieldType"]} is Required Field`,
        };
      } else {
        return {
          ...ele,
          isError: false,
          message: "",
        };
      }
    });
    return data;
  };

  const valiateProofID = () => {
    let validate = true;
    if (LTData?.PatientIDProof && LTData?.PatientIDProofNo.length < 5) {
      validate = false;
    }
    return validate;
  };

  const { errors, handleBlur, touched, handleSubmit } = useFormik({
    initialValues: { ...state, ...LTData, ...formData, ...Pndt },
    enableReinitialize: true,
    // validationSchema: PatientRegisterSchema,
    onSubmit: (values) => {
      const data = DynamicFieldValidations();
      setVisibleFields(data);
      const flag = data.filter((ele) => ele?.isError === true);
      const match = Match();
      // const paymentCheck = PaymentData();
      const { DocumentFlag, message } = handleFileValidationUpload();
      if (flag.length === 0) {
        if (PLO.length > 0) {
          if (valiateProofID()) {
            // if (!paymentCheck) {
            if (disAmt || discountPercentage || match) {
              setIsSubmit(true);
              axiosInstance
                .post("PatientRegistration/RegistrationEditData", {
                  PatientData: getTrimmedData({
                    ...state,
                    PageName: "",
                    BarcodeNo: "",
                    ProEmployee: "",
                    RateTypeEmail: "",
                    RateTypePhone: "",
                    ClientAddress: "",
                    MobileVip: "",
                    FirstNameVip: "",
                    MiddleNameVip: "",
                    LastNameVip: "",
                    MembershipCardID: 0,
                    FamilyMemberIsPrimary: 0,
                    SecondReferName: "",
                    SecondReferDoctor: "",
                    PatientID: state?.PatientID?.toString(),
                  }),
                  LTData: getTrimmedData({
                    ...LTData,
                    ...Pndt,
                    Pregnancy:
                      Pndt?.Pregnancy == "0001-01-01"
                        ? "0001-01-01"
                        : moment(Pndt?.Pregnancy).format("YYYY-MM-DD"),
                    DiscountApprovedBy: "",
                    ReferRate: "",
                    CentreName: "",
                    DiscountType: "",
                    SecondReferDoctor: "",
                    DoctorMobile: "",
                    DoctorEmail: "",
                    LedgerTransactionID:
                      LTData?.LedgerTransactionID?.toString(),
                    LedgertransactionID:
                      LTData?.LedgertransactionID?.toString(),
                    Source: "",
                    RegistrationDate: new Date(),
                    SrfId: "",
                    IcmrId: "",
                    IsConcern: 0,
                    HideAmount: "",
                    DiscountId: "",
                    BTB: "0",
                    OrderId: "",
                    CoupanCode: "",
                    CoupanId: "",
                    IsCoupon: "",
                    PNameVip: "",
                    IsCourier: "",
                    IsWhatsappRequired: "",
                    IsPndtForm: "",
                    ReferLabId: "",
                    CollectionBoyId: "",
                    IsPndt: Pndt?.PNDT ? 1 : 0,
                  }),
                  PLO: PLO.map((ploItem) => ({
                    ...getTrimmedData(ploItem),
                    IsSampleRequired: "Sample Required",

                    DiscountApprovedBy: "",
                    ReportType: ploItem?.ReportType?.toString(),
                    Amount: ploItem?.Amount?.toString(),
                    DiscountAmt: ploItem?.DiscountAmt?.toString(),
                    Rate: ploItem?.Rate?.toString(),
                    SessionCentreID: "",
                    TestCentreID: ploItem?.TestCentreID
                      ? Number(ploItem?.TestCentreID)
                      : 0,
                    UrgentDateTime: "",
                    isLabOutSource: ploItem?.isLabOutSource
                      ? Number(ploItem?.isLabOutSource)
                      : 0,
                    IsCulture: ploItem?.IsCulture ?? 0,
                    MemberType: ploItem?.MemberType
                      ? Number(ploItem?.MemberType)
                      : 0,
                    IsConcern: "0",
                    SetMRP: "0",
                    UpdateModalityId: ploItem?.UpdateModalityId
                      ? ploItem?.UpdateModalityId?.toString()
                      : "",

                    OldModalityID: ploItem?.OldModalityID
                      ? ploItem?.OldModalityID?.toString()
                      : "",
                    OldUpdateModalityId: ploItem?.OldUpdateModalityId
                      ? ploItem?.OldUpdateModalityId?.toString()
                      : "",
                    DATE: new Date(),

                    ModalityId: ploItem?.ModalityId?.toString(),
                  })),
                  DocumentDetail: {
                    DocumentID: "",
                  },
                  patientMedical: {
                    PatientGuid: "",
                  },
                  PRDeliveryMethod: {
                    IsPatientSMS: "",
                    PatientMobileNo: "",
                    IsPatientEmail: "",
                    PatientEmailId: "",
                    IsDoctorSMS: "",
                    DoctorMobileNo: "",
                    IsDoctorEmail: "",
                    DoctorEmailId: "",
                    IsClientSMS: "",
                    ClientMobileNo: "",
                    IsClientEmail: "",
                    ClientEmail: "",
                    IsCourier: "",
                  },
                  RcData: RcData,
                  FieldIds: "",
                  mandatoryFields: [],
                })
                .then((res) => {
                  if (res?.data?.success) {
                    toast.success(res.data.message);
                    setState(stateIniti);
                    setLTData(LTDataIniti);
                    setPLO([]);
                    setRcData([
                      {
                        PayBy: "Patient",
                        ReceiptNo: "",
                        ledgerNoCr: "",
                        RateTypeId: state?.RateID,
                        PaymentMode: "Cash",
                        PaymentModeID: 134,
                        BankName: "",
                        CardDate: "",
                        CardNo: "",
                        Amount: "",
                        CentreID: state?.CentreID,
                      },
                    ]);
                    setFormData({
                      DoctorName: "",
                    });
                    setPndt({
                      ...Pndt,
                      PNDT: false,
                      NoOfChildren: "",
                      NoOfSon: "",
                      NoOfDaughter: "",
                      Pregnancy: "",
                      AgeOfSon: "",
                      AgeOfDaughter: "",
                      PNDTDoctor: "",
                      Husband: "",
                    });
                    setTableData([]);

                    if (res?.data?.HideReceipt != 1)
                      getReceipt(res?.data?.ledgertransactionID);

                    navigate("/receiptreprint");
                  } else {
                    toast.error(res.data.message);
                  }
                  setIsSubmit(false);
                })
                .catch((err) => {
                  toast.error(
                    err?.response?.data?.message
                      ? err?.response?.data?.message
                      : "Something Went Wrong"
                  );
                  setIsSubmit(false);
                });
            } else {
              if (DocumentFlag) {
                setIsSubmit(true);
                axiosInstance
                  .post("PatientRegistration/RegistrationEditData", {
                    PatientData: getTrimmedData({
                      ...state,
                      MembershipCardID: 0,
                      FamilyMemberIsPrimary: 0,
                    }),
                    LTData: getTrimmedData({
                      ...LTData,
                      LedgerTransactionIDHash: documentId,
                    }),
                    PLO: getTrimmedData(PLO),
                    DocumentDetail: {
                      DocumentID: "",
                    },
                    patientMedical: {
                      PatientGuid: "",
                    },
                    PRDeliveryMethod: {
                      IsPatientSMS: "",
                      PatientMobileNo: "",
                      IsPatientEmail: "",
                      PatientEmailId: "",
                      IsDoctorSMS: "",
                      DoctorMobileNo: "",
                      IsDoctorEmail: "",
                      DoctorEmailId: "",
                      IsClientSMS: "",
                      ClientMobileNo: "",
                      IsClientEmail: "",
                      ClientEmail: "",
                      IsCourier: "",
                    },
                    RcData: RcData,
                    FieldIds: "",
                    mandatoryFields: [],
                  })
                  .then((res) => {
                    toast.success(res.data.message);
                    setState(stateIniti);
                    setLTData(LTDataIniti);
                    setPLO([]);
                    setRcData([
                      {
                        PayBy: "Patient",
                        ReceiptNo: "",
                        ledgerNoCr: "",
                        RateTypeId: state?.RateID,
                        PaymentMode: "Cash",
                        PaymentModeID: 134,
                        BankName: "",
                        CardDate: "",
                        CardNo: "",
                        Amount: "",
                        CentreID: state?.CentreID,
                      },
                    ]);
                    setTableData([]);
                    setIsSubmit(false);
                    setFormData({
                      DoctorName: "",
                    });
                    if (res?.data?.HideReceipt != 1)
                      getReceipt(res?.data?.ledgertransactionID);

                    navigate("/receiptreprint");
                  })
                  .catch((err) => {
                    toast.error(
                      err?.response?.data?.message ?? "Something Went Wrong"
                    );

                    setIsSubmit(false);
                  });
              } else {
                toast.error(`${message} is Required Document`);
              }
            }
            // } else {
            //   toast.error("Please Fill All The Required Fields");
            // }
          } else {
            toast.error("Please Enter Identity No");
          }
        } else {
          toast.error("Please Select Test");
        }
      }
    },
  });

  useEffect(() => {
    if (tableData.length === 0) {
      setPaid(0);
    }
  }, [tableData]);

  useEffect(() => {
    const data = PLO.map((ele) => {
      return {
        ...ele,
        DiscountReason: LTData?.DiscountReason,
        DiscountApprovedBy: LTData?.DiscountApprovedBy,
      };
    });
    setPLO(data);
  }, [LTData?.DiscountReason, LTData?.DiscountApprovedBy]);

  const handleCloseBarcodeModal = (value) => {
    if (value.length >= 3) {
      checkDuplicateBarcode(value, LTData?.LedgerTransactionID).then((res) => {
        console.log(res);
        if (res === " " || res === "") {
          setShow5({ modal: false, index: -1 });
        } else {
          toast.error(res);
        }
      });
    } else if (value === "") {
      toast.error("This Field Required");
    } else {
      toast.error("Minimum 3 Char is Required");
    }
  };
  const checkCovid = () => {
    const isCovid = PLO?.find((ele) => ele?.IsCovid == 1);
    if (isCovid) return true;
    else return false;
  };
  const handleRequiredModal = () => {
    if (tableData.length > 0) {
      let val = "";
      for (let i = 0; i < tableData.length; i++) {
        val =
          val === ""
            ? `${tableData[i].InvestigationID}`
            : `${val},${tableData[i].InvestigationID}`;
      }

      return new Promise((resolve, reject) => {
        axiosInstance
          .post("TestData/GetFieldIds", {
            invIds: "3306,2",
            isEditPage: false,
          })
          .then((res) => {
            resolve(res?.data?.message[0]);
          })
          .catch((err) => {
            reject(err);
          });
      });
    } else {
      toast.error("please Select one Test");
    }
  };

  useEffect(() => {
    if (tableData?.length === 0) {
      setdisAmt("");
      setDiscountPercentage("");
    }
  }, [tableData]);

  const getDocumentType = (data) => {
    setUploadDoumentType(data);
  };

  useEffect(() => {
    setThroughMobileData(true);
  }, []);

  const handleChangeRTCData = (e, index) => {
    const { name, value } = e.target;
    const data = [...RcData];
    data[index][name] = value;
    setRcData(data);
  };

  const handleUploadCount = (name, value, secondName) => {
    setLTData({
      ...LTData,
      [name]: value,
      [secondName]: value === 0 ? 0 : 1,
    });
  };

  return (
    <>
      {slotOpen?.show && (
        <SlotBookModal
          slotOpen={slotOpen}
          setSlotOpen={setSlotOpen}
          handleSelectSlot={handleSelectSlot}
          LTData={LTData}
          tableData={tableData}
        />
      )}
      {show2 && (
        <UploadFile
          options={Identity}
          show={show2}
          handleClose={handleClose2}
          documentId={PatientGuid}
          pageName="Patient Registration"
          handleUploadCount={handleUploadCount}
          getDocumentType={getDocumentType}
        />
      )}
      {show?.show && (
        <PatientRegisterModal
          show={show?.show}
          handleClose={handleClose}
          Type={show?.Type}
        />
      )}

      {mobleData.length > 0 && show4 && (
        <MobileDataModal
          show={show4}
          mobleData={mobleData}
          handleClose4={handleClose4}
          handleSelctData={handleSelctData}
        />
      )}
      {show3 && (
        <MedicialModal
          handleClose={handleClose3}
          MedicalId={PatientGuid}
          handleUploadCount={handleUploadCount}
        />
      )}
      <PageHead
        name="EditPatientDetails"
        showbtn={false}
        drop={false}
      ></PageHead>
      <div className="card">
        <div className="patent-register-outlet">
          <div className="patent-register-details">
            <div className="row">
              <div className="col-sm-2">
                <SelectBox
                  options={CentreData}
                  name="CentreID"
                  lable="Centre"
                  selectedValue={LTData?.CentreID}
                  onChange={handleSelectChange}
                />
              </div>
              <div className="col-sm-2">
                <SelectBox
                  options={RateType}
                  name="RateID"
                  lable="RateType"
                  selectedValue={state?.RateID}
                  onChange={handleSelectChange}
                />
              </div>
              <div className="col-sm-2">
                <SelectBox
                  name="VisitType"
                  options={VisitType}
                  lable="VisitType"
                  selectedValue={selectedValueCheck(
                    VisitType,
                    LTData?.VisitType
                  )}
                  onChange={handleSelectChange}
                />
              </div>
              <div className="col-sm-2">
                <Input
                  name="Mobile"
                  id="Mobile"
                  onInput={(e) => number(e, 10)}
                  onKeyDown={(e) => handlePatientData(e, "Mobile")}
                  value={state.Mobile}
                  disabled={throughMobileData}
                  onChange={handleMainChange}
                  type="number"
                  lable="Mobile Number"
                  placeholder=" "
                />

                {errors?.Mobile && (
                  <div className="error-message">{errors?.Mobile}</div>
                )}
              </div>
              <div className="col-sm-2">
                <Input
                  type="text"
                  lable="UHID"
                  max={15}
                  disabled={state?.Mobile}
                  value={state?.PatientCode}
                  name="PatientCode"
                  onInput={(e) => number(e, 15)}
                  onKeyDown={(e) => handlePatientData(e, "PatientCode")}
                  placeholder=" "
                  id="PatientCode"
                  onChange={handleMainChange}
                />
              </div>
              <div className="col-sm-2">
                <Input
                  type="text"
                  lable="PreBookingNo"
                  disabled={true}
                  name="PreBookingNo"
                  placeholder=" "
                  id="PreBookingNo"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-2">
                <div className="p-inputgroup flex-1">
                  <Input
                    id="DoctorName"
                    name="DoctorName"
                    lable="Referred Doctor"
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        DoctorName: e.target.value,
                      });
                      setDropFalse(true);
                    }}
                    value={formData?.DoctorName}
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
                    placeholder=" "
                    type="text"
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
                  <Button
                    icon="pi pi-plus"
                    className="iconSize"
                    onClick={() => handleShow("Refer")}
                  />
                </div>
                {(errors?.DoctorID || errors?.DoctorName) &&
                  (touched?.DoctorID || touched?.DoctorName) && (
                    <div className="error-message">
                      {errors?.DoctorID || errors?.DoctorName}
                    </div>
                  )}
              </div>
              <div className="col-sm-3">
                <div className="d-flex">
                  <div style={{ width: "30%" }}>
                    <SelectBox
                      options={Title}
                      name="Title"
                      id="Title"
                      lable="Title"
                      isDisabled={throughMobileData}
                      selectedValue={state?.Title}
                      onChange={handleMainChange}
                    />
                  </div>
                  <div style={{ width: "70%" }}>
                    <Input
                      max={35}
                      name="FirstName"
                      type="text"
                      id="FirstName"
                      lable="First Name"
                      placeholder=" "
                      disabled={throughMobileData}
                      value={state?.FirstName}
                      onChange={handleMainChange}
                    />

                    {errors?.FirstName && (
                      <div className="error-message">{errors?.FirstName}</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-sm-2">
                <Input
                  type="text"
                  lable="Middle Name"
                  name="MiddleName"
                  placeholder=" "
                  id="MiddleName"
                  value={state?.MiddleName}
                  disabled={throughMobileData}
                  max={35}
                  onChange={handleMainChange}
                />
              </div>
              <div className="col-sm-2">
                <Input
                  type="text"
                  lable="Last Name"
                  name="LastName"
                  placeholder=" "
                  id="LastName"
                  value={state?.LastName}
                  disabled={throughMobileData}
                  onChange={handleMainChange}
                />
              </div>
              <div className="col-sm-1">
                <SelectBox
                  options={Gender}
                  name="Gender"
                  id="Gender"
                  lable="Gender"
                  isDisabled={
                    ["Baby"].includes(state?.Title)
                      ? false
                      : state?.Title || state?.Title == ""
                      ? true
                      : false
                  }
                  selectedValue={state?.Gender}
                  onChange={handleMainChange}
                />
              </div>
              <div className="col-sm-2">
                <DatePicker
                  value={state?.DOB}
                  className="custom-calendar"
                  name="DOB"
                  disabled={throughMobileData}
                  placeholder=" "
                  id="DOB"
                  lable="DOB"
                  maxDate={new Date()}
                  onChange={dateSelect}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-3">
                <div className="p-inputgroup flex-1">
                  <Input
                    placeholder=" "
                    type="text"
                    id="Y"
                    name="AgeYear"
                    value={state?.AgeYear}
                    onInput={(e) => number(e, 3, 120)}
                    disabled={throughMobileData}
                    onChange={handleMainChange}
                  />
                  <span className="p-inputgroup-addon iconSizeAge">Y</span>

                  <Input
                    placeholder=" "
                    type="text"
                    id="M"
                    name="AgeMonth"
                    value={state?.AgeMonth}
                    onInput={(e) => number(e, 2, 12)}
                    disabled={throughMobileData}
                    onChange={handleMainChange}
                  />
                  <span className="p-inputgroup-addon iconSizeAge">M</span>
                  <Input
                    placeholder=" "
                    type="text"
                    id="D"
                    name="AgeDays"
                    value={state?.AgeDays}
                    onInput={(e) => number(e, 2, 31)}
                    disabled={throughMobileData}
                    onChange={handleMainChange}
                  />
                  <span className="p-inputgroup-addon iconSizeAge">D</span>
                </div>
              </div>
              <div className="col-sm-2">
                <Input
                  type="text"
                  lable="Email"
                  name="Email"
                  placeholder=" "
                  id="Email"
                  value={state?.Email}
                  onChange={handleMainChange}
                />
                {errors?.Email && (
                  <div className="error-message">{errors?.Email}</div>
                )}
              </div>

              <div className="col-sm-2">
                <Input
                  lable="Address"
                  type="text"
                  name="HouseNo"
                  max={100}
                  placeholder=" "
                  id="Address"
                  value={state?.HouseNo}
                  onChange={handleMainChange}
                />
              </div>
              <div className="col-sm-1">
                <Input
                  lable="Pincode"
                  type="number"
                  name="PinCode"
                  placeholder=" "
                  onInput={(e) => number(e, 6)}
                  id="PinCode"
                  value={state?.PinCode}
                  onChange={handleMainChange}
                />
              </div>
              <div className="col-sm-2">
                <Input
                  lable="Locality"
                  max={30}
                  type="text"
                  value={state?.Locality}
                  onChange={handleMainChange}
                  name="Locality"
                  placeholder=" "
                  id="Locality"
                />
              </div>
              <div className="col-sm-2">
                <Input
                  max={30}
                  type="text"
                  value={state?.City}
                  onChange={handleMainChange}
                  lable="City"
                  name="City"
                  placeholder=" "
                  id="City"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-2">
                <Input
                  type="text"
                  lable="State"
                  name="State"
                  placeholder=" "
                  id="State"
                  max={30}
                  value={state?.State}
                  onChange={handleMainChange}
                />
              </div>
              <div className="col-sm-1">
                <Input
                  max={30}
                  value={state?.Country}
                  type="text"
                  onChange={handleMainChange}
                  lable="Country"
                  name="Country"
                  placeholder=" "
                  id="Country"
                />
              </div>
              <div className="col-sm-2">
                <Input
                  max={50}
                  value={state?.Remarks}
                  type="text"
                  onChange={handleMainChange}
                  lable="Remarks"
                  name="Remarks"
                  placeholder=" "
                  id="Remarks"
                />
              </div>
              <div className="col-sm-3">
                <div className="d-flex">
                  <div style={{ width: "40%" }}>
                    <SelectBox
                      name="PatientIDProof"
                      options={[{ label: "Choose ID", value: "" }, ...Identity]}
                      selectedValue={LTData?.PatientIDProof}
                      id="IdType"
                      lable="Id Type"
                      onChange={handleSelectChange}
                    />
                  </div>
                  <div style={{ width: "60%" }}>
                    <Input
                      name="PatientIDProofNo"
                      type="text"
                      max={20}
                      onChange={handleLTData}
                      disabled={LTData?.PatientIDProof === "" ? true : false}
                      value={LTData?.PatientIDProofNo}
                      id="PatientIDProofNo"
                      lable="Patient ID Proof Number"
                      placeholder=" "
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm-2">
                <SelectBox
                  name="CollectionBoyId"
                  options={[
                    { label: "Select Collection Boy", value: "" },
                    ...CollectionBoy,
                  ]}
                  lable="Collection Boy"
                  isDisabled={true}
                  selectedValue={LTData?.CollectionBoyId}
                  onChange={handleSelectChange}
                />
              </div>
              {visibleFields?.map(
                (data, index) =>
                  data?.IsVisible === 1 && (
                    <>
                      <div className="col-sm-2" id="OpdNo" key={index}>
                        {["PatientSource", "PatientType"].includes(
                          data?.FieldType
                        ) ? (
                          <SelectBox
                            className={`${
                              data?.IsMandatory === 1 && "required"
                            }`}
                            lable={data?.FieldType}
                            options={
                              data?.FieldType === "PatientSource"
                                ? [
                                    { label: "Select", value: "" },
                                    ...PatientSource,
                                  ]
                                : data?.FieldType === "PatientType"
                                ? [
                                    { label: "Select", value: "" },
                                    ...PatientType,
                                  ]
                                : []
                            }
                            selectedValue={LTData[data?.FieldType]}
                            name={data?.FieldType}
                            onChange={handleSelectNew}
                          />
                        ) : (
                          <Input
                            className={` ${
                              data?.IsMandatory === 1 && "required"
                            }`}
                            id="OpdIpd_No"
                            placeholder=" "
                            lable={data?.FieldType}
                            max={30}
                            name={data?.FieldType}
                            value={LTData[data?.FieldType]}
                            onChange={handleLTData}
                            type="text"
                          />
                        )}
                        {data?.isError && (
                          <div className="error-message">{data?.message}</div>
                        )}
                      </div>
                    </>
                  )
              )}
            </div>
          </div>
          {Pndt?.PNDT && (
            <SubPageHead
              // className="card"
              title={"Pre-Natal Diagnostic Techniques"}
            >
              <div className="card">
                <div className="row mt-2">
                  <div className="col-md-2">
                    <Input
                      id="NoOfChildren"
                      name="NoOfChildren"
                      lable="Number Of Children"
                      placeholder=" "
                      type="number"
                      onInput={(e) => number(e, 3)}
                      value={Pndt?.NoOfChildren}
                      onChange={handlePNDTChange}
                    />
                    {Pndt.NoOfChildren === "" && (
                      <div className="error-message">
                        {errors?.NoOfChildren}
                      </div>
                    )}
                  </div>
                  <div className="col-md-2">
                    <Input
                      name="NoOfSon"
                      id="NoOfSon"
                      lable="Number Of Son"
                      placeholder=" "
                      type="number"
                      value={Pndt?.NoOfSon}
                      onInput={(e) => number(e, 3)}
                      onChange={handlePNDTChange}
                    />
                    {Pndt.NoOfSon === "" && (
                      <div className="error-message">{errors?.NoOfSon}</div>
                    )}
                  </div>
                  <div className="col-md-2">
                    <Input
                      id="NoOfDaughter"
                      lable="Number Of Daughter"
                      placeholder=" "
                      name="NoOfDaughter"
                      type="number"
                      value={Pndt?.NoOfDaughter}
                      onInput={(e) => number(e, 3)}
                      onChange={handlePNDTChange}
                    />
                    {Pndt.NoOfDaughter === "" && (
                      <div className="error-message">
                        {errors?.NoOfDaughter}
                      </div>
                    )}
                  </div>
                  <div className="col-md-2 ">
                    <DatePicker
                      name="Pregnancy"
                      className="custom-calendar"
                      id="Pregnancy"
                      lable="Pregnancy"
                      placeholder=" "
                      value={Pndt?.Pregnancy}
                      maxDate={new Date()}
                      onChange={handleDatePNDT}
                    />
                    {Pndt.Pregnancy === "" && (
                      <div className="error-message">{errors?.Pregnancy}</div>
                    )}
                  </div>
                  <div className="col-md-1">
                    <Input
                      name="AgeOfSon"
                      lable="Son's Age"
                      id="AgeOfSon"
                      placeholder=" "
                      type="number"
                      value={Pndt?.AgeOfSon}
                      onInput={(e) => number(e, 3)}
                      onChange={handlePNDTChange}
                    />
                    {Pndt.AgeOfSon === "" && (
                      <div className="error-message">{errors?.AgeOfSon}</div>
                    )}
                  </div>
                  <div className="col-md-1">
                    <Input
                      className="form-control input-sm"
                      name="AgeOfDaughter"
                      type="number"
                      id="AgeOfDaughter"
                      lable="Daughter's Age"
                      placeholder=" "
                      value={Pndt?.AgeOfDaughter}
                      onInput={(e) => number(e, 3)}
                      onChange={handlePNDTChange}
                    />
                    {Pndt.AgeOfDaughter === "" && (
                      <div className="error-message">
                        {errors?.AgeOfDaughter}
                      </div>
                    )}
                  </div>
                  <div className="col-md-1">
                    <SelectBox
                      className="form-control input-sm"
                      name="PNDTDoctor"
                      id="PNDTDoctor"
                      lable="PNDT Doctor"
                      placeholder="PNDT Doctor"
                      options={DoctorData}
                      selectedValue={Pndt?.PNDTDoctor}
                      onChange={handlePNDTChange}
                    />
                    {Pndt.PNDTDoctor === "" && (
                      <div className="error-message">{errors?.PNDTDoctor}</div>
                    )}
                  </div>
                  <div className="col-md-1 m-0 p-0">
                    <Input
                      className="form-control input-sm"
                      name="Husband"
                      lable="Husband"
                      placeholder=" "
                      id="Husband"
                      value={Pndt?.Husband}
                      onChange={handlePNDTChange}
                    />
                    {Pndt.Husband === "" && (
                      <div className="error-message">{errors?.Husband}</div>
                    )}
                  </div>
                </div>
              </div>{" "}
            </SubPageHead>
          )}
          <div className="row patent-register-image">
            <div>
              <Image
                src={MyImage}
                alt="Image"
                width="115"
                height="90"
                margin="0"
                padding="0"
                preview
              />
            </div>
            <div>
              <button
                className={`btn ${
                  LTData?.UploadDocumentCount === 0 ? "btn-info" : "btn-success"
                } w-100 btn-sm p-0`}
                id="Upload Document"
                onClick={() => {
                  setShow2(true);
                }}
              >
                {t("Upload Document")}
                <span id="spnCount"> ({LTData?.UploadDocumentCount})</span>
              </button>
            </div>
            <div>
              <button
                className={`btn   ${
                  LTData?.MedicalHistoryCount === 0 ? "btn-info" : "btn-success"
                } w-100 btn-sm `}
                id="Medical History"
                onClick={() => {
                  handleClose3();
                }}
              >
                {t("Medical History")}&nbsp;
                <span id="spnMedicalCount">
                  ({LTData?.MedicalHistoryCount})
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="patient-register-other">
        <div className="">
          <div className="card">
            <div className="row">
              <div className="col-sm-5">
                <Input
                  name="TestName"
                  lable={
                    searchTest == "TestName"
                      ? "Type TestName For Add Test"
                      : "Type TestCode For Add Test"
                  }
                  type="text"
                  placeholder=" "
                  max={30}
                  id="testSearch"
                  onChange={handleChange}
                  onBlur={() => {
                    autocompleteOnBlur(setSuggestion);
                    setTimeout(() => {
                      document.getElementById("testSearch").value = "";
                    }, 500);
                  }}
                  onKeyDown={handleIndex}
                />
                {suggestion.length > 0 && (
                  <ul className="suggestion-data" style={{ zIndex: 99 }}>
                    {suggestion.map((data, index) => (
                      <li
                        onClick={() => handleListSearch(data, "TestName")}
                        key={index}
                        className={`${index === indexMatch && "matchIndex"}`}
                      >
                        {data.TestName}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="col-sm-4">
                <div className="flex flex-wrap gap-3">
                  <div className="flex ">
                    <input
                      type="radio"
                      id="TestName"
                      name="TestName"
                      value="TestName"
                      checked={searchTest == "TestName"}
                      onChange={(e) => {
                        setSearchTest(e.target.value);
                      }}
                    />
                    <label htmlFor="TestName" className="ml-2">
                      By TestName
                    </label>
                  </div>
                  <div className="flex ">
                    <input
                      type="radio"
                      id="TestCode"
                      name="TestCode"
                      value="TestCode"
                      checked={searchTest == "TestCode"}
                      onChange={(e) => {
                        setSearchTest(e.target.value);
                      }}
                    />
                    <label htmlFor="TestCode" className="ml-2">
                      By TestCode
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-sm-3 ">
                <div className="flex flex-wrap gap-2 justify-content-end">
                  <div className="flex ml-3">
                    <input
                      type="checkbox"
                      name="isVIP"
                      id="isVIP"
                      checked={state?.isVIP}
                      onChange={handleMainChange}
                      value={state?.isVIP === 1 ? true : false}
                    />
                    <label htmlFor="isVIP" className="ml-2">
                      VIP
                    </label>
                  </div>

                  {state?.isVIP === 1 && (
                    <>
                      <div className="flex align-items-left">
                        <input
                          type="checkbox"
                          name="IsMask"
                          id="IsMask"
                          checked={state?.IsMask}
                          onChange={handleMainChange}
                          value={state?.IsMask === 1 ? true : false}
                        />
                      </div>

                      <label htmlFor="IsMask" className="ml-1">
                        MASK
                      </label>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div style={{ maxHeight: "250px", overflowX: "auto" }}>
              <Table paginate={false}>
                <thead>
                  <tr>
                    <th className="text-center">{"#"}</th>
                    <th>{"Slot"}</th>
                    <th>{"Code"}</th>
                    <th
                      style={{
                        wordWrap: "break-word",
                        whiteSpace: "normal",
                      }}
                    >
                      {"Item"}
                    </th>
                    <th>{"View"}</th>
                    <th>{"DOS"}</th>
                    <th>{"MRP"}</th>
                    <th>{"Rate"}</th>
                    <th>{"Disc."}</th>
                    <th>{"Amt"}</th>
                    <th>{"D.Date"}</th>
                    <th>{"SC"}</th>
                    <th>
                      <Tooltip label={"Urgen Delivery"}>
                        {/* <span class="blinking"> */}
                        <i
                          className="fa fa-hourglass-start fa-spin blinking"
                          style={{ color: "red" }}
                        ></i>
                        {/* </span> */}
                      </Tooltip>
                    </th>
                    <th className="text-center">
                      <i class="fa fa-trash"></i>
                    </th>
                  </tr>
                </thead>{" "}
                {tableData.length > 0 && (
                  <tbody>
                    {tableData.map((data, index) => (
                      <>
                        <tr
                          key={index}
                          style={{
                            backgroundColor:
                              data?.isOutSource === 1 ? "pink" : "",
                          }}
                        >
                          <RegisterationTable
                            data={data}
                            slotOpen={slotOpen}
                            setSlotOpen={setSlotOpen}
                            handleSelectSlot={handleSelectSlot}
                            tableData={tableData}
                            setTableData={setTableData}
                            LTData={LTData}
                            index={index}
                            coupon={false}
                            member={false}
                            handleFilter={handleFilter}
                            handleDiscount={handleDiscount}
                            handlePLOChange={handlePLOChange}
                            handleUrgent={handleUrgent}
                            state={state}
                          />
                        </tr>
                      </>
                    ))}
                  </tbody>
                )}
              </Table>
            </div>
          </div>
        </div>
        <div className="">
          <div className="card">
            <div className="row">
              <div className="col-sm-2 col-4 mb-2 ">
                {isSubmit ? (
                  <Loading />
                ) : (
                  <button
                    type="submit"
                    id="btnSave"
                    className="btn btn-success w-100 btn-sm"
                    onClick={() => {
                      handleSubmit();
                      window.scrollTo(0, 0);
                    }}
                  >
                    {"Submit"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditPatientDetails;
