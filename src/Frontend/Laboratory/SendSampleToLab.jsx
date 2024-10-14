import React, { useEffect, useState } from "react";
import PageHead from "../../components/CommonComponent/PageHead";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  getAccessCentres,
  getCollectionBoy,
} from "../../utils/NetworkApi/commonApi";
import moment from "moment";
import { axiosInstance } from "../../utils/axiosInstance";
import Input from "../../components/CommonComponent/Input";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import DatePicker from "../../components/CommonComponent/DatePicker";
import CustomTimePicker from "../../components/CommonComponent/TimePicker";
import Loading from "../../components/Loading/Loading";
import { Status } from "../../utils/Constants";
import { Time } from "../../utils/helpers";
import Table from "../../components/Table/Table";
const SendSampleToLab = () => {
  const [Center, setCenter] = useState([]);

  const [CollectionBoy, setCollectionBoy] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [ToCenter, setToCenter] = useState([]);
  const [load, setLoad] = useState({
    searchLoad: false,
    saveLoad: false,
  });
  const [errors, setErrors] = useState({});
  const { t, i18n } = useTranslation();
  const today = new Date();
  const [payload, setPayload] = useState({
    FromCentre: "",
    DATE: new Date(),
    ToDate: new Date(),
    FromTime: new Date(today.setHours(0, 0, 0, 0)),
    ToTime: new Date(today.setHours(23, 59, 59, 999)),
    Status: "1",
    ToCentre: "",
    EqualCentre: 1,
    FieldBoyID: "",
    FieldBoyName: "",
    ChkForce: 0,
    TestName: "",
  });

  const handleSelection = (event) => {
    const { name, value, selectedIndex } = event?.target;
    const label = event?.target?.children[selectedIndex].text;
    if (name === "FieldBoyID") {
      setPayload({
        ...payload,
        [name]: value,
        FieldBoyName: label,
      });
    }

    if (name == "FromCentre") {
      setPayload({
        ...payload,
        [name]: value,
      });
      getToAccessCenter(value);
    } else {
      setPayload({ ...payload, [name]: value });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setPayload({
      ...payload,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const validationFields = () => {
    let errors = "";
    if (payload?.ToCentre === "") {
      errors = { ...errors, ToCenter: "Please Select Centre" };
    }
    if (payload?.FieldBoyID === "") {
      errors = {
        ...errors,
        FieldBoyID: "Please Select Collection Boy",
      };
    }
    return errors;
  };
  const handleTime = (time, name) => {
    setPayload({ ...payload, [name]: time });
  };

  const handleSave = () => {
    const generatedError = validationFields();
    if (generatedError === "") {
      setErrors({});
      let data = tableData?.filter((ele) => ele?.isSelected === true);
      if (data.length > 0) {
        setLoad({ ...load, saveLoad: true });

        const newdata = data.map((ele) => {
          return {
            ...ele,
            TestID: ele?.TestID,
            BarcodeNo: ele?.BarcodeNo,
            VisitID: ele?.LedgerTransactionNo,
            PatientCode: ele?.PatientCode,
            ItemName: ele?.TestName,
            FromCentre: payload?.FromCentre,
            ToCentre: payload?.ToCentre,
            FieldBoyID: payload?.FieldBoyID,
            FieldBoyName: payload?.FieldBoyName,
          };
        });
        axiosInstance
          .post("SendSampleToLab/SendSampleToLab", newdata)
          .then((res) => {
            toast.success(res?.data?.message);
            setTableData([]);
            setLoad({ ...load, saveLoad: false });
          })
          .catch((err) => {
            toast.error(
              err?.response?.data?.message
                ? err?.response?.data?.message
                : "Error Occured"
            );
            setLoad({ ...load, saveLoad: false });
          });
      } else {
        toast.error("Please Choose One Value");
      }
    } else {
      setErrors(generatedError);
    }
  };

  const handleSelectValue = () => {
    let match = false;
    for (let i = 0; i < tableData.length; i++) {
      if (tableData[i]["isSelected"]) {
        match = true;
        break;
      }
    }
    return match;
  };
  const dateSelect = (value, name) => {
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const getToAccessCenter = (value) => {
    axiosInstance
      .post("SendSampleToLab/TransferCentreList", {
        BookingCentreID: value ?? "",
      })
      .then((res) => {
        let data = res?.data?.message;
        data = data.filter((ele) => ele?.CentreID != payload?.FromCentre);
        const val = data.map((ele) => {
          return {
            value: ele?.CentreID,
            label: ele?.Centre,
          };
        });
        setToCenter(val);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSearch = () => {
    const generatedError = validation();
    if (generatedError === "") {
      setLoad({ ...load, searchLoad: true });
      axiosInstance
        .post("SendSampleToLab/SearchDataToSendSample", {
          ...payload,
          DATE: moment(payload?.DATE).format("YYYY-MM-DD"),
          ToDate: moment(payload?.ToDate).format("YYYY-MM-DD"),
          TestCentre: payload?.ToCentre,
          FromTime: Time(payload.FromTime),
          ToTime: Time(payload.ToTime),
        })
        .then((res) => {
          const data = res.data.message;
          if (data.length > 0) {
            const val = data.map((ele) => {
              return {
                ...ele,
                isSelected: false,
              };
            });
            setTableData(val);
          } else {
            setTableData([]);
            toast.error("No Data Found");
          }
          setLoad({ ...load, searchLoad: false });
          setErrors({});
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
          setLoad({ ...load, searchLoad: false });
        });
    } else {
      toast.error(generatedError);
    }
  };

  const validation = () => {
    let error = "";
    if (!payload?.FromCentre) {
      error = "Please Select FromCentre.";
    } else if (!payload?.ToCentre) {
      error = "Please Select ToCentre.";
    }
    return error;
  };

  const handleSelected = (e, index) => {
    const { name, checked } = e.target;
    const data = [...tableData];
    data[index][name] = checked;
    setTableData(data);
  };
  useEffect(() => {
    getAccessCentres(setCenter);

    getCollectionBoy(setCollectionBoy);
    getToAccessCenter();
  }, []);
  return (
    <>
      <PageHead name="Send Sample To Lab" showDrop="true">
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <SelectBox
                options={[{ label: "Select", value: "" }, ...Center]}
                name="FromCentre"
                id="FromCentre"
                lable="FromCentre"
                selectedValue={payload?.FromCentre}
                onChange={handleSelection}
              />
            </div>
            <div className="col-sm-2">
              <SelectBox
                options={[{ label: "Select", value: "" }, ...ToCenter]}
                name="ToCentre"
                lable="ToCentre"
                id="ToCentre"
                selectedValue={payload?.ToCentre}
                onChange={handleSelection}
              />
              {errors?.ToCenter && (
                <span className="golbal-Error">{errors?.ToCenter}</span>
              )}
            </div>
            <div className="col-sm-2 ">
              <DatePicker
                className="custom-calendar"
                name="DATE"
                value={payload?.DATE}
                onChange={dateSelect}
                placeholder=" "
                id="DATE"
                lable="FromDate"
                maxDate={new Date(payload?.ToDate)}
              />
              {errors?.FromDate && (
                <span className="golbal-Error">{errors?.FromDate}</span>
              )}
            </div>
            <div className="col-md-1">
              <CustomTimePicker
                name="FromTime"
                placeholder="FromTime"
                value={payload?.FromTime}
                id="FromTime"
                lable="FromTime"
                onChange={handleTime}
              />
            </div>
            <div className="col-sm-2 ">
              <DatePicker
                className="custom-calendar"
                name="ToDate"
                value={payload?.ToDate}
                onChange={dateSelect}
                placeholder=" "
                id="ToDate"
                lable="ToDate"
                maxDate={new Date()}
                minDate={new Date(payload?.Date)}
              />

              {errors?.ToDate && (
                <span className="golbal-Error">{errors?.ToDate}</span>
              )}
            </div>
            <div className="col-md-1">
              <CustomTimePicker
                name="ToTime"
                placeholder="ToTime"
                value={payload?.ToTime}
                id="ToTime"
                lable="ToTime"
                onChange={handleTime}
              />
            </div>
            <div className="col-sm-2">
              <SelectBox
                options={Status}
                name="Status"
                lable="Status"
                id="Status"
                onChange={handleSelection}
                selectedValue={payload?.Status}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-2">
              <input
                name="ChkForce"
                type="checkbox"
                checked={payload?.ChkForce}
                onChange={handleChange}
              />
              <label className="ml-2" htmlFor="ApplicableForAll">
                {t("Show All Sample")}
              </label>
            </div>
            <div className="col-sm-1" style={{ alignSelf: "flex-end" }}>
              {load?.searchLoad ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-info btn-sm btn-block"
                  onClick={handleSearch}
                >
                  {t("Search")}
                </button>
              )}
            </div>
          </div>
        </div>
      </PageHead>

      <div className="card">
        <Table>
          <thead className="cf">
            <tr>
              <th>{t("S.No")}</th>
              <th>{t("Select")}</th>
              <th>{t("DispatchCode")}</th>
              <th>{t("SIN No.")}</th>
              <th>{t("VisitNo")}</th>
              <th>{t("PatientCode")}</th>
              <th>{t("Name")}</th>
              <th>{t("Age")}</th>
              <th>{t("Test")}</th>
            </tr>
          </thead>
          {tableData?.map((data, index) => (
            <tr
              key={index}
              style={{
                backgroundColor: data?.dispatchcode !== "" && "#9795c6",
              }}
            >
              <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
              <td data-title={t("Select")}>
                {data?.issend === 1 && data?.dispatchcode === "" && (
                  <input
                    type="checkbox"
                    checked={data?.isSelected}
                    name="isSelected"
                    className="ml-2"
                    onChange={(e) => handleSelected(e, index)}
                  />
                )}
                &nbsp;
              </td>
              <td data-title={t("DispatchCode")}>
                {data?.dispatchcode ? data?.dispatchcode : "-"}&nbsp;
              </td>
              <td data-title={t("SIN No.")}>{data?.BarcodeNo}&nbsp;</td>
              <td data-title={t("VisitNo")}>
                {data?.LedgerTransactionNo}&nbsp;
              </td>
              <td data-title={t("PatientCode")}>{data?.PatientCode}&nbsp;</td>
              <td data-title={t("Name")}>{data?.PName}&nbsp;</td>
              <td data-title={t("Age")}>
                {data?.Pinfo ? data?.Pinfo : "-"}&nbsp;
              </td>
              <td data-title={t("Test")}>{data?.TestName}&nbsp;</td>
            </tr>
          ))}
        </Table>

        {payload?.Status == 1 && handleSelectValue() && (
          <>
            <div className="row">
              <label className="col-sm-1" style={{ textAlign: "end" }}>
                Field Boy :
              </label>
              <div className="col-sm-2">
                <SelectBox
                  options={[{ label: "Select", value: "" }, ...CollectionBoy]}
                  name="FieldBoyID"
                  selectedValue={payload?.FieldBoyID}
                  onChange={handleSelection}
                />
                {errors?.FieldBoyID && (
                  <span className="error-message">{errors?.FieldBoyID}</span>
                )}
              </div>

              <div className="col-sm-1 mb-2">
                {load?.saveLoad ? (
                  <Loading />
                ) : (
                  <button
                    className="btn btn-success btn-sm btn-block"
                    onClick={handleSave}
                  >
                    {t("Save")}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SendSampleToLab;
