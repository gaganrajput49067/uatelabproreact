import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { useTranslation } from "react-i18next";
import { isChecked } from "../util/Commonservices";
import { axiosInstance } from "../../utils/axiosInstance";
import PageHead from "../../components/CommonComponent/PageHead";
import Loading from "../../components/Loading/Loading";
import Input from "../../components/CommonComponent/Input";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import Table from "../../components/Table/Table";
import TableSelectBox from "../../components/TableComponent/TableSelectBox";
import NoRecordFound from "../../components/CommonComponent/NoRecordFound";
const TestCentreMapping = () => {
  const [loading, setLoading] = useState(false);
  const [FetchDepartment, setFetchDepartment] = useState([]);
  const [FetchCentre, setFetchCentre] = useState([]);
  const [payload, setPayload] = useState({
    BookingCentreId: "",
    DepartmentId: "",
    TestName: "",
  });
  const { t } = useTranslation();
  const [load, setLoad] = useState(false);
  const [tableData, setTableData] = useState([]);
  console.log(tableData);
  const handleChangeSelect = (e, index) => {
    const { name, value } = e.target;
    if (index >= 0) {
      const data = [...tableData];
      data[index][name] = value;
      setTableData(data);
    } else {
      const val = tableData?.map((ele) => {
        return {
          ...ele,
          [name]: value,
        };
      });
      setTableData(val);
    }
  };
  const handleCollection = (e, index) => {
    const { name, checked } = e.target;
    const datas = [...tableData];
    datas[index][name] = checked ? "1" : "0";
    setTableData(datas);
  };
  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setPayload({ ...payload, [name]: value });
    setTableData([]);
  };

  const fetchCenter = () => {
    axiosInstance
      .get("Centre/getAccessCentres")
      .then((res) => {
        const data = res?.data?.message;
        const val = data.map((ele) => {
          return {
            label: ele?.Centre,
            value: ele?.CentreID,
          };
        });
        // val.unshift({ label: "Booking Centre", value: "" });
        setFetchCentre(val);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };

  const fetchDepartment = () => {
    axiosInstance
      .get("TestCentreMappingController/BindDepartment")
      .then((res) => {
        const data = res?.data?.message;
        const val = data?.map((ele) => {
          return {
            label: ele?.department,
            value: ele?.departmentid,
          };
        });
        val.unshift({ label: "Department", value: "" });
        setFetchDepartment(val);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };

  const SearchApi = () => {
    if (payload?.DepartmentId && payload?.BookingCentreId) {
      setLoad(true);
      setTableData([]);
      axiosInstance
        .post("TestCentreMappingController/getTestCentre", payload)
        .then((res) => {
          if (res?.data?.message?.length > 0) setTableData(res?.data?.message);
          else {
            toast.error("No Record Found");
          }
          setLoad(false);
        })
        .catch((err) => {
          setTableData([]);
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something Went Wrong"
          );
          setLoad(false);
        });
    } else {
      setTableData([]);
      toast.error("Please Select Centre & Department");
    }
  };
  const handleCheckbox = (e) => {
    const { checked } = e.target;
    const data = tableData?.map((ele) => {
      return {
        ...ele,
        isActive: checked ? "1" : "0",
      };
    });

    setTableData(data);
  };
  const handleSave = () => {
    const checkedData = tableData.filter((ele) => ele?.isActive == "1");

    if (checkedData?.length > 0) {
      setLoading(true);
      const data = checkedData.map((ele) => {
        return {
          BookingCentreId: payload?.BookingCentreId,
          InvestigationId: ele?.InvestigationID,
          DepartmentId: payload?.DepartmentId,
          TestCentreId1: ele?.Test_Centre,
          TestCentreId2: ele?.Test_Centre2,
          TestCentreId3: ele?.Test_Centre3,
        };
      });
      axiosInstance
        .post("TestCentreMappingController/SaveTestCentreMapping", data)
        .then((res) => {
          toast.success(res?.data?.message);
          setLoading(false);
          SearchApi();
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something Went Wrong"
          );
          setLoading(false);
        });
    } else {
      toast.error("Please Choose One Row");
    }
  };

  useEffect(() => {
    fetchCenter();
    fetchDepartment();
  }, []);

  return (
    <>
      <PageHead name="Test Mappin" showDrop={"false"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2 col-md-2">
              <SelectBox
                lable="Booking Centre"
                id="Booking Centre"
                name="BookingCentreId"
                options={FetchCentre}
                onChange={handleSelectChange}
                selectedValue={payload?.BookingCentreId}
              />
            </div>

            <div className="col-sm-2 col-md-2">
              <SelectBox
                lable="Department"
                id="Department"
                onChange={handleSelectChange}
                name="DepartmentId"
                options={FetchDepartment}
                selectedValue={payload?.DepartmentId}
              />
            </div>

            <div className="col-sm-2 col-md-2">
              <Input
                id="Test Name"
                lable="Test Name"
                placeholder=" "
                type="text"
                value={payload?.TestName}
                name="TestName"
                onChange={(e) => {
                  setPayload({ ...payload, TestName: e.target.value });
                }}
              />
            </div>

            <div className="col-sm-1">
              {load ? (
                <Loading />
              ) : (
                <button
                  type="search"
                  className="btn btn-info btn-sm btn-block"
                  onClick={SearchApi}
                >
                  {t("Search")}
                </button>
              )}
            </div>
          </div>
        </div>
      </PageHead>
      {tableData.length > 0 ? (
        <>
          <div className="card">
            <Table>
              <thead className="cf">
                <tr>
                  <th>{t("S.No")}</th>
                  <th>{t("Investigation")}</th>
                  <th>
                    <TableSelectBox
                      options={[{ label: "Select", value: "" }, ...FetchCentre]}
                      onChange={(e) => {
                        handleChangeSelect(e);
                      }}
                      name="Test_Centre"
                    ></TableSelectBox>
                  </th>
                  <th>
                    <TableSelectBox
                      options={[{ label: "Select", value: "" }, ...FetchCentre]}
                      onChange={(e) => {
                        handleChangeSelect(e);
                      }}
                      name="Test_Centre2"
                    ></TableSelectBox>
                  </th>
                  <th>
                    <TableSelectBox
                      options={[{ label: "Select", value: "" }, ...FetchCentre]}
                      onChange={(e) => {
                        handleChangeSelect(e);
                      }}
                      name="Test_Centre3"
                    ></TableSelectBox>
                  </th>

                  <th>
                    <input
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
                {tableData.map((data, i) => (
                  <tr key={i}>
                    <td data-title={t("S.No")}>{i + 1}&nbsp;</td>
                    <td data-title={t("Investigation")}>
                      {data?.TestName}&nbsp;
                    </td>
                    <td data-title={t("Test_Centre")}>
                      <TableSelectBox
                        options={[
                          { label: "--Select--", value: "" },
                          ...FetchCentre,
                        ]}
                        selectedValue={data?.Test_Centre}
                        name="Test_Centre"
                        onChange={(e) => handleChangeSelect(e, i)}
                      ></TableSelectBox>
                    </td>
                    <td data-title={t("Test_Centre2")}>
                      <TableSelectBox
                        options={[
                          { label: "--Select--", value: "" },
                          ...FetchCentre,
                        ]}
                        selectedValue={data?.Test_Centre2}
                        name="Test_Centre2"
                        onChange={(e) => handleChangeSelect(e, i)}
                      ></TableSelectBox>
                    </td>
                    <td data-title={t("Test_Centre3")}>
                      <TableSelectBox
                        options={[
                          { label: "--Select--", value: "" },
                          ...FetchCentre,
                        ]}
                        selectedValue={data?.Test_Centre3}
                        name="Test_Centre3"
                        onChange={(e) => handleChangeSelect(e, i)}
                      ></TableSelectBox>
                    </td>
                    <td data-title={t("Status")}>
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={data?.isActive === "1" ? true : false}
                        onChange={(e) => handleCollection(e, i)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <div className="row">
              <div className="col-sm-2">
                {loading ? (
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
          </div>
        </>
      ) : (
        <div className="card">
          <NoRecordFound />
        </div>
      )}
    </>
  );
};

export default TestCentreMapping;
