import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../utils/axiosInstance";
import { MenuMasterValidation } from "../../utils/Schema";
import PageHead from "../../components/CommonComponent/PageHead";
import Input from "../../components/CommonComponent/Input";
import { number } from "../../utils/helpers";
import Table from "../../components/Table/Table";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading/Loading";

const MenuMaster = () => {
  const payLoadConst = {
    MenuName: "",
    Priority: "",
    isActive: 1,
    Description: "",
    ID: "",
    SetMaster: 0,
  };
  const [update, setUpdate] = useState(false);
  const [load, setLoad] = useState(false);
  const [savedata, setSaveData] = useState([]);
  const [errors, setErrors] = useState({});
  const [payload, setPayload] = useState(payLoadConst);
  const { t } = useTranslation();

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setPayload({
      ...payload,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const fetchPageMaster = () => {
    axiosInstance
      .get("Menu/getAllMenu")
      .then((res) => {
        if (res?.data?.success || res?.data?.message?.length > 0) {
          const data = res?.data?.message;
          setSaveData(data);
        } else {
          setSaveData([]);
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const editIDMaster = (id) => {
    setUpdate(true);
    setLoad(true);
    axiosInstance
      .post("Menu/getMenuByID", {
        ID: id,
      })
      .then((res) => {
        console.log(res);
        setLoad(false);
        const data = res.data.message[0];
        const updateData = {
          MenuName: data?.MenuName,
          Priority: data?.Priority.toString(),
          isActive: data?.isActive,
          Description: data?.Description,
          ID: data?.ID,
          SetMaster: data?.SetMaster,
          CompanyID: data?.CompanyID,
        };
        setPayload(updateData);
      })
      .catch((err) => {
        setLoad(false);
        console.log(err);
      });
  };
  const handleSave = (url, btnName) => {
    let generatedError = MenuMasterValidation(payload);
    if (generatedError === "") {
      setLoad(true);
      axiosInstance
        .post(url, payload)
        .then((res) => {
          toast.success(res.data?.message);
          setLoad(false);
          fetchPageMaster();
          if (btnName === "Update") {
            setUpdate(false);
          }
          setPayload(payLoadConst);
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
      setErrors(generatedError);
      setLoad(false);
    }
  };

  useEffect(() => {
    fetchPageMaster();
  }, []);
  return (
    <>
      <PageHead name="Menu Master" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2  ">
              <Input
                type="text"
                lable="Menu Name"
                id="MenuName"
                name="MenuName"
                max={50}
                disabled={payload?.CompanyID == 0 ? true : false}
                value={payload.MenuName}
                onChange={handleChange}
                placeholder=" "
              />
              <div className="error-message">{errors?.MenuName}</div>
            </div>
            <div className="col-sm-2  ">
              <Input
                onInput={(e) => number(e, 4)}
                lable="Priority"
                id="Priority"
                name="Priority"
                value={payload.Priority}
                onChange={handleChange}
                placeholder=" "
              />
              <div className="error-message">{errors?.Priority}</div>
            </div>
            <div className="col-sm-2  ">
              <Input
                onInput={(e) => number(e, 4)}
                lable="Description"
                id="Description"
                disabled={payload?.CompanyID == 0 ? true : false}
                max={50}
                name="Description"
                value={payload.Description}
                onChange={handleChange}
                placeholder=" "
              />
            </div>
            <div className="col-sm-1 d-flex">
              <div className="mt-1">
                <input
                  name="isActive"
                  type="checkbox"
                  disabled={payload?.CompanyID == 0 ? true : false}
                  checked={payload?.isActive}
                  onChange={handleChange}
                />
              </div>
              <label className="col-sm-10">{t("Active")}</label>
            </div>
            {payload?.ID == "" ? (
              <div className="col-sm-1 d-flex">
                <div className="mt-1">
                  <input
                    name="SetMaster"
                    type="checkbox"
                    max={50}
                    checked={payload?.SetMaster}
                    onChange={handleChange}
                  />
                </div>
                <label className="col-sm-10">{t("SetMaster")}</label>
              </div>
            ) : (
              ""
            )}
            <div className="col-sm-1">
              {load ? (
                <Loading />
              ) : update ? (
                <button
                  type="button"
                  className="btn btn-block btn-warning btn-sm"
                  id="btnSave"
                  title="Update"
                  onClick={() => handleSave("Menu/UpdateMenu", "Update")}
                >
                  {t("Update")}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-block btn-success btn-sm"
                  id="btnSave"
                  title="Update"
                  onClick={() => handleSave("Menu/SaveMenuMaster", "Save")}
                >
                  {t("Save")}
                </button>
              )}
            </div>
            <div className="col-sm-1">
              <button
                type="button"
                className="btn btn-block btn-danger btn-sm"
                id="Reset"
                title="Reset"
                onClick={() => {
                  setPayload(payLoadConst);
                  setUpdate(false);
                  setErrors({})
                }}
              >
                {t("Reset")}
              </button>
            </div>
          </div>
        </div>
      </PageHead>
      <div className="card">
        {load ? (
          <Loading />
        ) : (
          <>
            <Table>
              <thead
                className="cf"
                style={{
                  position: "sticky",
                  top: 0,
                }}
              >
                <tr>
                  <th>{t("S.No")}</th>
                  <th>{t("Menu Name")}</th>
                  <th>{t("Description")}</th>
                  <th>{t("Is Master")}</th>
                  <th>{t("Priority")}</th>
                  <th>{t("Is Active")}</th>
                  <th>{t("Action")}</th>
                </tr>
              </thead>
              <tbody>
                {savedata.map((ele, index) => (
                  <tr key={index}>
                    <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                    <td data-title={t("Code")}>{ele?.MenuName}&nbsp;</td>
                    <td data-title={t("Description")}>
                      {ele?.Description}&nbsp;
                    </td>
                    <td data-title={t("IsMaster")}>
                      {ele?.CompanyID == 0 ? "Master" : "Self"}&nbsp;
                    </td>
                    <td data-title={t("Priority")}>{ele?.Priority}&nbsp;</td>
                    <td data-title={t("Is Active")}>
                      {ele?.isActive == 1 ? "Active" : "InActive"}&nbsp;
                    </td>
                    <td>
                      <Link
                        className="text-primary"
                        style={{
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                        onClick={() => {
                          window?.scroll(0, 0);
                          setErrors({});
                          editIDMaster(ele?.ID);
                        }}
                      >
                        {t("Edit")}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </div>
    </>
  );
};

export default MenuMaster;
