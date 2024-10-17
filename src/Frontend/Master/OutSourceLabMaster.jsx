import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { OutSourceLabMasterValidationSchema } from "../../utils/Schema";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import { getTrimmedData, number } from "../../utils/helpers";
import PageHead from "../../components/CommonComponent/PageHead";
import Input from "../../components/CommonComponent/Input";
import Loading from "../../components/Loading/Loading";
import Table from "../../components/Table/Table";
import moment from "moment";

const OutSourceLabMaster = () => {
  const [update, setUpdate] = useState(false);
  const [load, setLoad] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    OutSourceLabID: "",
    LabName: "",
    Address: "",
    ContactPersonName: "",
    PhoneNo: "",
    MobileNo: "",
    EmailID: "",
    isActive: "1",
  });
  const { t } = useTranslation();

  const getOutSourceLabData = () => {
    axiosInstance
      .get("OutSourceLabMaster/getAllOutSourceLabData", formData)
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const editOutSourceLabMaster = (id) => {
    axiosInstance
      .post("OutSourceLabMaster/getAllOutSourceLabDataById", {
        OutSourceLabID: id,
      })
      .then((res) => {
        const data = res.data.message[0];
        setFormData(data);
      })
      .catch((err) => console.log(err));
  };

  const { errors, handleBlur, touched, handleSubmit } = useFormik({
    initialValues: formData,
    enableReinitialize: true,
    validationSchema: OutSourceLabMasterValidationSchema,
    onSubmit: (values) => {
      setLoad(true);
      if (update === true) {
        axiosInstance
          .post(
            "OutSourceLabMaster/UpdateOutSourceLabData",
            getTrimmedData({
              ...values,
            })
          )
          .then((res) => {
            if (res.data.message) {
              setUpdate(false);
              setLoad(false);
              toast.success(res.data.message);
              setFormData({
                OutSourceLabID: "",
                LabName: "",
                Address: "",
                ContactPersonName: "",
                PhoneNo: "",
                MobileNo: "",
                EmailID: "",
                isActive: "1",
              });
              getOutSourceLabData();
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
        setLoad(true);
        axiosInstance
          .post(
            "OutSourceLabMaster/InsertOutSourceLabData",
            getTrimmedData({
              ...values,
            })
          )
          .then((res) => {
            if (res.data.message) {
              setLoad(false);
              toast.success(res.data.message);
              setFormData({
                OutSourceLabID: "",
                LabName: "",
                Address: "",
                ContactPersonName: "",
                PhoneNo: "",
                MobileNo: "",
                EmailID: "",
                isActive: "1",
              });
              getOutSourceLabData();
            } else {
              toast.error("Something went wrong");
            }
          })
          .catch((err) => {
            toast.error(err.response.data.message);
            setLoad(false);
          });
      }
    },
  });

  console.log(errors);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  useEffect(() => {
    getOutSourceLabData();
  }, []);
  return (
    <>
      <PageHead name="Out Source Lab Master" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <Input
                type="text"
                lable="Lab Name"
                name="LabName"
                id="LabName"
                placeholder=""
                value={formData?.LabName}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {errors?.LabName && touched?.LabName && (
                <div className="error-message">{errors?.LabName}</div>
              )}
            </div>
            <div className="col-sm-2">
              <Input
                type="text"
                lable="Contact Person Name"
                name="ContactPersonName"
                id="ContactPersonName"
                placeholder=""
                value={formData?.ContactPersonName}
                onChange={handleChange}
              />
              {errors?.ContactPersonName && touched?.ContactPersonName && (
                <div className="error-message">{errors?.ContactPersonName}</div>
              )}
            </div>
            <div className="col-sm-2">
              <Input
                type="text"
                lable="Address"
                name="Address"
                id="Address"
                placeholder=""
                value={formData?.Address}
                onChange={handleChange}
              />
            </div>
            <div className="col-sm-1">
              <Input
                type="number"
                lable="Phone No"
                name="PhoneNo"
                id="PhoneNo"
                placeholder=""
                value={formData?.PhoneNo}
                onInput={(e) => number(e, 15)}
                onChange={handleChange}
              />
            </div>
            <div className="col-sm-1">
              <Input
                type="number"
                lable="Mobile No"
                name="MobileNo"
                id="MobileNo"
                placeholder=""
                value={formData?.MobileNo}
                onInput={(e) => number(e, 10)}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {errors?.MobileNo && touched?.MobileNo && (
                <div className="error-message">{errors?.MobileNo}</div>
              )}
            </div>
            <div className="col-sm-2">
              <Input
                type="email"
                lable="Email ID"
                name="EmailID"
                id="EmailID"
                placeholder=""
                value={formData?.EmailID}
                onChange={handleChange}
                required
              />
              {errors?.EmailID && touched?.EmailID && (
                <div className="error-message">{errors?.EmailID}</div>
              )}
            </div>
            <div className="col-sm-1 d-flex">
              <div className="mt-1">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData?.isActive}
                  onChange={handleChange}
                />
                <label className="ml-2">{t("Active")}</label>
              </div>
            </div>
            <div className="col-sm-1">
              {load ? (
                <Loading />
              ) : (
                <button
                  type="submit"
                  className="btn btn-block btn-success btn-sm"
                  onClick={handleSubmit}
                >
                  {update ? t("Update") : t("Create")}
                </button>
              )}
            </div>
          </div>
        </div>
      </PageHead>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="card">
            {data.length > 0 ? (
              <Table>
                <thead className="cf">
                  <tr>
                    <th>{t("S.No")}</th>
                    <th>{t("Lab Name")}</th>
                    <th>{t("Address")}</th>
                    <th>{t("Phone No")}</th>
                    <th>{t("Mobile No")}</th>
                    <th>{t("Contact Person Name")}</th>
                    <th>{t("Active")}</th>
                    <th>{t("Created By")}</th>
                    <th>{t("Created On")}</th>
                    <th>{t("Action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((data, i) => (
                    <tr key={i}>
                      <td data-title={t("S.No")}>{i + 1}&nbsp;</td>
                      <td data-title={t("Lab Name")}>{data?.LabName}&nbsp;</td>
                      <td data-title={t("Address")}>{data?.Address}&nbsp;</td>
                      <td data-title={t("Phone No")}>{data?.PhoneNo}&nbsp;</td>
                      <td data-title={t("Mobile No")}>
                        {data?.MobileNo}&nbsp;
                      </td>
                      <td data-title={t("Contact Person Name")}>
                        {data?.ContactPersonName}&nbsp;
                      </td>
                      <td data-title={t("Active")}>
                        {data?.isActiveStatus}&nbsp;
                      </td>
                      <td data-title={t("Created By")}>
                        {data?.CreatedByName}&nbsp;
                      </td>
                      <td data-title={t("Created On")}>
                        {moment(data?.dtEntry).format("DD-MMM-YYYY")}
                        &nbsp;
                      </td>

                      <td data-title={t("Edit")}>
                        <div
                          className="text-primary"
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() => {
                            window.scroll(0, 0);
                            editOutSourceLabMaster(data?.OutSourceLabID);
                            setUpdate(true);
                          }}
                        >
                          {t("Edit")}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              " No Data Found"
            )}
          </div>
        </>
      )}
    </>
  );
};

export default OutSourceLabMaster;
