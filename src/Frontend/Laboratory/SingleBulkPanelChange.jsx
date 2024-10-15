import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../utils/axiosInstance";
import Input from "../../components/CommonComponent/Input";
import DatePicker from "../../components/CommonComponent/DatePicker";
import Loading from "../../components/Loading/Loading";
import TableSelectBox from "../../components/TableComponent/TableSelectBox";
import Table from "../../components/Table/Table";
import { isChecked } from "../../utils/helpers";
import PageHead from "../../components/CommonComponent/PageHead";

const SingleBulkPanelChange = () => {
  const { t } = useTranslation();
  const [CentreData, setCentreData] = useState([]);
  const [RateData, setRateData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    VisitNo: "",
    FromDate: new Date(),
    ToDate: new Date(),
  });

  const handleChangeNew = (e, index) => {
    const { name, value } = e.target;
    if (name == "NewCentreID") {
      getAccessDataRate(value);
      const data = [...tableData];
      data[index][name] = value;
      data[index]["NewPanelID"] = "";
      setTableData(data);
    }
    if (name == "NewPanelID") {
      const data = [...tableData];
      data[index][name] = value;
      setTableData(data);
    }
  };
  const handleCollection = (e, index) => {
    const { name, checked } = e.target;
    const datas = [...tableData];
    datas[index][name] = checked ? 1 : 0;
    setTableData(datas);
  };
  const handleCheckbox = (e) => {
    const { checked } = e.target;
    const data = tableData?.map((ele) => {
      return {
        ...ele,
        isChecked: checked ? 1 : 0,
      };
    });

    setTableData(data);
  };
  console.log(tableData);
  const handelSave = () => {
    const data = tableData.filter((ele) => ele?.isChecked);
    if (data.length > 0) {
      if (data[0]?.NewPanelID != "" && data[0]?.NewCentreID != "") {
        const val = data?.map((ele) => {
          return {
            NewPanelID: ele?.NewPanelID,
            NewCentreID: ele?.NewCentreID,
            LabNo: ele?.LedgerTransactionNo,
          };
        });
        setLoading(true);
        axiosInstance
          .post("ChangePanel/SaveNewPanelRatesBulk", {
            getData: val,
          })
          .then((res) => {
            toast.success(res?.data?.message);
            getAccessDataRate("");
            setLoading(false);
            setTableData([]);
          })
          .catch((err) => {
            toast.error(
              err?.data?.message
                ? err?.data?.message
                : t("Something Went Wrong")
            );
            setLoading(false);
          });
      } else {
        toast.error("Please Select New Centre and New Panel");
      }
    } else {
      toast.error(t("Please Choose Any Result"));
    }
  };

  const dynamicOperation = (val, property, mode) => {
    if (mode === "sum") {
      return val?.reduce((acc, cur) => acc + Number(cur?.[property] || 0), 0);
    }
    if (mode === "concat") {
      return val?.reduce((acc, cur, index) => {
        return acc + (index ? ", " : "") + (cur?.[property] || "");
      }, "");
    }
  };
  const handelSearch = () => {
    if (formData?.VisitNo?.trim() == "") {
      toast.error("Enter Visit no.");
    } else {
      setLoading(true);
      axiosInstance
        .post("ChangePanel/SearchPanel", {
          searchdata: getTrimmedData({
            labNo: formData?.VisitNo?.trim(),
            FromDate: moment(formData?.FromDate).format("DD-MMM-YYYY"),
            ToDate: moment(formData?.ToDate).format("DD-MMM-YYYY"),
          }),
        })
        .then((res) => {
          if (res?.data?.success) {
            const data = res?.data?.message;
            const val =
              data?.length > 0
                ? [
                    {
                      ...data[0],
                      NewCentreID: "",
                      NewPanelID: "",
                      isChecked: false,
                      Rate: dynamicOperation(data, "Rate", "sum"),
                      NewRate: dynamicOperation(data, "NewRate", "sum"),
                      ItemName: dynamicOperation(data, "ItemName", "concat"),
                    },
                  ]
                : [];
            setTableData(val);
          } else {
            toast.error(res?.data?.message);
          }
          setLoading(false);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something Wents Wrong"
          );
          setLoading(false);
        });
    }
  };

  const dateSelect = (value, name) => {
    setFormData({
      ...formData,
      [name]: value,
    });
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

        setCentreData(CentreDataValue);
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getAccessDataRate = (centerID) => {
    axiosInstance
      .post("Centre/getRateTypeWithCentre", {
        CentreID: centerID,
      })
      .then((res) => {
        const data = res?.data?.message;
        const val = data.map((ele) => {
          return {
            value: ele?.RateTypeID,
            label: ele?.RateTypeName,
          };
        });
        setRateData(val);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getAccessDataRate("");
    getAccessCentres();
  }, []);

  return (
    <>
      <PageHead name="Single Bulk Panel Change" showDrop={true}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2 ">
              <Input
                placeholder=" "
                id="VisitNo"
                type="text"
                lable="VisitNo"
                name="VisitNo"
                value={formData?.VisitNo}
                onChange={handleChange}
              />
            </div>

            <div className="col-sm-2">
              <DatePicker
                className="custom-calendar"
                name="FromDate"
                id="From Date"
                lable="From Date"
                value={formData?.FromDate}
                onChange={dateSelect}
                maxDate={new Date(formData?.ToDate)}
              />
            </div>

            <div className="col-sm-2">
              <DatePicker
                className="custom-calendar"
                id="To Date"
                lable="To Date"
                name="ToDate"
                value={formData?.ToDate}
                onChange={dateSelect}
                maxDate={new Date()}
                minDate={new Date(formData.FromDate)}
              />
            </div>
            <div className="col-sm-1">
              <button
                className="btn btn-block btn-info btn-sm"
                onClick={handelSearch}
              >
                {t("Search")}
              </button>
            </div>
          </div>
        </div>
      </PageHead>
      {loading ? (
        <Loading />
      ) : (
        <>
          {tableData?.length > 0 && (
            <div className="card">
              <Table>
                <thead className="cf">
                  <tr>
                    {[
                      t("S.No."),
                      t("Visit No"),
                      t("PatientName"),
                      t("Age"),
                      t("Gender"),
                      t("Investigation"),
                      t("Old Centre"),
                      t("Old Panel"),
                      t("New Centre"),
                      t("New Panel"),

                      <input
                        type="checkbox"
                        checked={
                          tableData.length > 0
                            ? isChecked("isChecked", tableData, true).includes(
                                false
                              )
                              ? false
                              : true
                            : false
                        }
                        onChange={handleCheckbox}
                      />,
                    ].map((ele, index) => (
                      <th key={index}>{ele}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((ele, index) => (
                    <tr key={index}>
                      <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                      <td data-title={t("Visit No")}>
                        {ele?.LedgerTransactionNo}&nbsp;
                      </td>
                      <td data-title={t("PatientName")}>{ele?.PName}&nbsp;</td>
                      <td data-title={t("Age")}>{ele?.Age}&nbsp;</td>
                      <td data-title={t("Gender")}>{ele?.Gender}&nbsp;</td>
                      <td data-title={t("Investigation")}>
                        {ele?.ItemName}&nbsp;
                      </td>
                      <td data-title={t("Old Centre")}>
                        {ele?.OldCentre}&nbsp;
                      </td>
                      <td data-title={t("Old Panel")}>{ele?.OldPanel}&nbsp;</td>
                      <td data-title={t("New Centre")}>
                        <TableSelectBox
                          options={[
                            { label: "Select New Centre", value: "" },
                            ...CentreData,
                          ]}
                          selectedValue={ele?.NewCentreID}
                          name="NewCentreID"
                          onChange={(e) => handleChangeNew(e, index)}
                        />
                      </td>
                      <td data-title={t("New Panel")}>
                        <TableSelectBox
                          options={[
                            { label: "Select New Client", value: "" },
                            ...RateData,
                          ]}
                          name="NewPanelID"
                          selectedValue={ele?.NewPanelID}
                          onChange={(e) => handleChangeNew(e, index)}
                        />
                      </td>

                      <td data-title="#">
                        <input
                          type="checkbox"
                          checked={ele?.isChecked}
                          name="isChecked"
                          onChange={(e) => handleCollection(e, index)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {loading ? (
                <Loading />
              ) : (
                <div className="row">
                  <div className="col-sm-1">
                    <button
                      className="btn btn-block btn-success btn-sm"
                      onClick={handelSave}
                    >
                      {t("Save")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default SingleBulkPanelChange;
