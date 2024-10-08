import PageHead from "../../components/CommonComponent/PageHead";
import React, { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import {
  checkDuplicateBarcode,
  getDoctorSuggestion,
  getPaymentModes,
  getRejectCount,
} from "../../utils/NetworkApi/commonApi";
import VIP from "../../assets/image/vip.gif";

import {
  AddBlankData,
  AllDataDropDownPayload,
  Time,
  autocompleteOnBlur,
  dateConfig,
  getTrimmedData,
  isChecked,
} from "../../utils/helpers";

import urgentGIF from "../../assets/image/Urgent.gif";
import { SampleStatusSearch, SearchBy } from "../../utils/Constants";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import Input from "../../components/CommonComponent/Input";
import { axiosInstance } from "../../utils/axiosInstance";
import DatePicker from "../../components/CommonComponent/DatePicker";
import CustomTimePicker from "../../components/CommonComponent/TimePicker";
import Table from "../../components/Table/Table";
import SampleCollectionTable from "../Table/SampleCollectionTable";
import Loading from "../../components/Loading/Loading";
import SampleRemark from "../utils/SampleRemark";
import CustomModal from "../utils/CustomModal";
import MedicialModal from "../utils/MedicialModal";
import UploadFile from "../utils/UploadFIleModal/UploadFile";
import Tooltip from "../../components/CommonComponent/Tooltip";
import NoRecordFound from "../../components/CommonComponent/NoRecordFound";
const SampleCollection = () => {
  const [CentreData, setCentreData] = useState([]);
  const [toggleTable, setToggleTable] = useState(true);
  const [DepartmentData, setDepartmentData] = useState([]);
  const [payload, setPayload] = useState([]);
  const [Identity, setIdentity] = useState([]);
  const [RateTypes, setRateTypes] = useState([]);
  const [scdata, setScData] = useState([]);
  const [searchInvdata, setSearchInvdata] = useState([]);
  const [newdata, setNewData] = useState([]);
  const [snr, setSnr] = useState([]);
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
  const [saveLoad, setSaveLoad] = useState(false);
  const [show, setShow] = useState({
    modal: false,
    data: "",
    index: -1,
  });
  const [showLog, setShowLog] = useState({
    modal: false,
    visitId: "",
  });
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
  });
  const location = useLocation();
  const { state } = location;
  const [local, setLocal] = useState(state?.other);
  const [showRemark, setShowRemark] = useState(false);
  const [showPrickRemark, setShowPrickRemark] = useState(false);

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

  // const handleToggle = (name) => {
  //   setToggleDate({ ...toggleDate, [name]: !toggleDate[name] });
  // };

  const dateSelect = (value, name) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    if (name == "CentreID") {
      setFormData({ ...formData, [name]: value, RateTypeID: "" });
      fetchRateTypes(
        [value],
        DepartmentData?.map((ele) => ele?.value)
      );
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({});
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
        const Centre = CentreDataValue?.map((ele) => ele?.value);
        getDepartment(Centre);
        setCentreData(CentreDataValue);
      })
      .catch((err) => {
        getDepartment([]);
      });
  };

  const handleTime = (time, name) => {
    setFormData({ ...formData, [name]: time });
  };

  const getDepartment = (Centre) => {
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
        const Dept = DeptDataValue?.map((ele) => ele?.value);
        setDepartmentData(DeptDataValue);
        fetchRateTypes(Centre, Dept);
      })
      .catch((err) => {});
  };

  const filterPayload = (filterData) => {
    const data = filterData.filter(
      (ele) =>
        ele.Status === 1 || (ele.Status === 4 && ele?.isSampleReCollection == 1)
    );
    return data;
  };
  const filterPayload2 = (filterData) => {
    const data = filterData.filter(
      (ele) =>
        ele.Status == 1 ||
        (ele.Status == 4 && ele?.isSampleReCollection == 1) ||
        ele.Status == 2
    );
    return data;
  };
  const handleCheckboxCondition = useCallback(
    (data) => {
      let status = false;
      for (let i = 0; i < data?.length; i++) {
        if ([1, 4, 2].includes(data[i]["Status"])) {
          status = true;
          break;
        }
      }
      return status;
    },
    [searchInvdata]
  );

  const getBarcodeData = (arr, VisitNo, SINNo) => {
    axiosInstance
      .post("SC/getBarcode", {
        LedgerTransactionNo: VisitNo,
        BarcodeNo: SINNo,
        TestID: arr,
      })
      .then((res) => {
        if (res?.data?.message != "") window.open(res?.data?.message);
        //toast.success(res.data.message);
      })
      .catch((err) => {
        if (err.response.status === 504) {
          toast.error(t("Something Went Wrong"));
        }
        if (err.response.status === 401) {
          toast.error(err.response.data.message);
        }
      });
  };

  const checkSampleTypeIdCheck = (payload) => {
    const hasInvalidSampleType = payload.some(
      (ele) => ele.SampleTypeID === 0 || ele.SampleTypeID === ""
    );

    return !hasInvalidSampleType;
  };

  const SaveSampleCollection = () => {
    const getBarcodeDate = getTrimmedData(filterPayload(payload));
    const testidArray =
      getBarcodeDate &&
      getBarcodeDate.map((ele) => {
        return ele?.TestID;
      });

    if (filterPayload(payload)?.length > 0) {
      setSaveLoad(true);
      axiosInstance
        .post("SC/SampleCollection", {
          data: getTrimmedData(filterPayload(payload)),
        })
        .then((res) => {
          setSaveLoad(false);
          toast.success(res.data.message);
          getBarcodeData(
            testidArray,
            getBarcodeDate[0]?.VisitNo,
            getBarcodeDate[0]?.SINNo
          );
          getRejectCount();
          setPayload([]);
          if (payload.length === searchInvdata.length) {
            TableData("");
          } else {
            // SearchInvestigationData(payload[0]?.LedgerTransactionID);
            TableData(document.getElementById("SampleStatusSearch").value);
          }
        })
        .catch((err) => {
          setSaveLoad(false);
          if (err.response.status === 504) {
            toast.error(t("Something Went Wrong"));
          }
          if (err.response.status === 401) {
            toast.error(err.response.data.message);
          }
        });
    } else {
      toast.error(
        "Please Select Atlease One Test Or For Collect Rejected test contact to admin"
      );
    }
  };

  const SaveSNR = () => {
    const getBarcodeDate = getTrimmedData(filterPayload2(payload));
    const testidArray =
      getBarcodeDate &&
      getBarcodeDate.map((ele) => {
        return ele?.TestID;
      });

    if (filterPayload2(payload)?.length > 0) {
      setSaveLoad(true);
      axiosInstance
        .post("SC/SampleSNR", {
          data: getTrimmedData(filterPayload2(payload)),
        })
        .then((res) => {
          setSaveLoad(false);
          toast.success(res.data.message);
          getBarcodeData(
            testidArray,
            getBarcodeDate[0]?.VisitNo,
            getBarcodeDate[0]?.SINNo
          );
          getRejectCount();
          setPayload([]);
          if (payload.length === searchInvdata.length) {
            TableData("");
          } else {
            // SearchInvestigationData(payload[0]?.LedgerTransactionID);
            TableData(document.getElementById("SampleStatusSearch").value);
          }
        })
        .catch((err) => {
          setSaveLoad(false);
          if (err.response.status === 504) {
            toast.error(t("Something Went Wrong"));
          }
          if (err.response.status === 401) {
            toast.error(err.response.data.message);
          }
        });
    } else {
      toast.error("Please Select atlease One Test to Continue");
    }
  };
  const TableData = (status, centre, Dep, Rate) => {
    const generatedError = validation();
    if (generatedError === "") {
      setLoading(true);
      axiosInstance
        .post(
          "SC/GetSampleCollection",
          getTrimmedData({
            CentreID:
              centre ??
              AllDataDropDownPayload(formData?.CentreID, CentreData, "value"),
            SelectTypes: formData.SelectTypes,
            ItemValue: formData.ItemValue.trim(),
            RateTypeID:
              Rate ??
              AllDataDropDownPayload(formData?.RateTypeID, RateTypes, "value"),
            DoctorReferal: formData.DoctorReferal,
            FromDate: moment(formData.FromDate).format("DD/MMM/YYYY"),
            ToDate: moment(formData.ToDate).format("DD/MMM/YYYY"),
            FromTime: Time(formData.FromTime),
            ToTime: Time(formData.ToTime),
            DepartmentID:
              Dep ??
              AllDataDropDownPayload(
                formData?.DepartmentID,
                DepartmentData,
                "value"
              ),
            SampleStatus: status,
          })
        )
        .then((res) => {
          setScData(res?.data?.message);
          setLoading(false);
          setToggleTable(true);
        })
        .catch((err) => setLoading(false));
      setErrors(generatedError);
    } else {
      setLoading(false);
      setErrors(generatedError);
    }
  };

  const SearchInvestigationData = (LedgerTransactionID) => {
    const generatedError = validation();
    axiosInstance
      .post("SC/SearchInvestigation", {
        LedgerTransactionID: LedgerTransactionID,
      })
      .then((res) => {
        const data = res?.data?.message;
        const val = data.map((ele, index) => {
          return {
            ...ele,
            index: index,
            isSelected: false,
            valQty: 1,
          };
        });
        setSearchInvdata(val);
        setNewData(
          res?.data?.message.some((x) => x.Status == "1" || x.Status == "4")
        );
        setSnr(
          res?.data?.message.some(
            (x) => x.Status == "1" || x.Status == "4" || x.Status == "2"
          )
        );
        setToggleTable(false);
        setLoading(false);
      })
      .catch((err) => setLoading(false));
    setErrors(generatedError);
  };

  const handlePayload = (e) => {
    const { checked } = e.target;
    let flag = 1;
    for (let i = 0; i < searchInvdata.length; i++) {
      if (
        ["", null].includes(searchInvdata[i].SINNo) ||
        searchInvdata[i]?.SINNo?.length < 3
      ) {
        flag = 0;
      }
      break;
    }
    if (checked) {
      if (flag) {
        const data = searchInvdata.map((ele) => {
          return {
            ...ele,
            isSelected: true,
          };
        });
        setSearchInvdata(data);
        setPayload(data);
      } else {
        toast.error(
          t("Barcode is Required Field and Should Contain atleast 3 character")
        );
      }
    } else {
      const data = searchInvdata.map((ele) => {
        return {
          ...ele,
          isSelected: false,
        };
      });
      setSearchInvdata(data);
      setPayload([]);
    }
  };

  const handleCloseBarcodeModal = (
    value,
    LedgerTransactionID,
    barcodeLogic,
    sampletypeId
  ) => {
    checkDuplicateBarcode(value, LedgerTransactionID).then((res) => {
      if (res === " " || res === "") {
      } else {
        if (barcodeLogic === 3) {
          const data = searchInvdata.map((ele) => {
            return {
              ...ele,
              SINNo: "",
            };
          });
          setSearchInvdata(data);
          toast.error(res);
        }

        if (barcodeLogic === 4) {
          const data = searchInvdata.map((ele) => {
            if (ele?.SampleTypeID === sampletypeId) {
              return {
                ...ele,
                SINNo: "",
              };
            } else {
              return ele;
            }
          });
          setSearchInvdata(data);
          toast.error(res);
        }
      }
    });
  };

  const handleBarcode = (e, barcodeLogic, sampletypeId) => {
    const { value } = e.target;
    if (barcodeLogic === 3) {
      const data = searchInvdata.map((ele) => {
        return {
          ...ele,
          SINNo: value,
        };
      });
      setSearchInvdata(data);
    }
    if (barcodeLogic === 4) {
      let flag = true;
      for (let i = 0; i < searchInvdata.length; i++) {
        if (
          searchInvdata[i]?.SampleTypeID !== sampletypeId &&
          value !== "" &&
          value === searchInvdata[i]?.SINNo
        ) {
          flag = false;
          break;
        }
      }
      if (flag) {
        const data = searchInvdata.map((ele) => {
          if (ele?.SampleTypeID === sampletypeId) {
            return {
              ...ele,
              SINNo: value,
            };
          } else {
            return ele;
          }
        });
        setSearchInvdata(data);
      } else {
        toast.error(t("This BarCode is Already Given"));
      }
    }
  };

  const handleUploadCount = (name, value, secondName) => {
    const data = searchInvdata?.map((ele) => {
      return {
        ...ele,
        [name]: value,
        [secondName]: value === 0 ? 0 : 1,
      };
    });
    setSearchInvdata(data);
  };

  const handleSearchByDropDown = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      ["SampleStatus"]: value,
    });
    TableData(value);
  };
  const fetchRateTypes = async (Center, Dept) => {
    try {
      const res = await axiosInstance.post("Centre/GetRateType", {
        CentreId: Center,
      });
      const list = res?.data?.message.map((item) => ({
        label: item?.RateTypeName,
        value: item?.RateTypeID,
      }));

      setRateTypes(list);
      const Rate = list?.map((ele) => ele?.value);
      if (local) {
        TableData("4", Center, Dept, Rate);
        setFormData({
          ...formData,
          ["SampleStatus"]: "4",
        });
        setLocal(false);
      }
    } catch (err) {
      if (local) {
        TableData("4", Center, Dept, []);
        setFormData({
          ...formData,
          ["SampleStatus"]: "4",
        });
      }
      console.log(err);
    }
  };

  useEffect(() => {
    getAccessCentres();
    getPaymentModes("Identity", setIdentity);
  }, []);

  const handleShowRemark = () => {
    setShowRemark(false);
  };
  const handleShowPrickRemarks = () => {
    setShowPrickRemark(false);
  };

  const handleValQty = (type, sinNo, active) => {
    const data = searchInvdata.map((ele) => {
      if (sinNo === ele?.SINNo) {
        if (type === "add") {
          return {
            ...ele,
            valQty: ele.valQty + 1,
          };
        } else if (type === "sub" && ele?.valQty > 0) {
          return {
            ...ele,
            valQty: ele.valQty - 1,
          };
        } else {
          return ele;
        }
      } else {
        return ele;
      }
    });
    setSearchInvdata(data);
  };
  return (
    <>
      {showLog?.modal && (
        <CustomModal
          show={showLog?.modal}
          visitID={showLog?.visitId}
          onHide={() =>
            setShowLog({
              modal: false,
              visitId: "",
            })
          }
        />
      )}
      {show?.modal && (
        <UploadFile
          handleClose={() => {
            setShow({ modal: false, data: "", index: -1 });
          }}
          options={Identity}
          documentId={show?.data}
          pageName="Patient Registration"
          handleUploadCount={handleUploadCount}
        />
      )}
      <PageHead name="Sample Collection" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <div className="d-flex" style={{ display: "flex" }}>
                <div style={{ width: "50%" }}>
                  <SelectBox
                    options={SearchBy}
                    selectedValue={formData?.SelectTypes}
                    name="SelectTypes"
                    id="SelectTypes"
                    lable="SelectTypes"
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
                        value={formData?.ItemValue}
                        onChange={handleChange}
                        onInput={(e) => number(e, 10)}
                      />
                      {errors?.ItemValue && (
                        <div className="error-message">{errors?.ItemValue}</div>
                      )}
                    </div>
                  ) : (
                    <div style={{ width: "100%" }}>
                      <Input
                        className="select-input-box form-control input-sm"
                        type="text"
                        name="ItemValue"
                        max={20}
                        value={formData?.ItemValue}
                        onChange={handleChange}
                      />
                      {errors?.ItemValue && (
                        <div className="error-message">{errors?.ItemValue}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-sm-2">
              <SelectBox
                options={AddBlankData(CentreData, "All Center")}
                lable="Centre"
                id="Centre"
                selectedValue={formData?.CentreID}
                name="CentreID"
                onChange={handleSelectChange}
              />
            </div>

            <div className="col-sm-2">
              <SelectBox
                lable="RateType"
                id="RateType"
                options={AddBlankData(RateTypes, "All RateType")}
                selectedValue={formData?.RateTypeID}
                name="RateTypeID"
                onChange={handleSelectChange}
              />
            </div>
            <div className="col-sm-2  ">
              <SelectBox
                lable="Department"
                id="Department"
                options={AddBlankData(DepartmentData, "All Department")}
                selectedValue={formData.DepartmentID}
                name="DepartmentID"
                onChange={handleSelectChange}
              />
            </div>
            <div className="col-sm-2 ">
              <Input
                type="text"
                name="DoctorName"
                lable="DoctorName"
                id="DoctorName"
                value={formData?.DoctorName}
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
                  style={{ top: "27px", width: "100%" }}
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
              <SelectBox
                options={SampleStatusSearch}
                className="input-sm"
                lable="SampleStatusSearch"
                name="SelectTypes"
                id="SampleStatusSearch"
                selectedValue={formData?.SampleStatus}
                onChange={handleSearchByDropDown}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-2">
              <DatePicker
                className="custom-calendar"
                name="FromDate"
                value={formData?.FromDate}
                placeholder=" "
                id="FromDate"
                lable="FromDate"
                onChange={dateSelect}
                maxDate={new Date(formData.ToDate)}
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
                placeholder=" "
                id="ToDate"
                lable="ToDate"
                onChange={dateSelect}
                maxDate={new Date()}
                minDate={new Date(formData.FromDate)}
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
            <div className="col-sm-1">
              {loading ? (
                <Loading />
              ) : (
                <button
                  type="button"
                  className="btn btn-block btn-info btn-sm"
                  onClick={() =>
                    TableData(
                      document.getElementById("SampleStatusSearch").value
                    )
                  }
                >
                  {"Search"}
                </button>
              )}
            </div>{" "}
          </div>
        </div>
      </PageHead>
      <div className="card mt-2">
        {loading ? (
          <Loading />
        ) : toggleTable ? (
          <>
            {scdata.length > 0 ? (
              <Table paginate={true} data={scdata ?? []} itemsPerPage={10}>
                {({ currentItems, finalIndex }) => {
                  return (
                    <>
                      <thead className="cf">
                        <tr>
                          <th>{"S.No"}</th>
                          <th>{"Sin No"}</th>
                          <th>{"RegDate"}</th>
                          <th>{"VisitNo"}</th>
                          <th>{"UHID"}</th>
                          <th>{"Name"} </th>
                          <th>{"Remarks"} </th>
                          <th className="text-center">
                            <i title="Barcode" class="fa fa-barcode"></i>{" "}
                          </th>
                          <th>{"Age"}</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems &&
                          currentItems?.map((data, index) => (
                            <tr key={index}>
                              <td data-title={"S.No"}>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-around",
                                    margin: "0",
                                  }}
                                >
                                  {index + finalIndex}

                                  {data?.isUrgent === 1 && (
                                    <div>
                                      <img src={urgentGIF}></img>
                                    </div>
                                  )}

                                  {data?.IsVip === 1 && (
                                    <div>
                                      <img src={VIP}></img>
                                    </div>
                                  )}
                                </div>
                              </td>

                              <td data-title={"Sin No"}>{data?.SinNo}&nbsp;</td>
                              <td data-title={"Date"}>
                                {dateConfig(data.Date)}&nbsp;
                              </td>
                              <td
                                className={`color-Status-${data.Status} `}
                                onClick={() =>
                                  SearchInvestigationData(
                                    data.LedgerTransactionID
                                  )
                                }
                                data-title={"Status"}
                                style={{
                                  cursor: "pointer",
                                  color: "black !important",
                                }}
                              >
                                {data?.VisitNo}&nbsp;
                              </td>
                              <td data-title={"PatientCode"}>
                                {data?.PatientCode}&nbsp;
                              </td>

                              <td data-title={"PName"}>
                                {data?.PName}
                                &nbsp;
                              </td>

                              <td data-title={"Remarks"}>
                                {data?.Remarks}&nbsp;
                              </td>
                              <td
                                data-title={"Barcode Print"}
                                className="text-center"
                              >
                                <div
                                  className="text"
                                  style={{ cursor: "pointer" }}
                                >
                                  {data?.Status == 2 || data?.Status == 3 ? (
                                    <i
                                      className="fa fa-print"
                                      onClick={() => {
                                        getBarcodeData(
                                          data?.TestID,
                                          data?.VisitNo,
                                          data?.SinNo
                                        );
                                      }}
                                    ></i>
                                  ) : null}
                                </div>
                                &nbsp;
                              </td>
                              <td data-title={"Gender"}>
                                {data?.Age}/{data?.Gender}&nbsp;
                              </td>
                              <td className="text-center">
                                <i
                                  className="fa fa-search"
                                  style={{
                                    cursor: "pointer",
                                    color: "red",
                                  }}
                                  onClick={() => {
                                    setShowLog({
                                      modal: true,
                                      visitId: data?.VisitNo,
                                    });
                                  }}
                                />
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </>
                  );
                }}
              </Table>
            ) : (
              <NoRecordFound />
            )}
          </>
        ) : (
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
            {showRemark && (
              <SampleRemark
                show={showRemark}
                handleShow={handleShowRemark}
                state={handleShowRemark}
                PageName={searchInvdata[0]?.Remarks}
                handleSave={handleShowRemark}
                title={"Remarks"}
              />
            )}
            {showPrickRemark && (
              <SampleRemark
                show={showPrickRemark}
                handleShow={handleShowPrickRemarks}
                state={handleShowPrickRemarks}
                PageName={searchInvdata[0]?.PricksRemarks}
                handleSave={handleShowRemark}
                title={"PricksRemarks"}
              />
            )}
            <div className="custom-box-body mb-3">
              <div className="custom-row">
                <div className="custom-col custom-col-visit">
                  <span className="fa fa-folder custom-text">
                    &nbsp; <span> {searchInvdata[0]?.VisitNo}</span>
                  </span>
                  {searchInvdata.filter((item) => item.StatSample == 1).length >
                  0 ? (
                    <span
                      className="fa fa-cog fa-spin"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="STATSample"
                      style={{ marginLeft: "4px" }}
                    ></span>
                  ) : (
                    <></>
                  )}
                </div>

                <div className="custom-col">
                  <span className="fa fa-user custom-text">
                    &nbsp; <span>{searchInvdata[0]?.PName}</span>
                  </span>
                </div>

                <div className="custom-col">
                  <span className="fa fa-book custom-text">
                    &nbsp;<span>{searchInvdata[0]?.PatientCode}</span>
                  </span>
                </div>

                <div className="custom-col custom-col-age-gender">
                  <span className="fa fa-calendar-check-o custom-text">
                    &nbsp;<span> {searchInvdata[0]?.Age}</span>
                  </span>
                  <span className="fa fa-street-view custom-text">
                    &nbsp; <span> {searchInvdata[0]?.Gender}</span>
                  </span>
                </div>

                <div className="custom-col justify-content-center">
                  <span className="fa fa-h-square custom-text">
                    &nbsp; <span>{searchInvdata[0]?.Centre}</span>
                  </span>
                </div>

                <div className="custom-col">
                  <span className="fa fa-user-md custom-text">
                    &nbsp; <span> {searchInvdata[0]?.Referdoctor}</span>
                  </span>
                </div>

                <div className="custom-col">
                  <span className="fa fa-plus-square custom-text">
                    &nbsp;<span> {searchInvdata[0]?.RateType} </span>
                  </span>
                </div>

                <div className="custom-col custom-col-regdate">
                  <span className="fa fa-calendar custom-text">
                    &nbsp; <span> {dateConfig(searchInvdata[0]?.RegDate)}</span>
                  </span>
                </div>

                <div className="custom-col custom-end">
                  <Tooltip label={"Uploaded Document"} className={"d-flex"}>
                    <span
                      className="fa fa-cloud-upload custom-text"
                      onClick={() => {
                        setShow({
                          modal: true,
                          data: searchInvdata[0]?.PatientGuid,
                        });
                      }}
                      style={{
                        color:
                          searchInvdata[0]?.UploadDocumentCount > 0
                            ? "#4ea30c"
                            : "black !important",
                        marginRight: "10px",
                        cursor: "pointer",
                      }}
                    >
                      &nbsp;<span>{searchInvdata[0]?.UploadDocumentCount}</span>
                    </span>
                  </Tooltip>
                  <Tooltip label={"Medical History"} className={"d-flex"}>
                    <span
                      className="fa fa-history custom-text"
                      onClick={() => {
                        setShow4({
                          modal: true,
                          data: searchInvdata[0]?.PatientGuid,
                        });
                      }}
                      style={{
                        color:
                          searchInvdata[0]?.MedicalHistoryCount > 0
                            ? "#4ea30c"
                            : "black !important",
                        marginRight: "10px",
                        cursor: "pointer",
                      }}
                    >
                      &nbsp;<span>{searchInvdata[0]?.MedicalHistoryCount}</span>
                    </span>
                  </Tooltip>
                  <Tooltip label={"Remark"}>
                    <span
                      className="fa fa-comment custom-icon-large"
                      onClick={() => setShowRemark(true)}
                      style={{ marginRight: "10px" }}
                    ></span>
                  </Tooltip>
                  <Tooltip label={"Pricks Remark"}>
                    <span
                      className="fa fa-eyedropper custom-icon-large"
                      onClick={() => setShowPrickRemark(true)}
                    ></span>{" "}
                  </Tooltip>
                </div>
              </div>
            </div>
            <div>
              {}
              {searchInvdata.length > 0 ? (
                <div
                  className="box-body divResult boottable table-responsive"
                  id="no-more-tables"
                >
                  <Table>
                    <thead>
                      <tr>
                        <th>{"S.No"}</th>
                        <th>{"Test"}</th>
                        <th>{"Sin No"}</th>
                        <th>{"Barcode"} </th>
                        <th>{"Source"}</th>
                        <th>{"DOS"}</th>
                        <th>{"Vial Qty"}</th>
                        <th>{"No Of Pricks"}</th>
                        <th>{"Prick Remarks"}</th>
                        <th>{"SampleTypeName"}</th>
                        <th>{"Reject"}</th>
                        <th className="text-center">
                          {handleCheckboxCondition(searchInvdata) && (
                            <input
                              type="checkbox"
                              onChange={(e) => {
                                setTimeout(handlePayload(e), 500);
                              }}
                              checked={
                                searchInvdata.length > 0
                                  ? isChecked(
                                      "isSelected",
                                      searchInvdata,
                                      true
                                    ).includes(false)
                                    ? false
                                    : true
                                  : false
                              }
                            />
                          )}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchInvdata?.map((data, index) => (
                        <tr
                          key={index}
                          style={{
                            backgroundColor:
                              data?.isOutSource == 1 ? "pink" : "",
                          }}
                        >
                          <SampleCollectionTable
                            data={data}
                            index={index}
                            payload={payload}
                            setPayload={setPayload}
                            setSearchInvdata={setSearchInvdata}
                            searchInvdata={searchInvdata}
                            TableData={TableData}
                            handleBarcode={handleBarcode}
                            handleCloseBarcodeModal={handleCloseBarcodeModal}
                            handleValQty={handleValQty}
                            snr={snr}
                          />
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                "No Data Found"
              )}
              {saveLoad ? (
                <Loading />
              ) : (
                <div className="row mt-3">
                  <div className="d-flex col-md-3 ms-auto">
                    <button
                      className="btn btn-info btn-sm mx-2"
                      onClick={() => {
                        setToggleTable(true);
                      }}
                    >
                      Main List
                    </button>
                    &nbsp;
                    {newdata && (
                      <button
                        className="btn btn-info btn-sm mx-2"
                        onClick={() => {
                          SaveSampleCollection();
                        }}
                      >
                        {"Collect"}
                      </button>
                    )}
                    &nbsp;
                    {snr && (
                      <button
                        className="btn btn-danger btn-sm mx-2"
                        onClick={() => {
                          SaveSNR();
                        }}
                      >
                        {"SNR"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SampleCollection;
