import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import Modal from "../../components/Modal/Modal";
import Input from "../../components/CommonComponent/Input";
import { number } from "../../utils/helpers";
import { axiosInstance } from "../../utils/axiosInstance";

const initialValues = {
  Name: "",
  Mobile: "",
  // DoctorCode: "",
};

const PatientRegisterModal = ({ handleClose }) => {
  const { values, errors, handleChange, touched, handleSubmit } = useFormik({
    initialValues: initialValues,
    // validationSchema: DoctorSchema,
    onSubmit: (values, { resetForm }) => {
      axiosInstance
        .post("DoctorReferal/InsertDoctorReferal", values)
        .then((res) => {
          toast.success(res?.data?.message);
          handleClose();
          resetForm({ values: "" });
        })
        .catch((err) => console.log(err));
    },
  });
  const { t } = useTranslation();

  return (
    <>
      <Modal title={"Add Doctor"} handleClose={handleClose} top={"25%"}>
        <div
          className="d-flex"
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "200px",
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* <div className="row">
              <div className="col-sm-12">
                      className="select-input-box form-control input-sm"
                      placeholder={t("Doctor Code")}
                      type="number"
                      name="DoctorCode"
                      value={values.DoctorCode}
                      onChange={handleChange}
                    />
                    {errors?.DoctorCode && touched?.DoctorCode && (
                      <span className="golbal-Error">{errors?.DoctorCode}</span>
                  </div>
            </div> */}
            <div className="w-100">
              <div className="col-sm-12 w-100">
                <Input
                  className="select-input-box form-control input-sm"
                  placeholder={t("Doctor Name")}
                  type="text"
                  name="Name"
                  value={values.Name}
                  onChange={handleChange}
                />
                {errors?.Name && touched?.Name && (
                  <span className="golbal-Error">{errors?.Name}</span>
                )}
              </div>

              <div className="col-sm-12">
                <Input
                  className="select-input-box form-control input-sm"
                  placeholder={t("Mobile No")}
                  type="number"
                  name="Mobile"
                  onInput={(e) => number(e, 10)}
                  value={values.Mobile}
                  onChange={handleChange}
                  required
                />
                {errors?.Mobile && touched?.Mobile && (
                  <span className="golbal-Error">{errors?.Mobile}</span>
                )}
              </div>
            </div>
          </form>
          <div className="row w-100">
            <div className="col-sm-6">
              <button
                type="submit"
                className="btn btn-success btn-block btn-sm"
                onClick={handleSubmit}
              >
                {t("Save")}
              </button>
            </div>
            <div className="col-sm-6">
              <button
                className="btn btn-danger btn-block btn-sm"
                onClick={handleClose}
              >
                {t("Close")}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PatientRegisterModal;
