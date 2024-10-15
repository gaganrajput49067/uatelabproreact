import { useFormik } from "formik";
import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { guidNumber } from "../util/Commonservices";
import { EmployeeMasterSchema } from "../../utils/Schema";
import { axiosInstance } from "../../utils/axiosInstance";
import { getTrimmedData } from "../../utils/helpers";
import { getLocalStorageDecryptData } from "../../Navigation/Storage";
import {
  GetAccessRightApproval,
  GetAccessRightMaster,
  getDepartment,
  getDesignationData,
  getEmployeeCenter,
} from "../../utils/NetworkApi/commonApi";
import Loading from "../../components/Loading/Loading";
import UploadFile from "../utils/UploadFIleModal/UploadFile";
import CameraModal from "../utils/CameraModal";
import Input from "../../components/CommonComponent/Input";
import PageHead from "../../components/CommonComponent/PageHead";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import SubPageHead from "../../components/CommonComponent/SubPageHead";
import { SelectBoxWithCheckbox } from "../../components/CommonComponent/MultiSelectBox";
import { Theme } from "../../utils/Constants";

function CreateEmployeeMaster() {
  const location = useLocation();
  const { state } = location;
  const navigation = useNavigate();
  const [Title, setTitle] = useState([]);
  const [show, setShow] = useState(false);
  const [uploadImage, setUploadImage] = useState({ show: false, data: "" });
  const [centreId, setCentreId] = useState([]);

  const [EmployeeCenter, setEmployeeCenter] = useState([]);
  const [Department, setDepartment] = useState([]);
  const [Designation, setDesigation] = useState([]);
  const [AccessRight, setAccessRight] = useState([]);
  const [ApprovalRight, setApprovalRight] = useState([]);
  const [EditData, setEditData] = useState(false);
  const [load, setLoad] = useState(false);
  const [EmployeeMaster, setEmployeeMaster] = useState({
    AccessRight: "",
    ShowDashboard: 0,
    ApprovalRight: "",
    ApprovalRightID: "",
    Centre: "",
    CentreID: "",
    City: "",
    Department: "",
    Designation: 8,
    DesignationID: "",
    Email: "",
    HouseNo: "",
    Locality: "",
    Mobile: "",
    Name: "",
    PCity: "",
    PHouseNo: "",
    PLocality: "",
    PPincode: "",
    PStreetName: "",
    Pincode: "",
    StreetName: "",
    Title: "",
    isActive: 1,
    isLoginApprovel: 0,
    isPasswordChanged: 0,
    DefaultCentre: "",
    EmployeeIDHash: guidNumber(),
    canRefund: 0,
    canSettlement: 0,
    canDiscountAfterBill: 0,
    HideRate: 0,
    DesignationId: "",
    FirstName: "",
    Password: "",
    Username: "",
    EmpCode: "",
    AMRAccess: "",
    SaveAmendment: "",
    isPassword: true,
    AllowDiscount: 0,
    UnMasking: "",
    IsDoctorPro: "",
    ProEmployee: "",
    Theme: "Default",
  });

  const { t } = useTranslation();

  const { values, handleChange, errors, handleBlur, touched, handleSubmit } =
    useFormik({
      initialValues: EmployeeMaster,
      enableReinitialize: true,
      validationSchema: EmployeeMasterSchema,
      onSubmit: (values) => {
        console.log(errors);
        DuplicateUsername().then((res) => {
          if (res) {
          } else {
            setLoad(true);
            axiosInstance
              .post(state?.url2 ? state?.url2 : "Employee/SaveNewEmployee", {
                EmployeeMaster: [
                  getTrimmedData({
                    EmployeeID: state?.id,
                    AccessRight: EmployeeMaster?.AccessRight,
                    ApprovalRight: EmployeeMaster?.ApprovalRight,
                    Centre: EmployeeMaster?.Centre,
                    CentreID: EmployeeMaster?.CentreID,
                    City: values?.City,
                    Department: EmployeeMaster?.Department,
                    Designation: EmployeeMaster?.Designation,
                    DesignationID: EmployeeMaster?.DesignationID,
                    Email: values?.Email,
                    HouseNo: values?.HouseNo,
                    Locality: values?.Locality,
                    Mobile: (values?.Mobile).toString(),
                    Name: values?.Name,
                    PCity: values?.PCity,
                    PHouseNo: values?.PHouseNo,
                    PLocality: values?.PLocality,
                    PPincode: values?.PPincode,
                    PStreetName: values?.PStreetName,
                    Pincode: values?.Pincode,
                    StreetName: values?.StreetName,
                    Title: EmployeeMaster?.Title,
                    isActive: EmployeeMaster?.isActive,
                    isLoginApprovel: EmployeeMaster?.isLoginApprovel,
                    isPasswordChanged: EmployeeMaster?.isPasswordChanged,
                    EmployeeIDHash: EmployeeMaster?.EmployeeIDHash,
                    DefaultCentre: EmployeeMaster?.DefaultCentre,
                    canRefund: EmployeeMaster?.canRefund,
                    canSettlement: EmployeeMaster?.canSettlement,
                    canDiscountAfterBill: EmployeeMaster?.canDiscountAfterBill,
                    HideRate: EmployeeMaster?.HideRate,
                    AMRAccess: EmployeeMaster?.AMRAccess,
                    SaveAmendment: EmployeeMaster?.SaveAmendment,
                    AllowDiscount: EmployeeMaster?.AllowDiscount,
                    UnMasking: EmployeeMaster?.UnMasking,
                    ShowDashboard: EmployeeMaster?.ShowDashboard,
                    ImageGuid: uploadImage.data,
                    IsDoctorPro: EmployeeMaster?.IsDoctorPro,
                    ProEmployee: EmployeeMaster?.ProEmployee,
                    Theme: EmployeeMaster?.Theme,
                  }),
                ],
                userData: [
                  getTrimmedData({
                    DesignationId: EmployeeMaster?.DesignationID,
                    FirstName: values?.Name,
                    Password: values.Password,
                    Username: values.Username,
                  }),
                ],
              })
              .then((res) => {
                toast.success(res?.data?.message);

                EmployeeMaster?.User?.toLowerCase() ==
                  getLocalStorageDecryptData("Username")?.toLowerCase() &&
                  getLocalStorageDecryptData(
                    "UnMasking",
                    EmployeeMaster?.UnMasking == "" ||
                      EmployeeMaster?.UnMasking == 0
                      ? 0
                      : 1
                  );
                setLoad(false);
                navigation("/EmployeeMaster");
              })
              .catch((err) => {
                toast.error(
                  err.response?.data?.message
                    ? err.response?.data?.message
                    : err.response?.data
                );
                setLoad(false);
              });
          }
        });
      },
    });
  console.log(EmployeeMaster);
  const handleChanges = (select, name) => {
    const val = select?.map((ele) => ele?.value);
    setEmployeeMaster({ ...values, [name]: val });
  };

  const handleMultiSelect = (select, name) => {
    setCentreId(select);
    const val = select?.map((ele) => ele?.value);
    setEmployeeMaster({
      ...values,
      [name]: val,
      CentreID: select[0]?.value,
    });
  };

  const handleSelectChange = (event) => {
    const { name, value, selectedIndex } = event?.target;
    const label = event?.target?.children[selectedIndex].text;
    if (name === "Designation") {
      setEmployeeMaster({
        ...values,
        [name]: label,
        DesignationID: value,
      });
    } else {
      setEmployeeMaster({ ...values, [name]: value });
    }
  };

  const getGenderDropdown = (name) => {
    axiosInstance.post("Global/getGlobalData", { Type: name }).then((res) => {
      let data = res.data.message;
      let value = data.map((ele) => {
        return {
          value: ele.FieldDisplay,
          label: ele.FieldDisplay,
        };
      });
      setTitle(value);
    });
  };

  const getDesignID = (checked) => {
    const design = Designation?.filter((ele) => {
      return ele?.label == "Sales Person";
    });
    if (checked && design?.length > 0) {
      return design[0]?.value;
    } else {
      return 8;
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "ProEmployee") {
      setEmployeeMaster({
        ...values,
        [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
        DesignationID: getDesignID(checked),
        ShowDashboard: 0,
      });
    } else {
      setEmployeeMaster({
        ...values,
        [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
      });
    }
  };

  const getEditDefaultDropDown = (data) => {
    const val = data.split(",");
    const newData = EmployeeCenter.map((ele) => {
      return val.includes(String(ele?.value)) && ele;
    });
    return newData;
  };

  const fetch = () => {
    setEditData(true);
    axiosInstance
      .post(state?.url1, {
        EmployeeID: state?.id,
      })
      .then((res) => {
        const responseData = res.data.message[0];
        const Username = responseData?.Username.split("-")[1];
        const data = {
          ...responseData,
          DesignationId: responseData?.DesignationID,
          Username: Username,
          User: responseData?.Username,
          isPassword: false,
        };
        setUploadImage({
          show: false,
          data: data?.ImageGuid ? data?.ImageGuid : "",
        });
        setEmployeeMaster({ ...EmployeeMaster, data });
        fetchDepartments(data);
        const dropdown = getEditDefaultDropDown(data?.CentreList);
        setCentreId(dropdown);
      })
      .catch((err) => {
        setEditData(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const fetchDepartments = (data) => {
    axiosInstance
      .post("Employee/getAccessDepartment", {
        EmployeeID: state?.id,
      })
      .then((res) => {
        let val = "";
        for (let i = 0; i < res.data.message.length; i++) {
          val =
            val === ""
              ? `${res.data.message[i].DepartmentID}`
              : `${val},${res.data.message[i].DepartmentID}`;
        }
        const data1 = { ...data, Department: val };
        fetchAccessCenter(data1);
      })
      .catch((err) => {
        setEditData(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const fetchAccessCenter = (data) => {
    axiosInstance
      .post("Employee/SearchAccessCentre", {
        EmployeeID: state?.id,
      })
      .then((res) => {
        let val = "";
        for (let i = 0; i < res.data.message.length; i++) {
          val =
            val === ""
              ? `${res.data.message[i].CentreID}`
              : `${val},${res.data.message[i].CentreID}`;
        }
        const data1 = { ...data, Centre: val };
        fetchAccessRight(data1);
      })
      .catch((err) => {
        setEditData(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const fetchAccessRight = (data) => {
    axiosInstance
      .post("Employee/SearchAccessRight", {
        EmployeeID: state?.id,
      })
      .then((res) => {
        let val = "";
        for (let i = 0; i < res.data.message.length; i++) {
          val =
            val === ""
              ? `${res.data.message[i].AccessRightID}`
              : `${val},${res.data.message[i].AccessRightID}`;
        }
        const data1 = { ...data, AccessRight: val };
        fetchAccessApproval(data1);
      })
      .catch((err) => {
        setEditData(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const fetchAccessApproval = (data) => {
    axiosInstance
      .post("Employee/SearchApprovalRight", {
        EmployeeID: state?.id,
      })
      .then((res) => {
        console.log(res);
        let val = "";
        for (let i = 0; i < res.data.message.length; i++) {
          val =
            val === ""
              ? `${res.data.message[i].ApprovalRightID}`
              : `${val},${res.data.message[i].ApprovalRightID}`;
        }

        setEmployeeMaster({ ...data, ApprovalRight: val });
        setEditData(false);
      })
      .catch((err) => {
        setEditData(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  useEffect(() => {
    getGenderDropdown("Title");
    getDepartment(setDepartment, "getDepartmentEmployeeMaster");
    getDesignationData(setDesigation, true);
    GetAccessRightMaster(setAccessRight);
    GetAccessRightApproval(setApprovalRight);
  }, []);

  useEffect(() => {
    if (!state) {
      setEmployeeMaster({
        ...EmployeeMaster,
        Title: EmployeeMaster?.Title ? EmployeeMaster?.Title : Title[0]?.value,
        Designation: EmployeeMaster?.Designation
          ? EmployeeMaster?.Designation
          : Designation[0]?.label,
        DesignationID: EmployeeMaster?.DesignationID
          ? EmployeeMaster?.DesignationID
          : Designation[0]?.value,
      });
    }
  }, [Title, Designation]);

  useEffect(() => {
    if (state) {
      fetch();
    }
  }, []);

  const DuplicateUsername = (url) => {
    return new Promise((resolve, reject) => {
      axiosInstance
        .post(
          url,
          state
            ? {
                UserName: values?.Username,
                EmployeeID: state?.id,
              }
            : {
                UserName: values?.Username,
                EmployeeID: "",
              }
        )
        .then((res) => console.log(res))
        .catch((err) => {
          resolve(err?.response?.data?.message);
          toast.error(err?.response?.data?.message);
          setEmployeeMaster({
            ...EmployeeCenter,
            Username: "",
          });
        });
    });
  };

  useEffect(() => {
    if (!state) {
      setEmployeeMaster({ ...EmployeeMaster, CentreID: centreId[0]?.value });
    }
  }, [centreId]);

  useEffect(() => {
    getEmployeeCenter(setEmployeeCenter);
    guidNumber();
  }, []);

  return (
    <>
      {EditData || load ? (
        <div className="loading-center">
          <Loading />
        </div>
      ) : (
        <>
          {" "}
          {show && (
            <UploadFile
              show={show}
              handleClose={() => setShow(false)}
              documentId={EmployeeMaster?.EmployeeIDHash}
              pageName="EmployeMaster"
            />
          )}
          {uploadImage.show && (
            <CameraModal
              show={uploadImage.show}
              guid={uploadImage.data}
              pageName={"Employee Image"}
              handleClose={(guidNo) =>
                setUploadImage({
                  show: false,
                  data: guidNo && guidNo !== "" ? guidNo : uploadImage.data,
                })
              }
            />
          )}
          <PageHead name="Employee Details" showDrop={"true"}>
            <div className="card">
              <div className="row">
                <div className="col-sm-2">
                  <SelectBox
                    lable="Title"
                    id="Title"
                    options={Title}
                    selectedValue={EmployeeMaster?.Title}
                    onChange={(e) => handleSelectChange(e, values)}
                    name="Title"
                  />
                </div>

                <div className="col-sm-2">
                  <Input
                    lable="Name"
                    id="Name"
                    placeholder=" "
                    name="Name"
                    type="text"
                    max={50}
                    value={values?.Name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors?.Name && touched?.Name && (
                    <span className="error-message">{errors?.Name}</span>
                  )}
                </div>

                <div className="col-sm-2">
                  <div>
                    <Input
                      lable="House No"
                      id="House No"
                      placeholder=" "
                      name="HouseNo"
                      type="text"
                      max={50}
                      value={values?.HouseNo}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-sm-2">
                  <Input
                    lable="Street Name"
                    id="Street Name"
                    placeholder=" "
                    name="StreetName"
                    max={50}
                    type="text"
                    value={values?.StreetName}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-sm-2">
                  <Input
                    name="Locality"
                    type="text"
                    max={50}
                    value={values?.Locality}
                    onChange={handleChange}
                    lable="Locality"
                    id="Locality"
                    placeholder=" "
                  />
                </div>

                <div className="col-sm-2">
                  <Input
                    name="Pincode"
                    type="number"
                    value={values?.Pincode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onInput={(e) => number(e, 6)}
                    lable="Pincode"
                    id="Pincode"
                    placeholder=" "
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-2">
                  <Input
                    name="City"
                    type="text"
                    max={50}
                    value={values?.City}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    lable="City"
                    id="City"
                    placeholder=" "
                  />
                </div>

                <div className="col-sm-2 ">
                  <Input
                    name="Mobile"
                    type="text"
                    onInput={(e) => number(e, 10)}
                    value={values?.Mobile}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    lable="Mobile"
                    id="Mobile"
                    placeholder=" "
                  />
                  {errors?.Mobile && touched?.Mobile && (
                    <span className="error-message">{errors?.Mobile}</span>
                  )}
                </div>

                <div className="col-sm-2">
                  <Input
                    name="Email"
                    value={values?.Email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    max={50}
                    lable="Email"
                    id="Email"
                    placeholder=" "
                    type="email"
                  />
                  {errors?.Email && touched?.Email && (
                    <span className="error-message">{errors?.Email}</span>
                  )}
                </div>

                <div className="col-sm-2">
                  <Input
                    value={getLocalStorageDecryptData("CompanyCode") + "-"}
                    readOnly={true}
                    lable="Company Code"
                    id="Company Code"
                    placeholder=" "
                  />
                </div>

                <div className="col-sm-2">
                  <Input
                    name="Username"
                    value={values?.Username}
                    onChange={handleChange}
                    max={50}
                    onBlur={(e) => {
                      DuplicateUsername("Employee/checkDublicateUserName");
                      handleBlur(e);
                    }}
                    type="text"
                    autoComplete={"off"}
                    lable="User Name"
                    id="User Name"
                    placeholder=" "
                  />
                  {errors?.Username && touched?.Username && (
                    <span className="error-message">{errors?.Username}</span>
                  )}
                </div>

                {!state?.id && (
                  <>
                    <div className="col-sm-2">
                      <Input
                        name="Password"
                        type="password"
                        onBlur={handleBlur}
                        max={50}
                        value={values?.Password}
                        onChange={handleChange}
                        lable="Password"
                        id="Password"
                        placeholder=" "
                      />
                      {errors?.Password && touched?.Password && (
                        <span className="error-message">
                          {errors?.Password}
                        </span>
                      )}
                    </div>
                  </>
                )}
                {state?.id && (
                  <>
                    <div className="col-sm-2">
                      <Input
                        lable="Employee Code"
                        id="Employee Code"
                        placeholder=" "
                        name="EmpCode"
                        type="text"
                        max={50}
                        value={values?.EmpCode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={true}
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="row">
                <div className="col-sm-2">
                  <input
                    id="isLoginApprovel"
                    name="isLoginApprovel"
                    type="checkbox"
                    checked={EmployeeMaster?.isLoginApprovel}
                    onChange={handleInputChange}
                  />
                  <label className="ml-2" htmlFor="isLoginApprovel">
                    {t("Is Login Approval")}:
                  </label>
                </div>

                <div className="col-sm-2">
                  <input
                    id="isPasswordChanged"
                    name="isPasswordChanged"
                    type="checkbox"
                    checked={EmployeeMaster?.isPasswordChanged}
                    onChange={handleInputChange}
                  />
                  <label className="ml-2" htmlFor="isPasswordChanged">
                    {t("Can Change Password")}
                  </label>
                </div>

                <div className="col-sm-1">
                  <input
                    id="canRefund"
                    name="canRefund"
                    type="checkbox"
                    checked={EmployeeMaster?.canRefund}
                    onChange={handleInputChange}
                  />
                  <label className="ml-2" htmlFor="canRefund">
                    {t("CanRefund")}
                  </label>
                </div>

                <div className="col-sm-2">
                  <input
                    id="canDiscountAfterBill"
                    name="canDiscountAfterBill"
                    type="checkbox"
                    checked={EmployeeMaster?.canDiscountAfterBill}
                    onChange={handleInputChange}
                  />
                  <label className="ml-2" htmlFor="canDiscountAfterBill">
                    {t("Can Discount After Bill")}
                  </label>
                </div>

                <div className="col-sm-2">
                  <input
                    id="canSettlement"
                    name="canSettlement"
                    type="checkbox"
                    checked={EmployeeMaster?.canSettlement}
                    onChange={handleInputChange}
                  />
                  <label className="ml-2" htmlFor="canSettlement">
                    {t("Can Settlement")}
                  </label>
                </div>

                <div className="col-sm-1">
                  <input
                    id="HideRate"
                    name="HideRate"
                    type="checkbox"
                    checked={EmployeeMaster?.HideRate}
                    onChange={handleInputChange}
                  />
                  <label className="ml-2" htmlFor="HideRate">
                    {t("HideRate")}:
                  </label>
                </div>
                <div className="col-sm-1">
                  <input
                    id="SaveAmendmentAprove"
                    name="AllowDiscount"
                    type="checkbox"
                    checked={EmployeeMaster?.AllowDiscount}
                    onChange={handleInputChange}
                  />
                  <label className="ml-2" htmlFor="SaveAmendmentAprove">
                    {t("AllowDiscount")}
                  </label>
                </div>
                <div className="col-sm-1">
                  <input
                    id="AMRAccess"
                    name="AMRAccess"
                    type="checkbox"
                    checked={EmployeeMaster?.AMRAccess}
                    onChange={handleInputChange}
                  />{" "}
                  <label className="ml-2" htmlFor="AMRAccess">
                    {t("AMRAccess")}
                  </label>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-2">
                  <input
                    id="SaveAmendmentAprove"
                    name="SaveAmendment"
                    type="checkbox"
                    checked={EmployeeMaster?.SaveAmendment}
                    onChange={handleInputChange}
                  />
                  <label className="ml-2" htmlFor="SaveAmendmentAprove">
                    {t("Save/Approve amendment")}
                  </label>
                </div>

                <div className="col-sm-1">
                  <input
                    id="UnMasking"
                    name="UnMasking"
                    type="checkbox"
                    checked={EmployeeMaster?.UnMasking}
                    onChange={handleInputChange}
                  />
                  <label className="ml-2" htmlFor="UnMasking">
                    {t("UnMasking")}
                  </label>
                </div>

                <div className="col-sm-2">
                  <input
                    name="ShowDashboard"
                    type="checkbox"
                    disabled={EmployeeMaster?.ProEmployee == 1 ? true : false}
                    checked={EmployeeMaster?.ShowDashboard}
                    onChange={handleInputChange}
                  />
                  <label className="ml-2" htmlFor="ShowDashboard">
                    {t("Access Dashboard")}
                  </label>
                </div>
                <div className="col-sm-1">
                  <input
                    id="ProEmployee"
                    name="ProEmployee"
                    type="checkbox"
                    checked={EmployeeMaster?.ProEmployee}
                    onChange={handleInputChange}
                  />
                  <label className="ml-2" htmlFor="ProEmployee">
                    {t("ProEmployee")}
                  </label>
                </div>
              </div>
            </div>
          </PageHead>
          <SubPageHead title="Professional Details">
            <div className="card">
              <div className="row">
                <div className="col-sm-2">
                  <SelectBox
                    lable="Centre"
                    id="Centre"
                    name="CentreID"
                    options={centreId}
                    selectedValue={EmployeeMaster?.CentreID}
                    onChange={handleSelectChange}
                  />
                  {errors?.CentreID && touched?.CentreID && (
                    <span className="error-message">{errors?.CentreID}</span>
                  )}
                </div>

                <div className="col-sm-2">
                  <SelectBox
                    lable="Designation"
                    id="Designation"
                    name="Designation"
                    className="required"
                    options={Designation}
                    selectedValue={EmployeeMaster?.DesignationID}
                    onChange={handleSelectChange}
                    isDisabled={EmployeeMaster?.ProEmployee == 1 ? true : false}
                  />
                </div>
              </div>
            </div>
          </SubPageHead>
          <SubPageHead title="Access Details">
            <div className="card">
              <div className="row">
                <div className="col-sm-2">
                  <SelectBoxWithCheckbox
                    lable="Department"
                    id="Department"
                    placeholder=" "
                    name="Department"
                    options={Department}
                    value={EmployeeMaster?.Department}
                    onChange={handleChanges}
                  />
                  {errors?.Department && touched?.Department && (
                    <span className="error-message">{errors?.Department}</span>
                  )}
                </div>

                <div className="col-sm-2">
                  <SelectBoxWithCheckbox
                    lable="Centre"
                    id="Centre"
                    placeholder=" "
                    name="Centre"
                    options={EmployeeCenter}
                    value={EmployeeMaster?.Centre}
                    onChange={handleMultiSelect}
                    depends={setCentreId}
                  />
                  {errors?.Centre && touched?.Centre && (
                    <span className="error-message">{errors?.Centre}</span>
                  )}
                </div>

                <div className="col-sm-2">
                  <SelectBoxWithCheckbox
                    lable="AccessRight"
                    id="AccessRight"
                    placeholder=" "
                    name="AccessRight"
                    options={AccessRight}
                    value={EmployeeMaster?.AccessRight}
                    onChange={handleChanges}
                  />
                  {errors?.AccessRight && touched?.AccessRight && (
                    <span className="error-message">{errors?.AccessRight}</span>
                  )}
                </div>

                <div className="col-sm-2">
                  <SelectBoxWithCheckbox
                    lable="ApprovalRight"
                    id="ApprovalRight"
                    placeholder=" "
                    name="ApprovalRight"
                    options={ApprovalRight}
                    value={EmployeeMaster?.ApprovalRight}
                    onChange={handleChanges}
                  />
                  {errors?.ApprovalRight && touched?.ApprovalRight && (
                    <span className="error-message">
                      {errors?.ApprovalRight}
                    </span>
                  )}
                </div>
                <div className="col-sm-2">
                  <SelectBox
                    lable="Theme"
                    id="Theme"
                    name="Theme"
                    className="required"
                    options={Theme}
                    selectedValue={EmployeeMaster?.Theme}
                    onChange={handleSelectChange}
                  />
                </div>
                <div className="col-sm-2">
                  <button
                    className="btn btn-block btn-info btn-sm"
                    type="button"
                    id="btnUpload"
                    onClick={() => {
                      setShow(true);
                    }}
                  >
                    {t("Attach Signature")}
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-2">
                  <button
                    className="btn btn-block btn-info btn-sm"
                    type="button"
                    onClick={() => {
                      setUploadImage({ ...uploadImage, show: true });
                    }}
                  >
                    {t("Upload Employee Image")}
                  </button>
                </div>
              </div>
            </div>
          </SubPageHead>
          <SubPageHead title="Permanent Details">
            <div className="card">
              <div className="row">
                <div className="col-sm-2">
                  <div>
                    <Input
                      name="PHouseNo"
                      type="text"
                      max={50}
                      lable="Permanent HouseNo"
                      id="PHouseNo"
                      placeholder=" "
                      value={values?.PHouseNo}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                </div>

                <div className="col-sm-2">
                  <Input
                    name="PStreetName"
                    value={values?.PStreetName}
                    type="text"
                    max={50}
                    lable="Permanent StreetName"
                    id="PStreetName"
                    placeholder=" "
                    onChange={handleChange}
                  />
                </div>

                <div className="col-sm-2">
                  <Input
                    name="PLocality"
                    value={values?.PLocality}
                    type="text"
                    max={50}
                    lable="Permanent Locality"
                    id="P.Locality"
                    placeholder=" "
                    onChange={handleChange}
                  />
                </div>

                <div className="col-sm-2">
                  <div>
                    <Input
                      name="PPincode"
                      value={values?.PPincode}
                      type="number"
                      lable="Permanent Pincode"
                      id=" Pincode"
                      placeholder=" "
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onInput={(e) => number(e, 6)}
                    />
                  </div>
                </div>
                <div className="col-sm-2">
                  <div>
                    <Input
                      name="PCity"
                      value={values?.PCity}
                      type="text"
                      max={50}
                      lable="Permanent City"
                      id="PCity"
                      placeholder=" "
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                </div>
                <div className="col-sm-1">
                  <input
                    name="isActive"
                    type="checkbox"
                    checked={EmployeeMaster?.isActive}
                    onChange={handleInputChange}
                  />
                  <label className="control-label ml-2" htmlFor="IsLogin">
                    {t("Active")}
                  </label>
                </div>

                <div className="col-sm-1">
                  <Link to="/EmployeeMaster">{t("Back to List")}</Link>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-1">
                  {load ? (
                    <Loading />
                  ) : (
                    <button
                      className="btn btn-block btn-success btn-sm"
                      onClick={handleSubmit}
                      type="submit"
                    >
                      {state?.button ? state?.button : t("Submit")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </SubPageHead>
        </>
      )}
    </>
  );
}

export default CreateEmployeeMaster;
