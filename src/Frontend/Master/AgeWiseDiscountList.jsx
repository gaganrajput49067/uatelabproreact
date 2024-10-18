import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import AgeWiseModal from "../utils/AgeWiseModal";
import DeptModal from "../utils/DeptModal";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import { dateConfig } from "../../utils/helpers";
import LinkPageHead from "../../components/CommonComponent/LinkPageHead";
import Table from "../../components/Table/Table";
import NoRecordFound from "../../components/CommonComponent/NoRecordFound";

const AgeWiseDiscountList = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [showdep, setShowdep] = useState(false);
  const [DiscountId, setDiscountId] = useState();

  const handleClose = () => setShow(false);
  const handleClosedep = () => setShowdep(false);
  const handleShow = () => setShow(true);
  const handleShowdep = () => {
    setShowdep(true);
  };

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAgeWiseDiscountList = () => {
    axiosInstance
      .get("AgeWiseDiscount/AllAgeWiseDiscountData")
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.message);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAgeWiseDiscountList();
  }, []);

  const disableData = (Id) => {
    if (window.confirm("Are You Sure?")) {
      axiosInstance
        .post("AgeWiseDiscount/DeActiveAgeWiseDiscountData", {
          ID: Id,
        })
        .then((res) => {
          if (res?.data?.message === "This record De-Activate Successfully") {
            toast.success(res?.data?.message);
            getAgeWiseDiscountList();
          }
        })
        .catch((err) => console.log(err));
    }
  };
  return (
    <>
      <div className="box box-success">
        {DiscountId && show && (
          <AgeWiseModal
            show={show}
            handleClose={handleClose}
            DiscountData={DiscountId}
          />
        )}
        {showdep && (
          <DeptModal
            show={showdep}
            handleClose={handleClosedep}
            DiscountData={DiscountId}
          />
        )}
        <LinkPageHead
          name="AgeWiseDiscountList"
          showDrop={"true"}
          to="/AgeWiseDiscount"
          title="Create New"
          state={{
            url: "AgeWiseDiscount/InsertAgeWiseDiscountData",
          }}
        >
        </LinkPageHead>
        {loading ? (
          <Loading />
        ) : (
          <div className="card">
            {data.length > 0 ? (
              <Table>
                <thead className="cf">
                  <tr>
                    <th>{t("S.No")}</th>
                    <th>{t("Discount Type")}</th>
                    <th>{t("Created By")} </th>
                    <th>{t("Created On")}</th>
                    <th>{t("Discount %")}</th>
                    <th>{t("Valid From")}</th>
                    <th>{t("Valid To")}</th>
                    <th>{t("From Age")}</th>
                    <th>{t("To Age")}</th>
                    <th>{t("Gender")}</th>
                    <th>{t("Discount Share Type")} </th>
                    {/* <th>{t("Coupon Required")}</th> */}
                    <th>{t("Status")}</th>
                    <th>{t("Action")}</th>
                    <th>{t("View")}</th>
                    <th>{t("Add")}</th>
                    <th>{t("De-Active")}</th>
                    <th>{t("Applicable For All")} </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((data, i) => (
                    <tr key={i}>
                      <td data-title={t("S.No")}>{i + 1} &nbsp;</td>
                      <td data-title={t("Discount Type")}>
                        {data?.DiscountType}&nbsp;
                      </td>
                      <td data-title={t("Created By")}>
                        {data?.CreatedByName} &nbsp;
                      </td>
                      <td data-title={t("Created On")}>
                        {dateConfig(data?.CreatedOn)}&nbsp;
                      </td>
                      <td data-title={t("Discount %")}>
                        {data?.DiscountPer} &nbsp;
                      </td>
                      <td data-title={t("Valid From")}>
                        {dateConfig(data?.FromValidityDate)}
                      </td>
                      <td data-title={t("Valid To")}>
                        {dateConfig(data?.ToValidityDate)} &nbsp;
                      </td>
                      <td data-title={t("From Age")}>{data?.FromAge}&nbsp;</td>
                      <td data-title={t("To Age")}>{data?.ToAge}&nbsp;</td>
                      <td data-title={t("Gender")}>{data?.Gender}&nbsp;</td>
                      <td data-title={t("Discount Share Type")}>
                        {data?.DiscountShareType}&nbsp;
                      </td>

                      {/* <td data-title={t("Coupon Required")}>
                          {data?.IsCouponRequired}&nbsp;
                        </td> */}
                      <td data-title={t("Status")}>
                        {data?.isActiveStatus}&nbsp;
                      </td>
                      <td data-title={t("Action")}>
                        <Link
                          to="/AgeWiseDiscount"
                          state={{
                            data: data,
                            other: { button: "Update", pageName: "Edit" },
                            url: "AgeWiseDiscount/UpdateAgeWiseDiscountData",
                          }}
                        >
                          {t("Edit")}
                        </Link>
                      </td>
                      <td data-title={t("View")}>
                        <span
                          title="View Data"
                          className="fa fa-search coloricon"
                          onClick={() => {
                            handleShowdep();
                            setDiscountId(data);
                          }}
                        ></span>
                        &nbsp;
                      </td>
                      <td data-title={t("Add")}>
                        <button
                          id="AddInvestigation"
                          className="form-control btn btn-primary btn-sm"
                          style={{
                            borderRadius: "20px",
                            color: "white",
                            width: "30px",
                            textAlign: "center",
                          }}
                          onClick={() => {
                            handleShow();
                            setDiscountId(data);
                          }}
                        >
                          +
                        </button>
                        &nbsp;{" "}
                      </td>
                      <td data-title={t("Remove")}>
                        <button
                          id="AddInvestigation"
                          className="form-control btn btn-primary btn-sm"
                          style={{
                            borderRadius: "20px",
                            color: "white",
                            width: "28px",
                          }}
                          onClick={() => disableData(data.Id)}
                        >
                          X
                        </button>
                        &nbsp;{" "}
                      </td>
                      <td data-title={t("Applicable For All")}>
                        {data?.ApplicableForAll} &nbsp;
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
    </>
  );
};

export default AgeWiseDiscountList;
