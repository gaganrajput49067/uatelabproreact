import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import NoRecordFound from "../../components/CommonComponent/NoRecordFound";
import Modal from "../../components/Modal/Modal";
import Table from "../../components/Table/Table";
import Loading from "../../components/Loading/Loading";

function InvoiceCreationModal({ show, data, onClose }) {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetch = () => {
    setLoading(true);
    axiosInstance
      .post("Accounts/InvoiceDetails", data)
      .then((res) => {
        setTableData(res?.data?.message);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(
          err?.data?.message ? err?.data?.message : "Something Went Wrong"
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <Modal handleClose={onClose} size="lg">
      <div className="card">
        <div className="row">
          {loading ? (
            <Loading />
          ) : tableData?.length > 0 ? (
            <>
              <Table>
                <thead className="cf">
                  <tr>
                    <th>S.no</th>
                    {tableData.length > 0 &&
                      Object?.keys(tableData[0]).map((ele, index) => (
                        <th key={index}>{ele}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData?.map((ele, index) => (
                    <tr key={index}>
                      <td data-title={"S.No"}>{index + 1} &nbsp;</td>
                      {tableData.length > 0 &&
                        Object?.keys(ele).map((innerData, indexNew) => (
                          <td data-title={innerData} key={indexNew}>
                            {ele[innerData]} &nbsp;
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          ) : (
            <NoRecordFound />
          )}
        </div>

        <div className="row">
          <div className="col-sm-6">
            <button
              className="btn btn-block btn-danger btn-sm "
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default InvoiceCreationModal;
