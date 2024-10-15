import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../utils/axiosInstance";
import DesignationModal from "../utils/DesignationModal";
import Table from "../../components/Table/Table";
import { dateConfig } from "../../utils/helpers";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import LinkPageHead from "../../components/CommonComponent/LinkPageHead";

const Designations = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState({
    modal: false,
    id: "",
    name: "",
  });
  const { t } = useTranslation();
  const getDesignationData = () => {
    axiosInstance
      .get("Designation/getDesignationData")
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.message);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleCloseModal = () => {
    setShow({
      modal: false,
      id: "",
      name: "",
    });
  };

  useEffect(() => {
    getDesignationData();
  }, []);
  return (
    <>
      {show?.modal && (
        <DesignationModal show={show} onHandleClose={handleCloseModal} />
      )}
      <LinkPageHead
        name="Designations"
        showDrop={"true"}
        to="/DesignationsCreate"
        title="Create New"
        state={{
          url: "Designation/InsertDesignationData",
        }}
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
                  <th>{t("Designation Name")}</th>
                  <th>{t("View Rights")}</th>
                  <th>{t("Sequence No")}</th>
                  <th>{t("Date Of Creation")}</th>
                  <th>{t("Date Of Updation")}</th>
                  <th>{t("New Test Approve")}</th>
                  <th>{t("ShowSpecialRate")}</th>
                  <th>{t("Active Status")}</th>
                  <th>{t("Direct Approve")}</th>
                  <th>{t("Action")}</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((data, i) => (
                  <tr key={i}>
                    <td data-title={t("S.No")}>{i + 1}</td>
                    <td data-title={t("Designation Name")}>
                      {data?.DesignationName}
                    </td>
                    <td data-title={t("View Rights")}>
                      <a
                        title="Page Rights"
                        className="fa fa-search coloricon"
                        onClick={() => {
                          setShow({
                            modal: true,
                            id: data?.DesignationID,
                            name: data?.DesignationName,
                          });
                        }}
                      ></a>
                    </td>

                    <td data-title={t("Sequence No")}>{data?.SequenceNo}</td>
                    <td data-title={t("Date Of Creation")}>
                      {dateConfig(data?.dtEntry)}
                    </td>
                    <td data-title={t("Date Of Updation")}>
                      {data?.dtUpdate !== "0000-00-00 00:00:00"
                        ? dateConfig(data?.dtUpdate)
                        : "-"}
                    </td>
                    <td data-title={t("New Test Approve")}>
                      {data?.NewTestApproves}
                    </td>
                    <td data-title={t("ShowSpecialRate")}>
                      {data?.ShowSpecialRate}
                    </td>
                    <td data-title={t("Active Status")}>
                      {data?.ActiveStatus}
                    </td>
                    <td data-title={t("Direct Approve")}>
                      {data?.DirectApprove}
                    </td>
                    <td data-title={t("Action")}>
                      <Link
                        state={{
                          data: data,
                          other: { button: "Update" },
                          url: "Designation/UpdateDesignationData",
                        }}
                        to="/DesignationsCreate"
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

export default Designations;
