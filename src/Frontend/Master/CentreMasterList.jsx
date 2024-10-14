import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useTranslation } from "react-i18next";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import Input from "../../components/CommonComponent/Input";
import Loading from "../../components/Loading/Loading";
import Table from "../../components/Table/Table";
import { axiosInstance } from "../../utils/axiosInstance";
import LinkPageHead from "../../components/CommonComponent/LinkPageHead";
import NoRecordFound from "../../components/CommonComponent/NoRecordFound";
const CentreMasterList = () => {
  const { t } = useTranslation();
  const { name } = useParams();
  console.log(useParams());
  const [loading, setLoading] = useState(false);
  const [CentreType, setCentreType] = useState([]);
  const [payload, setPayload] = useState({
    CentreType: "",
    CentreName: "",
    CentreCode: "",
    DataType: name === "Rate" ? "RateType" : "Centre",
  });
  const [data, setData] = useState([]);

  const handleSelect = (event) => {
    const { name, value } = event.target;
    setPayload({ ...payload, [name]: value });
  };

  const getCentreData = () => {
    setLoading(true);
    axiosInstance
      .post("Centre/getCentreData", payload)
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.message);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const getDropDownData = (name) => {
    axiosInstance
      .post("Global/getGlobalData", { Type: name })
      .then((res) => {
        let data = res.data.message;
        let value = data.map((ele) => {
          return {
            value: ele.FieldDisplay,
            label: ele.FieldDisplay,
          };
        });
        value.unshift({ label: "All", value: "" });
        switch (name) {
          case "CentreType":
            setCentreType(value);
            break;
        }
      })
      .catch((err) => console.log(err));
  };

  console.log(CentreType[0]?.value);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  useEffect(() => {
    getCentreData();
    getDropDownData("CentreType");
  }, []);

  return (
    <LinkPageHead
      name={`${name} ${t("Type List")}`}
      showDrop={"true"}
      to={name === "center" ? "/CentreMaster/center" : "/CentreMaster/Rate"}
      title="Create New"
      state={{
        url: "Centre/InsertCentre",
      }}
    >
      <div className="card">
        <div className="row">
          {name === "center" && (
            <>
              <div className="col-sm-2 col-md-2">
                <SelectBox
                  onChange={handleSelect}
                  options={CentreType}
                  id="Type"
                  lable="Type"
                  name="CentreType"
                  selectedValue={payload?.CentreType}
                />
              </div>
            </>
          )}
          <div className="col-sm-2 col-md-2">
            <Input
              className="select-input-box form-control input-sm"
              placeholder=" "
              lable="Centre Name"
              id="CentreName"
              name="CentreName"
              type="text"
              value={payload?.CentreName}
              onChange={handleChange}
            />
          </div>

          <div className="col-sm-2 col-md-2">
            <Input
              name="CentreCode"
              type="text"
              placeholder=" "
              lable="Centre Code"
              id="CentreCode"
              value={payload?.CentreCode}
              onChange={handleChange}
            />
          </div>

          <div className="col-sm-1">
            <button
              type="submit"
              className="btn btn-block btn-info btn-sm"
              onClick={getCentreData}
            >
              {t("Search")}
            </button>
          </div>
        </div>
        <div className="card">
          {loading ? (
            <Loading />
          ) : (
            <div className="row">
              {data.length > 0 ? (
                <Table>
                  <thead className="cf">
                    <tr>
                      <th>{t("S.No")}</th>
                      {name === "Rate" ? null : <th>Centre Type</th>}
                      <th>{t("Name")}</th>
                      <th>{t("Code")}</th>
                      <th>{t("Invoice To")}</th>
                      <th>{t("Business Unit")}</th>
                      <th>{t("Processing Lab")}</th>
                      <th>{t("Reference Rate")}</th>
                      <th>{t("Barcode Logic")}</th>
                      <th>{t("Invoicing")}</th>
                      <th>{t("Status")}</th>
                      <th>{t("Action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((data, i) => (
                      <tr key={i}>
                        <td data-title={t("S.No")}>{i + 1}&nbsp;</td>
                        {name === "Rate" ? null : (
                          <td data-title="Centre Type">
                            {data?.CentreType}&nbsp;
                          </td>
                        )}
                        <td data-title={t("Name")}>{data?.Centre}&nbsp;</td>
                        <td data-title={t("Code")}>{data?.CentreCode}&nbsp;</td>
                        <td data-title={t("Invoice To")}>
                          {data?.InvoiceToStatus}&nbsp;
                        </td>
                        <td data-title={t("Business Unit")}>
                          {data?.BusinessUnitStatus}&nbsp;
                        </td>
                        <td data-title={t("Processing Lab")}>
                          {data?.ProcessingLabStatus}&nbsp;
                        </td>
                        <td data-title={t("Reference Rate")}>
                          {data?.ReferenceRateStatus}&nbsp;
                        </td>
                        <td data-title={t("Barcode Logic")}>
                          {data?.BarcodeDisplay}&nbsp;
                        </td>
                        <td data-title={t("Invoicing")}>
                          {data?.InvoiceToStatus}&nbsp;
                        </td>
                        <td data-title={t("Status")}>
                          {data?.isActive === 1 ? t("Active") : t("Expired")}
                          &nbsp;
                        </td>
                        <td data-title={t("Action")}>
                          <Link
                            state={{
                              data: data,
                              other: { button: "Update", pageName: "Edit" },
                              url: "Centre/UpdateCentre",
                            }}
                            to={
                              name === "center"
                                ? "/CentreMaster/center"
                                : "/CentreMaster/Rate"
                            }
                          >
                            {t("Edit")}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <NoRecordFound />
              )}
            </div>
          )}
        </div>
      </div>
    </LinkPageHead>
  );
};

export default CentreMasterList;
