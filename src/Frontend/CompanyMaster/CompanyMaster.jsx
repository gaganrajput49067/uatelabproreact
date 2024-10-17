import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { axiosInstance } from "../../utils/axiosInstance";
import { guidNumber } from "../util/Commonservices";
import { getTrimmedData, PreventSpecialCharacter } from "../../utils/helpers";
import { CompanyMasterValidation } from "../../utils/Schema";
import UploadFile from "../utils/UploadFIleModal/UploadFile";
import Input from "../../components/CommonComponent/Input";
import Loading from "../../components/Loading/Loading";
import { Button } from "primereact/button";
import PageHead from "../../components/CommonComponent/PageHead";

const CompanyMaster = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const [BillingType, setBillingType] = useState([]);
  const [GraceType, setGraceType] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    CompanyId: "",
    CompanyCode: "",
    CompanyName: "",
    Country: "",
    State: "",
    City: "",
    Email: "",
    PhoneNo: "",
    Phone2: "",
    Address1: "",
    Address2: "",
    Address3: "",
    isPrefixRequired: 0,
    companyGUID: guidNumber(),
    SelectType: "",
    GraceDays: 0,
    Mobile1: "",
    Mobile2: "",
    BillingType: "",
    IsShareRequired: 0,
    IsSmsRequired: 0,
    IsEmailRequired: 0,
    IsWhatsappRequired: 0,
    SkipMicLabEntry: 0,
    ModifiedRegDate: 0,
    SampleCollectionAndDepartmentRecieve: 0,
    CompanyLogo: guidNumber(),
  });

  const [showMobile2, setShowMobile2] = useState(false);
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  const handleMobileFun = (type) => {
    if (type === "ADD") {
      setShowMobile2(true);
    } else {
      setShowMobile2(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (["CompanyCode"].includes(name)) {
      setPayload({
        ...payload,
        [name]: value.trim().toUpperCase(),
      });
    } else if (name === "Country" || name === "City") {
      setPayload({
        ...payload,
        [name]: PreventSpecialCharacter(value)
          ? value.trimStart()
          : payload[name],
      });
    } else if (["CompanyName"].includes(name)) {
      setPayload({
        ...payload,
        [name]: PreventSpecialCharacter(value)
          ? value.trimStart().toUpperCase()
          : payload[name],
      });
    } else if (["Email"].includes(name)) {
      setPayload({
        ...payload,
        [name]: value.trim(),
      });
    } else {
      setPayload({
        ...payload,
        [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
      });
    }
  };

  const BindBillingDropDown = (value) => {
    if (value === "PostPaid") {
      getGlobalData("BillingType");
    } else if (value === "PrePaid") {
      setBillingType([]);
    }
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
    BindBillingDropDown(value);
  };

  const getGlobalData = (name) => {
    axiosInstance
      .post("Global/getGlobalData", { Type: name })
      .then((res) => {
        let data = res?.data?.message;
        console.log(data);
        let value = data?.map((ele) => {
          return {
            value: ele?.FieldDisplay,
            label: ele?.FieldDisplay,
          };
        });
        switch (name) {
          case "BillingType":
            setBillingType(value);
            break;
          case "GraceType":
            setGraceType(value);
            break;
          default:
            break;
        }
      })
      .catch((err) => console.log(err));
  };

  const fetch = (id) => {
    setLoading(true);
    axiosInstance
      .post(state?.url, {
        CompanyId: id,
      })
      .then((res) => {
        setLoading(false);
        const data = res?.data?.message[0];
        const guid = res?.data?.guId[0]?.GuId || "";
        BindBillingDropDown(data?.SelectType);
        setPayload({
          ...data,
          companyGUID: guid,
          FirstLastPage: data?.FirstLastPage ?? 0,
          CompanyLogo:
            data?.CompanyLogo && data?.CompanyLogo !== ""
              ? data?.CompanyLogo
              : guidNumber(),
        });
      })
      .catch((err) => {
        setLoading(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  useEffect(() => {
    if (state?.data) {
      fetch(state?.data);
    }
  }, []);

  const { values, errors, handleBlur, touched, handleSubmit } = useFormik({
    initialValues: { ...payload },
    enableReinitialize: true,
    validationSchema: CompanyMasterValidation,
    onSubmit: (values) => {
      setLoading(true);
      axiosInstance
        .post(
          state?.url
            ? "CompanyMaster/UpdateCompanyMaster"
            : "CompanyMaster/SaveCompanyMaster",
          getTrimmedData(payload)
        )
        .then((res) => {
          if (res?.data?.message) {
            navigate(`/CompanyMasterList`);
            toast.success(res?.data?.message);
          }
          setLoading(false);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something Wents Wrong."
          );
          setLoading(false);
        });
    },
  });

  useEffect(() => {
    getGlobalData("GraceType");
  }, []);

  return (
    <>
      <>
        {show && (
          <UploadFile
            show={show}
            handleClose={() => setShow(false)}
            documentId={payload?.companyGUID}
            pageName="CompanyMaster"
          />
        )}
      </>
      <>
        {show2 && (
          <UploadFile
            show={show2}
            handleClose={() => setShow2(false)}
            documentId={payload?.CompanyLogo}
            pageName="CompanyLogo"
          />
        )}
      </>
      <PageHead name="Company Master" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2 col-md-2">
              <Input
                disabled={state?.other?.button ? true : false}
                lable="CompanyCode"
                placeholder=" "
                id="CompanyCode"
                type="text"
                name="CompanyCode"
                value={payload?.CompanyCode}
                onChange={handleChange}
                onBlur={handleBlur}
                max={10}
                onInput={(e) => number(e, 10)}
              />
              {errors?.CompanyCode && touched?.CompanyCode && (
                <span className="error-message">{errors?.CompanyCode}</span>
              )}
            </div>

            <div className="col-sm-2 col-md-2">
              <Input
                lable="Company Name"
                placeholder=" "
                id="Company Name"
                type="text"
                name="CompanyName"
                value={payload?.CompanyName}
                onBlur={handleBlur}
                onChange={handleChange}
                max={60}
              />
              {errors?.CompanyName && touched?.CompanyName && (
                <span className="error-message">{errors?.CompanyName}</span>
              )}
            </div>
            <div className="col-sm-2 col-md-2">
              <Input
                lable="Country"
                placeholder=" "
                id="Country"
                onChange={handleChange}
                value={payload?.Country}
                name="Country"
                type="text"
                max={25}
              />
            </div>

            <div className="col-sm-2 col-md-2">
              <Input
                lable="State"
                placeholder=" "
                id="State"
                onChange={handleChange}
                value={payload?.State}
                name="State"
                type="text"
                max={25}
              />
            </div>
            <div className="col-sm-2 col-md-2">
              <Input
                lable="City"
                placeholder=" "
                id="City"
                onChange={handleChange}
                value={payload?.City}
                name="City"
                type="text"
                max={25}
              />
            </div>

            <div className="col-sm-2 col-md-2">
              <Input
                lable="Email"
                placeholder=" "
                id="Email"
                onChange={handleChange}
                value={payload?.Email}
                name="Email"
                type="email"
                max={50}
                onBlur={handleBlur}
                required
              />
              {errors?.Email && touched?.Email && (
                <span className="error-message">{errors?.Email}</span>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-sm-2 col-md-2">
              <Input
                lable="Phone No"
                placeholder=" "
                id="Phone No"
                onInput={(e) => number(e, 10)}
                type="number"
                name="PhoneNo"
                value={payload?.PhoneNo}
                onChange={handleChange}
              />
            </div>

            <div className="col-sm-2 col-md-2">
              <Input
                lable="Land Line No."
                placeholder=" "
                id="Land Line No."
                name="Phone2"
                value={payload?.Phone2}
                onChange={handleChange}
              />
            </div>

            <div className="col-sm-2 col-md-2">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Input
                  onInput={(e) => number(e, 10)}
                  lable="Mobile No"
                  placeholder=" "
                  id="Mobile No"
                  type="number"
                  name="Mobile1"
                  value={payload?.Mobile1}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <Button
                  icon={`pi pi-plus`}
                  className="iconSize"
                  onClick={() => handleMobileFun("ADD")}
                ></Button>
              </div>
              {errors?.Mobile1 && touched?.Mobile1 && (
                <span className="error-message">{errors?.Mobile1}</span>
              )}
              {showMobile2 && (
                <div
                  style={{
                    marginTop: "1px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Input
                    onInput={(e) => number(e, 10)}
                    className="select-input-box form-control input-sm"
                    type="number"
                    name="Mobile2"
                    value={payload?.Mobile2}
                    onChange={handleChange}
                  />

                  <Button
                    icon={`pi pi-minus`}
                    className="iconSize"
                    onClick={() => handleMobileFun("DELETE")}
                  ></Button>
                </div>
              )}
              <div>
                {errors?.Mobile2 && touched?.Mobile2 && (
                  <span className="error-message">{errors?.Mobile2}</span>
                )}
              </div>
            </div>

            <div className="col-sm-2 col-md-2">
              <Input
                lable="Address1"
                placeholder=" "
                id="Address1"
                onChange={handleChange}
                value={payload?.Address1}
                name="Address1"
                type="text"
                max={50}
              />
            </div>

            <div className="col-sm-2 col-md-2">
              <Input
                lable="Address2"
                placeholder=" "
                id="Address2"
                onChange={handleChange}
                value={payload?.Address2}
                name="Address2"
                type="text"
                max={50}
              />
            </div>

            <div className="col-sm-2 col-md-2">
              <Input
                lable="Address3"
                placeholder=" "
                id="Address3"
                onChange={handleChange}
                value={payload?.Address3}
                name="Address3"
                type="text"
                max={50}
              />
            </div>
          </div>

          <div className="row mt-2 mb-2">
            <div className="col-sm-1 d-flex">
              <input
                type="checkbox"
                name="isPrefixRequired"
                onChange={handleChange}
                checked={payload?.isPrefixRequired}
              />
              &nbsp;
              <label className="control-label">{t("isPrefixRequired")}</label>
            </div>
            <div className="col-sm-1  d-flex" style={{ alignItems: "center" }}>
              <input
                type="checkbox"
                name="IsShareRequired"
                onChange={handleChange}
                checked={payload?.IsShareRequired}
              />
              &nbsp;
              <label className="control-label">{t("IsShareRequired")}</label>
            </div>
            <div className="col-sm-1 d-flex" style={{ alignItems: "center" }}>
              <input
                type="checkbox"
                name="IsSmsRequired"
                onChange={handleChange}
                checked={payload?.IsSmsRequired}
              />
              &nbsp;
              <label className="control-label">{t("IsSmsRequired")}</label>
            </div>
            <div className="col-sm-1 d-flex" style={{ alignItems: "center" }}>
              <input
                type="checkbox"
                name="IsEmailRequired"
                onChange={handleChange}
                checked={payload?.IsEmailRequired}
              />
              &nbsp;
              <label className="control-label">{t("IsEmailRequired")}</label>
            </div>{" "}
            <div className="col-sm-1 d-flex" style={{ alignItems: "center" }}>
              <input
                type="checkbox"
                name="SkipMicLabEntry"
                onChange={handleChange}
                checked={payload?.SkipMicLabEntry}
              />
              &nbsp;
              <label className="control-label">{t("SkipMicrolabEntry")}</label>
            </div>
            <div className="col-sm-1 d-flex" style={{ alignItems: "center" }}>
              <input
                type="checkbox"
                name="IsWhatsappRequired"
                onChange={handleChange}
                checked={payload?.IsWhatsappRequired}
              />
              &nbsp;
              <label className="control-label">{t("IsWhatsappReq.")}</label>
            </div>
            <div className=" col-sm-2 d-flex" style={{ alignItems: "center" }}>
              <input
                type="checkbox"
                name="ModifiedRegDate"
                onChange={handleChange}
                checked={payload?.ModifiedRegDate}
              />
              &nbsp;
              <label className="control-label">
                {t("ModifyRegisterationDate")}
              </label>
            </div>
            <div className="col-sm-3 d-flex" style={{ alignItems: "center" }}>
              <input
                type="checkbox"
                name="SampleCollectionAndDepartmentRecieve"
                onChange={handleChange}
                checked={payload?.SampleCollectionAndDepartmentRecieve}
              />
              &nbsp;
              <label className="control-label">
                {t("SkipSamp.Collection&Dept.Recieve for CultureTest")}
              </label>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-2">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => setShow2(true)}
              >
                Upload Company Logo
              </button>
            </div>
            <div className="col-sm-1">
              {loading ? (
                <Loading />
              ) : (
                <>
                  <button
                    className="btn btn-block btn-sm btn-success"
                    onClick={handleSubmit}
                    type="submit"
                  >
                    {state?.other?.button ? state?.other?.button : t("Save")}
                  </button>
                </>
              )}
            </div>
            <div className="col-sm-2">
              <Link to={`/CompanyMasterList`} style={{ fontSize: "13px" }}>
                {t("Back to List")}
              </Link>
            </div>
          </div>
        </div>{" "}
      </PageHead>
    </>
  );
};

export default CompanyMaster;
