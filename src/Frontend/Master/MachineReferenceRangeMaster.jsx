import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import PageHead from "../../components/CommonComponent/PageHead";
import Input from "../../components/CommonComponent/Input";
import Loading from "../../components/Loading/Loading";
import Table from "../../components/Table/Table";
import { Link } from "react-router-dom";

const MachineReferenceRangeMaster = () => {
  const { t } = useTranslation();
  const [tableData, setTableData] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [load, setLoad] = useState(false);
  const [payload, setPayload] = useState({
    MachineName: "",
    IsActive: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e?.target;
    if (name === "IsActive") {
      setPayload({ ...payload, [name]: type === "checkbox" ? checked : value });
    } else {
      setPayload({ ...payload, [name]: value });
    }
  };

  const handleTableData = () => {
    axiosInstance
      .get("MachineMaster/getMachine")
      .then((res) => {
        setTableData(res?.data?.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSave = () => {
    if (payload?.MachineName.trim() === "") {
      toast.error("Please Enter Machine Name.");
    } else {
      setLoad(true);
      axiosInstance
        .post("MachineMaster/savemachine", {
          MachineName: payload?.MachineName.trim(),
          isActive: payload?.IsActive === true ? 1 : 0,
        })
        .then((res) => {
          toast.success(res?.data?.message);
          setLoad(false);
          setPayload({
            MachineName: "",
          });
          handleTableData();
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something went wrong."
          );
          setLoad(false);
        });
    }
  };

  const handleUpdate = () => {
    if (payload?.MachineName.trim() === "") {
      toast.error("Please Enter Machine Name.");
    } else {
      setLoad(true);
      axiosInstance
        .post("MachineMaster/UpdateMachine", {
          MachineId: payload?.MachineId,
          MachineName: payload?.MachineName.trim(),
          isActive: payload?.IsActive === true ? 1 : 0,
        })
        .then((res) => {
          toast.success(res?.data?.message);
          setLoad(false);
          setPayload({
            MachineName: "",
          });
          handleTableData();
          setIsUpdate(false);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something went wrong."
          );
          setLoad(false);
        });
    }
  };

  const getMachineTable = (ele) => {
    setIsUpdate(true);
    setPayload({
      MachineName: ele?.MachineName,
      IsActive: ele?.isActive === 1 ? true : false,
      MachineId: ele?.MachineId,
    });
    window.scrollTo(0, 0);
  };

  useState(() => {
    handleTableData();
  }, []);
  return (
    <>
      <PageHead name={t("Machine Reference Range Master")} showDrop="true">
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <Input
                type="text"
                name="MachineName"
                id="MachineName"
                placeholder=""
                value={payload?.MachineName}
                max={30}
                onChange={handleChange}
                lable={t("Machine Name")}
              />
            </div>
            <div className="col-sm-1 d-flex align-items-center">
              <input
                type="checkbox"
                name="IsActive"
                id="IsActive"
                placeholder=""
                checked={payload?.IsActive}
                onChange={handleChange}
              />
              <label className="col-sm-10">{t("IsActive")}</label>
            </div>
            <div className="col-sm-1">
              <button
                className="btn btn-sm btn-success btn-block"
                onClick={isUpdate ? handleUpdate : handleSave}
              >
                {" "}
                {isUpdate ? t("Update") : t("Save")}
              </button>
            </div>
          </div>
        </div>
      </PageHead>
      {load ? (
        <Loading />
      ) : (
        <Table>
          <thead className="cf">
            <tr>
              <th>{t("S.No.")}</th>
              <th>{t("Machine ID")}</th>
              <th>{t("Machine Name")}</th>
              <th>{t("Status")}</th>
              <th>{t("Action")}</th>
            </tr>
          </thead>
          <tbody>
            {tableData?.map((ele, index) => (
              <tr key={index}>
                <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                <td data-title={t("Machine ID")}>{ele?.MachineId}&nbsp;</td>
                <td data-title={t("Machine Name")}>{ele?.MachineName}&nbsp;</td>
                <td data-title={t("Status")}>
                  {ele?.isActive ? "Active" : "De-Active"}&nbsp;
                </td>
                <td>
                  <Link
                    className="text-primary"
                    style={{
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={() => {
                      getMachineTable(ele);
                    }}
                  >
                    {t("Edit")}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default MachineReferenceRangeMaster;
