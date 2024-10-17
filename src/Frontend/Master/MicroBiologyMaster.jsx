import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../utils/axiosInstance";
import { MicroBioMasterSchema } from "../../utils/Schema";
import PageHead from "../../components/CommonComponent/PageHead";
import { MicroBioMaster } from "../../utils/Constants";
import Input from "../../components/CommonComponent/Input";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import { getTrimmedData, number } from "../../utils/helpers";
import Loading from "../../components/Loading/Loading";
import Table from "../../components/Table/Table";

const MicroBiologyMaster = () => {
  const [TableData, setTableData] = useState([]);
  const [loading, setLoading] = useState({
    save: false,
    search: false,
  });
  const [payload, setPayload] = useState({
    Name: "",
    TypeID: "2",
    TypeName: "Organism",
    Code: "",
    IsActive: "1",
  });
  const [err, setErr] = useState({});
  const { t } = useTranslation();

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setPayload({
      ...payload,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };

  const handleTestSearch = (id) => {
    setLoading({
      ...loading,
      search: true,
    });
    axiosInstance
      .post("MicroMaster/getmasterdata", {
        TypeID: id,
      })
      .then((res) => {
        setLoading({
          ...loading,
          search: false,
        });
        setTableData(res?.data?.message);
        setErr({});
      })
      .catch((err) => {
        setLoading({
          ...loading,
          search: false,
        });
        setTableData([]);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went wrong."
        );
      });
  };

  const handleSelect = (event) => {
    const { name, value, selectedIndex } = event?.target;
    const label = event?.target?.children[selectedIndex].text;
    setPayload({ ...payload, [name]: value, TypeName: label });
    handleTestSearch(value);
  };

  const handleEdit = (data) => {
    setPayload({
      Name: data?.Name,
      TypeID: data?.typeid,
      TypeName: data?.typename,
      Code: data?.Code,
      IsActive: data?.isactive,
      ID: data?.id,
    });
    window.scrollTo(0, 0);
  };

  const handleSave = (url) => {
    const generatedError = MicroBioMasterSchema(payload);

    if (generatedError === "") {
      setLoading({
        ...loading,
        save: true,
      });
      axiosInstance
        .post(url, getTrimmedData(payload))
        .then((res) => {
          toast.success(res?.data?.message);
          setLoading({
            ...loading,
            save: false,
          });
          setErr({});
          setPayload({
            Name: "",
            TypeID: "2",
            IsActive: "1",
            TypeName: "Organism",
            Code: "",
          });
          handleTestSearch("2");
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
          setLoading({
            ...loading,
            save: false,
          });
        });
    } else setErr(generatedError);
  };
  useEffect(() => {
    handleTestSearch("2");
  }, []);
  return (
    <>
      <PageHead name="Master Entry" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <SelectBox
                options={MicroBioMaster}
                name="TypeID"
                lable="Organism"
                id="Organism"
                onChange={handleSelect}
                selectedValue={payload?.TypeID}
              />
            </div>

            <div className="col-sm-2">
              <Input
                id="Name"
                lable="Name"
                placeholder=" "
                type="text"
                name="Name"
                value={payload?.Name}
                onChange={handleChange}
              />

              {payload?.Name?.trim() === "" && (
                <span className="error-message">{err?.Name}</span>
              )}
            </div>

            <div className="col-sm-2">
              <Input
                id="Code"
                lable="Code"
                placeholder=" "
                type="text"
                onInput={(e) => number(e, 20)}
                name="Code"
                value={payload?.Code}
                onChange={handleChange}
              />
              {payload?.Code?.trim() === "" && (
                <span className="error-message">{err?.Code}</span>
              )}
            </div>

            <div className="col-sm-1">
              <input
                type="checkbox"
                name="IsActive"
                className="mt-2"
                checked={payload?.IsActive == "1" ? true : false}
                onChange={(e) => handleChange(e)}
              />
              &nbsp;
              <label className="ml-2" htmlFor="IsActive">
                {t("Active")}
              </label>
            </div>

            <div className="col-sm-1">
              {loading?.save ? (
                <Loading />
              ) : payload?.ID ? (
                <div
                  className="btn btn-warning btn-sm btn-block"
                  onClick={() =>
                    handleSave("MicroMaster/updatemasterdata", "Update")
                  }
                >
                  {t("Update")}
                </div>
              ) : (
                <div
                  className="btn btn-success btn-sm btn-block"
                  onClick={() =>
                    handleSave("MicroMaster/savemasterdata", "Save")
                  }
                >
                  {t("Save")}
                </div>
              )}
            </div>
            <div className="col-sm-1">
              <div
                className="btn btn-danger btn-sm btn-block"
                onClick={() => {
                  setErr({});
                  setPayload({
                    Name: "",
                    TypeID: "2",
                    IsActive: "1",
                    TypeName: "Organism",
                    Code: "",
                  });
                }}
              >
                {t("Reset")}
              </div>
            </div>
          </div>
        </div>
      </PageHead>
      {loading?.search ? (
        <Loading />
      ) : (
        TableData?.length > 0 && (
          <div className="card">
            <Table>
              <thead className="cf">
                <tr>
                  {[
                    t("S.No"),
                    t("Code"),
                    t("Name"),
                    t("Type"),
                    t("Status"),
                    t("Insert By"),
                    t("Insert Date"),
                    t("Last Update By"),
                    t("Last Update Date"),
                    t("Edit"),
                    t("Tagging"),
                  ].map((ele, index) => (
                    <th key={index}>{ele}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading?.search ? (
                  <Loading />
                ) : (
                  TableData.map((item, index) => (
                    <tr key={index}>
                      <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                      <td data-title={t("Code")}>{item?.Code}&nbsp;</td>
                      <td data-title={t("Name")}>{item?.Name}&nbsp;</td>
                      <td data-title={t("Type")}>{item?.typename}&nbsp;</td>
                      <td data-title={t("Status")}>{item?.STATUS}&nbsp;</td>
                      <td data-title={t("Insert By")}>
                        {item?.InsertByname}&nbsp;
                      </td>
                      <td data-title={t("Insert Date")}>
                        {item?.entrydate}&nbsp;
                      </td>
                      <td data-title={t("Last Update By")}>
                        {item?.UpdateByname}&nbsp;
                      </td>
                      <td data-title={t("Last Update Date")}>
                        {item?.updatedate}&nbsp;
                      </td>
                      <td data-title={t("Edit")}>
                        <div
                          className="text-primary"
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() => handleEdit(item)}
                        >
                          {t("Edit")}
                        </div>
                      </td>
                      <td data-title={t("Tagging")}>
                        {item?.typeid == "2" && (
                          <Link
                            className="text-primary"
                            style={{
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                            to={`/MicroBiologyMasterMapping`}
                            state={{
                              id: item?.id,
                              Code: item?.Code,
                              Name: item?.Name,
                              typeid: item?.typeid,
                            }}
                          >
                            {t("Tagging")}
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        )
      )}
    </>
  );
};

export default MicroBiologyMaster;
