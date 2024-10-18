import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ChangePasswordSchema } from "../../utils/Schema";
import { toast } from "react-toastify";
import PageHead from "../../components/CommonComponent/PageHead";
import Input from "../../components/CommonComponent/Input";
import { axiosInstance } from "../../utils/axiosInstance";

const ChangePassword = () => {
  const [state, setState] = useState({
    UserType: "",
    UserName: "",
    OldPassword: "",
    NewPassword: "",
    ConfirmPassword: "",
  });

  const [load, setLoad] = useState(false);

  const { t } = useTranslation();

  const navigate = useNavigate();
  const handleLogout = () => {
    axiosInstance
      .get("Users/logout")
      .then((res) => {
        window.localStorage.clear();
        navigate("/login");
        toast.success("Logout Successfully");
      })
      .catch((err) => {
        toast.error(err?.data?.message ? err?.data?.message : "Error Occured");
      });
  };

  const { values, errors, handleChange, handleBlur, touched, handleSubmit } =
    useFormik({
      initialValues: state,
      validationSchema: ChangePasswordSchema,
      onSubmit: (values, { resetForm }) => {
        setLoad(true);
        axiosInstance
          .post("changePassword/changeUserPassword", {
            UserType: state?.UserType,
            UserName: state?.UserName,
            OldPassword: values?.OldPassword,
            NewPassword: values?.NewPassword,
            ConfirmPassword: values?.ConfirmPassword,
          })
          .then((res) => {
            if (res?.data?.message === "Password  Update Successfully") {
              toast.success(res?.data?.message);
              handleLogout();
              setLoad(false);
              resetForm();
            } else {
              setLoad(false);
              toast.error(res?.data?.message);
            }
          })
          .catch((err) => {
            toast.error(
              err?.response?.data?.message
                ? err?.response?.data?.message
                : "error Occured"
            );
            setLoad(false);
            resetForm();
          });
      },
    });

  const fetchDetail = () => {
    axiosInstance
      .get("changePassword/getUserDetail")
      .then((res) => {
        const data = res?.data?.message[0];
        setState({
          ...state,
          UserType: data?.UserType,
          UserName: data?.Username,
          UserTypeName: data?.UserTypeName,
        });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "error Occured"
        );
      });
  };

  useEffect(() => {
    fetchDetail();
  }, []);
  return (
    <>
      <PageHead name="ChangePassword" showDrop={"true"}>
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-sm-2 ">
                <Input
                  name="UserType"
                  id="UserType"
                  lable="User Type"
                  placeholder=""
                  disabled={true}
                  value={state?.UserTypeName}
                />
              </div>
              <div className="col-sm-2 ">
                <Input
                  name="UserName"
                  id="UserName"
                  lable="User Type"
                  placeholder=""
                  disabled={true}
                  max={30}
                  value={state?.UserName}
                />
              </div>
              <div className="col-sm-2 ">
                <Input
                  lable="Old Password"
                  id="OldPassword"
                  placeholder=""
                  type="password"
                  max={30}
                  name="OldPassword"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.OldPassword}
                />
              </div>
              <div className="col-sm-2 ">
                <Input
                  lable="New Password"
                  id="NewPassword"
                  placeholder={t("New Password")}
                  type="password"
                  max={30}
                  onChange={handleChange}
                  name="NewPassword"
                  onBlur={handleBlur}
                  value={values?.NewPassword}
                />
                {errors?.NewPassword && touched?.NewPassword && (
                  <div className="error-message">{errors?.NewPassword}</div>
                )}
              </div>
              <div className="col-sm-2 ">
                <Input
                  lable="Confirm Password"
                  id="ConfirmPassword"
                  placeholder=""
                  type="password"
                  max={30}
                  onChange={handleChange}
                  name="ConfirmPassword"
                  onBlur={handleBlur}
                  value={values?.ConfirmPassword}
                />
                {errors?.ConfirmPassword && touched?.ConfirmPassword && (
                  <div className="error-message">
                    {errors?.ConfirmPassword}
                  </div>
                )}
              </div>
              <div className="col-sm-1">
                {load ? (
                  <Loading />
                ) : (
                  <button
                    className="btn btn-block btn-success btn-sm"
                    type="submit"
                  >
                    {t("Save")}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </PageHead>
    </>
  );
};

export default ChangePassword;
