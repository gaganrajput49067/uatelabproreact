import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { dateConfig } from "../../utils/helpers";
import Loading from "../../components/Loading/Loading";
import Modal from "../../components/Modal/Modal";
import Table from "../../components/Table/Table";
import NoRecordFound from "../../components/CommonComponent/NoRecordFound";
import { axiosInstance, axiosReport } from "../../utils/axiosInstance";

function OldReportModal({ show, handleClose, value }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPrint, setIsPrint] = useState({
    index: -1,
    isPrinting: false,
    loading: false,
  });

  useEffect(() => {}, []);

  const handleReport = async (TestIDHash, PHead, index) => {
    if (isPrint.index === -1) {
      setIsPrint({ index: index, loading: true });
      await axiosReport
        .post(`commonReports/GetLabReport`, {
          TestIDHash: TestIDHash,
          PHead: PHead,
        })
        .then((res) => {
          window.open(res?.data?.Url, "_blank");
          setIsPrint({ index: -1, loading: false });
        })
        .catch((err) => {
          setIsPrint({ index: -1, loading: false });
          handleClose();
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : err?.data?.message
          );
        });
    } else {
      toast.warn("Please wait Generating Report");
      // setIsPrint({ index: -1, loading: false });
    }
  };

  const getData = () => {
    axiosInstance
      .post("CommonController/OldPatientReports", {
        PatientCode: value,
      })
      .then((response) => {
        let data = response.data.message;
        let groupedData = {};

        data.forEach((item) => {
          let ledgerNo = item.LedgerTransactionNo;
          if (!groupedData[ledgerNo]) {
            groupedData[ledgerNo] = { ...item, keyToPrint: [item.TestIdHash] };
          } else {
            groupedData[ledgerNo].keyToPrint.push(item.TestIdHash);
          }
        });

        let result = Object.values(groupedData);
        setData(result);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err.response.data.message);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  console.log(data);
  return (
    <Modal
      title={"Old Reports"}
      handleClose={handleClose}
      className={"table-lg"}
    >
      {loading ? (
        <Loading />
      ) : (
        <div>
          {data.length > 0 ? (
            <Table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>PatientId</th>
                  <th>Patient Name</th>
                  <th>Lab Ref No.</th>
                  <th>Date</th>
                  <th>Source</th>
                  <th className="text-centre">View Report</th>
                </tr>
              </thead>
              <tbody>
                {data.map((ele, index) => (
                  <tr key={index}>
                    <td data-title={"S.No"}>{index + 1}</td>
                    <td data-title={"PatientId"}>{ele?.PatientCode}</td>
                    <td data-title={"Patient Name"}>{ele?.PName}</td>
                    <td data-title={"Lab Ref No."}>
                      {ele?.LedgerTransactionNo}
                    </td>
                    <td data-title={"Lab Ref No."}>{dateConfig(ele?.date)}</td>
                    <td data-title={"Date"}>{ele?.CentreName}</td>

                    <td data-title={"View Report"} className="text-center">
                      {index === isPrint.index && isPrint.loading ? (
                        <Loading />
                      ) : (
                        <>
                          <i
                            className="fa fa-print iconStyle"
                            style={{
                              cursor: "pointer",
                              textAlign: "center",
                            }}
                            onClick={() =>
                              handleReport(ele?.keyToPrint, 0, index)
                            }
                            title="Print without header"
                          ></i>
                          &nbsp;&nbsp;&nbsp;
                          <i
                            className="fa fa-print iconStyle"
                            style={{
                              color: "red",
                              cursor: "pointer",
                              textAlign: "center",
                            }}
                            onClick={() =>
                              handleReport(ele?.keyToPrint, 1, index)
                            }
                            title="Print with header"
                          ></i>
                        </>
                      )}
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
      <div className="row m-2">
        <div className="col-sm-2">
          <button
            className="btn btn-danger btn-sm btn-block"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default OldReportModal;
