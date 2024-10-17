import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import PageHead from "../../components/CommonComponent/PageHead";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import Table from "../../components/Table/Table";
import Loading from "../../components/Loading/Loading";
import NoRecordFound from "../../components/CommonComponent/NoRecordFound";

const OutSourceTestMaster = () => {
  const [load, setLoad] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [TestSuggestion, setTestSuggestion] = useState([]);
  const [CentreData, setCentreData] = useState([]);
  const [OutSourceLabData, setOutSourceLabData] = useState([]);
  const [Department, setDepartment] = useState([]);
  const [payload, setPayload] = useState({
    OutSourceLabID: "0",
    OutSourceLabName: "",
    BookingCentreID: "",
    BookingCentreName: "",
    DepartmentID: "",
    InvestigationID: "0",
  });

  const { t } = useTranslation();

  const validationFields = (key) => {
    let error = "";
    if (!payload?.BookingCentreID) {
      error = "Please Select From Centre  ";
    } else if (!payload?.DepartmentID) {
      error = "Please Select Department ";
    } else if (!payload?.OutSourceLabID) {
      error = "Please Select OutSourceLab ";
    }
    return key ? error : "";
  };

  const handleSelectChange = (event) => {
    const { name, value, selectedIndex } = event?.target;
    const label = event?.target?.children[selectedIndex].text;
    if (name === "OutSourceLabID") {
      setPayload({
        ...payload,
        [name]: value,
        OutSourceLabName: label,
      });
      handleSearch(
        value,
        label,
        payload.BookingCentreID,
        payload.BookingCentreName,
        payload.DepartmentID,
        payload.InvestigationID,
        false
      );
    } else if (name === "BookingCentreID") {
      setPayload({
        ...payload,
        [name]: value,
        BookingCentreName: label,
      });
      handleSearch(
        payload.OutSourceLabID,
        payload.OutSourceLabName,
        value,
        label,
        payload.DepartmentID,
        payload.InvestigationID,
        false
      );
    } else if (name === "DepartmentID") {
      setPayload({
        ...payload,
        [name]: value,
      });
      handleSearch(
        payload.OutSourceLabID,
        payload.OutSourceLabName,
        payload.BookingCentreID,
        payload.BookingCentreName,
        value,
        payload.InvestigationID,
        false
      );
      BindTestData(value);
    } else {
      setPayload({
        ...payload,
        [name]: value,
      });
      handleSearch(
        payload.OutSourceLabID,
        payload.OutSourceLabName,
        payload.BookingCentreID,
        payload.BookingCentreName,
        payload.DepartmentID,
        value,
        false
      );
    }
  };

  const getDepartment = () => {
    axiosInstance
      .get("Department/getDepartment")
      .then((res) => {
        let data = res.data.message;
        let Department = data.map((ele) => {
          return {
            value: ele.DepartmentID,
            label: ele.Department,
          };
        });
        Department.unshift({ label: "Select", value: "" });
        setDepartment(Department);
      })
      .catch((err) => console.log(err));
  };

  const getOutSourceLabData = () => {
    axiosInstance
      .get("OutSourceLabMaster/getOutSourceLabData")
      .then((res) => {
        let data = res.data.message;
        let OutSourceLabData = data.map((ele) => {
          return {
            value: ele.OutSourceLabID,
            label: ele.LabName,
          };
        });
        OutSourceLabData.unshift({ label: "Select", value: "" });
        setOutSourceLabData(OutSourceLabData);
      })
      .catch((err) => console.log(err));
  };

  const handleSearch = (
    OutSourceLabID,
    OutSourceLabName,
    BookingCentreID,
    BookingCentreName,
    DepartmentID,
    InvestigationID,
    key
  ) => {
    const generatedError = validationFields(key);
    if (generatedError === "") {
      setLoad(true);
      axiosInstance
        .post("OutSourceLabRateListMaster/BindItemRateListTable", {
          OutSourceLabID: OutSourceLabID,
          OutSourceLabName: OutSourceLabName,
          BookingCentreID: BookingCentreID,
          BookingCentreName: BookingCentreName,
          DepartmentID: DepartmentID,
          InvestigationID: InvestigationID,
        })
        .then((res) => {
          const data = res?.data?.message;
          const val = data?.map((ele) => {
            return {
              ...ele,
              isDefault: "0",
            };
          });
          setTableData(val);
          setLoad(false);
        })
        .catch((err) => {
          setTableData([]);
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
          setLoad(false);
        });
    } else {
      setTableData([]);
      toast.error(generatedError);
    }
  };

  const handleSave = () => {
    setLoad(true);
    const data = tableData.filter((ele) => ele?.isDefault == "1");
    const newPayload = data.map((ele) => {
      return {
        ...ele,
        OutSourceLabID: ele?.LabID,
        BookingCentreID: ele?.CentreID,
      };
    });
    if (data?.length > 0) {
      const checkrate = newPayload?.filter(
        (ele) => ele?.OutSourceRate == 0 || ele?.OutSourceRate == null
      );
      if (checkrate?.length == 0) {
        axiosInstance
          .post("OutSourceLabRateListMaster/SaveRateList", {
            OutSourceData: newPayload,
          })
          .then((res) => {
            toast.success(res?.data?.message);
            setLoad(false);
            handleSearch(
              payload.OutSourceLabID,
              payload.OutSourceLabName,
              payload.BookingCentreID,
              payload.BookingCentreName,
              payload.DepartmentID,
              payload.InvestigationID,
              true
            );
          })
          .catch((err) => {
            toast.error(
              err?.data?.message ? err?.data?.message : "Something Went Wrong"
            );
            setLoad(false);
          });
      } else {
        setLoad(false);
        toast.error("Selected Test Rate Cannot Be Null Or Zero");
      }
    } else {
      setLoad(false);
      toast.error("Please Choose One Test");
    }
  };

  const handleRemove = () => {
    setLoad(true);
    const data = tableData.filter((ele) => ele?.isDefault == "1");
    const newPayload = data.map((ele) => {
      return {
        ...ele,
        OutSourceLabID: ele?.LabID,
        BookingCentreID: ele?.CentreID,
      };
    });
    axiosInstance
      .post("OutSourceLabRateListMaster/UpdateRateList", {
        OutSourceData: newPayload,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        setLoad(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
        setLoad(false);
      });
  };

  const BindTestData = (value) => {
    axiosInstance
      .post("OutSourceTestToOtherLab/GetInvestigationsWithDepartment", {
        DepartmentID: value,
      })
      .then((res) => {
        const data = res?.data?.message;
        const val = data.map((ele) => {
          return {
            label: ele?.TestName,
            value: ele?.InvestigationID,
          };
        });
        val.unshift({ label: "Investigation", value: "0" });
        setTestSuggestion(val);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  console.log(tableData, payload);
  const handleChangeNew = (e, index) => {
    const { name, value, type, checked } = e.target;
    if (index >= 0) {
      let data = [...tableData];
      data[index][name] = type === "checkbox" ? (checked ? "1" : "0") : value;
      setTableData(data);
    } else {
      let data = tableData.map((ele) => {
        return {
          ...ele,
          [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
        };
      });
      setTableData(data);
    }
  };

  const handleRateChange = (e, index) => {
    const { name, value } = e.target;
    const datas = [...tableData];
    datas[index][name] = value;
    setTableData(datas);
  };

  const getAccessCentres = () => {
    axiosInstance
      .get("Centre/getAccessCentres")
      .then((res) => {
        let data = res.data.message;
        let CentreDataValue = data.map((ele) => {
          return {
            value: ele.CentreID,
            label: ele.Centre,
          };
        });
        CentreDataValue.unshift({ label: "Select", value: "" });
        setCentreData(CentreDataValue);
      })
      .catch((err) => console.log(err));
  };

  const ShowBtn = () => {
    const val = tableData.filter((ele) => ele?.isDefault == "1");
    return val.length > 0 ? true : false;
  };

  useEffect(() => {
    getAccessCentres();
    getDepartment();
    BindTestData("");
    getOutSourceLabData();
  }, []);

  return (
    <>
      <PageHead name="OutSource Test Master" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <SelectBox
                name="BookingCentreID"
                options={CentreData}
                onChange={handleSelectChange}
                selectedValue={payload?.BookingCentreID}
                lable="From Centre"
              />
            </div>
            <div className="col-sm-2">
              <SelectBox
                name="OutSourceLabID"
                options={OutSourceLabData}
                selectedValue={payload?.OutSourceLabID}
                onChange={handleSelectChange}
                lable="OutSource Lab"
              />
            </div>
            <div className="col-sm-2">
              <SelectBox
                name="DepartmentID"
                options={Department}
                selectedValue={payload?.DepartmentID}
                onChange={handleSelectChange}
                lable="Department"
              />
            </div>
            <div className="col-sm-2">
              <SelectBox
                name="InvestigationID"
                options={TestSuggestion}
                selectedValue={payload?.InvestigationID}
                onChange={handleSelectChange}
                lable="Investigation"
              />
            </div>
            <div className="col-sm-1">
              <button
                className="btn btn-block btn-primary btn-sm"
                onClick={() =>
                  handleSearch(
                    payload.OutSourceLabID,
                    payload.OutSourceLabName,
                    payload.BookingCentreID,
                    payload.BookingCentreName,
                    payload.DepartmentID,
                    payload.InvestigationID,
                    true
                  )
                }
              >
                {t("Search")}
              </button>
            </div>
          </div>
        </div>
      </PageHead>
      {tableData?.length > 0 ? (
        <div className="card">
          <Table>
            <thead className="cf">
              <tr>
                {[
                  t("S.No"),
                  t("Centre"),
                  t("Lab Name"),
                  t("Investigation"),
                  t("Out Source Test Code"),
                  t("Out Source Rate"),
                  t("Select"),
                ].map((ele, index) => (
                  <th key={index}>{ele}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((item, index) => (
                <tr key={index}>
                  <td data-title={t("S.No")}>{index + 1}</td>
                  <td data-title={t("Centre")}>{item?.CentreName}</td>
                  <td data-title={t("Lab Name")}>{item?.LabName}</td>
                  <td data-title={t("Investigation")}>
                    {item?.Investigation}&nbsp;
                  </td>
                  <td
                    data-title={t("OutSourceTestCode")}
                    style={{ textAlign: "center" }}
                  >
                    {item?.isDefault == 1 ? (
                      <input
                        max={20}
                        name="OutSourceTestCode"
                        value={item?.OutSourceTestCode}
                        onChange={(e) => handleRateChange(e, index)}
                      />
                    ) : (
                      item?.OutSourceTestCode
                    )}
                  </td>
                  <td
                    data-title={t("Out Source Rate")}
                    style={{ textAlign: "center" }}
                  >
                    {item?.isDefault == 1 ? (
                      <input
                        max={6}
                        name="OutSourceRate"
                        value={item?.OutSourceRate}
                        onChange={(e) => handleRateChange(e, index)}
                      />
                    ) : (
                      item?.OutSourceRate
                    )}
                    &nbsp;
                  </td>

                  <td data-title={t("Select")}>
                    {
                      <div>
                        <input
                          type="checkbox"
                          name="isDefault"
                          checked={item?.isDefault == "1" ? true : false}
                          onChange={(e) => handleChangeNew(e, index)}
                        />
                      </div>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {load ? (
            <Loading />
          ) : (
            ShowBtn() && (
              <>
                <div className="box-footer">
                  <div className="row">
                    <div className="col-sm-1">
                      <button
                        className="btn btn-block btn-success btn-sm"
                        onClick={handleSave}
                      >
                        {t("Save")}
                      </button>
                    </div>

                    <div className="col-sm-1">
                      <button
                        className="btn btn-block btn-danger btn-sm"
                        onClick={handleRemove}
                      >
                        {t("Remove")}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )
          )}
        </div>
      ) : (
        <div className="card">
          <NoRecordFound />
        </div>
      )}
    </>
  );
};

export default OutSourceTestMaster;
