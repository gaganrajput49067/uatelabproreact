import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Loading from "../../components/Loading/Loading";
import { axiosInstance } from "../../utils/axiosInstance";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import PageHead from "../../components/CommonComponent/PageHead";
import ReactSelect from "../../components/CommonComponent/ReactSelect";
import Table from "../../components/Table/Table";
import { isChecked } from "../util/Commonservices";
import { dateConfig } from "../../utils/helpers";
import NoRecordFound from "../../components/CommonComponent/NoRecordFound";
import Input from "../../components/CommonComponent/Input";

function RateList() {
  const [Department, setDepartment] = useState([]);
  const [RateCentres, setRateCentres] = useState([]);
  const [Billing, setBilling] = useState([]);
  const [load, setLoad] = useState(false);
  const [payload, setPayload] = useState({
    BillingCategory: 0,
    CentreID: "",
    DepartmentID: 0,
    TestID: "",
  });
  const [tabledata, setTabledata] = useState([]);
  const [ItemList, setItemList] = useState([]);
  const { t } = useTranslation();

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setPayload({ ...payload, [name]: value });
  };
  const handleSubmit = () => {
    setLoad(true);
    axiosInstance
      .post("RateList/RateListGet", payload)
      .then((res) => {
        const data = res?.data?.message;
        if (data?.length === 0) {
          toast.error("No data Found");
          setTabledata([]);
          return;
        }
        let val = data.map((ele) => {
          return {
            ...ele,
            isActive: "0",
          };
        });
        setTabledata(val);
        setLoad(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        setLoad(false);
      });
  };

  const handleCollection = (e, index, data) => {
    const { name, checked } = e.target;
    const datas = [...tabledata];
    datas[index][name] = checked ? "1" : "0";
    setTabledata(datas);
  };

  const handleCheckbox = (e) => {
    const { checked } = e.target;
    const data = tabledata?.map((ele) => {
      return {
        ...ele,
        isActive: checked ? "1" : "0",
      };
    });

    setTabledata(data);
  };

  const handleValue = (e, index) => {
    const { name, value } = e.target;
    const datas = [...tabledata];
    datas[index][name] = value;
    setTabledata(datas);
  };

  const handleBaseRateAndMaxRate = (data) => {
    let match = true;
    for (let i = 0; i < data.length; i++) {
      const value = data[i]["Rate"] === "" ? 0 : data[i]["Rate"];
      if (data[i].MaxRate < value || data[i].BaseRate > value) {
        match = false;
        break;
      }
    }

    return match;
  };

  const handleSave = () => {
    const data = tabledata.filter((ele) => ele.isActive === "1");
    if (data?.length > 0) {
      if (handleBaseRateAndMaxRate(data)) {
        axiosInstance
          .post("RateList/RateListCreate", data)
          .then((res) => {
            toast.success(res.data?.message);
            handleSubmit();
          })
          .catch((err) => {
            toast.error(
              err?.response?.data?.message
                ? err?.response?.data?.message
                : "Error Occured"
            );
          });
      } else {
        toast.error("Rate Must be Valid According to Base Rate And Max Rate");
      }
    } else {
      toast.error("please Choose One Value");
    }
  };

  const getRateCenters = () => {
    axiosInstance
      .get("centre/getRateList")
      .then((res) => {
        let data = res.data.message;

        let CentreDataValue = data.map((ele) => {
          return {
            value: ele.CentreID,
            label: ele.Centre,
          };
        });
        setPayload({
          ...payload,
          DepartmentID: 0,
          CentreID: CentreDataValue[0]?.value,
          BillingCategory: findRoutine(Billing),
        });
        setRateCentres(CentreDataValue);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getBillingCategory = (state) => {
    axiosInstance
      .get("Investigations/BindBillingCategory")
      .then((res) => {
        let data = res.data.message;
        let val = data.map((ele) => {
          return {
            value: ele?.BillingCategoryId,
            label: ele?.BillingCategoryName,
          };
        });
        setBilling(val);
        setPayload({
          ...payload,
          BillingCategory: findRoutine(val),
          DepartmentID: Department[0]?.value,
          CentreID: RateCentres[0]?.value,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getDepartment = () => {
    axiosInstance
      .get(`Department/getDepartment`)
      .then((res) => {
        let data = res.data.message;
        let Department = data.map((ele) => {
          return {
            value: ele.DepartmentID,
            label: ele.Department,
          };
        });
        Department.unshift({ label: "All Department", value: 0 });
        setDepartment(Department);
        setPayload({
          ...payload,
          DepartmentID: Department[0]?.value,
          BillingCategory: findRoutine(Billing),
          CentreID: RateCentres[0]?.value,
        });
      })
      .catch((err) => console.log(err));
  };

  const getRateItemList = () => {
    axiosInstance
      .post("RateList/getItemList", {
        DepartmentID: payload?.DepartmentID ?? 0,
        BillingCategory: payload?.BillingCategory ?? 0,
      })
      .then((res) => {
        let data = res.data.message;
        let val = data.map((ele) => {
          return {
            value: ele?.InvestigationID,
            label: ele?.TestName,
          };
        });
        val.unshift({ label: "Item Name", value: "" });
        setItemList(val);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getDepartment();
    getRateItemList();
    getBillingCategory();
    getRateCenters();
  }, []);
  const findRoutine = (data) => {
    for (let i of data) {
      if (i.label === "Routine") return i.value;
    }
    return data[0]?.value;
  };

  useEffect(() => {
    getRateItemList(setItemList, payload);
  }, [payload?.BillingCategory, payload?.DepartmentID]);

  useEffect(() => {
    setPayload({
      ...payload,
      DepartmentID: Department[0]?.value,
      CentreID: RateCentres[0]?.value,
      BillingCategory: findRoutine(Billing),
    });
  }, [Department]);
  useEffect(() => {
    setPayload({
      ...payload,
      CentreID: RateCentres[0]?.value,
      BillingCategory: findRoutine(Billing),
      DepartmentID: Department[0]?.value,
    });
  }, [RateCentres]);
  useEffect(() => {
    setPayload({
      ...payload,
      CentreID: RateCentres[0]?.value,
      BillingCategory: findRoutine(Billing),
      DepartmentID: Department[0]?.value,
    });
  }, [Billing]);

  return (
    <>
      <PageHead name="Rate List" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2 col-md-2">
              <SelectBox
                options={Department}
                name="DepartmentID"
                label="Department"
                id="Department List"
                lable="Department List"
                selectedValue={payload?.DepartmentID}
                onChange={handleSelectChange}
              />
            </div>

            <div className="col-sm-2 col-md-2">
              <SelectBox
                options={Billing}
                id="Billing Category"
                lable="Billing Category"
                name="BillingCategory"
                selectedValue={payload?.BillingCategory}
                onChange={handleSelectChange}
              />
            </div>

            <div className="col-sm-2 col-md-2">
              <SelectBox
                options={RateCentres}
                id="Rate Type"
                lable="Rate Type"
                name="CentreID"
                selectedValue={payload?.CentreID}
                onChange={handleSelectChange}
              />
            </div>

            <div className="col-sm-2 col-md-2">
              <ReactSelect
                dynamicOptions={ItemList}
                name="TestID"
                placeholderName="Select Test"
                value={payload?.TestID}
                onChange={(_, e) => {
                  setPayload({ ...payload, TestID: e?.value });
                }}
              />
            </div>
            <div className="col-sm-1">
              <button
                className="btn btn-info btn-sm btn-block"
                onClick={handleSubmit}
              >
                {t("Search")}
              </button>
            </div>
          </div>
        </div>
      </PageHead>
      {load ? (
        <Loading />
      ) : tabledata.length > 0 ? (
        <>
          <div className="card">
            <Table>
              <thead className="cf" style={{ position: "sticky", top: "0" }}>
                <tr>
                  <th>{t("S.No")}</th>
                  <th>{t("Centre Name")}</th>
                  <th>{t("Test Name")}</th>
                  <th>{t("BaseRate")}</th>
                  <th>{t("MaxRate")}</th>
                  <th className="">
                    <div>{t("Rate")}</div>
                  </th>

                  <th>{t("Item Code")}</th>
                  <th> {t("Create On")}</th>
                  <th>{t("Created By")}</th>
                  <th>
                    <input
                      type="checkbox"
                      checked={
                        tabledata.length > 0
                          ? isChecked("isActive", tabledata, "1").includes(
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
                {tabledata?.map((data, index) => (
                  <tr key={index}>
                    <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                    <td data-title={t("Centre Name")}>{data?.Centre}&nbsp;</td>
                    <td data-title={t("Test Name")}>{data?.TestName}&nbsp;</td>
                    <td data-title={t("Base Rate")}>{data?.BaseRate}&nbsp;</td>
                    <td data-title={t("Max Rate")}>{data?.MaxRate}&nbsp;</td>
                    <td data-title={t("Rate")}>
                      {data?.isActive === "1" ? (
                        <Input
                          value={parseInt(data?.Rate)}
                          type="number"
                          name="Rate"
                          onChange={(e) => handleValue(e, index)}
                          max={10}
                        />
                      ) : (
                        Number(data?.Rate).toFixed(2)
                      )}
                    </td>

                    <td data-title={t("Item Code")}>{data?.TestCode}&nbsp;</td>
                    <td data-title={t("Create On")}>
                      {dateConfig(data?.dtEntry)}&nbsp;
                    </td>
                    <td data-title={t("Created By")}>
                      {data?.CreatedByName ? data?.CreatedByName : "-"}
                      &nbsp;
                    </td>
                    <td data-title={t("Status")}>
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={data?.isActive === "1" ? true : false}
                        onChange={(e) => handleCollection(e, index, data)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="col-sm-2" style={{ marginTop: "9px" }}>
              <button
                className="btn btn-success btn-sm btn-block"
                onClick={handleSave}
              >
                {t("Save")}
              </button>
            </div>{" "}
          </div>
        </>
      ) : (
        <div className="card">
          <NoRecordFound />
        </div>
      )}
    </>
  );
}

export default RateList;
