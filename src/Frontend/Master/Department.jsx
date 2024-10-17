import React, { useEffect, useState } from "react";
import PageHead from "../../components/CommonComponent/PageHead";
import { Link, useNavigate } from "react-router-dom";
import {
  AllowCharactersNumbersAndSpecialChars,
  dateConfig,
  getTrimmedData,
} from "../../utils/helpers";
import { axiosInstance } from "../../utils/axiosInstance";
import { validation } from "../../utils/Schema";
import Input from "../../components/CommonComponent/Input";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Loading from "../../components/Loading/Loading";
import SubPageHead from "../../components/CommonComponent/SubPageHead";
import Table from "../../components/Table/Table";
const Department = () => {
  const [loading, setLoading] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [err, setErr] = useState({});
  const [formData, setFormData] = useState({
    Department: "",
    DepartmentID:"",
    DepartmentCode: "",
    isActive: 1,
    isMembershipcard: 0,
    isPackage: 0,
    Microbiology: 0,
    radiology: 0,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (
      ["isMembershipcard", "isPackage", "Microbiology", "radiology"].includes(
        name
      )
    ) {
      setFormData({
        ...formData,
        [name]: checked ? 1 : 0,
      });
    } else if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: AllowCharactersNumbersAndSpecialChars(value)
          ? value
          : formData[name],
      });
    }
  };

  const { t } = useTranslation();
  const postData = () => {
    let generatedError = validation(formData);
    if (generatedError === "") {
      setLoading(true);
      axiosInstance
        .post("Department/InsertDepartmentData", getTrimmedData(formData))
        .then((res) => {
          if (res.data.message) {
            setFormData({
              Department: "",
              DepartmentCode: "",
              isActive: 1,
              DepartmentID: 0,
              isMembershipcard: 0,
              isPackage: 0,
              Microbiology: 0,
              radiology: 0,
            });
            setLoading(false);
            getTableData();
            setErr({});
            toast.success(res.data.message);
          } else {
            toast.error("Something went wrong");
            setLoading(false);
          }
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
          setLoading(false);
        });
    } else {
      setErr(generatedError);
      setLoading(false);
    }
  };
  const EditData = (data) => {
    console.log(data);
    setFormData({
      Department: data?.Department,
      DepartmentCode: data?.DepartmentCode,
      isActive: data?.Status == "Active" ? 1 : 0,
      DepartmentID: data?.DepartmentID,
      isMembershipcard: data?.isMembershipcard,
      isPackage: data?.isPackage,
      Microbiology: data?.Microbiology,
      radiology: data?.Radiology,
    });
  };
  const getTableData = () => {
    axiosInstance
      .get("Department/getDepartmentData")
      .then((res) => {
        setTableData(res.data.message);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getTableData();
  }, []);
  return (
    <>
      <PageHead name="Create New Department" showDrop={true} drop={true}>
        {" "}
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <Input
                name="DepartmentCode"
                lable="Department Code"
                id="Department Code"
                placeholder=" "
                value={formData?.DepartmentCode}
                onChange={handleChange}
              />
              {formData?.DepartmentCode.trim() === "" && (
                <span className="error-message">{err?.DepartmentCode}</span>
              )}
              {formData?.DepartmentCode.trim().length > 0 &&
                formData?.DepartmentCode.trim().length < 2 && (
                  <span className="error-message">{err?.DepartmentCodes}</span>
                )}
            </div>
            <div className="col-sm-2">
              <Input
                name="Department"
                lable="Department Name"
                id="Department Name"
                placeholder=" "
                value={formData?.Department}
                onChange={handleChange}
              />
              {formData?.Department.trim() === "" && (
                <span className="error-message">{err?.Department}</span>
              )}
              {formData?.Department.trim().length > 0 &&
                formData?.Department.trim().length < 2 && (
                  <span className="error-message">{err?.Department}</span>
                )}
            </div>

            <div className="col-sm-1 mt-2">
              <input
                name="isActive"
                type="checkbox"
                checked={formData?.isActive}
                onChange={handleChange}
              />
              &nbsp;
              <label>{t("Active")}</label>
            </div>
            <div className="col-sm-1 mt-2">
              <input
                name="isPackage"
                type="checkbox"
                checked={formData?.isPackage == 0 ? false : true}
                onChange={handleChange}
              />
              &nbsp;
              <label>{t("IsPackage")}</label>
            </div>
            <div className="col-sm-1 mt-2">
              <input
                name="isMembershipcard"
                type="checkbox"
                checked={formData?.isMembershipcard == 0 ? false : true}
                onChange={handleChange}
              />
              &nbsp;
              <label>{t("IsMembership")}</label>
            </div>
            <div className="col-sm-1 mt-2">
              <input
                name="Microbiology"
                type="checkbox"
                checked={formData?.Microbiology == 0 ? false : true}
                onChange={handleChange}
              />
              &nbsp;
              <label>{t("IsMicrobiology")}</label>
            </div>
            <div className="col-sm-1 mt-2">
              <input
                name="radiology"
                type="checkbox"
                checked={formData?.radiology == 0 ? false : true}
                onChange={handleChange}
              />
              &nbsp;
              <label>{t("IsRadiology")}</label>
            </div>

            
            <div className="col-sm-1">
              {loading ? (
                <Loading />
              ) : (
                <>
                  {}
                  <button
                    type="button"
                    className={`btn ${
                      formData?.DepartmentID ? "btn-warning" : "btn-info"
                    } btn-block  btn-sm`}
                    id="btnSave"
                    onClick={postData}
                  >
                    {formData?.DepartmentID ? "Update" : t("Create")}
                  </button>
                </>
              )}
            </div>
            <div className="col-sm-1">
              {loading ? (
                <Loading />
              ) : (
                <>
                  {}
                  <button
                    type="button"
                    className="btn btn-danger btn-block  btn-sm"
                    id="btnSave"
                    onClick={() => {
                      setFormData({
                        Department: "",
                        DepartmentCode: "",
                        isActive: 1,
                        DepartmentID: 0,
                        isMembershipcard: 0,
                        isPackage: 0,
                        Microbiology: 0,
                        radiology: 0,
                      });
                      setErr({})
                    }}
                  >
                    Reset
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </PageHead>
      {/* <SubPageHead title="Department"> */}
      <div className="card">
        {" "}
        <Table paginate={true} data={tableData ?? []} itemsPerPage={10}>
          {({ currentItems, finalIndex }) => {
            return (
              <>
                <thead className="cf">
                  <tr>
                    <th>S.No</th>
                    <th>Code</th>
                    <th>Department</th>
                    <th>Active</th>
                    <th>Entry Date</th>
                    <th>Update Date </th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((data, index) => (
                    <tr key={index}>
                      <td data-title={"S.No"}>{index + finalIndex}&nbsp;</td>
                      <td data-title={"Code"}>{data?.DepartmentCode}&nbsp;</td>
                      <td data-title={"Department"}>
                        {data?.Department}&nbsp;
                      </td>

                      <td data-title={"Active"}>{data?.Status}&nbsp;</td>
                      <td data-title={"Entry Date"}>
                        {dateConfig(data?.dtEntry)}
                      </td>
                      <td data-title={"Update Date"}>
                        {data?.dtUpdate !== "0000-00-00 00:00:00"
                          ? dateConfig(data?.dtUpdate)
                          : "-"}
                        &nbsp;
                      </td>

                      <td data-title={"Action"}>
                        {data.companyId === 0 ? (
                          <p
                            style={{ color: "red" }}
                            Tooltip="System Generated it can't be changed"
                          >
                            System Generated it can't be changed
                          </p>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-block btn-primary btn-sm w-5"
                            id="btnSave"
                            title="Edit"
                            onClick={() => EditData(data)}
                          >
                            {t("Edit")}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </>
            );
          }}
        </Table>
      </div>
      {/* </SubPageHead> */}
    </>
  );
};

export default Department;
