import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../utils/axiosInstance";
import { getTrimmedData } from "../../utils/helpers";
import PageHead from "../../components/CommonComponent/PageHead";
import Input from "../../components/CommonComponent/Input";
import Loading from "../../components/Loading/Loading";
import { toast } from "react-toastify";
import { validationForDesignations } from "../../utils/Schema";

const DesignationsCreate = () => {
  const [err, setErr] = useState({});
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const [formData, setFormData] = useState({
    Name: state?.data?.DesignationName ? state?.data?.DesignationName : "",
    SequenceNo: state?.data?.SequenceNo ? state?.data?.SequenceNo : "",
    IsDirectApprove: state?.data?.DirectApprove
      ? state?.data?.DirectApprove === "True"
        ? "1"
        : "0"
      : "",
    IsNewTestApprove: state?.data?.NewTestApproves
      ? state?.data?.NewTestApproves === "True"
        ? "1"
        : "0"
      : "",
    IsSales: state?.data?.IsSales
      ? state?.data?.IsSalesStatus === "True"
        ? "1"
        : "0"
      : "",
    IsShowSpecialRate: state?.data?.ShowSpecialRate
      ? state?.data?.ShowSpecialRate === "True"
        ? "1"
        : "0"
      : "",
    isActive: state?.data?.ActiveStatus
      ? state?.data?.ActiveStatus === "True"
        ? "1"
        : "0"
      : "1",
    DesignationID: state?.data?.DesignationID ? state?.data?.DesignationID : "",
    RecEdit: state?.data?.RecEdit ? state?.data?.RecEdit : 0,
    EditInfo: state?.data?.EditInfo ? state?.data?.EditInfo : 0,
  });

  console.log(formData);

  const { t } = useTranslation();

  const postData = () => {
    let generatedError = validationForDesignations(formData);
    if (generatedError === "") {
      setLoad(true);
      axiosInstance
        .post(state?.url, getTrimmedData(formData))
        .then((res) => {
          if (res.data.message) {
            navigate("/Designations");
            setLoad(false);
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };
  return (
    <>
      <PageHead name="Designations Create" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <Input
                type="text"
                name="Name"
                lable="Designation Name"
                id="Name"
                placeholder=" "
                max={50}
                onChange={handleChange}
                value={formData?.Name}
              />
              <span
                className="golbal-Error"
                data-valmsg-for="DepartmentCode"
                data-valmsg-replace="true"
              >
                {err?.Name}
              </span>
            </div>
            <div className="col-sm-2">
              <Input
                type="number"
                name="SequenceNo"
                lable="Sequence Number"
                id="SequenceNo"
                placeholder=" "
                max={11}
                onChange={handleChange}
                value={formData?.SequenceNo}
                onInput={(e) => number(e, 11)}
              />
              <span
                className="golbal-Error"
                data-valmsg-for="DepartmentCode"
                data-valmsg-replace="true"
              >
                {err?.SequenceNo}
              </span>
            </div>
            <div className="col-sm-1  d-flex align-items-center">
              <input
                type="checkbox"
                name="IsSales"
                onChange={handleChange}
                checked={formData?.IsSales == "1" ? true : false}
              />
              <label className="control-label ml-2" htmlFor="IsSales">
                {t("Sales")}
              </label>
            </div>
            <div className="col-sm-2 d-flex align-items-center">
              <input
                type="checkbox"
                onChange={handleChange}
                name="IsNewTestApprove"
                checked={formData?.IsNewTestApprove == "1" ? true : false}
              />
              <label className="control-label ml-2" htmlFor="IsNewTestApprove">
                {t("New Test Approve")}
              </label>
            </div>
            <div className="col-sm-2 d-flex align-items-center">
              <input
                type="checkbox"
                name="IsDirectApprove"
                onChange={handleChange}
                checked={formData?.IsDirectApprove == "1" ? true : false}
              />
              <label className="control-label ml-2" htmlFor="IsDirectApprove">
                {t("Direct Approve")}
              </label>
            </div>
            <div className="col-sm-2 d-flex align-items-center">
              <input
                type="checkbox"
                name="IsShowSpecialRate"
                onChange={handleChange}
                checked={formData?.IsShowSpecialRate == "1" ? true : false}
              />
              <label className="control-label ml-2" htmlFor="IsShowSpecialRate">
                {t("Show Special Rate")}
              </label>
            </div>
            <div className="col-sm-1 d-flex align-items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData?.isActive == "1" ? true : false}
                onChange={handleChange}
              />
              <label className="control-label ml-2" htmlFor="isActive">
                {t("Active")}
              </label>
            </div>
          </div>
          &nbsp;
          <div className="row">
           
           
            <div className="col-sm-1 d-flex align-items-center">
              {load ? (
                <Loading />
              ) : (
                <button
                  type="submit"
                  className="btn btn-block btn-success btn-sm"
                  title="Create"
                  onClick={postData}
                >
                  {state?.other?.button ? state?.other?.button : t("Save")}
                </button>
              )}
            </div>
            <div className="col-sm-2">
              <Link to="/Designations" style={{ fontSize: "13px" }}>
                {t("Back to List")}
              </Link>
            </div>
          </div>
        </div>
      </PageHead>
    </>
  );
};

export default DesignationsCreate;
