import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import PageHead from "../../components/CommonComponent/PageHead";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import { SubPageMasterValidation } from "../../utils/Schema";
import Input from "../../components/CommonComponent/Input";
import Loading from "../../components/Loading/Loading";
import Table from "../../components/Table/Table";
import { Link } from "react-router-dom";

const SubPageMaster = () => {
  const [menudata, setMenuData] = useState([]);
  const [PageData, setPageData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [load, setLoad] = useState(false);
  const [savedata, setSaveData] = useState([]);
  const [errors, setErrors] = useState({});
  const [payload, setPayload] = useState({
    PageName: "",
    PageId: "",
    SubPageName: "",
    Url: "",
    Priority: "",
    isActive: 1,
    MenuID: "",
    SetMaster: 0,
    Id: "",
  });
  const { t } = useTranslation();

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    if (name === "MenuID") {
      getpageData(value);
      setPayload({
        ...payload,
        [name]: value,
      });
      fetchPageMaster(value);
      setErrors({});
    } else {
      setPayload({ ...payload, [name]: value, ItemValue: "" });
      setErrors({});
    }
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setPayload({
      ...payload,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const fetchMenuApi = () => {
    axiosInstance
      .get("Menu/SelectAllMenu")
      .then((res) => {
        console.log(res);
        const data = res?.data?.message;
        const menuapi = data.map((ele) => {
          return {
            label: ele?.MenuName,
            value: ele?.ID,
          };
        });
        setMenuData(menuapi);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went wrong."
        );
      });
  };

  const getpageData = (value) => {
    axiosInstance
      .post("Menu/getpage", { MenuId: Number(value) })
      .then((res) => {
        console.log(res);
        if (res?.data?.success) {
          const data = res?.data?.message;
          const Pageapi = data.map((ele) => {
            return {
              label: ele?.Display,
              value: ele?.PageId,
            };
          });
          setPageData(Pageapi);
        } else {
          setPageData([]);
        }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Somthing Wents Wrong"
        );
      });
  };

  const fetchPageMaster = (value) => {
    axiosInstance
      .post("Menu/GetSubpageMaster", {
        MenuID: value,
      })
      .then((res) => {
        if (res?.data?.success) {
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

  const editIDMaster = (ele) => {
    console.log(ele);
    setUpdate(true);
    getpageData(ele?.MenuId);
    setPayload({
      PageName: ele?.Display,
      SubPageName: ele?.SubPageName,
      Url: ele?.Url,
      Priority: ele?.Priority,
      isActive: ele?.isActive,
      MenuID: ele?.MenuId,
      PageId: ele?.PageId,
      Id: ele?.Id,
      MenuName: ele?.MenuName,
      CompanyID: ele?.CompanyID,
    });
  };

  const handleSave = () => {
    let generatedError = SubPageMasterValidation(payload);
    if (generatedError === "") {
      setLoad(true);
      if (update === true) {
        axiosInstance
          .post("Menu/UpdateSubpageMaster", {
            SubPageName: payload?.SubPageName,
            Url: payload?.Url,
            Priority: payload?.Priority,
            Id: payload?.Id,
            MenuId: payload?.MenuID,
            PageID: payload?.PageId,
            isActive: payload?.isActive,

            SetMaster: payload?.SetMaster,
          })
          .then((res) => {
            toast.success(res.data?.message);
            setLoad(false);
            fetchPageMaster("");

            setPayload({
              PageName: "",
              SubPageName: "",
              Url: "",
              Priority: "",
              isActive: 1,
              MenuID: "",
              PageId: "",
              SetMaster: 0,
              Id: "",
            });
            setUpdate(false);
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
        axiosInstance
          .post("Menu/SaveSubPageMaster", {
            MenuID: payload?.MenuID,
            PageID: payload?.PageId,
            SubPageName: payload?.SubPageName,
            Url: payload?.Url,
            Priority: payload?.Priority,
            isActive: payload?.isActive,
            SetMaster: payload?.SetMaster,
          })
          .then((res) => {
            toast.success(res.data?.message);
            setLoad(false);
            fetchPageMaster("");

            setPayload({
              PageName: "",
              SubPageName: "",
              Url: "",
              Priority: "",
              isActive: 1,
              MenuID: "",
              PageId: "",
              SetMaster: 0,
              Id: "",
            });
          })
          .catch((err) => {
            toast.error(
              err?.response?.data?.message
                ? err?.response?.data?.message
                : "Error Occured"
            );
            setLoad(false);
          });
      }
    } else {
      setErrors(generatedError);
      setLoad(false);
    }
  };

  useEffect(() => {
    fetchPageMaster("");
    fetchMenuApi();
  }, []);
  return (
    <>
      <PageHead name="Sub Page Master" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <SelectBox
                name="MenuID"
                onChange={handleSelectChange}
                options={[{ label: "Select", value: "" }, ...menudata]}
                isDisabled={payload?.CompanyID == 0 ? true : false}
                selectedValue={payload?.MenuID}
                lable="Menu"
              />
              <div className="error-message">{errors?.MenuID}</div>
            </div>
            <div className="col-sm-2">
              <SelectBox
                name="PageId"
                onChange={handleSelectChange}
                options={[{ label: "Select", value: "" }, ...PageData]}
                isDisabled={payload?.CompanyID == 0 ? true : false}
                selectedValue={payload?.PageId}
                lable="Page Name"
              />
              <div className="error-message">{errors?.PageId}</div>
            </div>
            <div className="col-sm-2">
              <Input
                type="text"
                lable="Sub Page Name"
                name="SubPageName"
                id="SubPageName"
                placeholder=""
                max={50}
                disabled={payload?.CompanyID == 0 ? true : false}
                value={payload?.SubPageName}
                onChange={handleChange}
              />
              <div className="error-message">{errors?.SubPageName}</div>
            </div>
            <div className="col-sm-2">
              <Input
                type="text"
                lable="URL"
                name="Url"
                id="Url"
                placeholder=""
                value={payload?.Url}
                onChange={handleChange}
              />
              <div className="error-message">{errors?.Url}</div>
            </div>
            <div className="col-sm-2">
              <Input
                type="text"
                lable="Priority"
                name="Priority"
                id="Priority"
                placeholder=""
                max={50}
                value={payload?.Priority}
                onInput={(e) => number(e, 4)}
                onChange={handleChange}
              />
              <div className="error-message">{errors?.Priority}</div>
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
            {payload?.Id == "" ? (
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
          </div>
          <div className="row">
            <div className="col-sm-1">
              <button
                className="btn btn-success btn-sm btn-block"
                onClick={handleSave}
              >
                {update ? "Update" : "Save"}
              </button>
            </div>
            <div className="col-sm-1">
              <button
                type="button"
                className="btn btn-block btn-danger btn-sm"
                id="Reset"
                title="Reset"
                onClick={() => {
                  setPayload({
                    PageName: "",
                    Url: "",
                    Priority: "",
                    isActive: 1,
                    MenuID: "",
                    SetMaster: 0,
                    PageID: "",
                  });
                  setUpdate(false);
                  setErrors({});
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
                  <th>{t("Page Name")}</th>
                  <th>{t("SubPageName")}</th>
                  <th>{t("URL")}</th>
                  <th>{t("Is Master")}</th>
                  <th>{t("Priority")}</th>
                  <th>{t("Status")}</th>
                  <th>{t("Action")}</th>
                </tr>
              </thead>
              <tbody>
                {savedata.map((ele, index) => (
                  <tr key={index}>
                    <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                    <td data-title={t("Manu Name")}>
                      {ele?.MenuName}
                      &nbsp;
                    </td>
                    <td data-title={t("Page Name")}>
                      {ele?.Display}
                      &nbsp;
                    </td>

                    <td data-title={t("SubPageName")}>
                      {ele?.SubPageName}&nbsp;
                    </td>
                    <td data-title={t("Url")}>{ele?.Url}&nbsp;</td>
                    <td data-title={t("IsMaster")}>
                      {ele?.CompanyID == 0 ? "Master" : "Self"}&nbsp;
                    </td>
                    <td data-title={t("Priority")}>{ele?.Priority}&nbsp;</td>
                    <td data-title={t("Status")}>
                      {ele?.isActive == 1 ? "Active" : "Deactive"}
                      &nbsp;
                    </td>
                    <td data-title={t("Action")}>
                      <Link
                        className="text-primary"
                        style={{
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                        onClick={() => {
                          window.scroll(0, 0);
                          editIDMaster(ele);
                          setErrors({});
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

export default SubPageMaster;
