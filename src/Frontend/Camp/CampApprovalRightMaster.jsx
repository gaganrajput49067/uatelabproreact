import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import PageHead from "../../components/CommonComponent/PageHead";
import { SelectBoxWithCheckbox } from "../../components/CommonComponent/MultiSelectBox";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import Loading from "../../components/Loading/Loading";
import Table from "../../components/Table/Table";
import NoRecordFound from "../../components/CommonComponent/NoRecordFound";

const CampApprovalRightMaster = () => {
  const [loading, setLoading] = useState({
    search: false,
    save: false,
  });
  const [tableData, setTableData] = useState([]);
  const [employee, setEmployee] = useState([]);
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    VerificationType: [],
    Employee: "",
    isActive: "",
  });

  const VerificationData = [
    {
      label: "CampConfiguration",
      value: "1",
    },
    {
      label: "CampRequest",
      value: "2",
    },
    {
      label: "CampApproval/Reject",
      value: "3",
    },
  ];

  const getEmployee = () => {
    axiosInstance
      .get("Camp/GetEmployees")
      .then((res) => {
        let data = res.data.message;
        let EmployeeData = data.map((ele) => {
          return {
            value: ele?.EmployeeID,
            label: ele?.NAME,
          };
        });
        setEmployee(EmployeeData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getEmployee();
    BindEmployee();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event?.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleSelectMultiChange = (select, name, value) => {
    if (name === "VerificationType") {
      const val = select.map((ele) => {
        return ele?.value;
      });
      setFormData({ ...formData, [name]: val });
    }
  };

  const VerificationTableData = (ele) => {
    switch (ele) {
      case "1":
        return "CampConfiguration";
      case "2":
        return "CampRequest";
      case "3":
        return "CampCreation";
    }
  };

  const BindEmployee = () => {
    setLoading({ ...loading, search: true });
    axiosInstance
      .get("Camp/bindCamptable")
      .then((res) => {
        setTableData(res?.data?.message);
        setLoading({ ...loading, search: false });
      })
      .catch((err) => {
        console.log(err);
        setLoading({ ...loading, search: false });
      });
  };

  const handleSave = () => {
    if (formData?.VerificationType == "" || formData?.Employee == "") {
      toast.error("Please Select All Fields.");
    } else {
      setLoading({ ...loading, save: true });
      const dataArray = formData?.VerificationType?.map((ele) => {
        return {
          EmployeeId: formData?.Employee,
          IsActive: formData?.isActive ? 1 : 0,
          VerificationType: ele,
        };
      });
      axiosInstance
        .post("Camp/save", { data: dataArray })
        .then((res) => {
          if (res?.data?.success) {
            toast.success(res?.data?.message);

            setFormData({
              VerificationType: [],
              Employee: "",
              isActive: "",
            });
            BindEmployee();
          } else {
            toast.error(res?.data?.message);
          }
          setLoading(false);
          setLoading({ ...loading, save: false });
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something went wrong."
          );
          setLoading({ ...loading, save: false });
        });
    }
  };

  const handleRemove = (data, IsActive) => {
    setLoading(true);
    axiosInstance
      .post("Camp/RightsUpdate", {
        EmployeeId: data?.EmployeeID,
        VerificationType: data?.VerificationType,
        IsActive: IsActive,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        setLoading(false);
        BindEmployee();
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };
  return (
    <>
      <PageHead name={t("Camp Approval Right Master")} showDrop="true">
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <SelectBoxWithCheckbox
                options={[...VerificationData]}
                onChange={handleSelectMultiChange}
                name="VerificationType"
                id="VerificationType"
                value={formData?.VerificationType}
                lable="Verification Type"
              />
            </div>
            <div className="col-sm-2">
              <SelectBox
                options={[{ label: "Select", value: "" }, ...employee]}
                onChange={handleChange}
                name="Employee"
                id="Employee"
                selectedValue={formData?.Employee}
                lable="Employee"
              />
            </div>
            <div className="col-sm-1 d-flex align-items-center">
              <input
                name="isActive"
                id="isActive"
                type="checkbox"
                checked={formData?.isActive}
                onChange={handleChange}
              />
              <label className="col-sm-10">{t("Active")}</label>
            </div>
            <div className="col-sm-1">
              {!loading.save && (
                <button
                  className="btn btn-block btn-success btn-sm"
                  onClick={handleSave}
                >
                  {t("Save")}
                </button>
              )}
              {loading?.save && <Loading />}
            </div>
          </div>
        </div>
      </PageHead>
      {loading.search ? (
        <Loading />
      ) : (
        <>
          <div className="card">
            {tableData?.length > 0 ? (
              <Table>
                <thead>
                  <tr>
                    <th>{t("S.No.")}</th>
                    <th>{t("Employe Name")}</th>
                    <th>{t("Verification")}</th>
                    <th>{t("Status")}</th>
                    <th>{t("Created By")}</th>
                    <th>{t("Created Date")}</th>
                    <th>{t("Change Status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData?.map((ele, index) => (
                    <tr key={index}>
                      <td data-title={t("S.No")}>{index + 1}</td>
                      <td data-title={t("Employe Name")}>{ele?.Name}</td>
                      <td data-title={t("Verification")}>
                        {VerificationTableData(ele?.VerificationType)}
                      </td>
                      <td data-title={t("Status")}>{ele?.STATUS}</td>
                      <td data-title={t("Created By")}>{ele?.CreatedBy}</td>
                      <td data-title={t("Created Date")}>{ele?.CreateDate}</td>
                      <td data-title={t("Remove")}>
                        {ele?.IsActive === 1 ? (
                          <button
                            type="button"
                            className="DeActive"
                            style={{
                              backgroundColor: "red",
                              color: "white",
                              border: "none",
                              fontWeight: "bold",
                              width: "40%",
                            }}
                            onClick={() => handleRemove(ele, 0)}
                          >
                            DeActive
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="Active"
                            style={{
                              backgroundColor: "green",
                              color: "white",
                              border: "none",
                              fontWeight: "bold",
                              width: "40%",
                            }}
                            onClick={() => handleRemove(ele, 1)}
                          >
                            Active
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <NoRecordFound />
            )}
          </div>
        </>
      )}
    </>
  );
};

export default CampApprovalRightMaster;
