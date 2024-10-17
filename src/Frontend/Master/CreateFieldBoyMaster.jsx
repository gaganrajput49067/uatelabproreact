import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { axiosInstance } from "../../utils/axiosInstance";
import PageHead from "../../components/CommonComponent/PageHead";
import Input from "../../components/CommonComponent/Input";
import Loading from "../../components/Loading/Loading";
import { toast } from "react-toastify";
import { FieldMasterValidation } from "../../utils/Schema";

const CreateFieldBoyMaster = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    Name: "",
    Age: "",
    Mobile: "",
    isActive: 0,
    HomeCollection: "0",
    Address: "",
    City: "",
    State: "",
    Pincode: "",
  });
  const [load, setLoad] = useState(false);

  const handleUpload = (url) => {
    setLoad(true);
    axiosInstance
      .post(url, formData)
      .then((res) => {
        setLoad(false);
        toast.success(res?.data?.message);
        setFormData({
          Name: "",
          Age: "",
          Mobile: "",
          isActive: 0,
          HomeCollection: "0",
          Address: "",
          City: "",
          State: "",
          Pincode: "",
        });
        navigate("/FieldBoyMaster");
      })
      .catch((err) => {
        setLoad(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went Wrong"
        );
      });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const { errors, handleBlur, touched, handleSubmit } = useFormik({
    initialValues: formData,
    validationSchema: FieldMasterValidation,
    enableReinitialize: true,
    onSubmit: () => {
      handleUpload(
        state?.url
          ? "FieldBoyMaster/UpdateFieldBoy"
          : "FieldBoyMaster/InsertFieldBoy"
      );
    },
  });

  const handleEditData = () => {
    axiosInstance
      .post(state?.url, { FieldBoyID: state?.data })
      .then((res) => {
        setFormData(res?.data?.message[0]);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };

  useEffect(() => {
    if (state) {
      handleEditData();
    }
  }, []);

  return (
    <>
      <PageHead name="Field Boy Master" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <Input
                type="text"
                name="Name"
                lable={t("Field Boy Name")}
                placeholder=" "
                max={50}
                onChange={handleChange}
                value={formData?.Name}
              />
              <span className="error-message">{errors?.Name}</span>
            </div>
            <div className="col-sm-2">
              <Input
                type="number"
                name="Age"
                lable={t("Age")}
                placeholder=" "
                max={3}
                onChange={handleChange}
                value={formData?.Age}
              />
              <span className="error-message">{errors?.Age}</span>
            </div>
            <div className="col-sm-2">
              <Input
                type="text"
                name="Mobile"
                lable={t("Mobile")}
                placeholder=" "
                max={10}
                onChange={handleChange}
                value={formData?.Mobile}
              />
              <span className="error-message">{errors?.Mobile}</span>
            </div>
            <div className="col-sm-2">
              <Input
                type="text"
                name="Address"
                lable={t("Address")}
                placeholder=" "
                max={50}
                onChange={handleChange}
                value={formData?.Address}
              />
            </div>
            <div className="col-sm-2">
              <Input
                type="text"
                name="City"
                lable={t("City")}
                placeholder=" "
                max={20}
                onChange={handleChange}
                value={formData?.City}
              />
            </div>
            <div className="col-sm-2">
              <Input
                type="text"
                name="State"
                lable={t("State")}
                placeholder=" "
                max={20}
                onChange={handleChange}
                value={formData?.State}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-2">
              <Input
                type="number"
                name="Pincode"
                lable={t("PinCode")}
                placeholder=" "
                max={6}
                onChange={handleChange}
                value={formData?.Pincode}
              />
            </div>

            <div className="col-sm-1">
              <input
                type="checkbox"
                name="isActive"
                label={t("Active")}
                checked={formData?.isActive == "1"}
                onChange={handleChange}
              />
              <label className="ml-2">IsActive</label>
            </div>
            <div className="col-sm-1">
              {load ? (
                <Loading />
              ) : (
                <button className="btn btn-success" onClick={handleSubmit}>
                  {state?.url ? t("Update") : t("Save")}
                </button>
              )}
            </div>
            <div className="col-sm-2">
              <Link to="/FieldBoyMaster">{t("Back to List")}</Link>
            </div>
          </div>
        </div>
      </PageHead>
    </>
  );
};

export default CreateFieldBoyMaster;
