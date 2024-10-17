import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import { CompanyKeyValidationSchema } from "../../utils/Schema";
import ReactSelect from "../../components/CommonComponent/ReactSelect";
import Input from "../../components/CommonComponent/Input";
import Loading from "../../components/Loading/Loading";
import PageHead from "../../components/CommonComponent/PageHead";
import Table from "../../components/Table/Table";

const CompanyKey = () => {
  const [payload, setPayload] = useState({
    CompanyID: "",
    KeyID: "",
    SecretKey: "",
  });
  const [company, setCompany] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErros] = useState({});
  const getCompanyName = () => {
    axiosInstance
      .get("CompanyMaster/getCompanyName")
      .then((res) => {
        let data = res?.data?.message;
        let Company = data?.map((ele) => {
          return {
            value: ele?.CompanyId,
            label: ele?.CompanyName,
          };
        });
        Company.unshift({ label: "Select Company", value: "" });
        setCompany(Company);
      })
      .catch((err) =>
        console.log(err?.res?.data ? err?.res?.data : "Something Went Wrong")
      );
  };
  const GetKeyData = (id) => {
    axiosInstance
      .post("CompanyMaster/getRazorpaySecretkey", {
        CompanyId: id,
      })
      .then((res) => {
        let data = res?.data?.message;
        setTableData(data);
      })
      .catch((err) => toast.error("No Data Found"));
  };

  useEffect(() => {
    GetKeyData("");
    getCompanyName();
  }, []);

  const SaveData = () => {
    const generatedError = CompanyKeyValidationSchema(payload);
    if (generatedError === "") {
      setLoading(true);

      axiosInstance
        .post("CompanyMaster/SaveRazorpaySecretkey", {
          ...payload,
        })
        .then((res) => {
          setLoading(false);
          toast.success(res?.data?.message);
          setPayload({
            CompanyID: "",
            KeyID: "",
            SecretKey: "",
          });
          GetKeyData("");
          setErros({});
        })
        .catch((err) => {
          setLoading(false);
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something Went Wrong"
          );
        });
    } else {
      setErros(generatedError);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value.trim(),
    });
  };

  const handleReset = () => {
    setPayload({
      CompanyID: "",
      KeyID: "",
      SecretKey: "",
    });
    GetKeyData("");
    setErros({});
  };
  const { t } = useTranslation();
  return (
    <>
      <PageHead name="Company Key" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-md-2">
              <ReactSelect
                dynamicOptions={company}
                value={payload?.CompanyID}
                name="CompanyID"
                placeholderName="Company"
                onChange={(_, e) => {
                  GetKeyData(e?.value);
                  setPayload({
                    ...payload,
                    CompanyID: e?.value,
                  });
                }}
              />
              {payload?.CompanyID === "" && (
                <span className="error-message">{errors?.CompanyID}</span>
              )}
            </div>

            <div className="col-md-2 col-md-2">
              <Input
                lable="Key ID"
                placeholder=" "
                id="Key ID"
                name="KeyID"
                value={payload?.KeyID}
                onChange={handleChange}
              />
              {payload?.KeyID === "" && (
                <span className="error-message">{errors?.KeyID}</span>
              )}
            </div>

            <div className="col-md-2">
              <Input
                lable="Secret Key"
                placeholder=" "
                id="Secret Key"
                name="SecretKey"
                value={payload?.SecretKey}
                onChange={handleChange}
              />{" "}
              {payload?.SecretKey === "" && (
                <span className="error-message">{errors?.SecretKey}</span>
              )}
            </div>
            <div className="col-md-1">
              {loading ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-block btn-success btn-sm"
                  onClick={SaveData}
                >
                  {t("Save")}
                </button>
              )}
            </div>

            <div className="col-md-1">
              <button
                type="button"
                className="btn btn-block btn-danger btn-sm"
                onClick={handleReset}
              >
                {t("Reset")}
              </button>
            </div>
          </div>
        </div>
      </PageHead>
      <div className="card">
        <Table>
          <thead className="cf text-center">
            <tr>
              <th className="text-center">{t("S.No")}</th>
              <th className="text-center">{t("Company Name")}</th>
              <th className="text-center">{t("Key ID")}</th>{" "}
              <th className="text-center">{t("Secret Key")}</th>
            </tr>
          </thead>
          {tableData?.length > 0 && (
            <tbody>
              {tableData.map((ele, index) => (
                <>
                  <tr>
                    <td data-title="S.No" className="text-center">
                      {index + 1}
                    </td>
                    <td data-title="CompanyName" className="text-center">
                      {ele?.CompanyName}
                    </td>
                    <td data-title="KeyID" className="text-center">
                      {ele?.KeyID}
                    </td>
                    <td data-title="SecretKey" className="text-center">
                      {ele?.SecretKey}
                    </td>
                  </tr>
                </>
              ))}
            </tbody>
          )}
        </Table>
      </div>
    </>
  );
};

export default CompanyKey;
