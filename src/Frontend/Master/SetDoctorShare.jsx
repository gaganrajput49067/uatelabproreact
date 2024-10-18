import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getAccessRateTypeNew,
  getBillingCategory,
} from "../util/Commonservices";
import { axiosInstance } from "../../utils/axiosInstance";
import PageHead from "../../components/CommonComponent/PageHead";
import Input from "../../components/CommonComponent/Input";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import Loading from "../../components/Loading/Loading";
import Table from "../../components/Table/Table";
import { toast } from "react-toastify";
import { number } from "../../utils/helpers";
import DoctorShareTransferModal from "../utils/DoctorShareTransferModal";

const SetDoctorShare = () => {
  const [loading, setLoading] = useState(false);
  const [secondLoading, setSecondLoading] = useState(false);
  const [formTable, setFormTable] = useState([]);
  const [formTableNew, setFormTableNew] = useState([]);
  const [saveItem, setSaveItem] = useState([]);
  const [RateData, setRateData] = useState([]);
  const [DoctorData, setDoctorData] = useState([]);
  const [Category, setCategory] = useState([]);
  const [DepartmentData, setDepartmentData] = useState([]);

  const [state, setState] = useState({
    ToggleData: "Department",
    searchType: "1",
    RateTypeID: "",
    DoctorID: "",
  });

  const { t } = useTranslation();
  const [payload, setPayload] = useState({
    DoctorID: "0",
    RateTypeID: "",
    DepartmentID: "",
    BillingCategoryID: "",
  });

  const [show, setShow] = useState(false);

  const handleChange = (name, value) => {
    if (name === "ToggleData") {
      if (value === "Department") {
        setFormTableNew([]);
        setPayload({
          DoctorID: "0",
          RateTypeID: "",
          DepartmentID: "",
          BillingCategoryID: "",
        });
        setState({ ...state, [name]: value });
      }

      if (value === "Item") {
        setState({
          ...state,
          [name]: value,
          RateTypeID: "",
          DoctorID: "",
        });

        setFormTable([]);
      }
    } else {
      setState({ ...state, [name]: value });
    }
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
    if (["DoctorID", "RateTypeID"].includes(name) && value === "") {
      setFormTable([]);
    }
  };

  const handleArrayChange = (e, index) => {
    const { name, value } = e.target;
    const data = [...formTable];
    data[index][name] = value > 100 ? "" : value;
    setFormTable(data);
  };

  const handleSelectChangeDoctor = (event) => {
    const { name, value } = event.target;
    setPayload({
      ...payload,
      [name]: value,
    });

    if (name === "DoctorID" && value === "") {
      setFormTableNew([]);
    }
  };

  const validation = () => {
    const data = formTableNew.filter(
      (ele) =>
        ["", 0].includes(ele?.DocShareAmt) && ["", 0].includes(ele?.DocSharePer)
    );
    return data.length > 0 ? true : false;
  };

  const isChecked = (name, state, value, id) => {
    if (id) {
      const data = state?.map((ele) => {
        if (ele?.TestID === id) {
          return ele[name] === value ? true : false;
        } else {
          return ele;
        }
      });
      return data;
    } else {
      const data = state?.map((ele) => {
        return ele[name] === value ? true : false;
      });
      return data;
    }
  };

  const handleChangeNew = (e) => {
    const { name, value, checked, type } = e.target;
    if (type === "checkbox") {
      const data = formTableNew.map((ele) => {
        return {
          ...ele,
          [name]: checked,
        };
      });
      setFormTableNew(data);
    } else {
      if (name === "DocSharePer") {
        const datas = formTableNew.map((ele) => {
          return {
            ...ele,
            [name]: value > 100 ? "" : value,
            DocShareAmt: "",
            isChecked: ["", 0].includes(value) && false,
          };
        });
        setFormTableNew(datas);
        let data = parseInt(document.getElementById("DocSharePer").value);
        document.getElementById("DocShareAmt").value = "";
        if (data > 100) {
          document.getElementById("DocSharePer").value = "";
        }
      } else if (name === "DocShareAmt") {
        const datas = formTableNew.map((ele) => {
          return {
            ...ele,
            [name]: value,
            DocSharePer: "",
            isChecked: ["", 0].includes(value) && false,
          };
        });
        setFormTableNew(datas);
        document.getElementById("DocSharePer").value = "";
      }
    }
  };

  const handleChangeNewOne = (e, index) => {
    const { name, value, checked, type } = e.target;
    const val = [...formTableNew];
    if (type === "checkbox") {
      val[index][name] = checked;
      setFormTableNew(val);
    } else {
      val[index][name] = value;
      if (name === "DocShareAmt") {
        val[index].DocSharePer = "";
        val[index][name] = value;
        val[index]["isChecked"] = ["", 0].includes(value) && false;
      } else if (name === "DocSharePer") {
        val[index].DocShareAmt = "";
        val[index][name] = value > 100 ? "" : value;
        val[index]["isChecked"] = ["", 0].includes(value) && false;
      }

      setFormTableNew(val);
    }
  };
  const handleChangeDepShare = (e) => {
    const { name, value } = e.target;
    const datas = formTable.map((ele) => {
      return {
        ...ele,
        [name]: value > 100 ? "" : value,
      };
    });
    let data = parseInt(document.getElementById("DocSharePer").value);
    if (data > 100) {
      document.getElementById("DocSharePer").value = "";
    }
    setFormTable(datas);
  };
  const getDepartment = () => {
    axiosInstance
      .get("Department/getDepartmentData")
      .then((res) => {
        let data = res.data.message;
        let DeptDataValue = data.map((ele) => {
          return {
            value: ele.DepartmentID,
            label: ele.Department,
          };
        });
        // DeptDataValue.unshift({ label: "Select", value: "" });
        setDepartmentData(DeptDataValue);
      })
      .catch((err) => console.log(err));
  };

  const getTableData = (data) => {
    setLoading(true);
    axiosInstance
      .post("DocShareMaster/getDepartmentDocData", data)
      .then((res) => {
        if (res?.data?.message?.length > 0) {
          setFormTable(res?.data?.message);
        } else {
          setFormTable([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const getDepartmentDocData = () => {
    setSecondLoading(true);
    axiosInstance
      .post("DocShareMaster/getDepartmentDocDataByItem", {
        ...payload,
        searchType: state?.searchType,
      })
      .then((res) => {
        const data = res?.data?.message;
        if (data.length > 0) {
          const val = data.map((ele) => {
            return {
              ...ele,
              isChecked: false,
            };
          });

          setFormTableNew(val);
        } else {
          toast.error("no data found");
          setFormTableNew([]);
        }
        setSecondLoading(false);
      })
      .catch((err) => {
        toast.error(
          err?.data?.message ? err?.data?.message : "SomeThing Went Wrong"
        );
        setSecondLoading(false);
      });
  };

  const BindDoctorData = () => {
    axiosInstance
      .post("DoctorReferal/getDoctorDataBind")
      .then((res) => {
        const data = res?.data?.message;
        const val = data?.map((ele) => {
          return {
            label: ele?.DoctorName,
            value: ele?.DoctorID,
          };
        });
        val.unshift({ label: "Select Doctor", value: "" });
        setDoctorData(val);
      })
      .catch((err) => {
        toast.error(
          err?.data?.message ? err?.data?.message : "SomeThing Went Wrong"
        );
      });
  };

  useEffect(() => {
    if (
      state?.searchType === "1" &&
      state?.ToggleData === "Department" &&
      state?.RateTypeID
    ) {
      getTableData({
        searchType: state?.searchType,
        DoctorID: state?.DoctorID,
        RateTypeID: state?.RateTypeID,
      });
    }
  }, [state?.RateTypeID]);

  useEffect(() => {
    if (state?.searchType === "2" && state?.ToggleData === "Department") {
      if (state?.DoctorID) {
        getTableData({
          searchType: state?.searchType,
          DoctorID: state?.DoctorID,
          RateTypeID: state?.RateTypeID,
        });
      }
    }
  }, [state?.DoctorID, state?.RateTypeID]);

  const submit = () => {
    setLoading(true);
    axiosInstance
      .post("DocShareMaster/DefaulDepartmentShareCreate", {
        RateTypeID: state?.RateTypeID,
        DoctorID: state?.DoctorID,
        Data: formTable,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        getTableData({
          searchType: state?.searchType,
          DoctorID: state?.DoctorID,
          RateTypeID: state?.RateTypeID,
        });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went wrong"
        );
        setLoading(false);
      });
  };

  const handleSubmit = () => {
    setSecondLoading(true);
    axiosInstance
      .post("DocShareMaster/SaveDocItemShare", {
        RateTypeID: payload?.RateTypeID,
        DoctorID: payload?.DoctorID,
        DepartmentID: payload?.DepartmentID,
        Data: formTableNew,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        getDepartmentDocData();
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went wrong"
        );
        setSecondLoading(false);
      });
  };

  useEffect(() => {
    if (
      payload.BillingCategoryID &&
      payload?.DepartmentID &&
      payload?.RateTypeID &&
      (payload?.DoctorID !== "" || payload?.DoctorID === "0")
    )
      getDepartmentDocData();
  }, [payload]);

  useEffect(() => {
    getAccessRateTypeNew(setRateData);
    getDepartment();
    BindDoctorData();
    getBillingCategory(setCategory);
  }, []);
  return (
    <>
      {show && (
        <DoctorShareTransferModal
          show={show}
          handleClose={() => setShow(false)}
        />
      )}
      <PageHead name={t("Set Doctor Share")} showDrop={true}>
        <div className="card">
          <div className="row">
            <div className="col-sm-1 d-flex align-items-center">
              <input
                type="radio"
                name="searchType"
                id="searchType"
                value="1"
                checked={state?.searchType == "1" ? true : false}
                onChange={(e) => {
                  handleChange(e.target.name, e.target.value);
                  setPayload({ ...payload, DoctorID: "0" });
                }}
              />
              <label className="col-sm-10 ml-2">{t("Master")}</label>
            </div>
            <div className="col-sm-1 d-flex align-items-center">
              <input
                type="radio"
                name="searchType"
                id="searchType"
                value="2"
                checked={state?.searchType == "2" ? true : false}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
              <label className="col-sm-10 ml-2">{t("Doctor")}</label>
            </div>
            <div className="col-sm-1">
              <button
                type="submit"
                className="btn btn-block btn-primary btn-sm"
                onClick={() => setShow(true)}
              >
                {t("Transfer Doctor Share")}
              </button>
            </div>
            <div className="col-sm-1">
              <button
                type="button"
                onClick={() => handleChange("ToggleData", "Department")}
                className={`btn ${
                  state?.ToggleData === "Department"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
              >
                {t("Department")}
              </button>
            </div>
            <div className="col-sm-1">
              <button
                type="button"
                onClick={() => handleChange("ToggleData", "Item")}
                className={`btn ${
                  state?.ToggleData === "Item"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
              >
                {t("Item")}
              </button>
            </div>
          </div>
        </div>
      </PageHead>
      {state?.ToggleData === "Department" && (
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <SelectBox
                options={[{ label: "SelectRateType", value: "" }, ...RateData]}
                onChange={handleSelectChange}
                name={"RateTypeID"}
                id="RateTypeID"
                lable="Rate Type"
                placeholder=""
                selectedValue={state?.RateTypeID}
              />
            </div>
            {state?.searchType == "2" && (
              <>
                <div className="col-sm-2">
                  <SelectBox
                    options={DoctorData}
                    onChange={handleSelectChange}
                    name={"DoctorID"}
                    id="DoctorID"
                    lable="Doctor"
                    placeholder=""
                    isDisabled={state?.RateTypeID ? false : true}
                    selectedValue={state?.DoctorID}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
      {loading ? (
        <Loading />
      ) : (
        <>
          {formTable.length > 0 && (
            <div className="card">
              <div className="row">
                <Table>
                  <thead>
                    <tr>
                      <th>{t("S.No")}</th>
                      <th>{t("Department")}</th>
                      <th>
                        {t("Percentage %")}
                        <Input
                          type="number"
                          id="DocSharePer"
                          name="DocSharePer"
                          placeholder={t("Enter Percent(%)")}
                          onChange={handleChangeDepShare}
                        />
                      </th>
                    </tr>
                  </thead>
                  {formTable.map((ele, index) => (
                    <tbody>
                      <tr key={index}>
                        <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                        <td data-title={t("Department")}>
                          {ele?.Department}&nbsp;
                        </td>
                        <td data-title={t("Percentage %")}>
                          <Input
                            type="number"
                            name="DocSharePer"
                            id="DocSharePer"
                            placeholder=""
                            value={ele?.DocSharePer}
                            onChange={(e) => handleArrayChange(e, index)}
                          />
                        </td>
                      </tr>
                    </tbody>
                  ))}
                </Table>
              </div>
              <div className="row">
                <div className="col-sm-1">
                  <button
                    type="button"
                    className="btn btn-block btn-success btn-sm"
                    id="btnSave"
                    title="Save"
                    options={saveItem}
                    onClick={submit}
                  >
                    {t("Save")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {state?.ToggleData === "Item" && (
        <>
          <div className="card">
            <div className="row">
              <div className="col-sm-2">
                <SelectBox
                  options={[
                    { label: "Select RateType", value: "" },
                    ...RateData,
                  ]}
                  onChange={handleSelectChangeDoctor}
                  name={"RateTypeID"}
                  id="RateTypeID"
                  placeholder=""
                  lable={t("Rate Type")}
                  selectedValue={payload?.RateTypeID}
                />
              </div>
              <div className="col-sm-2">
                <SelectBox
                  onChange={handleSelectChangeDoctor}
                  name={"DepartmentID"}
                  id="DepartmentID"
                  placeholder=""
                  lable={t("Department")}
                  selectedValue={payload?.DepartmentID}
                  options={[
                    { label: "Select Department", value: "" },
                    ...DepartmentData,
                  ]}
                />
              </div>
              <div className="col-sm-2">
                <SelectBox
                  options={[
                    { label: "Select Category", value: "" },
                    ...Category,
                  ]}
                  name={"BillingCategoryID"}
                  id="BillingCategoryID"
                  placeholder=""
                  lable={t("Category")}
                  selectedValue={payload?.BillingCategoryID}
                  onChange={handleSelectChangeDoctor}
                />
              </div>
              {state?.searchType == "2" && (
                <>
                  <div className="col-sm-2">
                    <SelectBox
                      options={DoctorData}
                      onChange={handleSelectChangeDoctor}
                      name={"DoctorID"}
                      id="DoctorID"
                      placeholder=""
                      lable={t("Doctor")}
                      selectedValue={payload?.DoctorID}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          {secondLoading ? (
            <Loading />
          ) : (
            <>
              {formTableNew.length > 0 && (
                <div className="card">
                  <div className="row">
                    <div
                      className={`col-12 ${
                        formTableNew.length > 8 && "boottable"
                      }`}
                    >
                      <Table>
                        <thead>
                          <tr>
                            <th>{t("S.No")}</th>
                            <th>{t("Test Code")}</th>
                            <th>{t("Investigation Name")}</th>
                            <th>
                              {t("DocShare Amt")}
                              <Input
                                className="form-control ui-autocomplete-input input-sm"
                                type="number"
                                name="DocShareAmt"
                                id="DocShareAmt"
                                placeholder={t("Enter Amount")}
                                onChange={handleChangeNew}
                              />
                            </th>
                            <th>
                              {t("DocShare Per (%)")}
                              <Input
                                className="form-control ui-autocomplete-input input-sm"
                                type="number"
                                name="DocSharePer"
                                id="DocSharePer"
                                placeholder={t("Enter Percent(%)")}
                                onChange={handleChangeNew}
                              />
                            </th>
                            <th>
                              <input
                                type="checkbox"
                                name="isChecked"
                                onChange={handleChangeNew}
                                disabled={validation()}
                                checked={
                                  formTableNew?.length > 0
                                    ? isChecked(
                                        "isChecked",
                                        formTableNew,
                                        true
                                      ).includes(false)
                                      ? false
                                      : true
                                    : false
                                }
                              />
                            </th>
                          </tr>
                        </thead>
                        {formTableNew.map((ele, index) => (
                          <tbody>
                            <tr key={index}>
                              <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                              <td data-title={t("Test Code")}>
                                {ele?.TestCode}&nbsp;
                              </td>
                              <td data-title={t("Investigation Name")}>
                                {ele?.InvestigationName}&nbsp;
                              </td>
                              <td data-title={t("DocShare Amt")}>
                                <Input
                                  type="number"
                                  name="DocShareAmt"
                                  id="DocShareAmt"
                                  onInput={(e) => number(e, 6)}
                                  value={ele?.DocShareAmt}
                                  onChange={(e) => handleChangeNewOne(e, index)}
                                />
                              </td>
                              <td data-title={t("DocSharePer")}>
                                <Input
                                  type="number"
                                  name="DocSharePer"
                                  id="DocSharePer"
                                  onInput={(e) => number(e, 3)}
                                  value={ele?.DocSharePer}
                                  onChange={(e) => handleChangeNewOne(e, index)}
                                />
                              </td>
                              <td data-title={t("Status")}>
                                <input
                                  type="checkbox"
                                  name="isChecked"
                                  checked={ele?.isChecked}
                                  disabled={
                                    ele?.DocSharePer || ele?.DocShareAmt
                                      ? false
                                      : true
                                  }
                                  onChange={(e) => handleChangeNewOne(e, index)}
                                />
                              </td>
                            </tr>
                          </tbody>
                        ))}
                      </Table>
                      {formTableNew?.length > 0 &&
                        isChecked("isChecked", formTableNew, true).includes(
                          true
                        ) && (
                          <div className="box-footer">
                            <div className="col-sm-1">
                              <button
                                type="button"
                                className="btn btn-block btn-success btn-sm"
                                id="btnSave"
                                title="Save"
                                onClick={handleSubmit}
                              >
                                {t("Save")}
                              </button>
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default SetDoctorShare;
