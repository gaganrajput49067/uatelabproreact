import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";

import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../utils/axiosInstance";
import { getAccessCentres } from "../../utils/NetworkApi/commonApi";
import PageHead from "../../components/CommonComponent/PageHead";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import { number } from "../../utils/helpers";
import Input from "../../components/CommonComponent/Input";
import { SelectBoxWithCheckbox } from "../../components/CommonComponent/MultiSelectBox";
import Loading from "../../components/Loading/Loading";
import Table from "../../components/Table/Table";
import NoRecordFound from "../../components/CommonComponent/NoRecordFound";
const Data = [
  {
    label: "Share Type",
    value: 0,
  },
  {
    label: "Client Share",
    value: 2,
  },
  {
    label: "Lab share",
    value: 3,
  },
];

function DiscountMasterEmployeeWise() {
  const [DepartmentOptions, setDepartmentOptions] = useState([]);
  const [Employee, setEmployee] = useState([]);
  const [Centre, setCentre] = useState([]);
  const [disable, setDisable] = useState(false);
  const [Load, setLoad] = useState(false);
  const [DeleteLoad, setDeleteLoad] = useState({
    load: false,
    index: -1,
  });
  const [payload, setPayload] = useState({
    DesignationID: "",
    EmployeeID: "",
    sharetype: "0",
    ItemData: "",
    DiscountMonth: 0,
    DiscountBill: 0,
    DiscountOnPackage: 0,
    AppBelowBaseRate: 0,
  });

  const { t } = useTranslation();
  const [tableData, setTableData] = useState([]);

  const getDesignationData = () => {
    axiosInstance
      .get("Designation/getDesignationData")
      .then((res) => {
        if (res.status === 200) {
          const data = res?.data?.message.map((ele) => {
            return {
              label: ele?.DesignationName,
              value: ele?.DesignationID,
            };
          });
          data.unshift({ label: "All Designation", value: "" });
          setDepartmentOptions(data);
        }
      })
      .catch((err) => console.log(err));
  };

  const getEmployee = () => {
    axiosInstance
      .post("DiscountMaster/bindEmployee", {
        DesignationID: payload?.DesignationID,
      })
      .then((res) => {
        const data = res?.data?.message;
        const val = data?.map((ele) => {
          return {
            label: ele?.NAME,
            value: ele?.EmployeeID,
          };
        });
        setEmployee(val);
        console.log("val");
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
      });
  };

  const getSearchData = () => {
    axiosInstance
      .post("DiscountMaster/Search", {
        EmployeeID: payload?.EmployeeID,
      })
      .then((res) => {
        if (res?.data?.message.length > 0) {
          setPayload({
            ...payload,
            DiscountMonth: res?.data?.message[0]?.DiscountPerMonth,
            DiscountBill: res?.data?.message[0]?.DiscountPerBill_per,
          });
        } else {
          setPayload({
            ...payload,
            DiscountMonth: 0,
          });
        }
        setTableData(res?.data?.message);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
      });
  };

  const handleChanges = (select, name) => {
    const val = select.map((ele) => {
      return ele?.value;
    });

    setPayload({ ...payload, [name]: val });
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setPayload({ ...payload, [name]: value });
  };

  useEffect(() => {
    if (payload?.DesignationID !== "") {
      getEmployee();
    }
  }, [payload?.DesignationID]);

  useEffect(() => {
    if (payload?.EmployeeID) {
      getSearchData();
    }
  }, [payload?.EmployeeID]);

  const PostApi = () => {
    setLoad(true);
    axiosInstance
      .post("DiscountMaster/SaveDiscount", payload)
      .then((res) => {
        toast.success(res?.data?.message);
        setLoad(false);
        setPayload({
          DesignationID: "",
          EmployeeID: "",
          sharetype: "0",
          ItemData: "",
          DiscountMonth: 0,
          DiscountBill: 0,
          DiscountOnPackage: 0,
          AppBelowBaseRate: 0,
        });
        setTableData([]);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
        setLoad(false);
      });
  };

  const Validation = () => {
    let Disable = false;
    if (
      payload?.DesignationID === "" ||
      payload?.EmployeeID === "" ||
      payload?.DiscountMonth <= 0 ||
      payload?.DiscountBill <= 0 ||
      payload?.ItemData === ""
    ) {
      Disable = true;
    }
    setDisable(Disable);
  };

  const HandleDelete = (id, i) => {
    setDeleteLoad({
      load: true,
      index: i,
    });
    axiosInstance
      .post("DiscountMaster/Remove", {
        DisAppID: id,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        getSearchData();
        setDeleteLoad({
          load: false,
          index: -1,
        });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
        setDeleteLoad({
          load: false,
          index: -1,
        });
      });
  };

  useEffect(() => {
    Validation();
  }, [payload]);

  useEffect(() => {
    getDesignationData();
    getAccessCentres(setCentre);
  }, []);
  return (
    <>
      <PageHead name="Discount Approval Employee Wise" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <SelectBox
                options={DepartmentOptions}
                name="DesignationID"
                selectedValue={payload?.DesignationID}
                lable="Designation"
                id="Designation"
                onChange={handleSelectChange}
              />
            </div>

            <div className="col-sm-2">
              <SelectBox
                options={[{ label: "Select...", value: "" }, ...Employee]}
                name="EmployeeID"
                lable="Employee"
                id="Employee"
                selectedValue={payload?.EmployeeID}
                className={"required"}
                onChange={handleSelectChange}
              />
            </div>

            <div className="col-sm-2">
              <Input
                lable="MaxDis/Month(inRs)"
                id="MaxDis/Month(inRs)"
                placeholder=" "
                type="number"
                onInput={(e) => number(e, 6)}
                name="DiscountMonth"
                onChange={(e) => {
                  setPayload({ ...payload, [e.target.name]: e.target.value });
                }}
                value={payload?.DiscountMonth}
              />
            </div>

            <div className="col-sm-2">
              <SelectBox
                options={Data}
                lable="Share Type"
                id="Share Type"
                name="sharetype"
                selectedValue={payload?.sharetype}
                onChange={handleSelectChange}
                className="required"
              />
            </div>
            <div className="col-sm-2">
              <SelectBoxWithCheckbox
                name="ItemData"
                placeholder=" "
                lable="Centre"
                id="Centre"
                options={Centre}
                value={payload?.ItemData}
                onChange={handleChanges}
              />
            </div>
            <div className="col-sm-2">
              <Input
                placeholder=" "
                lable="Disc.Bill(in%)"
                id="Disc.Bill(in%)"
                name="DiscountBill"
                value={payload?.DiscountBill}
                onChange={(e) => {
                  const val = e.target.value;
                  const isValidInput =
                    /^\d+(\.\d{0,2})?$/.test(val) &&
                    parseFloat(val) >= 0 &&
                    parseFloat(val) <= 100;
                  setPayload({
                    ...payload,
                    [e.target.name]:
                      isValidInput || val === "" ? val : payload?.DiscountBill,
                  });
                }}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-1">
              {Load ? (
                <Loading />
              ) : (
                <button
                  type="button"
                  className="btn btn-block btn-success btn-sm"
                  id="btnSave"
                  disabled={disable}
                  onClick={PostApi}
                >
                  {t("Save")}
                </button>
              )}
            </div>
          </div>
        </div>
      </PageHead>
      {tableData.length > 0 ? (
        <div className="card">
          <Table>
            <thead>
              <tr>
                {[
                  t("S.No"),
                  t("Centre Code"),
                  t("Centre Name"),
                  t("Discounted RateType"),
                  t("Employee Name"),
                  t("Max Disc.(Amt.)"),
                  t("Max Disc.(%)"),
                  t("Remove"),
                ].map((ele, index) => (
                  <th key={index}>{ele}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData?.map((ele, index) => (
                <tr key={index}>
                  <td data-title={t("S.No")}>{index + 1}</td>
                  <td data-title={t("Centre Code")}>{ele?.CentreCode}</td>
                  <td data-title={t("Centre Name")}>{ele?.Centre}</td>
                  <td data-title={t("Discounted RateType")}>-</td>
                  <td data-title={t("Employee Name")}>{ele?.EmpName}</td>
                  <td data-title={t("Max Disc.(Amt.)")}>
                    {ele?.DiscountPerMonth}
                  </td>
                  <td data-title={t("Max Disc.(%)")}>
                    {ele?.DiscountPerBill_per}
                  </td>
                  <td data-title={t("Remove")}>
                    {DeleteLoad?.load && DeleteLoad?.index === index ? (
                      <Loading />
                    ) : (
                      <button
                        className="btn btn-danger w-6"
                        onClick={() => HandleDelete(ele?.DisAppID, index)}
                      >
                        {t("Remove")}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <div className="card">
          <NoRecordFound />
        </div>
      )}
    </>
  );
}

export default DiscountMasterEmployeeWise;
