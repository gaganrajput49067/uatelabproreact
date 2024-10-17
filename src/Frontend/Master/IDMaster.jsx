import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getTrimmedData, selectedValueCheck } from "../../utils/helpers";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import PageHead from "../../components/CommonComponent/PageHead";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import Input from "../../components/CommonComponent/Input";
import DatePicker from "../../components/CommonComponent/DatePicker";
import Loading from "../../components/Loading/Loading";
import Table from "../../components/Table/Table";
import { validationForIDMAster } from "../../utils/Schema";

const IDMaster = () => {
  const { t } = useTranslation();
  const [update, setUpdate] = useState(false);
  const [load, setLoad] = useState(false);
  const [err, setErr] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [TypeName, setTypeName] = useState([]);
  const [Separator, setSeparator] = useState([]);
  const [LengthList, setLengthList] = useState([]);
  const [formData, setFormData] = useState({
    TypeID: "",
    TypeName: "",
    InitialChar: "",
    Separator1: "",
    FinancialYearStart: new Date(),
    Separator2: "",
    TypeLength: "",
    Separator3: "",
    FormatPreview: "",
    chkCentre: false,
    chkFinancialYear: false,
    isActive: false,
  });
  console.log(formData);
  // console.log(TypeName);

  const DateSelect = (name, date) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  const getDropDownData = (name) => {
    axiosInstance
      .post("Global/getGlobalData", { Type: name })
      .then((res) => {
        let data = res.data.message;
        let value = data.map((ele) => {
          return {
            label: ele.FieldDisplay,
            value: ele.FieldDisplay,
          };
        });

        switch (name) {
          case "IDMaster":
            value.unshift({ label: "Type Name", value: "" });
            setTypeName(value);
            break;
          case "Separator":
            value.unshift({ label: "Separator", value: "" });
            setSeparator(value);
            break;
        }
      })
      .catch((err) => console.log(err));
  };

  const getIdMasterDropDown = () => {
    axiosInstance
      .get("IDMaster/gettypelengthMaster")
      .then((res) => {
        const data = res?.data?.message;
        const val = data?.map((ele) => {
          return {
            value: ele?.TypeLengthId,
            label: ele?.NAME,
          };
        });
        // val.unshift({ label: "Length", value: "" });
        setLengthList(val);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const getIDMaster = () => {
    axiosInstance
      .get("IDMaster/getIDMasterData", formData)
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.message);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  useEffect(() => {
    let data = moment(formData?.FinancialYearStart).format("YY");
    let val = Number(data) + 1;

    setFormData({
      ...formData,
      FormatPreview: `${formData?.InitialChar}${formData?.Separator1}${
        formData?.chkFinancialYear ? data + val : ""
      }${formData?.Separator2}${formData?.chkCentre ? "CC" : ""}${
        formData?.Separator3
      }${selectedValueCheck(LengthList, formData?.TypeLength).label}`,
    });
  }, [
    formData?.InitialChar,
    formData?.Separator1,
    formData?.FinancialYearStart,
    formData?.chkFinancialYear,
    formData?.Separator2,
    formData?.chkCentre,
    formData?.Separator3,
    formData?.TypeLength,
  ]);

  const editIDMaster = (id) => {
    axiosInstance
      .post("IDMaster/getIDMasterDataByID", {
        TypeID: id,
      })
      .then((res) => {
        const data = res.data.message[0];
        setFormData(data);
      })
      .catch((err) => console.log(err));
    getDropDownData("IDMaster");
  };

  const postData = () => {
    const generatedError = validationForIDMAster(formData);
    if (generatedError == "") {
      setLoad(true);
      if (update === true) {
        axiosInstance
          .post(
            "IDMaster/UpdateIDMasterData",
            getTrimmedData({
              ...formData,
              // chkCentre: formData?.c ? "1" : "0",
              // chkFinancialYear: formData?.chkFinancialYear ? "1" : "0",
              // isActive: "0",
            })
          )
          .then((res) => {
            if (res.data.success) {
              setLoad(false);
              toast.success(res.data.message);
              getIDMaster();
              setFormData({
                TypeID: "",
                TypeName: "",
                InitialChar: "",
                Separator1: "",
                FinancialYearStart: new Date(),
                Separator2: "",
                TypeLength: "",
                Separator3: "",
                FormatPreview: "",
                chkCentre: false,
                chkFinancialYear: false,
                isActive: false,
              });
              setUpdate(false);
            } else {
              toast.error(res.data.message);
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
            "IDMaster/InsertIDMasterDatas",
            getTrimmedData({
              ...formData,
              chkCentre: formData?.chkCentre ? "1" : "0",
              chkFinancialYear: formData?.chkFinancialYear ? "1" : "0",
              isActive: "0",
            })
          )
          .then((res) => {
            if (res.data.success) {
              setLoad(false);
              toast.success(res.data.message);
              setFormData({
                TypeID: "",
                TypeName: "",
                InitialChar: "",
                Separator1: "",
                FinancialYearStart:new Date(),
                Separator2: "",
                TypeLength: "",
                Separator3: "",
                FormatPreview: "",
                chkCentre: false,
                chkFinancialYear: false,
                isActive: false,
              });
              getIDMaster();
            } else {
              toast.error(res.data.message);
              setLoad(false);
            }
          })
          .catch((err) => {
            toast.error(err.response.data.message);
            setLoad(false);
          });
      }
    } else {
      setErr(generatedError);
    }
  };

  useEffect(() => {
    getDropDownData("IDMaster");
    getDropDownData("Separator");
    getIdMasterDropDown();
    getIDMaster();
  }, []);
  return (
    <>
      <PageHead name="ID Master" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <SelectBox
                name="TypeName"
                onChange={handleSelectChange}
                options={TypeName}
                selectedValue={formData?.TypeName}
                lable="Type"
              />
              {formData?.TypeName === "" && (
                <div className="error-message">{err?.TypeName}</div>
              )}
            </div>
            <div className="col-sm-2">
              <Input
                type="text"
                lable="Initial Char"
                name="InitialChar"
                id="InitialChar"
                placeholder=""
                value={formData?.InitialChar}
                onInput={(e) => number(e, 8)}
                onChange={handleChange}
              />
              {formData?.InitialChar === "" && (
                <div className="error-message">{err?.InitialChar}</div>
              )}
            </div>
            <div className="col-sm-2">
              <SelectBox
                name="Separator1"
                onChange={handleSelectChange}
                options={Separator}
                selectedValue={formData?.Separator1}
                lable="Separator"
              />
            </div>
            <div className="col-sm-1">
              <input
                name="chkFinancialYear"
                type="checkbox"
                checked={formData?.chkFinancialYear}
                onChange={handleChange}
                value={formData?.chkFinancialYear}
              />
              <label className="ml-2">{t("Financial Year")}</label>{" "}
            </div>
            <div className="col-sm-2">
              <DatePicker
                className="custom-calendar"
                name="FinancialYearStart"
                id="FinancialYearStart"
                lable="Financial Year Start"
                placeholder=" "
                value={formData?.FinancialYearStart}
                onChange={handleChange}
                maxDate={new Date(formData?.FinancialYearStart)}
              />
            </div>
            <div className="col-sm-2">
              <SelectBox
                name="Separator2"
                onChange={handleSelectChange}
                options={Separator}
                selectedValue={formData?.Separator2}
                lable="Separator"
              />
            </div>
            <div className="col-sm-1">
              <input
                name="chkCentre"
                type="checkbox"
                checked={formData?.chkCentre}
                onChange={handleChange}
              />
              <label className="ml-2">{t("Center")}</label>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-2">
              <SelectBox
                name="Separator3"
                onChange={handleSelectChange}
                options={Separator}
                selectedValue={formData?.Separator3}
                lable="Separator"
              />
            </div>
            <div className="col-sm-2">
              <SelectBox
                name="TypeLength"
                onChange={handleSelectChange}
                options={[{ label: "Length", value: "" }, ...LengthList]}
                selectedValue={formData?.TypeLength}
              />
              {formData?.TypeLength === "" && (
                <div className="error-message">{err?.TypeLength}</div>
              )}
            </div>
            <div className="col-sm-2">
              <Input
                type="text"
                lable="Preview"
                name="FormatPreview"
                id="FormatPreview"
                placeholder=""
                onChange={handleChange}
                value={formData?.FormatPreview}
              />
              {err?.FormatPreview}
            </div>
            <div className="col-sm-1">
              {load ? (
                <Loading />
              ) : (
                <button
                  type="submit"
                  id="btnSave"
                  className="btn btn-success btn-sm btn-block"
                  onClick={postData}
                >
                  {update ? t("Update") : t("Save")}
                </button>
              )}
            </div>
          </div>
        </div>
      </PageHead>
      <div className="card">
        {loading ? (
          <Loading />
        ) : (
          <>
            <div
              className="card"
            >
              <div className="row">
                {data.length > 0 ? (
                  <Table>
                    <thead class="cf">
                      <tr>
                        <th>{t("S.No")}</th>
                        <th>{t("Type Name")}</th>
                        <th>{t("Initial Character")}</th>
                        <th>{t("Separator")}</th>
                        <th>{t("Financial Year")}</th>
                        <th>{t("Separator")}</th>
                        <th>{t("Type Length")}</th>
                        <th>{t("Separator")}</th>
                        <th>{t("Format Preview")}</th>
                        <th>{t("Action")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((data, i) => (
                        <tr key={i}>
                          <td data-title={t("S.No")}>{i + 1}&nbsp;</td>
                          <td data-title={t("Type Name")}>
                            {data?.TypeName}&nbsp;
                          </td>
                          <td data-title={t("Initial Character")}>
                            {data?.InitialChar}&nbsp;
                          </td>
                          <td data-title={t("Separator")}>
                            {data?.Separator1}&nbsp;
                          </td>
                          <td data-title={t("Financial Year")}>
                            {data?.FinancialYearStart !== "0000-00-00 00:00:00"
                              ? moment(data?.FinancialYearStart).format(
                                  "DD MMM YYYY"
                                )
                              : "-"}
                            &nbsp;
                          </td>
                          <td data-title={t("Separator")}>
                            {data?.Separator2}&nbsp;
                          </td>
                          <td data-title={t("Type Length")}>
                            {data?.TypeLength}&nbsp;
                          </td>
                          <td data-title={t("Separator")}>
                            {data?.Separator3}&nbsp;
                          </td>
                          <td data-title={t("Format Preview")}>
                            {data?.FormatPreview}&nbsp;
                          </td>
                          <td data-title={t("Action")}>
                            <div
                              className="text-primary"
                              style={{
                                cursor: "pointer",
                                textDecoration: "underline",
                              }}
                              onClick={() => {
                                window.scroll(0, 0);
                                editIDMaster(data?.TypeID);
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
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default IDMaster;
