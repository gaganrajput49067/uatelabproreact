import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { PageMasterValidation } from "../../utils/Schema";
import PageHead from "../../components/CommonComponent/PageHead";
import Input from "../../components/CommonComponent/Input";
import { number } from "../../utils/helpers";
import Table from "../../components/Table/Table";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import { axiosInstance } from "../../utils/axiosInstance";

const PageMaster = () => {
  const [menudata, setMenuData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [load, setLoad] = useState(false);
  const [savedata, setSaveData] = useState([]);
  const [errors, setErrors] = useState({});
  const [payload, setPayload] = useState({
    PageName: "",
    Url: "",
    Priority: "",
    isActive: 1,
    MenuID: "",
    SetMaster: 0,
    PageID: "",
  });
  const { t, i18n } = useTranslation();

  const handleSelectChange = (e) => {
    const { name, value } = e.target;

    if (name === "MenuID") {
      setPayload({ ...payload, [name]: value, ItemValue: "" });
      setErrors({});
      fetchPageMaster(value);
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
        menuapi.unshift({ label: "Select", value: "" });
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

  const fetchPageMaster = (value) => {
    axiosInstance
      .post("Menu/SelectAllPage", { MenuID: value })
      .then((res) => {
        console.log(res);
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

  const editIDMaster = (id) => {
    setUpdate(true);
    axiosInstance
      .post("Menu/SelectAllPageByPageID", {
        PageID: id,
      })
      .then((res) => {
        console.log(res);
        const data = res.data.message[0];
        setPayload(data);
      })
      .catch((err) => console.log(err));
  };
  console.log(payload);
  const handleSave = (url, btnName) => {
    let generatedError = PageMasterValidation(payload);
    if (generatedError === "") {
      setLoad(true);
      axiosInstance
        .post(url, payload)
        .then((res) => {
          toast.success(res.data?.message);
          setLoad(false);
          fetchPageMaster("");
          if (btnName === "Update") {
            setUpdate(false);
          }
          setPayload({
            PageName: "",
            Url: "",
            Priority: "",
            isActive: 1,
            MenuID: "",
            SetMaster: 0,
            PageID: "",
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
      <PageHead name="Page Master" showDrop={"true"}></PageHead>
      <div className="card"></div>
    </>
  );
};

export default PageMaster;
