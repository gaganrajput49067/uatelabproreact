import React, { useEffect, useRef, useState } from "react";
import PageHead from "../../components/CommonComponent/PageHead";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import Input from "../../components/CommonComponent/Input";
import MyImage from "../../assets/image/Gagan.jpg";

import Urgent from "../../assets/image/Urgent.gif";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { useMemo } from "react";
import DatePicker from "../../components/CommonComponent/DatePicker";
import { toast } from "react-toastify";
import { DISCOUNT_TYPE, LTDataIniti, stateIniti } from "../../utils/Constants";
import {
  checkEmploypeeWiseDiscount,
  getAccessCentres,
  getAccessDataRate,
  getBindDiscApproval,
  getBindDiscReason,
  getCollectionBoy,
  getDoctorSuggestion,
  getPaymentModes,
  getVisitType,
  getsecondDoctorSuggestion,
} from "../../utils/NetworkApi/commonApi";
import { axiosInstance, axiosReport } from "../../utils/axiosInstance";
import {
  PreventNumber,
  PreventSpecialCharacter,
  autocompleteOnBlur,
  getTrimmedData,
  number,
} from "../../utils/helpers";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment/moment";
import { useFormik } from "formik";
import Table from "../../components/Table/Table";
import Loading from "../../components/Loading/Loading";
import {
  CouponValidateSchema,
  PatientRegisterSchema,
} from "../../utils/Schema";
import RegisterationTable from "../Table/RegisterationTable";
import SaveSmsEmail from "../utils/SaveSmsEmail";
import MobileDataModal from "../utils/MobileDataModal";
import PatientRegisterModal from "../utils/PatientRegisterModal";
import { useTranslation } from "react-i18next";
import MedicialModal from "../utils/MedicialModal";
import UploadFile from "../utils/UploadFIleModal/UploadFile";
import SampleRemark from "../utils/SampleRemark";
import SlotBookModal from "../utils/SlotBookModal";
const PatientRegistration = () => {
  const { t } = useTranslation();
  const [patientImg, setPatientImg] = useState({
    img: MyImage,
    show: false,
  });
  const [RadioDefaultSelect, setRadioDefaultSelect] = useState("Age");
  const [AgeWiseDiscountDropdown, setAgeWiseDiscountDropdown] = useState([]);
  const [Gender, setGender] = useState([]);
  const [Title, setTitle] = useState([]);
  const [Identity, setIdentity] = useState([]);
  const [PaymentMode, setPaymentMode] = useState([]);
  const [BankName, setBankName] = useState([]);
  const [CollectionBoy, setCollectionBoy] = useState([]);
  const [visibleFields, setVisibleFields] = useState([]);
  const [RateType, setRateType] = useState([]);
  const [CentreData, setCentreData] = useState([]);
  const [suggestion, setSuggestion] = useState([]);
  const [doctorSuggestion, setDoctorSuggestion] = useState([]);
  const [seconddoctorSuggestion, setseconddoctorSuggestion] = useState([]);
  const [VisitType, setVisitType] = useState([]);
  const [throughMobileData, setThroughMobileData] = useState(false);
  const [throughMemberData, setThroughmemberdata] = useState(false);
  const [DateData, setDateData] = useState({
    AgeYear: "",
    AgeDays: "",
    AgeMonth: "",
  });
  const Navigate = useNavigate();
  const [paid, setPaid] = useState(0);
  const [BindDiscApproval, setBindDiscApproval] = useState([]);
  const [BindDiscReason, setBindDiscReason] = useState([]);

  const [discountPercentage, setDiscountPercentage] = useState("");
  const [disAmt, setdisAmt] = useState("");
  const [documentId, setDocumentID] = useState("");
  const [PatientGuid, SetPatientGuid] = useState("");
  const [PatientSource, setPatientSource] = useState([]);
  const [PatientType, setPatientType] = useState([]);
  const [HLMPatientType, setHLMPatientType] = useState([]);
  const [SourceType, setSourceType] = useState([]);
  const [mobleData, setMobileData] = useState([]);
  const [Memberdata, setMemberdata] = useState([]);
  const [Memberdetails, setMemberdetails] = useState({});
  const [isSubmit, setIsSubmit] = useState({
    type: "Success",
    isLoading: false,
  });
  const [BarcodeLogic, setBarcodeLogic] = useState(0);
  const [UploadDoumentType, setUploadDoumentType] = useState([""]);

  const [dropFalse, setDropFalse] = useState(false);
  const [secondDropFalse, setSecondDropFalse] = useState(false);

  const [show, setShow] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [indexMatch, setIndexMatch] = useState(0);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);
  const [proEmplyee, setProEmployee] = useState([]);
  const [show5, setShow5] = useState({
    modal: false,
    index: -1,
  });
  const [show6, setShow6] = useState(false);
  const [show7, setShow7] = useState(false);
  const [RequiredShow, setRequiredShow] = useState({
    show: false,
    FieldIDs: "",
  });
  const [formData, setFormData] = useState({
    DoctorName: "Self",
    SecondReferDoctor: "",
  });
  const [state, setState] = useState(stateIniti);
  const [LTData, setLTData] = useState(LTDataIniti);
  const [saveSmsEmail, setSaveSmsEmail] = useState({
    SmsToPatient: "",
    SmsToDoctor: "",
    IsActiveSmsToPatient: "",
    IsActiveSmsToDoctor: "",
    EmailToPatient: "",
    EmailToDoctor: "",
    IsActiveEmailToPatient: "",
    IsActiveEmailToDoctor: "",
    SmsToClient: "",
    IsActiveSmsToClient: "",
    EmailToClient: "",
    IsActiveEmailToClient: "",
    IsCourier: "",
    IsWhatsappRequired: "",
  });
  const [membershipnum, setmembershipnum] = useState("");

  const [couponDetails, setCouponDetails] = useState([]);
  const [showCoupon, setShowCoupon] = useState({
    BindTestCouponShow: false,
    ShowCouponDetail: false,
  });
  const [coupon, setCoupon] = useState({
    code: "",
    field: false,
    load: false,
  });

  const [time, setTime] = useState({
    Hour: new Date().getHours().toString().padStart(2, "0"),
    Minute: new Date().getMinutes().toString().padStart(2, "0"),
    Second: new Date().getSeconds().toString().padStart(2, "0"),
  });

  const [suggestionData, setSuggestionData] = useState({
    show: false,
    viewTestModal: false,
    viewTestModalId: "",
    testSuggestions: {
      data: [],
      show: false,
      Total: [],
    },
    packageSuggestions: {
      data: [],
      show: false,
    },
    daySuggestions: {
      data: [],
      show: false,
    },
  });

  const getProEmployee = () => {
    axiosInstance
      .get("Employee/ProEmployee")
      .then((res) => {
        let data = res?.data?.message;
        let proData = data?.map((ele) => {
          return {
            value: ele?.EmployeeID,
            label: ele?.EmployeeName,
          };
        });
        setProEmployee(proData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (coupon?.field) setErr({});
  }, [coupon?.field]);

  const [couponData, setCouponData] = useState([]);
  const [err, setErr] = useState({});
  const [showRemark, setShowRemark] = useState(false);

  useEffect(() => {
    setLTData({ ...LTData, Adjustment: paid });
  }, [paid]);

  const [PLO, setPLO] = useState([]);
  const location = useLocation();

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
      CentreID: LTData?.CentreID,
    },
  ]);
  const [isRazorPayOpen, setIsRazorPayOpen] = useState(false);

  const inputRef = useRef(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  const getWhtsapp = () => {
    if (
      Object.values({
        IsPatientSMS: saveSmsEmail?.IsActiveSmsToPatient,

        IsPatientEmail: saveSmsEmail?.IsActiveEmailToPatient,

        IsDoctorSMS: saveSmsEmail?.IsActiveSmsToDoctor,

        IsDoctorEmail: saveSmsEmail?.IsActiveEmailToDoctor,
        IsClientSMS: saveSmsEmail?.IsActiveSmsToClient,

        IsClientEmail: saveSmsEmail?.IsActiveEmailToClient,
        IsCourier: saveSmsEmail?.IsCourier,
      }).every((value) => value == 0 || value == "")
    ) {
      if (LTData?.BTB == 1) {
        return 0;
      } else return 1;
    } else {
      if (saveSmsEmail?.IsWhatsappRequired == 0) {
        return 1;
      } else return 0;
    }
  };
  const saveData = (data) => {
    setIsSubmit({
      type: "Success",
      isLoading: true,
    });
    handleSubmitFinalBooking(data);
  };
  const handleSubmitFinalBooking = (data) => {
    axiosInstance
      .post("PatientRegistration/SaveData", {
        PatientData: getTrimmedData({
          ...state,
          CentreID: LTData?.CentreID,
          MobileVip: state?.Mobile,
          FirstNameVip: state?.FirstName,
          MiddleNameVip: state?.MiddleName,
          LastNameVip: state?.LastName,
          MembershipCardID: Memberdetails?.MembershipCardID
            ? Memberdetails?.MembershipCardID
            : 0,
          FamilyMemberIsPrimary: Memberdetails?.FamilyMemberIsPrimary
            ? Memberdetails?.FamilyMemberIsPrimary
            : 0,
        }),

        LTData: getTrimmedData({
          ...LTData,
          ProEmployee: state?.ProEmployee,
          OrderId: data ? data : "",
          LedgerTransactionIDHash: documentId,
          CoupanCode: coupon?.field ? coupon?.code : "",
          CoupanId: coupon?.field ? couponData[0]?.CoupanId : "",
          IsCoupon: coupon?.field ? 1 : 0,
          DATE:
            localStorage.getItem("ModifyRegDate") == "1"
              ? LTData?.RegistrationDate
              : undefined,
          PNameVip: LTData?.PName,
          IsCourier: saveSmsEmail?.IsCourier,
          IsWhatsappRequired: getWhtsapp(),
          IsCredit: handleRateTypePaymode == "Credit" ? 1 : 0,
          ...Pndt,
          Pregnancy: moment(Pndt?.Pregnancy).format("YYYY-MM-DD"),
          IsPndt: Pndt?.PNDT ? 1 : 0,
          // IsPndt: 1,
          IsPndtForm: checkPndt(),
          IsConcern: checkConcent(),
        }),
        PLO: PLO.map((ploItem) => ({
          ...getTrimmedData(ploItem),
          DATE:
            localStorage.getItem("ModifyRegDate") == "1"
              ? LTData?.RegistrationDate
              : undefined,
        })),
        DocumentDetail: {
          DocumentID: PatientGuid,
        },
        patientMedical: {
          PatientGuid: PatientGuid,
        },

        PRDeliveryMethod: Object.values({
          IsPatientSMS: saveSmsEmail?.IsActiveSmsToPatient,

          IsPatientEmail: saveSmsEmail?.IsActiveEmailToPatient,

          IsDoctorSMS: saveSmsEmail?.IsActiveSmsToDoctor,

          IsDoctorEmail: saveSmsEmail?.IsActiveEmailToDoctor,
          IsClientSMS: saveSmsEmail?.IsActiveSmsToClient,

          IsClientEmail: saveSmsEmail?.IsActiveEmailToClient,
          IsCourier: saveSmsEmail?.IsCourier,
        }).every((value) => value == 0 || value == "")
          ? ""
          : {
              IsPatientSMS: saveSmsEmail?.IsActiveSmsToPatient,
              PatientMobileNo: saveSmsEmail?.SmsToPatient,
              IsPatientEmail: saveSmsEmail?.IsActiveEmailToPatient,
              PatientEmailId: saveSmsEmail?.EmailToPatient,
              IsDoctorSMS: saveSmsEmail?.IsActiveSmsToDoctor,
              DoctorMobileNo: saveSmsEmail?.SmsToDoctor,
              IsDoctorEmail: saveSmsEmail?.IsActiveEmailToDoctor,
              DoctorEmailId: saveSmsEmail?.EmailToDoctor,
              IsClientSMS: saveSmsEmail?.IsActiveSmsToClient,
              ClientMobileNo: saveSmsEmail?.SmsToClient,
              IsClientEmail: saveSmsEmail?.IsActiveEmailToClient,
              ClientEmail: saveSmsEmail?.EmailToClient,
              IsCourier: saveSmsEmail?.IsCourier,
            },
        RcData: RcData,
        FieldIds: "",
        mandatoryFields: [],
      })
      .then((res) => {
        toast.success(res.data.message);
        const newDocumentId = guidNumber();
        setDocumentID(newDocumentId);
        setIsRazorPayOpen(false);
        setState(stateIniti);
        //    setLTData(LTDataIniti);
        setTime({
          Hour: new Date().getHours().toString().padStart(2, "0"),
          Minute: new Date().getMinutes().toString().padStart(2, "0"),
          Second: new Date().getSeconds().toString().padStart(2, "0"),
        });

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
            CentreID: LTData?.CentreID,
          },
        ]);
        setSaveSmsEmail({
          SmsToPatient: "",
          SmsToDoctor: "",
          IsActiveSmsToPatient: "",
          IsActiveSmsToDoctor: "",
          EmailToPatient: "",
          EmailToDoctor: "",
          IsActiveEmailToPatient: "",
          IsActiveEmailToDoctor: "",
          SmsToClient: "",
          IsActiveSmsToClient: "",
          EmailToClient: "",
          IsActiveEmailToClient: "",
          IsCourier: "",
          IsWhatsappRequired: "",
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
        setFormData({
          DoctorName: "Self",
          SecondReferDoctor: "",
        });
        setmembershipnum("");
        setThroughmemberdata(false);
        setMemberdetails({});
        setTableData([]);
        setIsSubmit({
          type: "Success",
          isLoading: false,
        });
        setCoupon({
          code: "",
          field: false,
        });
        setThroughMobileData(false);
        setThroughmemberdata(false);
        getAccessCentres(setCentreData, LTData, setLTData, LTDataIniti);

        if (res?.data?.HideReceipt != 1) {
          getReceipt(res?.data?.ledgertransactionID, res?.data?.FullyPaid);
        }
        if (res?.data?.IsConcern == 1) {
          getConcern(res?.data?.ledgertransactionID);
        }
        if (res?.data?.IsPndt == 1) {
          getPndtForm(res?.data?.ledgertransactionID);
        }

        getReceiptTRF(
          res?.data?.ledgertransactionID,
          res?.data?.IsTrfRequired,
          res?.data?.IsDepartmentSlip
        );
        guidNumber();
        setPatientImg({ img: MyImage, show: false });
        setSuggestionData({
          show: false,
          viewTestModal: false,
          viewTestModalId: "",
          testSuggestions: {
            data: [],
            show: false,
            Total: [],
          },
          packageSuggestions: {
            data: [],
            show: false,
          },
          daySuggestions: {
            data: [],
            show: false,
          },
        });
      })
      .catch((err) => {
        setIsRazorPayOpen(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
        setIsSubmit({
          type: "Error",
          isLoading: false,
        });
      });
  };
  const getPaymentModeAmount = RcData?.filter(
    (ele) => ele?.PaymentMode == "Online Payment"
  );

  const [searchTest, setSearchTest] = useState("TestName");
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
  const handleDatePNDT = (value, name) => {
    setPndt({
      ...Pndt,
      [name]: value,
    });
  };
  const handlePNDTChange = (e) => {
    const { name, value } = e.target;
    setPndt({
      ...Pndt,
      [name]: value,
    });
  };
  const handleCityState = (
    id,
    name,
    email,
    phone,
    ClientAddress,
    HideAmount,
    ProEmployee
  ) => {
    axiosInstance
      .post("Centre/getRateTypeDetailWithCentre", {
        CentreID: id,
      })
      .then((res) => {
        getSpecialDayTest(LTData?.CentreID, id);
        setState({
          ...state,
          RateTypeEmail: email,
          RateTypePhone: phone,
          ClientAddress: ClientAddress,
          HideAmount: HideAmount,
          ProEmployee: ProEmployee,
          [name]: id,
          PinCode: res?.data?.message[0]?.Pincode
            ? res?.data?.message[0]?.Pincode
            : "",
          City: res?.data?.message[0]?.City ? res?.data?.message[0]?.City : "",
          State: res?.data?.message[0]?.State
            ? res?.data?.message[0]?.State
            : "",
          Country: res?.data?.message[0]?.Country
            ? res?.data?.message[0]?.Country
            : "",
        });
      })
      .catch((err) => {
        setState({
          ...state,
          RateTypeEmail: email,
          RateTypePhone: phone,
          ClientAddress: ClientAddress,
          HideAmount: HideAmount,
          [name]: id,
        });
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went wrong."
        );
      });
  };

  const PaymentData = () => {
    let match = false;
    if (handleRateTypePaymode !== "Credit") {
      const data = ["Cash", "Online Payment", "Paytm"];
      for (let i = 0; i < RcData.length; i++) {
        if (!data.includes(RcData[i].PaymentMode)) {
          if (
            RcData[i].CardDate === "" ||
            RcData[i]?.CardNo === "" ||
            RcData[i]?.BankName === ""
          ) {
            match = true;
          }
        }
      }
    }
    return match;
  };

  useEffect(() => {
    if (handleRateTypePaymode === "Cash") {
      if (RcData.length === 1) {
        let data = RcData.map((ele) => {
          return {
            ...ele,
            Amount: LTData?.NetAmount
              ? parseFloat(LTData?.NetAmount).toFixed(2)
              : "",
          };
        });
        setRcData(data);
      }
    }
  }, [LTData?.NetAmount]);

  useEffect(() => {
    if (handleRateTypePaymode === "Cash") {
      setRcData([
        {
          PayBy: "Patient",
          ReceiptNo: "",
          ledgerNoCr: "",
          RateTypeId: state?.RateID,
          PaymentMode: "Cash",
          PaymentModeID: 134,
          Amount: LTData?.NetAmount
            ? Number(LTData?.NetAmount).toFixed(2)
            : "0.00",
          BankName: "",
          CardDate: "",
          CardNo: "",
          CentreID: LTData?.CentreID,
        },
      ]);
    }
  }, [LTData?.DiscountOnTotal]);

  useEffect(() => {
    setLTData({
      ...LTData,
      PName:
        state?.Title +
        " " +
        state?.FirstName?.trim() +
        (state?.MiddleName?.trim() ? " " + state?.MiddleName?.trim() : "") +
        (state?.LastName?.trim() ? " " + state?.LastName?.trim() : ""),
      Age: state?.Age,
      Gender: state?.Gender,
      RateTypeId: state?.RateID,
      VIP: state?.isVIP,
    });

    const data = RcData.map((ele) => {
      return {
        ...ele,
        CentreID: LTData?.CentreID,
        RateTypeId: state?.RateID,
        // PaymentMode: handleRateTypePaymode === "Credit" ? "Credit" :ele?.PaymentModeID,
        // PaymentModeID: handleRateTypePaymode === "Credit" ? 215 : ele?.PaymentModeID,
      };
    });
    setRcData(data);
  }, [state]);

  const handleMainChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "Mobile" && value.length === 10) {
      axiosInstance
        .post("CommonController/CheckInvalidMobileNo", {
          MobileNo: value,
        })
        .then((res) => {})

        .catch((err) => {
          if (err?.response?.data?.message >= 1) {
            toast.error("Invalid number");
            setState({ ...state, [name]: "" });
          } else {
            setState({ ...state, [name]: value });
          }
        });
      return;
    }
    if (name === "Gender") {
      setState({
        ...state,
        [name]: value,
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
    }

    if (name === "ProEmployee") {
      setState({
        ...state,
        [name]: value,
      });
    }
    if (name === "Title") {
      setState({
        ...state,
        [name]: value,
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
    } else {
      setState({
        ...state,
        [name]:
          type === "checkbox"
            ? checked
              ? 1
              : 0
            : [
                "FirstName",
                "MiddleName",
                "LastName",
                "City",
                "State",
                "Country",
                "Locality",
              ].includes(name)
            ? PreventNumber(value.toUpperCase())
              ? value.toUpperCase()
              : state[name]
            : [""].includes(name)
            ? PreventSpecialCharacter(value)
              ? value
              : state[name]
            : value,
      });
    }
  };

  const getSubtractType = (name) => {
    return name === "AgeYear"
      ? "years"
      : name === "AgeMonth"
      ? "months"
      : "days";
  };

  const handleDateFunction = (value) => {
    const { year, month, days } = value;
    const yearDiff = moment().subtract(year, "years")?._d;
    const monthDiff = moment(yearDiff).subtract(month, "months")?._d;
    const daysDiff = moment(monthDiff).subtract(days, days)?._d;

    return {
      AgeYear: yearDiff,
      AgeMonth: monthDiff,
      AgeDays: daysDiff,
    };
  };

  const handleDOBCalculation = (e) => {
    const { name, value } = e.target;
    let diff = {};
    let subtractType = getSubtractType(name);

    if (name === "AgeYear") {
      diff = moment().subtract(value, subtractType);
      setDateData({
        ...DateData,
        AgeYear: diff?._d,
      });
    }

    if (name === "AgeMonth") {
      diff = moment(DateData?.AgeYear || new Date().now).subtract(
        value,
        subtractType
      );
      setDateData({
        ...DateData,
        AgeMonth: diff?._d,
      });
    }

    if (name === "AgeDays") {
      diff = moment(DateData?.AgeMonth || new Date().now).subtract(
        value,
        subtractType
      );
      setDateData({
        ...DateData,
        AgeDays: diff?._d,
      });
    }

    var Newdiff = moment(moment(), "milliseconds").diff(
      moment(diff?._d).format("YYYY-MM-DD")
    );

    var duration = moment.duration(Newdiff);

    var startDate = moment(diff._d);
    var endDate = moment();

    var yearsDiff = endDate.diff(startDate, "years");
    startDate.add(yearsDiff, "years");

    var monthsDiff = endDate.diff(startDate, "months");
    startDate.add(monthsDiff, "months");

    var daysDiff = endDate.diff(startDate, "days");

    setState({
      ...state,
      [name]: value,
      DOB: diff?._d,
      TotalAgeInDays: moment(moment().format("YYYY-MM-DD")).diff(
        diff?._d,
        "days"
      ),
      Age: `${yearsDiff} Y ${monthsDiff} M ${daysDiff} D`,
    });

    setLTData({
      ...LTData,
      Age: `${yearsDiff} Y ${monthsDiff} M ${daysDiff} D`,
    });

    setTableData([]);

    setSuggestionData((ele) => ({
      ...ele,
      testSuggestions: {
        ...suggestionData?.testSuggestions,
        data: [],
        show: false,
      },
      packageSuggestions: {
        ...suggestionData?.packageSuggestions,
        data: [],
        show: false,
      },
    }));
    setRcData([
      {
        PayBy: "Patient",
        ReceiptNo: "",
        ledgerNoCr: "",
        RateTypeId: state?.RateID,
        PaymentMode: handleRateTypePaymode === "Credit" ? "Credit" : "Cash",
        PaymentModeID: handleRateTypePaymode === "Credit" ? 215 : 134,
        CardDate: "",
        CardNo: "",
        BankName: "",
        Amount: "",
        CentreID: LTData?.CentreID,
      },
    ]);
  };

  useEffect(() => {
    if (state?.isVIP === 0) {
      setState({ ...state, IsMask: 0 });
    }
  }, [state?.isVIP]);

  const handleDeboucing = (fuc) => {
    let timeout;
    return function (value) {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        fuc(value);
      }, 400);
    };
  };
  function getTestNamesWithBlankSampleTypeID() {
    const testsWithBlankSampleTypeID = PLO.filter(
      (test) =>
        test?.IsSampleRequired == "Sample Required" &&
        (test?.sampleTypeID === "" || test?.sampleTypeID === 0)
    );
    if (testsWithBlankSampleTypeID?.length === 0) {
      return false;
    } else {
      const testNames = testsWithBlankSampleTypeID?.map(
        (test) => test.ItemName
      );

      const concatenatedTestNames = testNames?.join(", ");

      return "In " + concatenatedTestNames + " test SampleType Not Found";
    }
  }
  const getSuggestion = (value) => {
    if (disAmt || discountPercentage) {
      toast.error("Remove Discount Amount or Discount Percentage to Add");
      return;
    }
    if (!state?.Age) {
      toast.error("Please choose DOB || Age");
    } else {
      if (LTData?.CentreID) {
        if (value.length >= 2) {
          axiosInstance
            .post("TestData/BindBillingTestData", {
              TestName: value,
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
        toast.error("please Select center");
      }
    }
  };

  const debouce = handleDeboucing(getSuggestion);

  const handleChange = (event) => {
    const { value } = event.target;
    debouce(value);
  };

  const handleSelectChange = (event) => {
    const { name, value, selectedIndex } = event?.target;
    const label = event?.target?.children[selectedIndex]?.text;
    if (name === "CentreID") {
      const data = CentreData.find((ele) => ele?.value == value);

      setLTData({
        ...LTData,
        [name]: value,
        CentreName: label,
        VisitType: data?.VisitType,
        SetMRP: data?.SetMRP,
        BTB: data?.BTB,
      });
      setSaveSmsEmail({
        SmsToPatient: "",
        SmsToDoctor: "",
        IsActiveSmsToPatient: "",
        IsActiveSmsToDoctor: "",
        EmailToPatient: "",
        EmailToDoctor: "",
        IsActiveEmailToPatient: "",
        IsActiveEmailToDoctor: "",
        SmsToClient: "",
        IsActiveSmsToClient: "",
        EmailToClient: "",
        IsActiveEmailToClient: "",
        IsCourier: "",
        IsWhatsappRequired: "",
      });
      getSpecialDayTest(value, state?.RateID);
    }

    if (name === "PatientIDProof") {
      setLTData({ ...LTData, [name]: value });
    }

    if (name === "VisitType") {
      setLTData({ ...LTData, [name]: value });
      fetchFields(value);
    }

    if (name === "ReportDeliveryMethodId") {
      setLTData({ ...LTData, [name]: value });
    }

    if (name === "DiscountApprovedBy") {
      if (value) {
        checkEmploypeeWiseDiscount(LTData, value)
          .then((res) => {
            setLTData({
              ...LTData,
              [name]: value,
              DiscountId: "",
              DiscountReason: "",
            });
          })
          .catch((err) => {
            toast.error(err);
            setLTData({
              ...LTData,
              [name]: "",
              DiscountId: "",
              DiscountReason: "",
            });
          });
      } else {
        setLTData({
          ...LTData,
          [name]: "",
          DiscountId: "",
          DiscountReason: "",
        });
      }
    }

    if (name === "DiscountReason") {
      setLTData({ ...LTData, [name]: value });
    }

    if (name === "CollectionBoyId") {
      setLTData({ ...LTData, [name]: value });
    } else {
      if (name === "RateID") {
        const data = RateType.find((ele) => ele?.value == value);
        setBarcodeLogic(Number(data?.BarcodeLogic));
        handleCityState(
          value,
          name,
          data?.RateTypeEmail,
          data?.RateTypePhone,
          data?.ClientAddress,
          data?.HideAmount,
          data?.ProEmployee
        );
        setSaveSmsEmail({
          SmsToPatient: "",
          SmsToDoctor: "",
          IsActiveSmsToPatient: "",
          IsActiveSmsToDoctor: "",
          EmailToPatient: "",
          EmailToDoctor: "",
          IsActiveEmailToPatient: "",
          IsActiveEmailToDoctor: "",
          SmsToClient: "",
          IsActiveSmsToClient: "",
          EmailToClient: "",
          IsActiveEmailToClient: "",
          IsCourier: "",
          IsWhatsappRequired: "",
        });
      }
      // getSpecialDayTest(LTData?.CentreID,value)
    }

    if (name === "SrfId") {
      setLTData({ ...LTData, [name]: value });
    }
    if (name === "IcmrId") {
      setLTData({ ...LTData, [name]: value });
    }

    if (name === "DiscountType") {
      if (value == "2") {
        handleDiscountAgeWiseItem();
        setLTData({
          ...LTData,
          [name]: Number(value),
          DiscountApprovedBy: "",
          DiscountReason: "",
        });
        setdisAmt("");
        setDiscountPercentage("");
      }

      if (value == "1") {
        setdisAmt("");
        setDiscountPercentage("");
        setLTData({
          ...LTData,
          [name]: Number(value),
          DiscountId: "",
          DiscountReason: "",
        });
      }
    }
  };

  const handleSelectNew = (event) => {
    const { name, value } = event?.target;
    setLTData({ ...LTData, [name]: value });
  };

  useEffect(() => {
    fetchFields(LTData?.VisitType);
  }, []);

  const findGender = () => {
    const male = ["Mr.", "Baba", "Dr.(Mr)", "Master"];
    const female = ["Miss.", "Mrs.", "Baby", "Dr.(Miss)", "Dr.(Mrs)"];
    const other = [""];
    if (male.includes(state?.Title)) {
      setState({ ...state, Gender: "Male" });
    }

    if (female.includes(state?.Title)) {
      setState({ ...state, Gender: "Female" });
    }
    if (other.includes(state?.Title)) {
      setState({ ...state, Gender: "Other" });
    }
  };

  useEffect(() => {
    findGender();
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
  }, [state?.Title]);

  const calculateDOB = (value) => {
    var TodayDate = moment(new Date().now).format("YYYY,MM,DD");
    var DOBDate = moment(value).format("YYYY,MM,DD");
    var a = moment(TodayDate);
    var b = moment(DOBDate);
    var years = a.diff(b, "year");
    b.add(years, "years");
    var months = a.diff(b, "months");
    b.add(months, "months");
    var days = a.diff(b, "days");
    days = years == 0 && months == 0 && days == 0 ? 1 : days;

    return { years, months, days };
  };

  const calculateTotalNumberOfDays = (value) => {
    return moment(moment().format("YYYY-MM-DD")).diff(value, "days");
  };

  const dateSelect = (value, name) => {
    const { years, months, days } = calculateDOB(value);
    setState({
      ...state,
      [name]: value,
      AgeYear: years,
      AgeMonth: months,
      AgeDays: days,
      TotalAgeInDays: calculateTotalNumberOfDays(value),
      Age: `${years} Y ${months} M ${days} D`,
    });
    const dateForFields = handleDateFunction({
      year: years,
      month: months,
      days: days,
    });
    setDateData({
      AgeYear: dateForFields?.AgeYear,
      AgeMonth: dateForFields?.AgeMonth,
      AgeDays: dateForFields?.AgeDays,
    });
    setLTData({
      ...LTData,
      Age: `${years} Y ${months} M ${days} D`,
    });
    setTableData([]);
    setSuggestionData((ele) => ({
      ...ele,
      testSuggestions: {
        ...suggestionData?.testSuggestions,
        data: [],
        show: false,
      },
      packageSuggestions: {
        ...suggestionData?.packageSuggestions,
        data: [],
        show: false,
      },
    }));
    setRcData([
      {
        PayBy: "Patient",
        ReceiptNo: "",
        ledgerNoCr: "",
        RateTypeId: state?.RateID,
        PaymentMode: handleRateTypePaymode === "Credit" ? "Credit" : "Cash",
        PaymentModeID: handleRateTypePaymode === "Credit" ? 215 : 134,
        CardDate: "",
        CardNo: "",
        BankName: "",
        Amount: "",
        CentreID: LTData?.CentreID,
      },
    ]);
  };
  const dateregselecect = (value, name) => {
    setLTData({ ...LTData, [name]: value });
  };

  const S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };

  const guidNumber = () => {
    const guidNumber =
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4();
    return guidNumber;
  };

  useEffect(() => {
    BindDoctorData();
    const DocumentId = guidNumber();
    setDocumentID(DocumentId);
    const patientId = guidNumber();
    SetPatientGuid(patientId);
    getProEmployee();
  }, []);

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
            if (suggestion.length > 0) {
              handleListSearch(suggestion[indexMatch], name);
            }
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

  // scroll view
  const validtabledata = (data, test, Promo) => {
    if (coupon?.field) {
      toast.error(
        "You can't add test because you have applied coupon,first remove coupon code."
      );
    } else {
      getTableData(data, "test", Promo);
    }
  };

  const handleListSearch = (data, name, Promo) => {
    switch (name) {
      case "TestName":
        document.getElementById("testSearch").value = "";
        setIndexMatch(0);
        setSuggestion([]);
        validtabledata(data, "test", Promo);

        break;
      case "DoctorName":
        setFormData({ ...formData, [name]: data.Name });
        setLTData({
          ...LTData,
          [name]: data.Name,
          DoctorID: data.DoctorReferalID,
          ReferLabId: data.DoctorReferalID,
          ReferLabName: data.Name,
          DoctorMobile: data?.Mobile,
          DoctorEmail: data?.Email,
          ProEmployee: data?.ProEmployee,
        });
        setState({
          ...state,
          ProEmployee:
            state?.ProEmployee != "" ? state?.ProEmployee : data?.ProEmployee,
        });
        setIndexMatch(0);
        setDoctorSuggestion([]);
        setDropFalse(false);
        break;
      case "SecondReferDoctor":
        setFormData({ ...formData, [name]: data.Name });
        setLTData({
          ...LTData,

          SecondReferDoctor: data.DoctorReferalID,
          // ReferLabId: data.DoctorReferalID,
          // ReferLabName: data.Name,
          // DoctorMobile: data?.Mobile,
          // DoctorEmail: data?.Email,
        });
        setIndexMatch(0);
        setDoctorSuggestion([]);
        setSecondDropFalse(false);
        break;
      default:
        break;
    }
  };

  const handleLTData = (e) => {
    const { name, value } = e.target;
    setLTData({
      ...LTData,
      [name]: value,
    });
  };

  useEffect(() => {
    getDoctorSuggestion(formData, setDoctorSuggestion, setFormData);
  }, [formData?.DoctorName]);
  useEffect(() => {
    getsecondDoctorSuggestion(formData, setseconddoctorSuggestion, setFormData);
  }, [formData?.SecondReferDoctor]);

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
        UpdateModalityId: 1,
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
          UpdateModalityId: 1,
        },
      ]);
    }
  };

  const getTableData = (data, key, Promo) => {
    const ItemIndex = tableData.findIndex(
      (e) => e.InvestigationID == data.InvestigationID
    );

    if (ItemIndex === -1) {
      axiosInstance
        .post("TestData/BindSingleTestData", {
          InvestigationID: data.InvestigationID,
          CentreID: data?.CentreID,
          CentreIdNew: LTData?.CentreID,
          FamilyMemberIsPrimary: throughMemberData
            ? Memberdetails?.FamilyMemberIsPrimary
            : 0,
          PatientCode: throughMemberData ? Memberdetails?.PatientCode : 0,
          MembershipCardID: throughMemberData
            ? Memberdetails?.MembershipCardID
            : 0,
          SetMRP: LTData?.SetMRP,
          IsPromotional: Promo ? 1 : 0,
          PromotionalID: data?.PromotionalID ? data?.PromotionalID : 0,
        })
        .then((res) => {
          const { genderCheck, ageCheck, message } = CheckageTest(
            res?.data?.message[0]?.Gender,
            res?.data?.message[0]?.ToAge,
            res?.data?.message[0]?.FromAge
          );

          if (genderCheck && ageCheck) {
            if (
              res?.data?.message[0]?.IsSampleRequired == "Sample Required" &&
              (res?.data?.message[0]?.SampleTypeID == "" ||
                res?.data?.message[0]?.SampleTypeID == 0)
            ) {
              toast?.error(
                "In " +
                  res?.data?.message[0]?.TestName +
                  " test SampleType Not Found"
              );
            } else if (res?.data?.message[0]?.Radiology == 1) {
              setSlotOpen({
                data: res?.data?.message[0],
                show: true,
              });
            } else
              setTableData([
                ...tableData,
                {
                  ...res?.data?.message[0],
                  Discount: data?.Discount
                    ? (
                        (Number(res?.data?.message[0].Rate) * data?.Discount) /
                        100
                      ).toFixed(2)
                    : Number(res?.data?.message[0].DiscAmt) == 0
                    ? ""
                    : Number(res?.data?.message[0].DiscAmt),
                  Rate: Number(res?.data?.message[0].Rate).toFixed(2),
                  NetAmount: data?.Discount
                    ? (
                        res?.data?.message[0].Rate -
                        (Number(res?.data?.message[0].Rate) * data?.Discount) /
                          100
                      ).toFixed(2)
                    : Number(res?.data?.message[0].Amount).toFixed(2),
                  IsSampleCollected: "N",
                  Status: 1,
                  IsUrgent: 0,
                  UrgentDateTime: "",
                  BarcodeNo: getBarcode(res?.data?.message[0]?.SampleTypeID),
                  isLabOutSource: res?.data?.message[0]?.isLabOutSource,
                  IsCulture: res?.data?.message[0]?.IsCulture,
                  IsConcern: res?.data?.message[0]?.IsConcern,
                  IsPndtForm: res?.data?.message[0]?.IsPndtForm,
                  UrgentdeleiveryDate:
                    res?.data?.message[0]?.UrgentdeleiveryDate,
                  Del_Date: res?.data?.message[0]?.deleiveryDate,
                },
              ]);
            if (key == "Coupon") {
              setCoupon({
                ...coupon,
                field: true,
              });
            }
          } else {
            !genderCheck &&
              toast.error("This Test is Not for " + state?.Gender);
            !ageCheck && toast.error(message);
          }
        })
        .catch((err) => console.log(err));
    } else {
      toast.error("Duplicate Test Found");
    }
  };

  const handlePLOChange = (e, index, main) => {
    const { name, checked } = !main && e.target;
    if (index >= 0) {
      const data = [...tableData];
      if (main) {
        data[index]["IsUrgent"] = 0;
        data[index]["UrgentDateTime"] = "";
      } else if (name === "Status") {
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

  const handleCloseBarcodeModal = (value) => {
    if (value?.length >= 3) {
      checkDuplicateBarcode(value, "").then((res) => {
        if (res === "") {
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

  const handleDiscountAgeWiseItem = () => {
    axiosInstance
      .post("PatientRegistration/DiscountTypeByAge", {
        Age: state?.AgeYear,
        Gender: state?.Gender,
      })
      .then((res) => {
        const data = res?.data?.message;
        const val = data?.map((ele) => {
          return {
            label: ele?.DiscountType,
            value: ele?.DiscountId,
            perCentage: ele?.DiscountPer,
          };
        });

        val?.unshift({
          label: "Select Discount",
          value: "",
          perCentage: "",
        });

        setAgeWiseDiscountDropdown(val);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUrgent = (value, index, mainClose) => {
    const data = [...tableData];
    if (mainClose) {
      data[index]["UrgentDateTime"] = "";
      setTableData(data);
    } else {
      data[index]["UrgentDateTime"] = value;
      setTableData(data);
    }
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
    if (
      (disAmt == 0 || disAmt === "") &&
      (discountPercentage == 0 || discountPercentage === "")
    ) {
      let total = tableData.reduce((acc, item) => acc + Number(item.Rate), 0);
      let NetTotal = tableData.reduce(
        (acc, item) => acc + Number(item.NetAmount),
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
      if (throughMemberData) {
        let total = tableData.reduce((acc, item) => acc + Number(item.Rate), 0);
        let NetTotal = tableData.reduce(
          (acc, item) => acc + Number(item.NetAmount),
          0
        );

        setLTData({
          ...LTData,
          GrossAmount: total,
          NetAmount: NetTotal,
          DiscountOnTotal: total > 0 && NetTotal >= 0 ? total - NetTotal : "",
          SrfId: checkCovid() ? LTData?.SrfId : "",
          IcmrId: checkCovid() ? LTData?.IcmrId : "",
        });
      }
    }
    tableData.length > 2 && getPackageSuggestions(tableData);
  }, [tableData]);

  const getPackageSuggestions = (data) => {
    const payload = [];

    data.forEach((obj) => {
      payload.push(obj.InvestigationID);
    });
    axiosInstance
      .post("TestData/BindPackage", {
        InvestigationID: payload,
        CentreID: LTData?.RateTypeId,
      })
      .then((res) => {
        let data = res?.data?.message;
        setSuggestionData((ele) => ({
          ...ele,
          show: true,
          packageSuggestions: {
            ...suggestionData.packageSuggestions,
            data: data,
            show: true,
          },
        }));
      })
      .catch((err) => {
        setSuggestionData((ele) => ({
          ...ele,
          packageSuggestions: {
            ...suggestionData.packageSuggestions,
            data: [],
            show: false,
          },
        }));
        // toast.error(
        //   err?.response?.data?.message
        //     ? err?.response?.data?.message
        //     : "Error Occured"
        // );
      });
  };
  const getSpecialDayTest = (CentreID, RateTypeID) => {
    axiosInstance
      .post("TestData/BindPromotional", {
        CentreID: CentreID,
        RateTypeID: RateTypeID,
      })
      .then((res) => {
        let data = res?.data?.message;
        setSuggestionData((ele) => ({
          ...ele,
          show: true,
          daySuggestions: {
            ...suggestionData.daySuggestions,
            data: data,
            show: true,
          },
        }));
      })
      .catch((err) => {
        setSuggestionData((ele) => ({
          ...ele,
          daySuggestions: {
            ...suggestionData.daySuggestions,
            data: [],
            show: false,
          },
        }));
      });
  };

  const globalVisibleFieldByVisitType = (fields) => {
    fields.forEach((ele) => {
      if (ele?.IsVisible) {
        if (["HLMPatientType", "Source"].includes(ele?.FieldType)) {
          getDropDownData(ele?.FieldType);
        }
      }
    });
  };

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

        globalVisibleFieldByVisitType(res?.data?.message);
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

  const checkCovid = () => {
    const isCovid = PLO?.find((ele) => ele?.IsCovid == 1);
    if (isCovid) return true;
    else return false;
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

  const getDropDownData = (name) => {
    const match = ["Title", "Gender", "BankName", "HLMPatientType", "Source"];
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
        !["Title", "PaymentMode", "Gender"].includes(name) &&
          value.unshift({ label: `Select ${name} `, value: "" });

        switch (name) {
          case "Gender":
            const extractedGenders = value
              ?.filter((option) => option?.value != "Both")
              .map((option) => {
                return {
                  value: option?.value,
                  label: option?.label,
                };
              });

            setGender(extractedGenders);
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
          case "HLMPatientType":
            setHLMPatientType(value);
            break;
          case "Source":
            setSourceType(value);
            break;
          default:
            break;
        }
      })
      .catch((err) => console.log(err));
  };

  //Modal show

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleShowMobile = () => {
    if (state?.Mobile?.length === 10) {
      getDataByMobileNo("Mobile");
    }
    // setShow4(true)
  };

  const handleFilter = (data) => {
    // InvestigationID

    if (coupon?.field) {
      toast.error(
        "You can't remove test because you have applied coupon, first remove coupon code."
      );
    } else {
      if (disAmt || discountPercentage) {
        toast.error("First Remove Disc per Or Discount Percentage");
      } else {
        const value = tableData.filter(
          (ele) => ele.InvestigationID !== data.InvestigationID
        );
        setTableData(value);
        getPackageSuggestions(value);
        toast.success("successfully Removed");
        setRcData([
          {
            PayBy: "Patient",
            ReceiptNo: "",
            ledgerNoCr: "",
            RateTypeId: state?.RateID,
            PaymentMode: handleRateTypePaymode === "Credit" ? "Credit" : "Cash",
            PaymentModeID: handleRateTypePaymode === "Credit" ? 215 : 134,
            Amount: "",
            BankName: "",
            CardDate: "",
            CardNo: "",
            CentreID: LTData?.CentreID,
          },
        ]);
      }
    }
  };

  useEffect(() => {
    let data = tableData.map((ele) => {
      return {
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
        SampleTypeName: ele?.SampleName,
        ItemId: ele?.InvestigationID,
        ItemName: ele?.TestName,
        InvestigationID: ele?.InvestigationID,
        InvestigationName: ele?.TestName,
        ReportType: ele?.ReportType,
        IsPackage: ele?.DataType === "Package" ? 1 : 0,
        Rate: Number(ele?.Rate).toFixed(2),
        Amount: Number(ele?.NetAmount).toFixed(2),
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
        CentreID: LTData?.CentreID,
        SessionCentreID: window.localStorage.getItem("DefaultCentre"),
        TestCentreID: 0,
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
        isLabOutSource: ele?.isOutSource,
        IsCulture: ele?.IsCulture,
        MemberType: ele?.MemberType,
        IsConcern: ele?.IsConcern,
        IsPndtForm: ele?.IsPndtForm,
        SetMRP: ele?.SetMRP,
        IsCovid: ele?.IsCovid,
        UrgentdeleiveryDate: ele?.UrgentdeleiveryDate,
      };
    });
    setPLO(data);
  }, [tableData]);

  const checkConcent = () => {
    const check = PLO?.filter((ele) => ele?.IsConcern == "1");

    return check?.length > 0 ? 1 : 0;
  };

  const checkPndt = () => {
    const check = PLO?.filter((ele) => ele?.IsPndtForm == "1");

    return check?.length > 0 ? 1 : 0;
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

  useEffect(() => {
    getAccessCentres(setCentreData, LTData, setLTData, LTDataIniti);
    getCollectionBoy(setCollectionBoy, true);
    getDropDownData("Gender");
    getDropDownData("Title");
    getDropDownData("Identity");
    getDropDownData("PaymentMode");
    getDropDownData("BankName");
    getVisitType(setVisitType);
    getBindDiscApproval(setBindDiscApproval);
    getBindDiscReason(setBindDiscReason);

    getPaymentModes("Source", setPatientSource);
    getPaymentModes("PatientType", setPatientType);
    getRequiredAttachment();
  }, []);

  useEffect(() => {
    if (
      (!isSubmit?.isLoading && isSubmit?.type === "Success") ||
      !throughMemberData
    ) {
      if (LTData?.CentreID) {
        getAccessDataRate(setRateType, LTData?.CentreID).then((res) => {
          handleCityState(
            res[0]?.value,
            "RateID",
            res[0]?.RateTypeEmail,
            res[0]?.RateTypePhone,
            res[0]?.ClientAddress,
            res[0]?.HideAmount,
            res[0]?.ProEmployee
          );
          setBarcodeLogic(Number(res[0]?.BarcodeLogic));
        });
      }
    }
  }, [LTData?.CentreID, isSubmit, throughMemberData]);

  useEffect(() => {
    let totaldiscount = (LTData.GrossAmount * discountPercentage) / 100;
    let disamount = LTData.GrossAmount - totaldiscount;

    setLTData({
      ...LTData,
      NetAmount: disamount,
      DiscountOnTotal: totaldiscount,
    });
    const data = PLO.map((ele) => {
      return {
        ...ele,
        Amount: Number(
          ele.Rate - (ele.Rate * discountPercentage) / 100
        ).toFixed(2),
        DiscountAmt: ((ele.Rate * discountPercentage) / 100).toFixed(2),
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
    const { value, selectedIndex } = event?.target;
    const label = event?.target?.children[selectedIndex].text;
    let match = false;
    for (var i = 0; i < RcData.length; i++) {
      if (RcData[i].PaymentMode === label) {
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
          PaymentMode: label,
          PaymentModeID: value,
          CardNo: "",
          CardDate: "",
          BankName: "",
          Amount: "",
          CentreID: LTData?.CentreID,
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
    setPaid(Number(sum).toFixed(2));
    return sum;
  };

  useEffect(() => {
    if (RcData.length === 1) {
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

  const getDataByMobileNo = (type) => {
    if (type === "Mobile") {
      if (state?.Mobile.length === 10) {
        axiosInstance
          .post("Booking/getDataByMobileNo", {
            Mobile: state?.Mobile,
            PatientCode: "",
          })
          .then((res) => {
            setMobileData(res.data.message?.user);
            setSuggestionData((ele) => ({
              ...ele,
              testSuggestions: {
                ...suggestionData.testSuggestions,
                Total: res?.data?.message?.Data,
              },
            }));
            setShow4(true);
          })
          .catch((err) => {
            toast.error(
              err?.response?.data?.message
                ? err?.response?.data?.message
                : "Error Occured"
            );
          });
      }
    } else {
      if (state?.PatientCode.length >= 3) {
        axiosInstance
          .post("Booking/getDataByMobileNo", {
            Mobile: "",
            PatientCode: state?.PatientCode,
          })
          .then((res) => {
            setMobileData(res.data.message?.user);
            setSuggestionData((ele) => ({
              ...ele,
              testSuggestions: {
                ...suggestionData.testSuggestions,
                Total: res?.data?.message?.Data,
              },
            }));
            setShow4(true);
          })
          .catch((err) => {
            toast.error(
              err?.response?.data?.message
                ? err?.response?.data?.message
                : "Error Occured"
            );
          });
      }
    }
  };

  const someMethodWithoutAccessToEvent = (e, id) => {
    if (e.key === " ") {
      document.getElementById(id).focus();
    }
  };

  const handlePatientData = (e, type) => {
    const keypress = [9, 13];
    if (keypress.includes(e.which)) {
      getDataByMobileNo(type);
    }
  };
  const getMemberhipdata = (e) => {
    const keypress = [9, 13];
    if (keypress.includes(e.which)) {
      axiosInstance
        .post("Booking/GetMemberShipPatientData", {
          MemberShipNo: membershipnum,
          CenterID: LTData?.CentreID,
        })
        .then((res) => {
          setMemberdata(res?.data.message);
          setShow7(true);
        })
        .catch((err) => {
          toast.error(err?.response.data.message);
        });
    }
  };

  const handleClose4 = () => {
    setShow4(false);
  };

  const Fetch = async (guidNumber, pageName) => {
    const response = await axiosInstance.post("CommonController/GetDocument", {
      Page: pageName,
      Guid: guidNumber,
    });
    return response?.data?.message;
  };

  const getS3url = async (id) => {
    const response = await axiosInstance.post("CommonController/GetFileUrl", {
      Key: id,
    });
    return response?.data?.message;
  };

  const handlePreviewImage = async (guidNumber) => {
    const response = await Fetch(guidNumber, "patientImage");
    if (response.length > 0) {
      const imgURL = await getS3url(response[0]?.awsKey);
      setPatientImg({
        img: imgURL,
        show: false,
      });
    }
  };

  const handleSelctData = (data) => {
    const centreName = CentreData?.find((ele) => ele.value === data.CentreID);
    const { years, months, days } = calculateDOB(new Date(data?.DOB));
    handlePreviewImage(data?.PatientGuid);
    setState({
      ...state,
      Title: data.Title,
      FirstName: data.FirstName,
      LastName: data?.LastName,
      MiddleName: data?.MiddleName,
      //  CentreID: data?.CentreID,
      //   RateID: data?.RateTypeId,
      Mobile: data?.Mobile,
      Gender: data?.Gender,
      DOB: new Date(data?.DOB),
      Age: data?.Age,
      PatientCode: data?.PatientCode,
      Email: data?.Email,
      PinCode: data?.Pincode,
      AgeDays: days,
      AgeMonth: months,
      AgeYear: years,
      HouseNo: data?.HouseNo,
      City: data?.City,
      State: data?.State,
      Country: data?.Country,
      StreetName: data?.StreetName,
      IsMask: data?.IsMask,
      isVIP: data?.IsVIP,
      Locality: data?.Locality,
      TotalAgeInDays: calculateTotalNumberOfDays(new Date(data?.DOB)),
    });

    const testDetails =
      suggestionData?.testSuggestions?.Total?.length > 0
        ? suggestionData?.testSuggestions?.Total?.filter(
            (ele) => ele?.patientcode == data?.PatientCode
          )
        : [];

    if (testDetails?.length > 0) {
      setSuggestionData((ele) => ({
        ...ele,
        show: true,
        testSuggestions: {
          ...suggestionData?.testSuggestions,
          data: testDetails,
          show: true,
        },
      }));
    }
    SetPatientGuid(
      data?.PatientGuid && data?.PatientGuid !== ""
        ? data?.PatientGuid
        : PatientGuid
    );
    handleUploadCount(
      "UploadDocumentCount",
      data?.DocumentUplodedCount,
      "IsDocumentUploaded",
      "MedicalHistoryCount",
      data?.MedicalHistoryCount,
      "IsMedicalHistory"
    );
    // handleUploadCount(
    //   "UploadDocumentCount",
    //   data?.MedicalHistoryCount,
    //   "IsDocumentUploaded"
    // );

    // setLTData({
    //   ...LTData,
    // //  CentreName: centreName.label,
    //   CentreID: centreName.value,
    // });
    handleClose4();
    setThroughMobileData(true);
    setMobileData([]);
  };
  const handleSelectedData = (data) => {
    const { years, months, days } = calculateDOB(new Date(data?.DOB));

    setState({
      ...state,
      Title: data.Title,
      FirstName: data.FirstName,
      LastName: data?.LastName,
      MiddleName: data?.MiddleName,
      Gender: data?.Gender,
      DOB: new Date(data?.DOB),
      Age: data?.Age,
      PatientCode: data?.PatientCode,
      Email: data?.Email == null ? "" : data?.Email,
      PinCode: data?.Pincode,
      AgeDays: days,
      AgeMonth: months,
      AgeYear: years,
      HouseNo: data?.HouseNo,
      City: data?.City,
      State: data?.State,
      Country: data?.Country,
      StreetName: data?.StreetName,
      IsMask: data?.IsMask,
      isVIP: data?.IsVIP,
      Locality: data?.Locality,
      Mobile: data?.Mobile,
      TotalAgeInDays: calculateTotalNumberOfDays(new Date(data?.DOB)),
    });
    setMemberdetails(data);
    setMemberdata([]);
    setThroughmemberdata(true);
    handleclosemembershipmodal();
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

  const getReceipt = (id, fullyPaid) => {
    axiosReport
      .post("getReceipt", {
        LedgerTransactionIDHash: id,
      })
      .then((res) => {
        window.open(res?.data?.Url, "_blank");
        if (fullyPaid == 1) getReceiptFullyPaid(id);
      })
      .catch((err) => {
        toast.error(
          err?.data?.response?.message
            ? err?.data?.response?.message
            : "Error Occured"
        );
      });
  };
  const getReceiptFullyPaid = (id) => {
    axiosInstance
      .post("reports/v1/getReceiptFullyPaid", {
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
  const getConcern = (id) => {
    axiosInstance
      .post("ConcentFormMaster/generateConcentForm", {
        LedgerTransactionIDHash: id,
      })
      .then((res) => {
        window.open(res?.data?.Url, "_blank");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
      });
  };
  const getPndtForm = (id) => {
    axiosInstance
      .post("PndtFormMaster/generatPndtForm", {
        LedgerTransactionIDHash: id,
      })
      .then((res) => {
        window.open(res?.data?.Url, "_blank");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
      });
  };
  const getReceiptTRF = (id, TRF, DepartmentSlip) => {
    if (TRF == 1) {
      axiosInstance
        .post("/reports/v1/getTRF", {
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
    }
    if (DepartmentSlip == 1) {
      axiosInstance
        .post("/reports/v1/getDepartment", {
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
    }
  };

  const checkPaymentStatus = async (order_id, pLink) => {
    try {
      const { data } = await axiosInstance.post("RazorPay/paymentstatus", {
        order_id: order_id,
        pLink: pLink,
      });
      if (data.success) {
        toast.success("Payment successful!");
        return true;
      } else {
        toast.error("Payment failed. Please try again.");
        return false;
      }
    } catch (error) {
      toast.error("Error checking payment status.");
      return false;
    }
  };
  const getPaymentLink = () => {
    axiosInstance
      .post("RazorPay/createPaymentLink", {
        amount: getPaymentModeAmount[0]?.Amount,
        receipt: guidNumber(),
        mobile: state?.Mobile,
        email: state?.Email,
      })
      .then((res) => {
        if (res.data.success) {
          const order_id = res.data.paymentLink.notes.order_id;
          let timeoutId;
          let intervalId;
          let countdownIntervalId;
          let remainingTime = 180;
          const formatTime = (time) => {
            const minutes = Math.floor(time / 60);
            const seconds = time % 60;
            return `${minutes} : ${seconds < 10 ? "0" : ""}${seconds}`;
          };
          const toastId = toast.info(
            `Please go to the payment link sent to your number ${
              state?.Mobile
            } and complete the payment. Time remaining : ${formatTime(
              remainingTime
            )} .`,
            {
              autoClose: false,
              closeOnClick: false,
            }
          );

          countdownIntervalId = setInterval(() => {
            remainingTime -= 1;
            toast.update(toastId, {
              render: `Please go to the payment link sent to your number ${
                state?.Mobile
              } and complete the payment. Time remaining : ${formatTime(
                remainingTime
              )} .`,
            });

            if (remainingTime <= 0) {
              clearInterval(countdownIntervalId);
            }
          }, 1000);

          intervalId = setInterval(async () => {
            const success = await checkPaymentStatus(
              order_id,
              res.data.paymentLink.id
            );
            if (success) {
              setIsRazorPayOpen(false);
              handleSubmitFinalBooking(order_id);
              clearInterval(intervalId);
              clearTimeout(timeoutId);
              clearInterval(countdownIntervalId);
              toast.dismiss();
            }
          }, 2000);

          timeoutId = setTimeout(() => {
            setIsRazorPayOpen(false);
            clearInterval(intervalId);
            clearInterval(countdownIntervalId);
            toast.dismiss();
            toast.error("Payment status check timeout.");
          }, 180000);
        } else {
          setIsRazorPayOpen(false);
          toast.error("Failed to create payment link");
        }
      })
      .catch((err) => {
        setIsRazorPayOpen(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occurred"
        );
      });
  };
  const IsOnlinePayment = () => {
    axiosInstance
      .get("RazorPay/Otherpayment")
      .then((res) => {
        if (res?.data?.payment_capture == 1) {
          setIsRazorPayOpen(true);
          getPaymentLink();
        } else {
          setIsSubmit({
            type: "Success",
            isLoading: true,
          });
          handleSubmitFinalBooking();
        }
      })
      .catch((err) =>
        toast.error(
          err?.data?.response?.message
            ? err?.data?.response?.message
            : "Error Occur"
        )
      );
  };

  const handleSubmitApi = () => {
    debugger;
    const { DocumentFlag, message } = handleFileValidationUpload();
    if (!filterUnPaidRcData()) {
      if (getTestNamesWithBlankSampleTypeID()) {
        toast.error(getTestNamesWithBlankSampleTypeID());
      } else {
        if (DocumentFlag) {
          if (getPaymentModeAmount?.length > 0) {
            IsOnlinePayment();
          } else {
            setIsSubmit({
              type: "Success",
              isLoading: true,
            });

            handleSubmitFinalBooking();
          }
        } else {
          toast.error(`${message} is Required Document`);
        }
      }
    } else {
      toast.error("please Enter Amount to continue");
    }
  };

  const { errors, handleSubmit } = useFormik({
    initialValues: { ...state, ...LTData, ...formData, ...Pndt },
    enableReinitialize: true,
    validationSchema: PatientRegisterSchema,
    onSubmit: (values) => {
      debugger;
      const data = DynamicFieldValidations();
      setVisibleFields(data);
      const flag = data.filter((ele) => ele?.isError === true);
      const match = Match();
      const paymentCheck = PaymentData();
      if (flag.length === 0) {
        if (PLO.length > 0) {
          if (valiateProofID()) {
            if (!paymentCheck) {
              if (!coupon?.field && (disAmt || discountPercentage || match)) {
                if (throughMemberData) {
                  handleSubmitApi();
                } else {
                  if (LTData?.DiscountOnTotal == 0) {
                    handleSubmitApi();
                  } else {
                    if (
                      (LTData?.DiscountApprovedBy != "" &&
                        LTData?.DiscountReason != "") ||
                      (LTData?.DiscountId != "" && LTData?.DiscountReason != "")
                    ) {
                      handleSubmitApi();
                    } else {
                      toast.error(
                        "Please Choose Discount Approval And Discount Reason"
                      );
                    }
                  }
                }
              } else {
                handleSubmitApi();
              }
            } else {
              toast.error("Please Fill All The Required Fields");
            }
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

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    if (value === "") {
      setTime({ ...time, [name]: 0 });
      return;
    }

    if (name === "Hour") {
      let hour = parseInt(value.replace(/\D/g, ""));
      if (isNaN(hour) || hour < 0 || hour > 23) return;
      const registrationDate = new Date(LTData?.RegistrationDate);
      registrationDate.setHours(value);
      registrationDate.setMinutes(time?.Minute);
      registrationDate.setSeconds(time?.Second);
      setLTData({ ...LTData, RegistrationDate: registrationDate });
      setTime({ ...time, [name]: hour });
    } else if (name === "Minute" || name === "Second") {
      let minuteOrSecond = parseInt(value.replace(/\D/g, ""));
      if (isNaN(minuteOrSecond) || minuteOrSecond < 0 || minuteOrSecond > 59)
        return;
      if (name == "Minute") {
        const registrationDate = new Date(LTData?.RegistrationDate);
        registrationDate.setHours(time?.Hour);
        registrationDate.setMinutes(value);
        registrationDate.setSeconds(time?.Second);
        setLTData({ ...LTData, RegistrationDate: registrationDate });
      }
      if (name == "Second") {
        const registrationDate = new Date(LTData?.RegistrationDate);
        registrationDate.setHours(time?.Hour);
        registrationDate.setMinutes(time?.Minute);
        registrationDate.setSeconds(value);
        setLTData({ ...LTData, RegistrationDate: registrationDate });
      }

      setTime({ ...time, [name]: minuteOrSecond });
    } else {
      setTime({ ...time, [name]: value });
    }
  };

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

  useEffect(() => {
    setTableData([]);
    setSuggestionData({
      show: false,
      viewTestModal: false,
      viewTestModalId: "",
      testSuggestions: {
        data: [],
        show: false,
        Total: [],
      },
      packageSuggestions: {
        data: [],
        show: false,
      },
      daySuggestions: {
        data: [],
        show: false,
      },
    });
    setRcData([
      {
        PayBy: "Patient",
        ReceiptNo: "",
        ledgerNoCr: "",
        RateTypeId: state?.RateID,
        PaymentMode: handleRateTypePaymode === "Credit" ? "Credit" : "Cash",
        PaymentModeID: handleRateTypePaymode === "Credit" ? 215 : 134,
        BankName: "",
        CardNo: "",
        CardDate: "",
        Amount: "",
        CentreID: LTData?.CentreID,
      },
    ]);
  }, [LTData?.CentreID, state?.RateID, state?.Gender]);

  const handleChangeRTCData = (e, index) => {
    const { name, value } = e.target;
    const data = [...RcData];
    data[index][name] = value;
    setRcData(data);
  };

  const handleUploadCount = (
    name,
    value,
    secondName,
    medicalName,
    medicalValue,
    MedicalSName
  ) => {
    setLTData({
      ...LTData,
      [name]: value,
      [secondName]: value === 0 ? 0 : 1,
      [medicalName]: medicalValue,
      [MedicalSName]: medicalValue === 0 ? 0 : 1,
    });
  };

  const handleMedicalCount = (name, value, secondName) => {
    setLTData({
      ...LTData,
      [name]: value,
      [secondName]: value === 0 ? 0 : 1,
    });
  };

  const getDocumentType = (data) => {
    setUploadDoumentType(data);
  };

  const handleBarcodeUpperClose = (index, sampletypeId) => {
    if (BarcodeLogic === 3) {
      const data = tableData.map((ele) => {
        return {
          ...ele,
          BarcodeNo: "",
          Status: 1,
          IsSampleCollected: "N",
        };
      });
      setTableData(data);
      setShow5({ modal: false, index: index });
    }
    if (BarcodeLogic === 4) {
      const data = tableData.map((ele) => {
        if (ele?.SampleTypeID === sampletypeId) {
          return {
            ...ele,
            BarcodeNo: "",
            Status: 1,
            IsSampleCollected: "N",
          };
        } else {
          return ele;
        }
      });
      setShow5({ modal: false, index: index });
      setTableData(data);
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

  const valiateProofID = () => {
    let validate = true;
    if (LTData?.PatientIDProof && LTData?.PatientIDProofNo.length < 5) {
      validate = false;
    }
    return validate;
  };

  const findMRPAndRateEstimate = () => {
    let MRP = 0;
    let Rate = 0;
    for (let i = 0; i < tableData?.length; i++) {
      MRP = MRP + Number(tableData[i]["Rate"]);
      Rate = Rate + Number(tableData[i]["NetAmount"]);
    }
    return { MRP, Rate };
  };

  const filterUnPaidRcData = () => {
    let paymentFlag = false;
    if (throughMemberData) {
      return false;
    }
    if (handleRateTypePaymode !== "Credit") {
      for (let i = 0; i < RcData.length; i++) {
        if (RcData[i]["Amount"] === "") {
          paymentFlag = true;
          break;
        }
      }
    }
    return paymentFlag;
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

  const handleLockRegistation = useMemo(() => {
    const data = RateType.find((ele) => ele?.value == state?.RateID);
    return [0, null].includes(data?.LockRegistration) ? false : true;
  }, [state?.RateID, RateType]);

  const handleRateTypePaymode = useMemo(() => {
    const data = RateType.find((ele) => ele?.value == state?.RateID);
    return data?.PayMode;
  }, [state?.RateID, RateType]);

  const handleCloseCoupon = () => {
    setShowCoupon({
      ...showCoupon,
      ShowCouponDetail: false,
    });
  };
  const handleclosemembershipmodal = () => {
    setShow7(false);
  };

  const handleCloseBindTestCouponShowModal = () => {
    setShowCoupon({
      ...showCoupon,
      BindTestCouponShow: false,
    });
  };
  const handleSelectTestData = (ele) => {
    const data = {
      InvestigationID: ele?.TestId,
      CentreID: state?.RateID,
      Discount: Number(ele?.DiscountPercentage),
    };

    getTableData(data, "Coupon");
  };

  const handleCouponValidate = () => {
    const generatedError = CouponValidateSchema(state, formData, LTData);
    setCoupon({
      ...coupon,
      load: true,
    });

    if (generatedError == "") {
      const match = Match();
      if (disAmt || discountPercentage || match) {
        toast.error("First Remove Discount For Adding Coupon");
        setCoupon({
          ...coupon,
          load: false,
        });
      } else {
        axiosInstance
          .post("CouponMaster/BindTestForAppliedCoupon", {
            CoupanCode: coupon?.code.trim(),
            CentreId: LTData?.CentreID,
            CentreID: state?.RateID,
          })
          .then((res) => {
            setCoupon({
              ...coupon,
              load: false,
            });
            const coupondatas = res?.data?.message;

            setCouponData(res?.data?.message);

            if (coupondatas[0].Type == 2) {
              setTableData([]);
              setShowCoupon({
                ...showCoupon,
                BindTestCouponShow: true,
              });
            } else {
              if (tableData.length > 0) {
                {
                  if (LTData?.GrossAmount < coupondatas[0]?.MinBookingAmount) {
                    toast.error(
                      "Total Billing amount should be greater than minimum booking amount " +
                        couponData[0]?.MinBookingAmount +
                        " so coupon discount can not be applied"
                    );
                  } else if (
                    LTData?.GrossAmount < coupondatas[0]?.DiscountAmount
                  ) {
                    toast.error(
                      "Gross amount Must be greator than " +
                        coupondatas[0]?.DiscountAmount +
                        " to apply this coupon"
                    );
                  } else {
                    toast.success("Coupon Applied Successfully");
                    if (coupondatas[0]?.DiscountAmount == 0)
                      setDiscountPercentage(coupondatas[0]?.DiscountPercentage);

                    if (coupondatas[0]?.DiscountPercentage == 0) {
                      setdisAmt(coupondatas[0]?.DiscountAmount);

                      setLTData({
                        ...LTData,
                        DiscountOnTotal: coupondatas[0]?.DiscountAmount,
                      });

                      const findPercentageDiscount =
                        (coupondatas[0]?.DiscountAmount / LTData?.GrossAmount) *
                        100;

                      const data = PLO.map((ele) => {
                        return {
                          ...ele,
                          Amount:
                            ele.Rate -
                            ((ele.Rate * findPercentageDiscount) / 100).toFixed(
                              2
                            ),
                          DiscountAmt: (
                            (ele.Rate * findPercentageDiscount) /
                            100
                          ).toFixed(2),
                        };
                      });
                      setPLO(data);
                    }

                    setCoupon({
                      ...coupon,
                      field: true,
                    });
                  }
                }
              } else {
                toast.error("Please Select any test first then apply coupon");
              }
            }
          })
          .catch((err) => {
            setCoupon({
              ...coupon,
              load: false,
            });
            toast.error(
              err?.response?.data?.message
                ? err?.response?.data?.message
                : "Error Occured"
            );
          });
      }
    } else {
      setCoupon({
        ...coupon,
        load: false,
      });
      setErr(generatedError);
    }
  };

  const handleCouponCancel = () => {
    setCoupon({
      code: "",
      field: false,
    });
    setTableData([]);
    setErr({});

    if (coupon?.field) toast.error("Coupon Removed Successfully");
  };
  const handleMembershipcancel = () => {
    setmembershipnum("");
    setTableData([]);
    setSuggestionData({
      show: false,
      viewTestModal: false,
      viewTestModalId: "",
      testSuggestions: {
        data: [],
        show: false,
        Total: [],
      },
      packageSuggestions: {
        data: [],
        show: false,
      },
      daySuggestions: {
        data: [],
        show: false,
      },
    });
    setErr({});
    setState(stateIniti);
    setThroughmemberdata(false);
    setThroughMobileData(false);
    getAccessCentres(setCentreData, LTData, setLTData, LTDataIniti);
  };

  const handleCouponDetailsModal = () => {
    axiosInstance
      .post("CouponMaster/GetCouponValidationData", {
        CoupanCode: coupon?.code.trim(),
      })
      .then((res) => {
        setCouponDetails(res?.data?.message);
        if (res?.data?.message.length > 0) {
          setShowCoupon({
            ...showCoupon,
            ShowCouponDetail: true,
          });
        } else {
          toast.error("No Coupon Details Found");
        }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message ? "Details Not Found" : "Error Occured"
        );
      });
  };

  let sumOfPLO = [];

  const handleDiscountLastIndex = (
    ele,
    index,
    findPercentageDiscount,
    value
  ) => {
    if (index + 1 != PLO.length) {
      const result = ((ele.Rate * findPercentageDiscount) / 100).toFixed(2);
      const roundedResult = parseFloat(result).toFixed(2);
      sumOfPLO.push(roundedResult);
      return roundedResult;
    } else {
      const finalData = sumOfPLO.reduce(
        (acc, current) => acc + parseFloat(current),
        0
      );

      const finalResult = parseFloat((value - finalData).toFixed(2));

      return finalResult;
    }
  };

  const testDataArray = [];
  tableData.forEach((obj) => {
    testDataArray.push(obj.InvestigationID);
  });
  const handleShowRemark = () => {
    setShowRemark(false);
  };

  const handleSaveremark = (payload) => {
    setLTData({ ...LTData, Remarks: payload });
    handleShowRemark();
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
      {show && <PatientRegisterModal handleClose={handleClose} />}
      {showRemark && (
        <SampleRemark
          show={showRemark}
          handleShow={handleShowRemark}
          state={LTData}
          PageName={LTData?.Remarks}
          handleSave={handleSaveremark}
          title={"Billing Remarks"}
        />
      )}
      {show6 && (
        <SaveSmsEmail
          state={state}
          LTData={LTData}
          saveSmsEmail={saveSmsEmail}
          setSaveSmsEmail={setSaveSmsEmail}
          setShow6={setShow6}
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
      <PageHead name="PatientRegistration">
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
                <div className="col-sm-1">
                  <SelectBox
                    name="VisitType"
                    options={VisitType}
                    lable="VisitType"
                    selectedValue={LTData?.VisitType}
                    onChange={handleSelectChange}
                  />
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
                <div className="col-sm-2">
                  <Input
                    type="text"
                    lable="Membership Number"
                    name="MembershipNo"
                    placeholder=" "
                    onKeyDown={(e) => getMemberhipdata(e)}
                    id="MembershipNo"
                    value={membershipnum}
                    disabled={throughMemberData}
                    onChange={(e) => {
                      setmembershipnum(e?.target?.value);
                    }}
                  />
                </div>
                <div className="col-sm-1">
                  {throughMemberData ? (
                    <button
                      id="btndeleterow"
                      disabled={!throughMemberData}
                      className="btn btn-danger btn-block btn-sm "
                      onClick={handleMembershipcancel}
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary btn-block btn-sm"
                      id="Membership"
                      onClick={() => {
                        Navigate("/MembershipCardMaster");
                      }}
                    >
                      Create
                    </button>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-2">
                  <Input
                    // className="select-input-box form-control input-sm required"
                    name="Mobile"
                    id="Mobile"
                    onInput={(e) => number(e, 10)}
                    onKeyDown={(e) => handlePatientData(e, "Mobile")}
                    value={state.Mobile}
                    disabled={throughMobileData || throughMemberData}
                    onChange={handleMainChange}
                    type="number"
                    lable="Mobile Number"
                    placeholder=" "
                  />
                  <Button
                    icon="pi pi-search"
                    className="iconSize ls-none"
                    onClick={handleShowMobile}
                  />

                  {!err?.Mobile && !err?.Mobiles && errors?.Mobile && (
                    <div className="error-message">{errors?.Mobile}</div>
                  )}

                  {state.Mobile == "" && (
                    <div className="error-message">{err?.Mobile}</div>
                  )}
                  {state.Mobile != "" && state?.Mobile.length < 10 && (
                    <div className="error-message">{err?.Mobiles}</div>
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
                        isDisabled={throughMobileData || throughMemberData}
                        selectedValue={state?.Title}
                        onChange={handleMainChange}
                      />
                    </div>
                    <div style={{ width: "70%" }}>
                      <Input
                        onKeyDown={(e) =>
                          someMethodWithoutAccessToEvent(e, "MiddleName")
                        }
                        max={35}
                        name="FirstName"
                        type="text"
                        id="FirstName"
                        lable="First Name"
                        placeholder=" "
                        disabled={throughMobileData || throughMemberData}
                        value={state?.FirstName}
                        onChange={handleMainChange}
                      />

                      {!err?.FirstName &&
                        !err?.FirstNames &&
                        errors?.FirstName && (
                          <div className="error-message">
                            {errors?.FirstName}
                          </div>
                        )}

                      {state.FirstName == "" && (
                        <div className="error-message">{err?.FirstName}</div>
                      )}

                      {state?.FirstName != "" &&
                        state?.FirstName.trim().length < 3 && (
                          <div className="error-message">{err?.FirstNames}</div>
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
                    onKeyDown={(e) =>
                      someMethodWithoutAccessToEvent(e, "LastName")
                    }
                    disabled={throughMobileData || throughMemberData}
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
                    disabled={throughMobileData || throughMemberData}
                    onChange={handleMainChange}
                  />
                </div>

                <div className="col-sm-2">
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

                <div className="col-sm-1">
                  <button
                    className="btn btn-primary btn-block btn-sm"
                    id="PRDM"
                    onClick={() => {
                      setSaveSmsEmail({
                        ...saveSmsEmail,
                        IsActiveEmailToClient:
                          saveSmsEmail?.IsActiveEmailToClient !== ""
                            ? saveSmsEmail?.IsActiveEmailToClient
                            : saveSmsEmail?.EmailToClient != ""
                            ? 1
                            : state?.RateTypeEmail != ""
                            ? 1
                            : 0,
                        IsActiveSmsToDoctor:
                          saveSmsEmail?.IsActiveSmsToDoctor !== ""
                            ? saveSmsEmail?.IsActiveSmsToDoctor
                            : saveSmsEmail?.SmsToDoctor != ""
                            ? 1
                            : LTData?.DoctorMobile != ""
                            ? 1
                            : 0,
                        IsActiveEmailToDoctor:
                          saveSmsEmail?.IsActiveEmailToDoctor !== ""
                            ? saveSmsEmail?.IsActiveEmailToDoctor
                            : saveSmsEmail?.EmailToDoctor != ""
                            ? 1
                            : LTData?.DoctorEmail != ""
                            ? 1
                            : 0,
                        IsActiveEmailToPatient:
                          saveSmsEmail?.IsActiveEmailToPatient !== ""
                            ? saveSmsEmail?.IsActiveEmailToPatient
                            : saveSmsEmail?.EmailToPatient != ""
                            ? 1
                            : state?.Email != ""
                            ? 1
                            : 0,
                        IsActiveSmsToPatient:
                          saveSmsEmail?.IsActiveSmsToPatient !== ""
                            ? saveSmsEmail?.IsActiveSmsToPatient
                            : saveSmsEmail?.SmsToPatient != ""
                            ? 1
                            : state?.Mobile != ""
                            ? 1
                            : 0,
                        IsActiveSmsToClient:
                          saveSmsEmail?.IsActiveSmsToClient !== ""
                            ? saveSmsEmail?.IsActiveSmsToClient
                            : saveSmsEmail?.SmsToClient != ""
                            ? 1
                            : state?.RateTypePhone != ""
                            ? 1
                            : 0,
                        IsWhatsappRequired: saveSmsEmail?.IsWhatsappRequired
                          ? saveSmsEmail?.IsWhatsappRequired
                          : 0,
                      });

                      setShow6(true);
                    }}
                  >
                    PRDM
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-2">
                  <DatePicker
                    value={state?.DOB}
                    className="custom-calendar"
                    name="DOB"
                    disabled={throughMobileData || throughMemberData}
                    placeholder=" "
                    id="DOB"
                    lable="DOB"
                    maxDate={new Date()}
                    onChange={dateSelect}
                  />
                  {!err?.DOB && errors?.DOB && (
                    <div className="error-message">{errors?.DOB}</div>
                  )}

                  {state.DOB == "" && (
                    <div className="error-message">{err?.DOB}</div>
                  )}
                </div>
                <div className="col-sm-3">
                  <div className="p-inputgroup flex-1">
                    <Input
                      placeholder=" "
                      type="text"
                      id="Y"
                      name="AgeYear"
                      value={state?.AgeYear}
                      onInput={(e) => number(e, 3, 120)}
                      disabled={throughMemberData || throughMobileData}
                      onChange={handleDOBCalculation}
                    />
                    <span className="p-inputgroup-addon iconSizeAge">Y</span>

                    <Input
                      placeholder=" "
                      type="text"
                      id="M"
                      name="AgeMonth"
                      value={state?.AgeMonth}
                      onInput={(e) => number(e, 2, 12)}
                      disabled={throughMemberData || throughMobileData}
                      onChange={handleDOBCalculation}
                    />
                    <span className="p-inputgroup-addon iconSizeAge">M</span>
                    <Input
                      placeholder=" "
                      type="text"
                      id="D"
                      name="AgeDays"
                      value={state?.AgeDays}
                      onInput={(e) => number(e, 2, 31)}
                      disabled={throughMemberData || throughMobileData}
                      onChange={handleDOBCalculation}
                    />
                    <span className="p-inputgroup-addon iconSizeAge">D</span>
                  </div>
                </div>

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
                            className={`${
                              index === indexMatch && "matchIndex"
                            }`}
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
                      onClick={handleShow}
                    />
                  </div>
                  {!err?.DoctorName &&
                    !err?.DoctorID &&
                    (errors?.DoctorID || errors?.DoctorName) &&
                    (touched?.DoctorID || touched?.DoctorName) && (
                      <div className="error-message">
                        {errors?.DoctorID || errors?.DoctorName}
                      </div>
                    )}

                  {formData.DoctorName == "" && (
                    <div className="error-message">{err?.DoctorName}</div>
                  )}

                  {formData.DoctorName != "" && formData?.DoctorID == "" && (
                    <div className="error-message">{err?.DoctorID}</div>
                  )}
                </div>
                <div className="col-sm-2">
                  <div className="p-inputgroup flex-1">
                    <Input
                      id="SecondReferDoctor"
                      name="SecondReferDoctor"
                      lable="Second Ref. Doctor"
                      placeholder=" "
                      type="text"
                      value={formData?.SecondReferDoctor}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          SecondReferDoctor: e.target.value,
                        });
                        setSecondDropFalse(true);
                      }}
                      onBlur={(e) => {
                        autocompleteOnBlur(setseconddoctorSuggestion);
                        setTimeout(() => {
                          const data = seconddoctorSuggestion.filter(
                            (ele) => ele?.Name === e.target.value
                          );
                          if (data.length === 0) {
                            setFormData({
                              ...formData,
                              SecondReferDoctor: "",
                            });
                          }
                        }, 500);
                      }}
                      onKeyDown={handleIndex}
                    />
                    {secondDropFalse && seconddoctorSuggestion.length > 0 && (
                      <ul className="suggestion-data">
                        {seconddoctorSuggestion.map((data, index) => (
                          <li
                            onClick={() =>
                              handleListSearch(data, "SecondReferDoctor")
                            }
                            className={`${
                              index === indexMatch && "matchIndex"
                            }`}
                            key={index}
                          >
                            {data?.Name}
                          </li>
                        ))}
                      </ul>
                    )}
                    <Button icon="pi pi-plus" className="iconSize" />
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
                <div className="col-sm-1">
                  <button
                    className={`btn  btn-block btn-sm ${
                      Pndt?.PNDT ? " btn-success" : "btn-primary"
                    }`}
                    id="PNDT"
                    disabled={state?.Gender == "Female" ? false : true}
                    onClick={handlePNDT}
                  >
                    PNDT
                  </button>
                </div>
              </div>
              <div className="row">
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
                <div className="col-sm-3">
                  <div className="d-flex">
                    <div style={{ width: "40%" }}>
                      <SelectBox
                        name="PatientIDProof"
                        options={[
                          { label: "Choose ID", value: "" },
                          ...Identity,
                        ]}
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
                <div className="col-sm-2">
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
                <div className="col-sm-1">
                  <button
                    className="btn btn-primary btn-block btn-sm"
                    id="Remarks"
                    onClick={() => {
                      setShowRemark(true);
                    }}
                  >
                    Remarks
                  </button>
                </div>
              </div>
              <div className="row">
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
                <div className="col-sm-2">
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
                  <SelectBox
                    options={[{ label: "Select", value: "" }, ...proEmplyee]}
                    name="ProEmployee"
                    lable="Pro Employee"
                    selectedValue={state?.ProEmployee}
                    onChange={handleMainChange}
                    isDisabled={state?.ProEmployee != "" ? true : false}
                  />
                </div>
                <div className="col-sm-4">
                  <div className="d-flex">
                    <div style={{ width: "60%" }}>
                      <DatePicker
                        className="custom-calendar"
                        name="RegistrationDate"
                        value={LTData?.RegistrationDate}
                        placeholder=" "
                        id="RegistrationDate"
                        lable="Registration Date"
                        onChange={dateregselecect}
                      />
                    </div>
                    <div style={{ width: "40%" }}>
                      <div className="d-flex">
                        <Input
                          type="text"
                          placeholder=" "
                          lable="H"
                          id="H"
                          value={time?.Hour}
                          name="Hour"
                          onChange={handleTimeChange}
                        />
                        <Input
                          type="text"
                          value={time?.Minute}
                          name="Minute"
                          onChange={handleTimeChange}
                          lable="M"
                          id="M"
                          placeholder=" "
                        />
                        <Input
                          type="text"
                          value={time?.Second}
                          name="Second"
                          onChange={handleTimeChange}
                          lable="S"
                          id="S"
                          placeholder=" "
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>{" "}
              {Pndt?.PNDT && (
                <>
                  <div className="row">
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
                    <div className="col-md-2">
                      <DatePicker
                        name="Pregnancy"
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
                    <div className="col-md-2">
                      <Input
                        name="AgeOfSon"
                        lable="Age Of Son"
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
                    <div className="col-md-2">
                      <Input
                        className="form-control input-sm"
                        name="AgeOfDaughter"
                        type="number"
                        id="AgeOfDaughter"
                        lable="Age Of Daughter"
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
                  </div>{" "}
                </>
              )}
              <div className="row">
                {Pndt?.PNDT && (
                  <>
                    <div className="col-md-2">
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
                        <div className="error-message">
                          {errors?.PNDTDoctor}
                        </div>
                      )}
                    </div>
                    <div className="col-md-2">
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
                  </>
                )}
                {checkCovid() && (
                  <>
                    <div className="col-md-2 ">
                      <Input
                        id="SrfId"
                        placeholder=" "
                        name="SrfId"
                        lable="Srf Id"
                        type="text"
                        value={LTData?.SrfId}
                        onChange={handleSelectChange}
                      />
                    </div>

                    <div className="col-md-2 ">
                      <Input
                        id="IcmrId"
                        placeholder=" "
                        name="IcmrId"
                        lable="Icmr Id"
                        type="text"
                        value={LTData?.IcmrId}
                        onChange={handleSelectChange}
                      />
                    </div>
                  </>
                )}
                {visibleFields?.map(
                  (data, index) =>
                    data?.IsVisible == 1 && (
                      <>
                        <div
                          className="col-md-2"
                          style={{ marginBottom: "5px" }}
                          key={index}
                        >
                          {[
                            "PatientSource",
                            "PatientType",
                            "HLMPatientType",
                            "Source",
                          ].includes(data?.FieldType) ? (
                            <SelectBox
                              className={`${
                                data?.IsMandatory === 1 && "required"
                              }`}
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
                                  : data?.FieldType === "HLMPatientType"
                                  ? HLMPatientType
                                  : data?.FieldType === "Source"
                                  ? SourceType
                                  : []
                              }
                              id={data?.FieldType}
                              placeholder={data?.FieldType}
                              lable={data?.FieldType}
                              selectedValue={LTData[data?.FieldType]}
                              name={data?.FieldType}
                              onChange={handleSelectNew}
                            />
                          ) : (
                            <Input
                              className={`select-input-box form-control input-sm ${
                                data?.IsMandatory === 1 && "required"
                              }`}
                              max={30}
                              name={data?.FieldType}
                              id={data?.FieldType}
                              placeholder=" "
                              lable={data?.FieldType}
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
            <div className="patent-register-image">
              <Image
                src={MyImage}
                alt="Image"
                width="115"
                height="130"
                margin="0"
                padding="0"
                preview
              />
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
                <div className="col-sm-7">
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

              <Table paginate={false}>
                <thead>
                  <tr>
                    <th>{"S.No"}</th>
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
                      <img src={Urgent} title="Is Urgent"></img>
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
                            coupon={coupon}
                            member={throughMemberData}
                            handleFilter={handleFilter}
                            handleDiscount={handleDiscount}
                            handlePLOChange={handlePLOChange}
                            handleUrgent={handleUrgent}
                            handleRateTypePaymode={handleRateTypePaymode}
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
          <div className="">
            <div className="card">
              <div className="row">
                <div className="col-sm-3">
                  <Input
                    className="select-input-box form-control input-sm currency"
                    data-val="false"
                    placeholder=" "
                    lable=" Total Amount"
                    id="Total_Amount"
                    name="Total_Amount"
                    disabled={true}
                    value={Number(LTData?.NetAmount).toFixed(2)}
                    type="text"
                    readOnly="readonly"
                  />
                </div>
                <div className="col-sm-3">
                  <Input
                    className="select-input-box form-control input-sm currency"
                    id="Paid_Amount"
                    lable="Paid Amount"
                    placeholder=" "
                    name="Paid_Amount"
                    type="number"
                    value={Number(paid).toFixed(2)}
                    readOnly="readonly"
                  />
                </div>
                <div className="col-sm-3">
                  <Input
                    className="select-input-box form-control input-sm currency"
                    data-val="false"
                    placeholder=" "
                    id="DiscountAmt"
                    lable="Discount Amount"
                    disabled={
                      tableData?.length > 0
                        ? LTData?.DiscountId != ""
                          ? true
                          : handleRateTypePaymode === "Credit"
                          ? true
                          : LTData?.DiscountApprovedBy != ""
                          ? true
                          : false
                        : true
                    }
                    value={disAmt}
                    name="disAmt"
                    onChange={(e) => {
                      let match = Match();

                      if (coupon?.field == true) {
                        toast.error("Remove Coupon First");
                      } else {
                        if (discountPercentage === "" && !match) {
                          if (LTData?.GrossAmount < Number(e.target.value)) {
                            toast.error("please Enter Valid Discount");
                          } else {
                            const val = e.target.value;
                            const isValidInput =
                              /^\d+(\.\d{0,2})?$/.test(val) &&
                              parseFloat(val) >= 0 &&
                              parseFloat(val) <= 99999999999;
                            setdisAmt(
                              isValidInput || val === "" ? val : disAmt
                            );
                            setLTData({
                              ...LTData,
                              DiscountOnTotal:
                                isValidInput || val === ""
                                  ? val
                                  : LTData.DiscountOnTotal,
                            });

                            const findPercentageDiscount =
                              (val / LTData?.GrossAmount) * 100;

                            const data = PLO.map((ele, index) => {
                              const finalDiscountamont =
                                handleDiscountLastIndex(
                                  ele,
                                  index,
                                  findPercentageDiscount,
                                  val
                                );

                              return {
                                ...ele,
                                Amount:
                                  tableData?.length > 1
                                    ? ele.Rate - finalDiscountamont
                                    : ele?.Rate - val,
                                DiscountAmt:
                                  tableData?.length > 1
                                    ? finalDiscountamont
                                    : val,
                              };
                            });
                            setPLO(data);
                          }
                        } else {
                          toast.error("Discount already Given");
                        }
                      }
                    }}
                  />
                </div>
                <div className="col-sm-3">
                  <Input
                    className="select-input-box form-control input-sm currency"
                    id="DiscountPer"
                    lable="Discount Percentage"
                    value={discountPercentage}
                    name="DiscountPer"
                    disabled={
                      tableData?.length > 0
                        ? LTData?.DiscountId != ""
                          ? true
                          : handleRateTypePaymode === "Credit"
                          ? true
                          : LTData?.DiscountApprovedBy != ""
                          ? true
                          : false
                        : true
                    }
                    placeholder=" "
                    onChange={(e) => {
                      const val = e.target.value;
                      const isValidInput =
                        /^\d+(\.\d{0,2})?$/.test(val) &&
                        parseFloat(val) >= 0 &&
                        parseFloat(val) <= 100;
                      let match = Match();

                      if (coupon?.field == true) {
                        toast.error("Remove Coupon First");
                      } else {
                        if (disAmt === "" && !match) {
                          setDiscountPercentage(
                            isValidInput || val === ""
                              ? val
                              : discountPercentage
                          );
                        } else {
                          toast.error("Discount Already Given");
                        }
                      }
                    }}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-3">
                  <SelectBox
                    options={PaymentMode}
                    selectedValue={RcData[RcData.length - 1].PaymentModeID}
                    onChange={handlePaymentChange}
                    isDisabled={
                      tableData?.length > 0
                        ? handleRateTypePaymode === "Credit"
                          ? true
                          : false
                        : true
                    }
                  />
                </div>
                <div className="col-sm-3">
                  <SelectBox
                    options={DISCOUNT_TYPE}
                    selectedValue={LTData?.DiscountType}
                    onChange={handleSelectChange}
                    name={"DiscountType"}
                    isDisabled={
                      tableData?.length > 0 && !coupon.field ? false : true
                    }
                  />
                </div>
                <div className="col-sm-3">
                  {LTData?.DiscountType === 1 ? (
                    <SelectBox
                      options={BindDiscApproval}
                      name="DiscountApprovedBy"
                      selectedValue={LTData?.DiscountApprovedBy}
                      onChange={handleSelectChange}
                      isDisabled={
                        coupon?.field
                          ? true
                          : LTData?.DiscountId != ""
                          ? true
                          : LTData?.DiscountOnTotal === "" ||
                            LTData?.DiscountOnTotal == 0
                          ? true
                          : false
                      }
                    />
                  ) : (
                    AgeWiseDiscountDropdown.length > 0 && (
                      <SelectBox
                        options={AgeWiseDiscountDropdown}
                        selectedValue={LTData?.DiscountId}
                        name="DiscountId"
                        onChange={(e) => {
                          let match = Match();
                          if (disAmt === "" && !match) {
                            const data = AgeWiseDiscountDropdown.find(
                              (ele) => ele?.value == e.target.value
                            );

                            setDiscountPercentage(data?.perCentage);
                            setLTData({
                              ...LTData,
                              DiscountId: e.target.value,
                              DiscountApprovedBy: "",
                              DiscountReason: "",
                            });
                          } else {
                            toast.error("Discount Already Given");
                          }
                        }}
                      />
                    )
                  )}
                </div>
                <div className="col-sm-3">
                  {LTData?.DiscountId === "" ? (
                    <SelectBox
                      options={BindDiscReason}
                      name="DiscountReason"
                      selectedValue={LTData?.DiscountReason}
                      onChange={handleSelectChange}
                      isDisabled={
                        coupon?.field
                          ? true
                          : LTData?.DiscountId != ""
                          ? true
                          : LTData?.DiscountOnTotal === "" ||
                            LTData?.DiscountOnTotal == 0
                          ? true
                          : false
                      }
                    />
                  ) : (
                    <Input
                      name="DiscountReason"
                      lable="Discount Reason"
                      placeholder=" "
                      value={LTData?.DiscountReason}
                      onChange={handleSelectChange}
                    />
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-4">
                  <div className="d-flex">
                    <div style={{ width: "87%" }}>
                      <Input
                        id="CouponCode"
                        lable="Enter Your Coupon Code"
                        type="text"
                        value={coupon.code}
                        max={30}
                        placeholder={" "}
                        disabled={coupon.field}
                        onChange={(e) =>
                          setCoupon({
                            ...coupon,
                            code: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div style={{ width: "13%" }}>
                      <button
                        className="btn btn-primary btn-sm"
                        id="NewReferDoc"
                        type="button"
                        onClick={handleCouponDetailsModal}
                        style={{ borderRadius: "0px !important" }}
                      >
                        <i
                          className="fa fa-search coloricon"
                          style={{ cursor: "pointer" }}
                        ></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-sm-2">
                  {coupon?.load ? (
                    <Loading />
                  ) : (
                    <button
                      className="btn btn-success btn-block btn-sm"
                      onClick={handleCouponValidate}
                      disabled={coupon.field}
                    >
                      {"Validate"}
                    </button>
                  )}
                </div>
                <div className="col-sm-2">
                  <button
                    id="btndeleterow"
                    className="btn btn-danger btn-block btn-sm"
                    onClick={handleCouponCancel}
                  >
                    {"Cancel"}
                  </button>
                </div>
              </div>

              <Table paginate={false}>
                <thead className="cf">
                  <tr>
                    <th>{"Action"}</th>
                    <th>{"Mode"}</th>
                    <th>{"Paid Amount"}</th>
                    <th>{"Currency"}</th>
                    <th>{"Base"}</th>
                    <th>{"Bank Name"}</th>
                    <th>{"Cheque/Card No."}</th>
                    <th>{"Cheque Date/Trans No"}</th>
                  </tr>
                </thead>
                <tbody>
                  {RcData?.map((data, index) => (
                    <tr key={index}>
                      <td data-label={"Action"}>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleFilterPayment(index)}
                        >
                          X
                        </button>
                      </td>
                      <td data-label={"Mode"}>
                        <span id="SpanPaymentMode">
                          {data?.PaymentMode} &nbsp;
                        </span>
                      </td>
                      <td data-label={"Paid Amount"}>
                        {handleRateTypePaymode === "Credit" ? (
                          ""
                        ) : (
                          <Input
                            name="Amount"
                            value={data?.Amount}
                            placeholder={"0.00"}
                            type="number"
                            onChange={(e) => {
                              let sum = calculate(e.target.value, index);
                              if (
                                sum > LTData?.NetAmount ||
                                e.target.value > LTData?.NetAmount
                              ) {
                                toast.error("Please Enter Correct Amount");
                                const data = [...RcData];
                                data[index]["Amount"] = "";
                                calculate("", index);
                                setRcData(data);
                              } else {
                                const data = [...RcData];
                                data[index]["Amount"] = e.target.value;
                                setRcData(data);
                              }
                            }}
                          />
                        )}
                      </td>
                      <td data-label={"Currency"}>
                        <span id="SpanCurrency">{"INR"}</span>
                      </td>
                      <td data-label={"Base"}>
                        <span id="spnbaseAmount">{data?.Amount} &nbsp;</span>
                      </td>
                      <td data-label={"Bank Name"}>
                        {["Cash", "Online Payment", "Paytm"].includes(
                          data?.PaymentMode
                        ) ? (
                          ""
                        ) : (
                          <select
                            className="required"
                            name="BankName"
                            value={data?.BankName}
                            disabled={
                              handleRateTypePaymode === "Credit" ? true : false
                            }
                            onChange={(e) => handleChangeRTCData(e, index)}
                          >
                            <option hidden>--Select Bank --</option>
                            {BankName.map((ele, index) => (
                              <option value={ele.value} key={index}>
                                {ele.label}
                              </option>
                            ))}
                          </select>
                        )}
                        &nbsp;
                      </td>
                      <td data-label={"Cheque/Card No."}>
                        <Input
                          disabled={
                            ["Cash", "Online Payment", "Paytm"].includes(
                              data?.PaymentMode
                            )
                              ? true
                              : handleRateTypePaymode === "Credit"
                              ? true
                              : false
                          }
                          type="number"
                          id="CardNo"
                          onInput={(e) => number(e, 16)}
                          name="CardNo"
                          value={data?.CardNo}
                          onChange={(e) => handleChangeRTCData(e, index)}
                          className={`select-input-box form-control input-sm ${
                            ["Cash", "Online Payment", "Paytm"].includes(
                              data?.PaymentMode
                            )
                              ? ""
                              : "required"
                          }`}
                        />
                      </td>
                      <td data-label={"Cheque Date/Trans No"}>
                        <Input
                          disabled={
                            data?.PaymentMode !== "Cash"
                              ? handleRateTypePaymode === "Credit"
                                ? true
                                : false
                              : true
                          }
                          type={
                            ["Cash", "Online Payment", "Paytm"].includes(
                              data?.PaymentMode
                            )
                              ? "text"
                              : "date"
                          }
                          id="CardDate"
                          className={`select-input-box form-control input-sm ${
                            ["Cash", "Online Payment", "Paytm"].includes(
                              data?.PaymentMode
                            )
                              ? ""
                              : "required"
                          }`}
                          name="CardDate"
                          value={data?.CardDate}
                          onChange={(e) => handleChangeRTCData(e, index)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="row">
                <div className="col-md-2">
                  {(isSubmit?.isLoading && isSubmit?.type === "Success") ||
                  isRazorPayOpen ? (
                    <Loading />
                  ) : (
                    <button
                      type="submit"
                      id="btnSave"
                      disabled={handleLockRegistation}
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
                {state?.HideAmount != 1 && (
                  <div className="col-md-3">
                    <small>
                      {"Due Amount"} :{" "}
                      {Number(LTData?.NetAmount - paid).toFixed(2)}
                    </small>
                  </div>
                )}
                {state?.HideAmount != 1 && (
                  <div className="col-md-4">
                    <small>
                      {"Total Discount Amount"} :
                      {LTData?.DiscountOnTotal
                        ? parseFloat(LTData?.DiscountOnTotal).toFixed(2)
                        : " 0"}
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </PageHead>
    </>
  );
};

export default PatientRegistration;
