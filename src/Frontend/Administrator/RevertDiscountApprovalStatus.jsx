import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import PageHead from "../../components/CommonComponent/PageHead";
import Input from "../../components/CommonComponent/Input";
import Table from "../../components/Table/Table";
import Loading from "../../components/Loading/Loading";
import NoRecordFound from "../../components/CommonComponent/NoRecordFound";
import { axiosInstance } from "../../utils/axiosInstance";
import { useTranslation } from "react-i18next";
const RevertDiscountApprovalStatus = () => {
  const [input, setInput] = useState({
    labNo: "",
  });
  const [data, setData] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const { t } = useTranslation();
  const fetch = () => {
    setSearchLoading(true);
    axiosInstance
      .post("RevertDiscountApprovalStatus/SearchRevertData", {
        labNo: input?.labNo,
      })
      .then((res) => {
        const data = res?.data?.message;
        if (data.length > 0) {
          setData(data);
        } else {
          toast.error("No Data Found");
        }
        setSearchLoading(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
        setSearchLoading(false);
      });
  };

  const handleReset = (id) => {
    axiosInstance
      .post("RevertDiscountApprovalStatus/UpdateRevertStatus", {
        labId: id,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        setData([]);
        setInput({ labNo: "" });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
      });
  };

  return (
    <>
      <PageHead name="Revert Discount Approval Status" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <Input
                id="Lab No."
                lable="Lab Number"
                placeholder=" "
                type="text"
                name="labNo"
                value={input.labNo}
                onChange={handleChange}
              />
            </div>

            <div className="col-sm-1 ">
              <button
                className="btn btn-block btn-info btn-sm"
                onClick={fetch}
                disabled={input?.labNo.length > 3 ? false : true}
              >
                {t("Search")}
              </button>
            </div>
          </div>
        </div>
      </PageHead>
      {searchLoading ? (
        <Loading />
      ) : data.length > 0 ? (
        <div className="card">
          <Table>
            <thead className="cf">
              <tr>
                <th>{t("S.No")}</th>
                <th>{t("Lab No")}</th>
                <th>{t("PName")}</th>
                <th>{t("Date")}</th>
                <th>{t("DiscountApprovedByName")}</th>
                <th>{t("NetAmount")}</th>
                <th>{t("DiscountOnTotal")}</th>
                <th>{t("STATUS")}</th>
                <th>{t("IsDiscountApproved")}</th>
                <th>{t("DiscountStatus")}</th>
                <th>{t("Action")}</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((item, index) => {
                return (
                  <tr key={index}>
                    <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                    <td data-title={t("Lab No")}>
                      {item.LedgertransactionNo}&nbsp;
                    </td>

                    <td data-title={t("PName")}>{item?.PName}&nbsp;</td>
                    <td data-title={t("Date")}>{item.DATE}&nbsp;</td>
                    <td data-title={t("DiscountApprovedByName")}>
                      {item.DiscountApprovedByName}&nbsp;
                    </td>
                    <td data-title={t("NetAmount")}>{item.NetAmount}&nbsp;</td>
                    <td data-title={t("DiscountOnTotal")}>
                      {item.DiscountOnTotal}&nbsp;
                    </td>
                    <td data-title={t("STATUS")}>{item.STATUS}&nbsp;</td>
                    <td data-title={t("IsDiscountApproved")}>
                      {item.IsDiscountApproved}&nbsp;
                    </td>
                    <td data-title={t("DiscountStatus")}>
                      {item.DiscountStatus}&nbsp;
                    </td>
                    <td data-title={t("Action")}>
                      <button
                        className="btn btn-block btn-danger btn-sm "
                        onClick={() => handleReset(item.LedgertransactionId)}
                      >
                        {t("Reset Status")}&nbsp;
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      ) : (
        <div className="card">
          {" "}
          <NoRecordFound />{" "}
        </div>
      )}
    </>
  );
};

export default RevertDiscountApprovalStatus;
