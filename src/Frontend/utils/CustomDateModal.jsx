import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import Modal from "../../components/Modal/Modal";
import DatePicker2 from "../../components/CommonComponent/DatePickerwithindex";
import Input from "../../components/CommonComponent/Input";
import Loading from "../../components/Loading/Loading";
import { isChecked } from "../util/Commonservices";

function CustomDateModal({ show, data, onHide }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState({
    search: false,
    update: false,
  });
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState([]);
  const [tableData, setTableData] = useState([]);

  const fetch = () => {
    setTableData([]);

    const payload = {
      TestId: data?.split(","),
    };

    axiosInstance
      .post("RE/CustomizedDate", payload)
      .then((res) => {
        setLoading({ ...loading, search: false });
        if (typeof res.data.message === "string") {
          toast.error("No record found");
          setTableData([]);
        } else {
          const val = res?.data?.message.map((item, index) => {
            const isValidDate = (dateString) => {
              const dateRegex = /^\d{2}-\w{3}-\d{4} \d{2}:\d{2}:\d{2}$/;
              return dateRegex.test(dateString);
            };

            return {
              VisitNo: item?.VisitNo,
              RegDate: isValidDate(item?.RegistrationDate)
                ? new Date(item?.RegistrationDate)
                : null,
              SampleDate: isValidDate(item?.SampleCollectionDate)
                ? new Date(item?.SampleCollectionDate)
                : null,
              ReDate: isValidDate(item?.ResultEnteredDate)
                ? new Date(item?.ResultEnteredDate)
                : null,
              ApprovalDate: isValidDate(item?.ApprovedDate)
                ? new Date(item?.ApprovedDate)
                : null,
              TestId: item?.Testid,
              ItemName: item?.TestName,
              isActive: false,
              status: item?.status,
            };
          });
          const errors = res?.data?.message.map((item) => {
            return {
              sample: false,
              re: false,
              approval: false,
              sampleerror: "",
              reerror: "",
              regerror: "",
            };
          });
          setErrors(errors);
          setTableData(val);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setFormData({
          FromDate: new Date(),
          ToDate: new Date(),
          ItemValue: "",
          SelectTypes: "",
          RefundFilter: null,
          FromTime: "00:00:00",
          ToTime: "23:59:59",
          CentreID: "",
        });
      });
  };

  const handleDateChange = (index, fieldName, date) => {
    const updatedTableData = [...tableData];
    updatedTableData[index][fieldName] = date;
    setTableData(updatedTableData);
  };

  const dateSelect = (date, name) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  const handleTime = (time, secondName, data, index) => {
    const newDate = new Date(data);
    const hours = time.Hour;
    const minutes = time.Minute;
    const seconds = time.Second;

    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    newDate.setSeconds(seconds);

    const updatedTableData = [...tableData];
    updatedTableData[index][secondName] = newDate;
    setTableData(updatedTableData);
  };

  const validateDates = (table) => {
    const newErrors = [...errors];
    console.log(newErrors);
    console.log(table, tableData);
    table.forEach((item, index) => {
      const regDate = item?.DATE;
      const sampleDate = item?.SampleDate;
      // const resultEnteredDate = item?.ResultEnteredDate;
      const approvedDate = item?.ApprovedDate;

      if (item.isActive == false) {
        newErrors[index] = {
          reg: false,
          sample: false,
          approval: false,
          sampleerror: "",
          // reerror:'',
          regerror: "",
        };
      } else {
        if (regDate && approvedDate) {
          if (!moment(regDate).isBefore(approvedDate)) {
            newErrors[index].sample = false;
            newErrors[index].re = false;
            newErrors[index].reg = true;
            newErrors[index].regerror =
              "Regsiteration Date must be before approval date";
          } else {
            newErrors[index].sample = false;
            newErrors[index].re = false;
            newErrors[index].sampleerror = "";
            newErrors[index].reg = false;
            newErrors[index].regerror = "";
          }
        }

        if (sampleDate && approvedDate) {
          if (!moment(sampleDate).isBefore(approvedDate)) {
            // newErrors[index].re = true;
            newErrors[index].sample = true;
            newErrors[index].reerror =
              "Sample Collection date must be before approval date";
          } else {
            newErrors[index].approval = false;
            newErrors[index].sample = false;
            newErrors[index].reerror = "";
          }
        }
      }
    });

    setErrors(newErrors);
    console.log(newErrors);
    for (let i of newErrors) {
      for (const key in i) {
        if (i[key] == true) {
          return false;
        }
      }
    }
    return true;
  };
  const getIndexesWithTrueValue = (arr) => {
    const indexes = [];
    arr.forEach((obj, index) => {
      for (const key in obj) {
        if (obj[key] === true) {
          indexes.push(index);
          break;
        }
      }
    });
    return indexes;
  };

  const handleUpdateTime = () => {
    setErrors([]);

    const payload = tableData.map((item) => {
      return {
        DATE:
          item?.RegDate == null
            ? null
            : moment(item?.RegDate).format("YYYY-MM-DD HH:mm:ss"),
        SampleDate:
          item?.SampleDate == null
            ? null
            : moment(item?.SampleDate).format("YYYY-MM-DD HH:mm:ss"),
        ApprovedDate:
          item?.ApprovalDate == null
            ? null
            : moment(item?.ApprovalDate).format("YYYY-MM-DD HH:mm:ss"),
        // ResultEnteredDate: item?.ReDate == null ? null : moment(item?.ReDate).format('YYYY-MM-DD HH:mm:ss'),
        LedgerTransactionNo: item?.VisitNo,
        TestId: item?.TestId,
        isActive: item?.isActive,
      };
    });
    const validate = validateDates(payload);
    console.log(validate);
    if (validate === true) {
      setLoading({ ...loading, update: true });
      const table = payload.filter((item) => {
        return item.isActive == true;
      });
      axios
        .post("/api/v1/RE/UpdateCustomizedDate", { data: table })
        .then((res) => {
          toast.success("Date updated succesfully");

          setLoading({ ...loading, update: false });
          fetch();
          onHide();
        })
        .catch((err) => {
          setLoading({ ...loading, update: false });
        });
    } else {
      const indexes = getIndexesWithTrueValue(errors);
      const sampleError = errors[indexes[0]]?.sampleerror;
      const reError = errors[indexes[0]]?.reerror;
      const regError = errors[indexes[0]]?.regerror;

      if (sampleError && sampleError.length > 0) {
        toast.error(sampleError);
      } else if (regError && regError.length > 0) {
        toast.error(regError);
      } else {
        toast.error(reError);
      }
    }
  };
  const handlesearchTime = (time, secondName) => {
    let TimeStamp = "";
    TimeStamp = time?.Hour + ":" + time?.Minute + ":" + time?.second;

    setFormData({ ...formData, [secondName]: TimeStamp });
  };

  const handleCheckbox = (e) => {
    const { checked } = e.target;
    const data = tableData?.map((ele) => {
      if (![4, 11].includes(ele?.status)) {
        return {
          ...ele,
          isActive: checked ? "1" : "0",
        };
      } else {
        return {
          ...ele,
          isActive: "0",
        };
      }
    });

    setTableData(data);
  };
  const handleCollection = (e, index, data) => {
    const { name, checked } = e.target;
    const datas = [...tableData];
    datas[index][name] = checked ? "1" : "0";
    setTableData(datas);
  };
  const isValidTime = (dateTimeString) => {
    if (!dateTimeString) return false;
    const timeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
    return timeRegex.test(dateTimeString);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getTimeDropdown = (type, state) => {
    axios
      .post("/api/v1/Global/GetGlobalData", {
        Type: type,
      })
      .then((res) => {
        const data = res?.data?.message;
        const val = data?.map((ele) => {
          return {
            label: ele?.FieldDisplay,
            value: ele?.FieldDisplay,
          };
        });
        state(val);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleClose = () => {
    onHide();
  };
  useEffect(() => {
    fetch();
  }, []);

  return (
    <>
      <Modal title={"Customize Date"} handleClose={handleClose}>
        {tableData.length > 0 && (
          <div className="box mb-4">
            <div
              className={`card-body ${
                tableData.length > 8 ? "boottable" : ""
              } table-responsive`}
            >
              <div
                className=" box-body divResult table-responsive mt-4"
                id="no-more-tables"
              >
                <table
                  className="table table-bordered table-hover table-striped tbRecord"
                  cellPadding="{0}"
                  cellSpacing="{0}"
                >
                  <thead>
                    <tr>
                      <th>{t("S.No")}</th>
                      <th>{t("Visit No.")}</th>
                      <th>{t("Test Name")}</th>
                      <th>{t("Registration Date and Time")}&nbsp;</th>
                      <th>{t("Sample Collection Date and Time")}&nbsp;</th>

                      <th>{t("Approval Date and Time")}</th>

                      <th>
                        {t("Update")}
                        <br></br>
                        <Input
                          type="checkbox"
                          checked={
                            tableData.length > 0
                              ? isChecked("isActive", tableData, "1").includes(
                                  false
                                )
                                ? false
                                : true
                              : false
                          }
                          onChange={handleCheckbox}
                        />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((data, index) => (
                      <tr key={index}>
                        <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                        <td data-title={t("Visit No")}>{data.VisitNo}</td>
                        <td
                          data-title={t("Test Name")}
                          style={{ width: "100px" }}
                        >
                          {data.ItemName}
                        </td>
                        <td data-title={t("Registeration Date")}>
                          <div
                            className={`${errors[index].reg ? "wdate" : ""}`}
                          >
                            {data.RegDate !== null ? (
                              <DatePicker2
                                key={`RegDate_${index}`}
                                name="RegDate"
                                secondName="RegDate"
                                date={
                                  data.RegDate ? new Date(data.RegDate) : null
                                }
                                onChange={(date) =>
                                  handleDateChange(index, "RegDate", date)
                                }
                                onChangeTime={(time) =>
                                  handleTime(
                                    time,
                                    "RegDate",
                                    data.RegDate,
                                    index
                                  )
                                }
                                time={data.RegDate ? data.RegDate : null}
                                disabled={data?.isActive == false}
                              />
                            ) : (
                              <span>{t("No Date Available")}</span>
                            )}
                          </div>
                        </td>
                        <td data-title={t("Sample Collection Date")}>
                          <div
                            className={`${errors[index].sample ? "wdate" : ""}`}
                          >
                            {data.SampleDate !== null ? (
                              <DatePicker2
                                name={`SampleDate_${index}`}
                                secondName="SampleDate"
                                date={
                                  data.SampleDate
                                    ? new Date(data.SampleDate)
                                    : null
                                }
                                onChange={(date) =>
                                  handleDateChange(index, "SampleDate", date)
                                }
                                onChangeTime={(time) =>
                                  handleTime(
                                    time,
                                    "SampleDate",
                                    data.SampleDate,
                                    index
                                  )
                                }
                                time={data.SampleDate ? data.SampleDate : null}
                                maxTime={new Date()}
                                disabled={data?.isActive == false}
                              />
                            ) : (
                              <span style={{ fontSize: "14px", color: "red" }}>
                                {t("Sample Not Collected")}
                              </span>
                            )}
                          </div>
                        </td>

                        <td data-title={t("Approval Date")}>
                          <div
                            className={`${
                              errors[index].approval ? "wdate" : ""
                            }`}
                          >
                            {data.ApprovalDate !== null ? (
                              <DatePicker2
                                name={`ApprovalDate_${index}`}
                                secondName={`ApprovalTime_${index}`}
                                date={
                                  data.ApprovalDate
                                    ? new Date(data.ApprovalDate)
                                    : null
                                }
                                onChange={(date) =>
                                  handleDateChange(index, "ApprovalDate", date)
                                }
                                onChangeTime={(time) =>
                                  handleTime(
                                    time,
                                    "ApprovalDate",
                                    data.ApprovalDate,
                                    index
                                  )
                                }
                                disabled={data?.isActive == false}
                                time={
                                  data.ApprovalDate ? data.ApprovalDate : null
                                }
                              />
                            ) : (
                              <span style={{ fontSize: "14px", color: "red" }}>
                                {t("Result Entry Not Approved")}
                              </span>
                            )}
                          </div>
                        </td>

                        <td data-title={t("Status")}>
                          <Input
                            type="checkbox"
                            name="isActive"
                            checked={data?.isActive === "1" ? true : false}
                            disabled={
                              [4, 11].includes(data?.status) ? true : false
                            }
                            onChange={(e) => handleCollection(e, index, data)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {loading.update && <Loading />}
                {!loading.update &&
                  tableData.some((item) => item.isActive == "1") && (
                    <div className="col-sm-1" style={{ marginTop: "9px" }}>
                      <button
                        className="btn btn-success btn-sm btn-block"
                        onClick={handleUpdateTime}
                      >
                        {t("Update")}
                      </button>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export default CustomDateModal;
