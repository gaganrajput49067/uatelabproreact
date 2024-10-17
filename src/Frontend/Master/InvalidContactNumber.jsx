import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { number } from "yup";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../utils/axiosInstance";
import PageHead from "../../components/CommonComponent/PageHead";
import Input from "../../components/CommonComponent/Input";
import Loading from "../../components/Loading/Loading";
import NoRecordFound from "../../components/CommonComponent/NoRecordFound";
import Table from "../../components/Table/Table";

const InvalidContactNumber = () => {
  const [update, setUpdate] = useState(false);
  const [load, setLoad] = useState(false);
  const [formData, setFormData] = useState([]);
  const [input, setInput] = useState({
    MobileNo: "",
    IsActive: "",
    Id: "",
  });
  const { t } = useTranslation();

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setInput({
      ...input,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };

  const validation = () => {
    let error = "";
    if (input?.MobileNo?.length !== 10) {
      error = "Invalid Mobile Number";
    }
    return error;
  };

  const getfetch = () => {
    axiosInstance
      .get("CommonController/GetInvalidMobileNo")
      .then((res) => {
        if (res?.data.success) {
          setFormData(res?.data?.message);
        } else {
          setFormData([]);
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSave = (url, btnName) => {
    const generatedError = validation();
    if (generatedError === "") {
      setLoad(true);
      axiosInstance
        .post(url, input)
        .then((res) => {
          toast.success(res?.data?.message);
          setLoad(false);
          getfetch();
          setInput({
            MobileNo: "",
            IsActive: "",
          });
          btnName === "Update" && setUpdate(false);
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
      toast.error(generatedError);
    }
  };

  const handleEdit = (data) => {
    setInput({ ...data, Id: data?.id });
    setUpdate(true);
  };

  useEffect(() => {
    getfetch();
  }, []);

  return (
    <>
      <PageHead name="Invalid Contact Number" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <Input
                lable="Invalid Contact Number"
                id="Invalid Contact Number"
                placeholder=" "
                type="number"
                name="MobileNo"
                onInput={(e) => number(e, 10)}
                value={input?.MobileNo}
                onChange={handleChange}
              />
            </div>
            <div className="col-sm-1">
              <input
                type="checkbox"
                className="mt-2"
                name="IsActive"
                checked={input?.IsActive == "1" ? true : false}
                onChange={(e) => handleChange(e)}
              />
              <label className=" ml-2">{t("IsActive")}</label>
            </div>

            <div className="col-sm-1">
              {load ? (
                <Loading />
              ) : update ? (
                <button
                  type="button"
                  className="btn btn-block btn-success btn-sm"
                  id="btnSave"
                  title="Save"
                  onClick={() =>
                    handleSave(
                      "CommonController/UpdateInvalidMobileNo",
                      "Update"
                    )
                  }
                >
                  {t("Update")}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-block btn-success btn-sm"
                  id="btnUpdate"
                  title="Update"
                  onClick={() =>
                    handleSave("CommonController/InsertInvalidMobileNo", "Save")
                  }
                >
                  {t("Save")}
                </button>
              )}
            </div>
          </div>
        </div>
      </PageHead>
      {load ? (
        <Loading />
      ) : (
        <>
          {formData.length > 0 ? (
            <div className="card">
              <Table>
                <thead className="cf">
                  <tr>
                    <th>{t("S.No")}</th>
                    <th>{t("Mobile No")}.</th>
                    <th>{t("Status")}</th>
                    <th>{t("Action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {formData?.map((ele, index) => (
                    <tr key={index}>
                      <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                      <td data-title={t("Mobile No")}>{ele?.MobileNo}&nbsp;</td>
                      <td data-title={t("Status")}>
                        {ele?.IsActive === 1 ? t("Active") : t("InActive")}
                        &nbsp;
                      </td>
                      <td data-title={t("Action")}>
                        {
                          <div
                            className="text-primary"
                            style={{
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                            onClick={() => handleEdit(ele)}
                          >
                            {t("Edit")}
                          </div>
                        }
                        &nbsp;
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="card">
              <NoRecordFound />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default InvalidContactNumber;
