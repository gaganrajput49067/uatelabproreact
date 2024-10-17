import { axiosInstance } from "../../utils/axiosInstance";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Input from "../../components/CommonComponent/Input";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import Loading from "../../components/Loading/Loading";
import NoRecordFound from "../../components/CommonComponent/NoRecordFound";
import { useTranslation } from "react-i18next";
import PageHead from "../../components/CommonComponent/PageHead";
import Table from "../../components/Table/Table";
const RefundAfterBill = () => {
  const [tableData, setTableData] = useState([]);
  const [BindRefundReason, setBindRefundReason] = useState([]);
  const [dropdownData, setDropDownData] = useState({
    RefundReason: "",
  });
  const [LabNo, setLabNo] = useState([]);

  const [load, setLoad] = useState({
    saveLoad: false,
  });

  console.log(tableData);

  const fetch = () => {
    axiosInstance
      .post("RefundAfterBill/GetItemsToRefund", {
        LedgerTransactionNo: LabNo.trim(),
      })
      .then((res) => {
        if (res?.data?.message.length == 0) {
          toast.error("No record found");
        }
        setTableData(res?.data?.message);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went wrong."
        );
      });
  };

  const getDropDownData = (name) => {
    axiosInstance.post("Global/getGlobalData", { Type: name }).then((res) => {
      let data = res.data.message;
      console.log(data);
      let value = data.map((ele) => {
        return {
          value: ele.FieldDisplay,
          label: ele.FieldDisplay,
        };
      });
      setDropDownData({ RefundReason: value[0]?.value });
      setBindRefundReason(value);
    });
  };

  const handleCheckbox = (e, index) => {
    const { name, checked } = e.target;
    const data = [...tableData];
    data[index][name] = checked === true ? 1 : 0;
    setTableData(data);
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setDropDownData({ ...dropdownData, [name]: value });
  };

  const handleSave = () => {
    setLoad({ ...load, saveLoad: true });
    const data = tableData.filter((ele) => ele?.IsRefund === 1);

    const val = data?.map((ele) => {
      return {
        LedgerTransactionID: ele?.LedgerTransactionID,
        ItemId: ele?.ItemId,
        BillNo: ele?.BillNo,
        DiscountAmt: ele?.DiscountAmt,
        Amount: ele?.Amount,
        RefundReason: dropdownData?.RefundReason,
      };
    });
    axiosInstance
      .post("RefundAfterBill/SaveRefundAfterBill", {
        PLO: val,
      })
      .then((res) => {
        console.log(res);
        toast.success(res?.data?.message);
        setLoad({ ...load, saveLoad: false });
        setLabNo("");
        setTableData([]);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went wrong."
        );
        setLoad({ ...load, saveLoad: false });
      });
  };

  useEffect(() => {
    getDropDownData("RefundReason");
  }, []);

  const handleShowSubmit = () => {
    let show = false;
    for (let i = 0; i < tableData.length; i++) {
      if (tableData[i]["IsRefund"] === 1) {
        show = true;
        break;
      }
    }
    return show;
  };

  const { t } = useTranslation();

  return (
    <>
      <PageHead name="Refund After Bill" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <Input
                type="text"
                id="Lab No."
                lable="Lab Number"
                placeholder=" "
                value={LabNo}
                onChange={(e) => {
                  setLabNo(e?.target?.value);
                }}
              />
            </div>

            <div className="col-sm-1">
              <button
                onClick={fetch}
                className="btn btn-primary btn-sm w-100"
                disabled={LabNo.length == 0}
              >
                {t("Search")}
              </button>
            </div>
          </div>{" "}
        </div>
      </PageHead>

      {tableData.length > 0 ? (
        <div className="card">
          <Table>
            <thead>
              <tr>
                {[
                  t("S.No."),
                  t("Lab No"),
                  t("Patient Code"),
                  t("Test Name"),
                  t("Quantity"),
                  t("Rate"),
                  t("Amount"),
                  t("Select"),
                ].map((ele, index) => (
                  <th key={index}>{ele}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((data, index) => (
                <tr key={index}>
                  <td data-title={t("S.No.")}>{index + 1}&nbsp;</td>
                  <td data-title={t("Lab No")}>
                    {data?.LedgerTransactionNo}&nbsp;
                  </td>
                  <td data-title={t("Patient Code")}>
                    {data?.PatientCode}&nbsp;
                  </td>
                  <td data-title={t("Test Name")}>{data?.ItemName}&nbsp;</td>
                  <td data-title={t("Quantity")}>{data?.Quantity}&nbsp;</td>
                  <td data-title={t("Rate")}>
                    {Number(data?.Rate).toFixed(2)}&nbsp;
                  </td>
                  <td data-title={t("Amount")}>
                    {Number(data?.Amount).toFixed(2)}&nbsp;
                  </td>
                  <td data-title={t("Select")}>
                    {data?.Rate != 0 && (
                      <input
                        type="checkbox"
                        checked={data?.IsRefund}
                        name="IsRefund"
                        onChange={(e) => handleCheckbox(e, index)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {handleShowSubmit() && (
            <>
              <div className="row mt-4">
                <div className="col-sm-2">
                  <SelectBox
                    name="RefundReason"
                    options={BindRefundReason}
                    onChange={handleSelectChange}
                    id="RefundReason"
                    lable="RefundReason"
                    selectedValue={dropdownData?.RefundReason}
                  />
                </div>

                <div className="col-sm-1">
                  {load?.saveLoad ? (
                    <Loading />
                  ) : (
                    <button
                      className="btn btn-block btn-success btn-sm"
                      onClick={handleSave}
                    >
                      {t("Save")}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="card">
          {" "}
          <NoRecordFound />
        </div>
      )}
    </>
  );
};

export default RefundAfterBill;
