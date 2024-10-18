import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosInstance";
import { validationForAgeWise } from "../../utils/Schema";
import { toast } from "react-toastify";
import { getTrimmedData, number } from "../../utils/helpers";
import PageHead from "../../components/CommonComponent/PageHead";
import Input from "../../components/CommonComponent/Input";
import DatePicker from "../../components/CommonComponent/DatePicker";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import Loading from "../../components/Loading/Loading";

const AgeWiseDiscount = () => {
  const [Gender, setGender] = useState([]);
  const [load, setLoad] = useState(false);
  const [err, setErr] = useState({});
  const [DiscountShareType, setDiscountShareType] = useState([]);

  const location = useLocation();
  const { state } = location;
  const { t, i18n } = useTranslation();

  const [formData, setFormData] = useState({
    FromDate: state?.data?.FromValidityDate
      ? new Date(state?.data?.FromValidityDate)
      : new Date(),
    ToDate: state?.data?.ToValidityDate
      ? new Date(state?.data?.ToValidityDate)
      : new Date(),
    DiscountType: state?.data?.DiscountType ? state?.data?.DiscountType : "",
    DiscountPer: state?.data?.DiscountPer ? state?.data?.DiscountPer : "",
    FromValidityDate: state?.data?.FromValidityDate
      ? new Date(state?.data?.FromValidityDate)
      : new Date(),
    ToValidityDate: state?.data?.ToValidityDate
      ? new Date(state?.data?.ToValidityDate)
      : new Date(),
    Gender: state?.data?.Gender ? state?.data?.Gender : "Both",
    DiscountShareType: state?.data?.DiscountShareType
      ? state?.data?.DiscountShareType
      : "Client Share",
    ApplicableForAll: state?.data?.ApplicableForAll
      ? state?.data?.ApplicableForAll
      : "1",
    IsCouponRequired: state?.data?.IsCouponRequired
      ? state?.data?.IsCouponRequired
      : "",
    RateTypeId: "0",
    DiscountId: state?.data?.DiscountId ? state?.data?.DiscountId : "",
    ID: state?.data?.Id ? state?.data?.Id : "",
    isActive: state?.data?.isActiveStatus ? state?.data?.isActive : 1,
    FromAge: state?.data?.FromAge ? state?.data?.FromAge : "",
    ToAge: state?.data?.ToAge ? state?.data?.ToAge : "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "DiscountPer") {
      const isValidInput =
        /^\d+(\.\d{0,2})?$/.test(value) &&
        parseFloat(value) >= 0 &&
        parseFloat(value) <= 100;
      setFormData({
        ...formData,
        [name]: isValidInput || value === "" ? value : formData[name],
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value, ItemValue: "" });
    // setErrors({});
  };

  const navigate = useNavigate();

  const getDropDownData = (name) => {
    axiosInstance
      .post("Global/getGlobalData", { Type: name })
      .then((res) => {
        let data = res.data.message;
        let value = data.map((ele) => {
          return {
            value: ele.FieldDisplay,
            label: ele.FieldDisplay,
          };
        });

        switch (name) {
          case "Gender":
            setGender(value);
            break;
          case "DiscountShareType":
            setDiscountShareType(value);
            break;
        }
      })
      .catch((err) => console.log(err));
  };

  const Api = () => {
    let generatedError = validationForAgeWise(formData);
    if (generatedError === "") {
      setLoad(true);
      axiosInstance
        .post(
          state?.url ? state?.url : "AgeWiseDiscount/InsertAgeWiseDiscountData",
          getTrimmedData({
            ...formData,
            IsCouponRequired: formData?.IsCouponRequired ? 1 : 0,
            isActive: formData?.isActive ? 1 : 0,
            ApplicableForAll: formData?.ApplicableForAll ? 1 : 0,
            FromValidityDate: formData?.FromDate,
            ToValidityDate: formData?.ToDate,
          })
        )
        .then((res) => {
          if (res.data.message) {
            setLoad(false);
            navigate("/AgeWiseDiscountList");
            toast.success(res.data.message);
          } else {
            toast.error("Something went wrong");
            setLoad(false);
          }
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
          setLoad(false);
        });
    } else {
      setErr(generatedError);
    }
  };

  const dateSelect = (value, name) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    getDropDownData("Gender");
    getDropDownData("DiscountShareType");
  }, []);
  return (
    <>
      <PageHead name="Age Wise Discount" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2 ">
              <Input
                max={20}
                name="DiscountType"
                type="text"
                id="DiscountType"
                value={formData.DiscountType}
                onChange={handleChange}
                placeholder=""
                lable="Discount Type"
              />
              {<div className="error-message">{err?.DiscountType}</div>}
            </div>
            <div className="col-sm-2 ">
              <Input
                name="DiscountPer"
                id="DiscountPer"
                type="text"
                value={formData.DiscountPer}
                onChange={handleChange}
                placeholder=""
                lable={t("Discount Per.(%)")}
              />
              {<div className="error-message">{err?.DiscountPer}</div>}
            </div>
            <div className="col-sm-2 ">
              <DatePicker
                name="FromDate"
                id="FromDate"
                placeholder=" "
                value={formData?.FromDate}
                onChange={dateSelect}
                maxDate={new Date()}
                lable={t("From Validity Date")}
              />
            </div>
            <div className="col-sm-2 ">
              <DatePicker
                name="ToDate"
                id="ToDate"
                placeholder=""
                value={formData?.ToDate}
                onChange={dateSelect}
                minDate={new Date(formData.FromDate)}
                lable={t("To Validity Date:")}
              />
            </div>
            <div className="col-sm-2 ">
              <Input
                id="FromAge"
                onInput={(e) => number(e, 3)}
                name="FromAge"
                value={formData?.FromAge}
                type="number"
                onChange={handleChange}
                placeholder=""
                lable={t("From Age (In Years):")}
              />
              {<div className="error-message">{err?.FromAge}</div>}
            </div>
            <div className="col-sm-2 ">
              <Input
                onInput={(e) => number(e, 3)}
                name="ToAge"
                id="ToAge"
                value={formData?.ToAge}
                type="number"
                onChange={handleChange}
                placeholder=""
                lable={t("To Age (In Years):")}
              />
              {<div className="error-message">{err?.ToAge}</div>}
            </div>
          </div>
          <div className="row">
            <div className="col-sm-2">
              <SelectBox
                options={Gender}
                selectedValue={formData?.Gender}
                onChange={handleSelectChange}
                name="Gender"
                lable={t("Gender")}
              />
              {formData.Gender === "" && (
                <div className="field-validation-valid text-danger">
                  {err?.Gender}
                </div>
              )}
            </div>
            <div className="col-sm-2">
              <SelectBox
                options={DiscountShareType}
                selectedValue={formData?.DiscountShareType}
                onChange={handleSelectChange}
                name="DiscountShareType"
                lable={t("Dis.Share Type")}
              />
              {formData.DiscountShareType === "" && (
                <div className="field-validation-valid text-danger">
                  {err?.DiscountShareType}
                </div>
              )}
            </div>
            <div className="col-sm-2 d-flex align-items-center">
              <input
                type="checkbox"
                name="ApplicableForAll"
                checked={formData?.ApplicableForAll}
                onChange={handleChange}
                lable={t("Applicable For All")}
              />
              <label className="ml-2">{t("Applicable For All")}</label>
            </div>
            <div className="col-sm-2 d-flex align-items-center">
              <input
                type="checkbox"
                name="IsCouponRequired"
                checked={formData?.IsCouponRequired}
                onChange={handleChange}
              />
              <label className="ml-2">{t("Is Coupon Required")}</label>
            </div>
            <div className="col-sm-1 d-flex align-items-center">
              <input
                name="isActive"
                type="checkbox"
                checked={formData?.isActive}
                onChange={handleChange}
              />
              <label className="ml-2">{t("Active")}</label>
            </div>
            <div className="col-sm-1">
              {load ? (
                <Loading />
              ) : (
                <button
                  type="submit"
                  id="btnSave"
                  className="btn btn-block btn-success btn-sm "
                  title="Create"
                  onClick={Api}
                >
                  {state?.other?.button ? state?.other?.button : t("Save")}
                </button>
              )}
            </div>

            <div className="col-sm-2 pl-15">
              <Link to="/AgeWiseDiscountList" style={{ fontSize: "13px" }}>
                {t("Back to List")}
              </Link>
            </div>
          </div>
        </div>
      </PageHead>
    </>
  );
};

export default AgeWiseDiscount;
