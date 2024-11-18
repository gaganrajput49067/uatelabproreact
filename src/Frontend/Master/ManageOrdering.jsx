import React, { useRef, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { getDepartment } from "../../utils/NetworkApi/commonApi";
import { axiosInstance } from "../../utils/axiosInstance";
import PageHead from "../../components/CommonComponent/PageHead";
import Loading from "../../components/Loading/Loading";
import Table from "../../components/Table/Table";
import TableSelectBox from "../../components/TableComponent/TableSelectBox";
import ReactSelect from "../../components/CommonComponent/ReactSelect";

function ManageOrdering() {
  const { t } = useTranslation();
  const [Department, setDepartment] = useState([]);
  const [Investigation, setInvestigation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [invSequence, setSequence] = useState([]);
  const [dep, setDep] = useState("");
  const dragItem = useRef();
  const [searchTest, setSearchTest] = useState("Department");
  const dragStart = (_, position) => {
    dragItem.current = position;
  };
  const dragOverItem = useRef();
  const dragEnter = (_, position) => {
    dragOverItem.current = position;
  };

  const dropDep = (_) => {
    const copyListItems = [...Department];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setDepartment(copyListItems);
  };
  const dropInv = (_) => {
    const copyListItems = [...Investigation];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setInvestigation(copyListItems);
  };

  const updateHandler = () => {
    const data =
      searchTest == "Department"
        ? Department.map((ele, index) => {
            return {
              PrintOrder: index + 1,
              DepartmentID: ele?.value,
              DepartmentName: ele?.label,
            };
          })
        : Investigation.map((ele, index) => {
            return {
              DepartmentId: dep,
              printsequence: dep == "" ? index + 1 : invSequence[index],
              InvestigationID: ele?.InvestigationID,
              TestName: ele?.TestName,
            };
          });
    console.log(data);
    if (data?.length > 0) {
      const url =
        searchTest == "Department"
          ? "Department/UpdateDepartmentDataWithOrdering"
          : "Investigations/UpdateprintsequenceForTest";
      setLoading(true);
      axiosInstance
        .post(url, {
          Data: data,
        })
        .then((res) => {
          toast.success(res?.data?.message);
          getDepartment(setDepartment, "getDepartmentEmployeeMaster", true);
          DepartmentWiseItemList("");
          setLoading(false);
          setDep("");
          setSequence([]);
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
      toast.error("Data Can't Be Blank");
    }
  };

  useEffect(() => {
    getDepartment(setDepartment, "getDepartmentEmployeeMaster", true);
    DepartmentWiseItemList("");
  }, []);

  const DepartmentWiseItemList = (id) => {
    // if (id == "") {
    //   setInvestigation([]);
    // } else {
    axiosInstance
      .post("CommonController/DepartmentWiseItemList", {
        DepartmentID: id,
        TestName: "",
      })
      .then((res) => {
        const data = res?.data?.message;
        const val = data.map((ele) => {
          return {
            TestName: ele?.TestName,
            InvestigationID: ele?.InvestigationID,
            printsequence: ele?.printordering,
          };
        });
        const values = data.map((ele) => ele?.printordering);
        setSequence(values);
        setInvestigation(val);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
    // }
  };
  return (
    <>
      <PageHead name="Manage Ordering" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <div className="row">
                <div className="col-sm-2">
                  <input
                    type="radio"
                    id="Department"
                    name="type"
                    value="Department"
                    checked={searchTest == "Department"}
                    onChange={(e) => {
                      setSearchTest(e.target.value);
                      getDepartment(
                        setDepartment,
                        "getDepartmentEmployeeMaster",
                        true
                      );
                      setDep("");
                    }}
                  />
                </div>
                <div className="col-sm-10">
                  <label htmlFor="Department">{t("Department")}</label>
                </div>
              </div>
            </div>
            <div className="col-sm-2">
              {" "}
              <div className="row">
                <div className="col-sm-2">
                  <input
                    type="radio"
                    name="type"
                    value="Investigation"
                    id="Investigation"
                    checked={searchTest == "Investigation"}
                    onChange={(e) => {
                      setSearchTest(e.target.value);
                      DepartmentWiseItemList("");
                      getDepartment(
                        setDepartment,
                        "getDepartmentEmployeeMaster",
                        true
                      );
                      setDep("");
                    }}
                  />
                </div>
                <div className="col-sm-10">
                  <label htmlFor="Investigation">{t("Investigation")}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageHead>

      {loading ? (
        <Loading />
      ) : searchTest == "Department" ? (
        <div className="card">
          <Table>
            <thead className="cf">
              <tr>
                {[t("Sequence"), t("Department ID"), t("Department Name")].map(
                  (ele, index) => {
                    return <th key={index}>{ele}</th>;
                  }
                )}
              </tr>
            </thead>
            <tbody>
              {Department?.map((ele, index) => (
                <tr
                  key={index}
                  onDragStart={(e) => dragStart(e, index)}
                  draggable
                  onDragEnter={(e) => dragEnter(e, index)}
                  onDragEnd={dropDep}
                  style={{ cursor: "move" }}
                >
                  <td data-title={t("Sequence")}>{ele?.printOrder}&nbsp;</td>
                  <td data-title={t("Dept_ID")}>{ele?.value}&nbsp;</td>
                  <td data-title={t("Name")}>{ele?.label}&nbsp;</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <>
          <div className="card">
            <div className="row">
              <div className="col-md-3 control-label">
                <ReactSelect
                  placeholderName="Select Department"
                  dynamicOptions={[
                    { label: "Select...", value: "" },
                    ...Department,
                  ]}
                  value={dep}
                  onChange={(_, e) => {
                    setDep(e?.value);
                    DepartmentWiseItemList(e?.value);
                  }}
                />
              </div>
            </div>
            <div className="card">
              <Table>
                <thead className="cf">
                  <tr>
                    {[
                      t("Sequence"),
                      t("Investigation ID"),
                      t("Investigation Name"),
                    ].map((ele, index) => {
                      return <th key={index}>{ele}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  {Investigation?.map((ele, index) => (
                    <tr
                      key={index}
                      onDragStart={(e) => dragStart(e, index)}
                      draggable
                      onDragEnter={(e) => dragEnter(e, index)}
                      onDragEnd={dropInv}
                      style={{ cursor: "move" }}
                    >
                      <td data-title={t("Sequence")}>
                        {ele?.printsequence}&nbsp;
                      </td>
                      <td data-title={t("Inv_ID")}>
                        {ele?.InvestigationID}&nbsp;
                      </td>
                      <td data-title={t("Name")}>{ele?.TestName}&nbsp;</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </>
      )}

      <div className="card">
        <div className="row">
          <div className="col-sm-2">
            {loading ? (
              <Loading />
            ) : (
              <button
                className="btn btn-block btn-success btn-sm"
                style={{ marginTop: "10px" }}
                onClick={updateHandler}
              >
                {t("Save Ordering")}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ManageOrdering;
