import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../utils/axiosInstance";
import Table from "../../components/Table/Table";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import LinkPageHead from "../../components/CommonComponent/LinkPageHead";

const FieldBoyMaster = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation();

  const getFieldBoyMasterData = () => {
    axiosInstance
      .get("FieldBoyMaster/getFieldBoy")
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.message);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getFieldBoyMasterData();
  }, []);

  return (
    <>
      <LinkPageHead
        name="Field Boy Master"
        showDrop={"true"}
        to="/CreateFieldBoyMaster"
        title="Create New"
       
      >
        <div className="card">
          {loading ? (
            <Loading />
          ) : (
            <Table
              className="table table-bordered table-hover table-striped tbRecord"
              cellPadding="{0}"
              cellSpacing="{0}"
            >
              <thead className="cf">
                <tr>
                  <th>{t("S.No")}</th>
                  <th>{t("Name")}</th>
                  <th>{t("Age")}</th>
                  <th>{t("Contact No")}</th>
                  <th>{t("City")}</th>
                  <th>{t("State")}</th>
                  <th>{t("PinCode")}</th>
                  <th>{t("Home Collection")}</th>
                  <th>{t("Action")}</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((ele, index) => (
                  <tr key={index}>
                    <td data-title={t("S.No")}>{index + 1}</td>
                    <td data-title={t("Name")}>{ele?.NAME}</td>
                    <td data-title={t("Age")}>{ele?.Age}</td>
                    <td data-title={t("Contact No")}>{ele?.Mobile}</td>
                    <td data-title={t("City")}>{ele?.City}</td>
                    <td data-title={t("State")}>{ele?.State}</td>
                    <td data-title={t("PinCode")}>{ele?.Pincode}</td>
                    <td data-title={t("Home Coll")}>
                      {ele?.HomeCollection ? t("Yes") : t("No")}
                    </td>
                    <td data-title={t("Action")}>
                      <Link
                        state={{
                          data: ele?.FieldBoyID,
                          other: { button: "Update" },
                          url: "FieldBoyMaster/EditFieldBoy",
                        }}
                        to="/CreateFieldBoyMaster"
                      >
                        {t("Edit")}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </LinkPageHead>
    </>
  );
};

export default FieldBoyMaster;
