import React from "react";
import Modal from "../../components/Modal/Modal";

import { useTranslation } from "react-i18next";
import Table from "../../components/Table/Table";
const ValidatePaymentReceiptDetail = ({ receiptData, setShowReceiptData }) => {
  console.log(receiptData?.data);
  const { t } = useTranslation();
  return (
    <>
      {receiptData?.data?.length > 0 && (
        <Modal
          handleClose={() =>
            setShowReceiptData({
              data: "",
              receiptModal: false,
            })
          }
          title=""
        >
          <div className="card">
            <Table>
              <thead className="cf text-center" style={{ zIndex: 99 }}>
                <tr>
                  <th className="text-center">{t("Invoice No.")}</th>
                  <th className="text-center">{t("Invoice Amount")}</th>
                  <th className="text-center">{t("Payment Mode")}</th>
                  <th className="text-center">{t("Amount")}</th>
                </tr>
              </thead>
              <tbody>
                {receiptData?.data?.map((ele, index) => (
                  <>
                    <tr key={index}>
                      <td data-title="Invoice No." className="text-center">
                        {ele?.InvoiceNo}
                      </td>
                      <td data-title="Invoice Amount" className="text-center">
                        {ele?.InvoiceAmount}
                      </td>
                      <td data-title="Payment Mode" className="text-center">
                        {ele?.PaymentMode}
                      </td>
                      <td data-title="Amount" className="text-center">
                        {ele?.ReceivedAmt}
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </Table>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ValidatePaymentReceiptDetail;
