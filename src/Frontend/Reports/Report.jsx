import React, { useEffect, useState } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import DatePicker from "../../components/CommonComponent/DatePicker";
import Input from "../../components/CommonComponent/Input";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import Loading from "../../components/Loading/Loading";
import PageHead from "../../components/CommonComponent/PageHead";
import { useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { axiosInstance, axiosReport } from "../../utils/axiosInstance";

const DocumentType = [
  {
    label: "Select Document Type",
    value: "",
  },
  {
    label: "PDF",
    value: 2,
  },
  {
    label: "Excel",
    value: 1,
  },
];

const SearchByDate = [
  {
    label: "Select Document Type",
    value: "",
  },
  {
    label: "Registeration Date",
    value: "RegisterationDate",
  },
  {
    label: "Sample Collection Date",
    value: "SampleCollectionDate",
  },
  {
    label: "Sample Receiving Date ",
    value: "SampleReceivingDate",
  },
  {
    label: "Approved Date",
    value: "ApprovedDate",
  },
  {
    label: "Sample Rejection Date",
    value: "SampleRejectionDate",
  },
];

function GetReport() {
  const { t } = useTranslation();
  const location = useLocation();
  const { id } = useParams();
  const [load, setLoad] = useState(true);
  const [CentreData, setCentreData] = useState([]);
  const [Department, setDepartment] = useState([]);
  const [DoctorName, setDoctorAdmin] = useState([]);
  const [EmployeeName, setEmployeeName] = useState([]);
  const [mapTest, setMapTest] = useState([]);
  const [rateType, setRateType] = useState([]);
  const [reportType, setReportType] = useState("0");
  const [FieldShow, setFieldShow] = useState({});
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [proEmployee, setProEmployee] = useState([]);
  const [PatientSource, setPatientSource] = useState([]);

  const handleRadioChange = (e) => {
    setReportType(e.target.value);
  };
  const currentPathname = window.location.pathname;

  const [formData, setFormData] = useState({
    Centre: "",
    FromDate: new Date(),
    FromTime: "00:00:00",
    ToDate: new Date(),
    ToTime: "",
    DocumentType: 2,
    // new
    User: "",
    RateType: "",
    Department: "",
    ReportType: "",
    InvestigationId: [],
    PatientType: "",
    Doctor: "",
    DateType: "",
    Urgent: "",
    Status: "",
    PatientName: "",
    VisitNo: "",
    DiscountApprovalUser: [],
    Barcodeno: "",
    ChkisUrgent: 0,
    chkTATDelay: 0,
    SearchByDate: "",
    ProEmployee: "",
    LabNo: "",
    ProReportType: "Summary",
    Source: "",
  });

  const handleSelectChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
    if (name === "Centre") getAccessDataRate(setRateType, value.toString());
  };

  const dateSelect = (date, name) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  const handleTime = (time, secondName) => {
    let TimeStamp = "";
    TimeStamp = time?.Hour + ":" + time?.Minute + ":" + time?.second;

    setFormData({ ...formData, [secondName]: TimeStamp });
  };

  const getDepartmentReports = (state) => {
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
        state(DeptDataValue);
      })
      .catch((err) => console.log(err));
  };
  const getInvestigationList = () => {
    axiosInstance
      .get("Investigations/BindInvestigationList")
      .then((res) => {
        let data = res.data.message;
        let MapTest = data.map((ele) => {
          return {
            value: ele.InvestigationID,
            label: ele.TestName,
          };
        });
        setMapTest(MapTest);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getInvestigationList();
  }, []);

  const bindApiResponseAccording = (data) => {
    const {
      Centre,
      User,
      RateType,
      Department,
      DiscountApproval,
      DiscountApprovalUser,
      ReportType,
      Test,
      PatientType,
      Doctor,
      DateType,
      Urgent,
      Status,
      MultipleCentre,
      MultipleRateType,
      MultipleDepartment,
      MultipleUser,
      MultipleReportType,
      MultipleDoctor,
      MultipleStatus,
      MultiplePatientType,
      MultipleDateType,
      MultipleTest,
      Barcodeno,
      ChkisUrgent,
      chkTATDelay,
      SearchByDate,
      AsOnNowOutstanding,
      DateWiseOutstanding,
      ProEmployee,
      Source,
    } = data;
    if (Centre || MultipleCentre) {
      getAccessCentresReports(setCentreData);
    }
    if (Department || MultipleDepartment) {
      getDepartmentReports(setDepartment);
    }
    if (User || MultipleUser || DiscountApprovalUser) {
      BindEmployeeReports(setEmployeeName);
    }

    if (Doctor || MultipleDoctor) {
      BindApprovalDoctorReports(setDoctorAdmin);
    }
    if (RateType || MultipleRateType) {
      getAccessDataRate(setRateType, formData?.Centre.toString()).then(
        (res) => {
          console.log(res);
        }
      );
    }
    if (ProEmployee) {
      BindProEmployee(setProEmployee);
    }
    if (Source) {
      getPaymentModes("Source", setPatientSource);
    }
  };

  const getPatientInfoReport = () => {
    setLoadingSearch(true);
    axiosReport
      .post(
        `commonReports/${id}`,
        {
          ...formData,
          ToDate: moment(formData?.ToDate).format("DD-MMM-YYYY"),
          FromDate: moment(formData?.FromDate).format("DD-MMM-YYYY"),
          DocumentType: Number(formData?.DocumentType),
          ReportType: reportType,
          ledgertransactionid: "",
        },
        formData?.DocumentType == 1 && { method: "GET", responseType: "blob" }
      )
      .then((res) => {
        setLoadingSearch(false);

        if (formData?.DocumentType == 1) {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${id}.xlsx`);
          document.body.appendChild(link);
          link.click();
        }
        if (formData?.DocumentType == 2) {
          window.open(res?.data?.Url, "_blank");
        }
      })
      .catch((err) => {
        setLoadingSearch(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
      });
  };

  const getPatientInfoField = (id) => {
    setLoad(true);
    axiosReport
      .get(`commonReports/getFields/${id}`)
      .then((res) => {
        setLoad(false);
        bindApiResponseAccording(res?.data?.message);
        setFieldShow({
          ...res?.data?.message,
          AsOnNowOutstanding: id == "OutStandingReport" ? true : false,
          DateWiseOutstanding: id == "OutStandingReport" ? true : false,
        });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const handleSelectMultiChange = (select, name) => {
    const val = select?.map((ele) => ele?.value);
    setFormData({ ...formData, [name]: val });
    if (name === "Centre") getAccessDataRate(setRateType, val.toString());
  };

  useEffect(() => {
    setFormData({
      Centre: "",
      FromDate: new Date(),
      FromTime: "00:00:00",
      ToDate: new Date(),
      ToTime: "",
      DocumentType: 2,
      User: "",
      RateType: "",
      Department: "",
      ReportType: "",
      Test: "",
      InvestigationId: [],
      PatientType: "",
      Doctor: "",
      DateType: "",
      Urgent: "",
      Status: "",
      PatientName: "",
      VisitNo: "",
      InvestigationId: [],
      DiscountApprovalUser: [],
      Barcodeno: "",
      ChkisUrgent: 0,
      chkTATDelay: 0,
      SearchByDate: "",
      ProEmployee: "",
      ProReportType: "Summary",
      LabNo: "",
      Source: "",
    });
    getPatientInfoField(id);
  }, [location?.pathname]);

  console.log("formData?.ProEmployee", formData?.ProEmployee);
  return (
    <>
      {load ? (
        <Loading />
      ) : (
        <>
          <PageHead
            title={t("Get Reports for ")}
            {...location.pathname
              .split("/")
              .slice(-1)[0]
              .replace(/([a-z])([A-Z])/g, "$1 $2")}
          ></PageHead>
          <div className="card">
            <div className="row">
              {FieldShow?.Centre && (
                <div className="col-sm-2">
                  <label>
                    <small>{t("Select Centre")}</small>
                  </label>
                  <SelectBox
                    options={[
                      { label: "Select Center", value: "" },
                      ...CentreData,
                    ]}
                    selectedValue={formData?.Centre}
                    name="Centre"
                    onChange={handleSelectChange}
                  />
                </div>
              )}

              {FieldShow?.MultipleCentre && (
                <div className="col-sm-2">
                  <label>
                    <small>{t("Select Centre")}</small>
                  </label>
                  <SelectBoxWithCheckbox
                    options={CentreData}
                    value={formData?.Centre}
                    name="Centre"
                    onChange={handleSelectMultiChange}
                  />
                </div>
              )}

              {FieldShow?.RateType && (
                <div className="col-sm-2">
                  <label>
                    <small>{t("Select Rate")}</small>
                  </label>
                  <SelectBox
                    options={[
                      { label: "Select Rate Type", value: "" },
                      ...rateType,
                    ]}
                    selectedValue={formData?.RateType}
                    name="RateType"
                    onChange={handleSelectChange}
                  />
                </div>
              )}

              {FieldShow?.MultipleRateType && (
                <div className="col-sm-2">
                  <label>
                    <small>{t("Select Rate")}</small>
                  </label>
                  <SelectBoxWithCheckbox
                    options={rateType}
                    value={formData?.RateType}
                    name="RateType"
                    onChange={handleSelectMultiChange}
                  />
                </div>
              )}

              {FieldShow?.Department && (
                <div className="col-sm-2 ">
                  <label>
                    <small>{t("Select Department")}</small>
                  </label>
                  <SelectBox
                    options={[
                      { label: "Select Department", value: "" },
                      ...Department,
                    ]}
                    selectedValue={formData.Department}
                    name="Department"
                    onChange={handleSelectChange}
                  />
                </div>
              )}

              {FieldShow?.Source && (
                <div className="col-sm-2 ">
                  <label>
                    <small>{t("Select Source")}</small>
                  </label>
                  <SelectBox
                    options={[
                      { label: "Select Source", value: "" },
                      ...PatientSource,
                    ]}
                    selectedValue={formData.Source}
                    name="Source"
                    onChange={handleSelectChange}
                  />
                </div>
              )}

              {FieldShow?.MultipleDepartment && (
                <div className="col-sm-2">
                  <label>
                    <small>{t("Select Department")}</small>
                  </label>
                  <SelectBoxWithCheckbox
                    options={Department}
                    value={formData?.Department}
                    name="Department"
                    onChange={handleSelectMultiChange}
                  />
                </div>
              )}

              {FieldShow?.SearchByDate && (
                <div className="col-sm-2 ">
                  <label>
                    <small>{t("Search By Date")}</small>
                  </label>
                  <SelectBox
                    options={SearchByDate}
                    selectedValue={formData.SearchByDate}
                    name="SearchByDate"
                    onChange={handleSelectChange}
                  />
                </div>
              )}

              {FieldShow?.FromDate && (
                <div className="col-sm-2">
                  <label>
                    <small>{t("FromDate")}:</small>
                  </label>
                  <DatePicker
                    name="FromDate"
                    date={formData?.FromDate}
                    onChange={dateSelect}
                    onChangeTime={handleTime}
                    secondName={FieldShow?.FromTime && "FromTime"}
                    maxDate={new Date()}
                  />
                </div>
              )}

              {FieldShow?.ToDate && (
                <div className="col-sm-2 ">
                  <label>
                    <small>{t("ToDate")}:</small>
                  </label>
                  <DatePicker
                    name="ToDate"
                    date={formData?.ToDate}
                    onChange={dateSelect}
                    onChangeTime={handleTime}
                    secondName={FieldShow?.ToTime && "ToTime"}
                    maxDate={new Date()}
                    minDate={new Date(formData.FromDate)}
                  />
                </div>
              )}

              {FieldShow?.DataType && (
                <div className="col-sm-2 ">
                  <label>
                    <small>{t("select DateType")}</small>
                  </label>
                  <SelectBox
                    options={[
                      { label: "DateType", value: "" },
                      ...DateTypeSearch,
                    ]}
                    formdata={formData?.DateType}
                    name="DateType"
                    onChange={handleSelectChange}
                  />
                </div>
              )}

              {FieldShow?.User && (
                <div className="col-sm-2 ">
                  <label>
                    <small>{t("Select Employee")}</small>
                  </label>
                  <SelectBox
                    options={[
                      { label: "Select Employee", value: "" },
                      ...EmployeeName,
                    ]}
                    formdata={formData?.User}
                    name="User"
                    onChange={handleSelectChange}
                  />
                </div>
              )}

              {FieldShow?.PatientName && (
                <div className="col-sm-2 ">
                  <label>
                    <small>{t("Patient Name")}</small>
                  </label>
                  <Input
                    className="form-control input-sm"
                    name="PatientName"
                    onChange={handleSelectChange}
                    value={formData?.PatientName}
                  />
                </div>
              )}
              {FieldShow?.VisitNo && (
                <div className="col-sm-2 ">
                  <label>
                    <small>{t("Visit No")}</small>
                  </label>
                  <Input
                    className="form-control input-sm"
                    name="VisitNo"
                    onChange={handleSelectChange}
                    value={formData?.VisitNo}
                  />
                </div>
              )}
              {FieldShow?.MultipleUser && (
                <div className="col-sm-2 ">
                  <label>
                    <small>{t("Select Employee")}</small>
                  </label>
                  <SelectBoxWithCheckbox
                    options={EmployeeName}
                    value={formData?.User}
                    name="User"
                    onChange={handleSelectMultiChange}
                  />
                </div>
              )}

              {FieldShow?.Doctor && (
                <div className="col-sm-2 ">
                  <label>
                    <small>{t("Select Doctor")}</small>
                  </label>
                  <SelectBox
                    options={[
                      { label: "Select Doctor", value: "" },
                      ...DoctorName,
                    ]}
                    formdata={formData?.Doctor}
                    name="Doctor"
                    onChange={handleSelectChange}
                  />
                </div>
              )}

              {FieldShow?.MultipleDoctor && (
                <div className="col-sm-2 ">
                  <label>
                    <small>{t("Select Doctor")}</small>
                  </label>
                  <SelectBoxWithCheckbox
                    options={[{ label: "Self", value: 1 }, ...DoctorName]}
                    value={formData?.Doctor}
                    name="Doctor"
                    onChange={handleSelectMultiChange}
                  />
                </div>
              )}

              {FieldShow?.MultipleTest && (
                <div className="col-sm-2">
                  <label>
                    <small>{t("Test")}</small>
                  </label>
                  <SelectBoxWithCheckbox
                    options={mapTest}
                    value={formData?.Test}
                    name="InvestigationId"
                    onChange={handleSelectMultiChange}
                  />
                </div>
              )}

              {FieldShow?.Status && (
                <div className="col-sm-2">
                  <label>
                    <small>{t("Status")}</small>
                  </label>
                  <SelectBox
                    options={workSheetSampleStatus}
                    selectedValue={formData.Status}
                    name="Status"
                    onChange={handleSelectChange}
                  />
                </div>
              )}

              {FieldShow?.DiscountApprovalUser && (
                <div className="col-sm-2">
                  <label>
                    <small>{t("DiscountApprovalUser")}</small>
                  </label>
                  <SelectBoxWithCheckbox
                    options={[...EmployeeName]}
                    value={formData.DiscountApprovalUser}
                    name="DiscountApprovalUser"
                    onChange={handleSelectMultiChange}
                  />
                </div>
              )}

              {FieldShow?.Barcodeno && (
                <div className="col-sm-2 ">
                  <label>
                    <small>{t("Barcode No")}</small>
                  </label>
                  <Input
                    className="form-control input-sm"
                    name="Barcodeno"
                    onChange={handleSelectChange}
                    value={formData?.Barcodeno}
                  />
                </div>
              )}
              {FieldShow?.LabNo && (
                <div className="col-sm-2 ">
                  <label>
                    <small>{t("Lab No")}</small>
                  </label>
                  <Input
                    className="form-control input-sm"
                    name="LabNo"
                    onChange={handleSelectChange}
                    value={formData?.LabNo}
                  />
                </div>
              )}
              {FieldShow?.ProEmployee && (
                <div className="col-sm-2">
                  <label>
                    <small>{t("Select ProEmployee")}</small>
                  </label>
                  <SelectBoxWithCheckbox
                    options={proEmployee}
                    value={formData?.ProEmployee}
                    name="ProEmployee"
                    onChange={handleSelectMultiChange}
                  />
                </div>
              )}
              <div className="col-sm-2 ">
                <label>
                  <small>{t("Select DocumentType")}</small>
                </label>
                <SelectBox
                  options={DocumentType}
                  selectedValue={formData.DocumentType}
                  name="DocumentType"
                  onChange={handleSelectChange}
                />
              </div>

              {FieldShow?.Urgent && (
                <div
                  className="col-sm-2 d-flex"
                  style={{
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <label>
                    <small>{t("Urgent")}</small>
                  </label>
                  <Input
                    type="checkbox"
                    name="Urgent"
                    value={formData?.Urgent}
                    onChange={handleSelectChange}
                  />
                </div>
              )}
              {FieldShow?.ChkisUrgent && (
                <div
                  className="col-sm-2 d-flex"
                  style={{
                    justifyContent: "space-around",
                    alignItems: "center",
                    alignContent: "center",
                  }}
                >
                  <label>
                    <small>{t("Check Is Urgent")}</small>
                  </label>
                  <Input
                    type="checkbox"
                    name="ChkisUrgent"
                    value={formData?.ChkisUrgent}
                    onChange={handleSelectChange}
                  />
                </div>
              )}
              {FieldShow?.chkTATDelay && (
                <div
                  className="col-sm-2 d-flex"
                  style={{
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <label>
                    <small>{t("Check TAT Delay")}</small>
                  </label>
                  <Input
                    type="checkbox"
                    name="chkTATDelay"
                    value={formData?.chkTATDelay}
                    onChange={handleSelectChange}
                  />
                </div>
              )}
              {FieldShow?.ProReporttype && (
                <div className="col-sm-3">
                  <label>
                    <small>{t("Report type")}&nbsp;</small>
                  </label>
                  <div
                    className="d-flex"
                    style={{
                      alignItems: "center",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <label>
                      <small>{t("Summary")}&nbsp;</small>
                    </label>
                    <Input
                      type="radio"
                      value="Summary"
                      checked={formData.ProReportType === "Summary"}
                      name="ProReportType"
                      onChange={handleSelectChange}
                    />
                    <label>
                      <small>{t("Detail")}&nbsp;</small>
                    </label>
                    <Input
                      type="radio"
                      value="Detail"
                      checked={formData.ProReportType === "Detail"}
                      name="ProReportType"
                      onChange={handleSelectChange}
                    />
                    <label>
                      <small>{t("Test Count")}&nbsp;</small>
                    </label>
                    <Input
                      type="radio"
                      value="TestCount"
                      checked={formData.ProReportType === "TestCount"}
                      name="ProReportType"
                      onChange={handleSelectChange}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="col-sm-2">
              <label></label>
              {loadingSearch ? (
                <Loading />
              ) : (
                <button
                  className="btn-block btn btn-success btn-sm "
                  onClick={getPatientInfoReport}
                >
                  {t("Get Report")}
                </button>
              )}
            </div>

            <div className="col-sm-2">
              {FieldShow?.AsOnNowOutstanding && (
                <>
                  <Input
                    type="radio"
                    name="AsOnNowOutstanding"
                    value="0"
                    checked={reportType == "0" ? true : false}
                    onChange={handleRadioChange}
                  />
                  <label style={{ marginLeft: "10px" }}>
                    As On Now Outstanding
                  </label>
                </>
              )}
            </div>
            <div className="col-sm-2">
              {FieldShow?.DateWiseOutstanding && (
                <>
                  <Input
                    type="radio"
                    name="DateWiseOutstanding"
                    value="1"
                    onChange={handleRadioChange}
                    checked={reportType == "1" ? true : false}
                  />
                  <label style={{ marginLeft: "10px" }}>
                    Datewise Outstanding
                  </label>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default GetReport;
