import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import PageHead from "../../components/CommonComponent/PageHead";
import Input from "../../components/CommonComponent/Input";
import Loading from "../../components/Loading/Loading";
import Table from "../../components/Table/Table";

const MachineGroup = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    MachineName: "",
  });

  const { t, i18n } = useTranslation();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const fetch = () => {
    setLoading(true);
    axiosInstance
      .get("MachineGroup/BindMachineGroup")
      .then((res) => {
        setTableData(res?.data?.message);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went Wrong"
        );
        setLoading(false);
      });
  };

  const BindData = (data) => {
    setState({
      ID: data?.ID,
      MachineName: data?.Name,
    });
  };

  const handleSave = (url) => {
    axiosInstance
      .post(url, state)
      .then((res) => {
        toast.success(res?.data?.message);
        setState({
          MachineName: "",
        });
        fetch();
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went Wrong"
        );
      });
  };

  useEffect(() => {
    fetch();
  }, []);
  return (
    <>
      <PageHead name={t("Machine Group")} showDrop="true">
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <Input
                placeholder=""
                className="select-input-box form-control input-sm"
                type="text"
                max={25}
                name="MachineName"
                id="MachineName"
                value={state?.MachineName}
                onChange={handleChange}
                required
                lable={t("Machine Name")}
              />
            </div>
            <div className="col-sm-1">
              {loading ? (
                <Loading />
              ) : state?.ID ? (
                <button
                  className="btn btn-block btn-success btn-sm"
                  onClick={() => handleSave("MachineGroup/UpdateMachineGroup")}
                  disabled={state?.MachineName?.length > 3 ? false : true}
                >
                  {t("Update")}
                </button>
              ) : (
                <button
                  className="btn btn-block btn-success btn-sm"
                  onClick={() => handleSave("MachineGroup/InsertMachineGroup")}
                  disabled={state?.MachineName?.length > 3 ? false : true}
                >
                  {t("Save")}
                </button>
              )}
            </div>
          </div>
        </div>
      </PageHead>
      <div className="card">
        <Table>
          <thead className="cf">
            <tr>
              {[t("S.No"), t("Name"), t("Action")].map((ele, index) => (
                <th key={index}>{ele}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData?.map((ele, index) => (
              <tr key={index}>
                <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                <td data-title={t("Name")}>{ele?.Name}&nbsp;</td>
                <td
                  data-title={t("Action")}
                  className="text-info"
                  style={{
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    window.scroll(0, 0);
                    BindData(ele);
                  }}
                >
                  {t("Select")}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default MachineGroup;
