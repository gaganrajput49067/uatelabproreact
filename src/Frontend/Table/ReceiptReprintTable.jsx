import React, { useState } from "react";
import { axiosInstance, axiosReport } from "../../utils/axiosInstance";
import Table from "../../components/Table/Table";

import urgentGIF from "../../assets/image/Urgent.gif";
import VIP from "../../assets/image/vip.gif";
import { dateConfig } from "../../utils/helpers";
import Loading from "../../components/Loading/Loading";
import { Link } from "react-router-dom";
import CustomModal from "../utils/CustomModal";
import SendEmailModalReprint from "../utils/SendEmailModalReprint";
import NoRecordFound from "../../components/CommonComponent/NoRecordFound";
import Tooltip from "../../components/CommonComponent/Tooltip";
const ReceiptReprintTable = ({ receiptData, show, show2 }) => {
  const [modal, setModal] = useState(false);
  const [visitID, setVisitID] = useState();
  const [showEmail, setShowEmail] = useState({
    modal: false,
    patientData: {},
  });
  const [printLoading, setPrintLoading] = useState({
    loading: false,
    index: -1,
  });
  const [printLoadingFP, setPrintLoadingFP] = useState({
    loading: false,
    index: -1,
  });
  const [showPatientImage, setShowPatientImage] = useState({
    show: false,
    data: "",
    index: -1,
    loading: false,
  });
  const getReceipt = (id, index) => {
    setPrintLoading({
      loading: true,
      index: index,
    });
    axiosReport
      .post("getReceipt", {
        LedgerTransactionIDHash: id,
      })
      .then((res) => {
        window.open(res?.data?.Url, "_blank");
        setPrintLoading({
          loading: false,
          index: -1,
        });
      })
      .catch((err) => {
        toast.error(
          err?.data?.response?.message
            ? err?.data?.response?.message
            : t("Error Occured")
        );
        setPrintLoading({
          loading: false,
          index: -1,
        });
      });
  };
  const getColor = (status) => {
    if (status) {
      switch (status) {
        case "fullpaid":
          return "#00FA9A";
        case "partialpaid":
          return "#F6A9D1";
        case "fullyunpaid":
          return "#FF457C";
        case "credit":
          return "#b3cdb3";
        case "fullrefund":
          return "#6699ff";
        case "All":
          return "white";
        default:
          break;
      }
    }
  };
  const handleClose = () => {
    setShowEmail({ ...showEmail, modal: false, patientData: {} });
  };
  const getBarcodeData = (testId, VisitNo, SINNo) => {
    let arr = testId?.split(",");
    axiosInstance
      .post("SC/getBarcode", {
        LedgerTransactionNo: VisitNo,
        BarcodeNo: SINNo,
        TestID: arr,
      })
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((err) => {
        if (err.response.status === 504) {
          toast.error(t("Something Went Wrong"));
        }
        if (err.response.status === 401) {
          toast.error(err.response.data.message);
        }
      });
  };
  const getReceiptFullyPaid = (id, index) => {
    setPrintLoadingFP({
      loading: true,
      index: index,
    });
    axiosReport
      .post("getReceiptFullyPaid", {
        LedgerTransactionIDHash: id,
      })
      .then((res) => {
        setPrintLoadingFP({
          loading: false,
          index: -1,
        });
        window.open(res?.data?.Url, "_blank");
      })
      .catch((err) => {
        setPrintLoadingFP({
          loading: false,
          index: -1,
        });
        toast.error(
          err?.data?.response?.message
            ? err?.data?.response?.message
            : "Error Occured"
        );
      });
  };

  const Fetch = async (guidNumber, pageName) => {
    const response = await axiosInstance.post("CommonController/GetDocument", {
      Page: pageName,
      Guid: guidNumber,
    });
    return response?.data?.message;
  };

  const getS3url = async (id) => {
    const response = await axiosInstance.post("CommonController/GetFileUrl", {
      Key: id,
    });
    return response?.data?.message;
  };

  const handlePreviewImage = async (guidNumber) => {
    const response = await Fetch(guidNumber, "patientImage");
    if (response.length > 0) {
      const imgURL = await getS3url(response[0]?.awsKey);
      setShowPatientImage({
        show: true,
        data: imgURL,
        index: -1,
        loading: false,
      });
    } else {
      toast.error("No Patient Image Found");
      setShowPatientImage({
        show: false,
        data: "",
        index: -1,
        loading: false,
      });
    }
  };

  const handlePatientImage = async (guid, index) => {
    console.log(guid);
    if (!guid) {
      toast.error("No Image found");
    } else {
      setShowPatientImage({
        show: false,
        data: "",
        index: index,
        loading: true,
      });
      await handlePreviewImage(guid);
    }
  };
  return (
    <>
      {receiptData?.length > 0 ? (
        <>
          {showEmail?.modal && (
            <SendEmailModalReprint
              show={showEmail?.modal}
              data={showEmail?.patientData}
              handleClose={handleClose}
            />
          )}
          <Table paginate={true} data={receiptData ?? []} itemsPerPage={10}>
            {({ currentItems, finalIndex }) => {
              return (
                <>
                  <thead class="cf">
                    <tr>
                      <th>{"S.No"}</th>
                      <th>{"Reg Date"}</th>
                      <th>{"RateType"}</th>
                      <th>{"Visit No"}</th>
                      <th>{"Patient Name"}</th>
                      <th>{"Remarks"}</th>
                      <th>{"Age/Gender"}</th>
                      <th>{"Mobile No"}</th>
                      <th>{"Gross Amt"}</th>
                      <th>{"Dis Amt"}</th>
                      <th>{"Net Amt"}</th>
                      <th>{"Due Amt"}</th>
                      <th>{"Paid Amt"}</th>
                      <th>{"Centre"}</th>
                      <th>{"Doctor"}</th>
                      <th>{"User"}</th>
                      <th>{"Rec Edit"}</th>
                      <th>{"Edit Info"}</th>
                      <th>{"Cash Receipt"}</th>
                      <th>{"FullyPaid"}</th>
                      <th>{"Concent form"}</th>
                      <th className="text-center">
                        &nbsp;
                        <i class="fa fa-info-circle" aria-hidden="true"></i>
                        &nbsp;
                      </th>
                      <th className="text-center">
                        &nbsp;{" "}
                        <i class="fa fa-envelope-open" aria-hidden="true"></i>
                        &nbsp;
                      </th>
                      <th
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Uploaded Document"
                        className="text-center"
                      >
                        <i class="fa fa-file" aria-hidden="true"></i>
                      </th>
                      <th
                        data-toggle="tooltip"
                        data-placement="top"
                        title="Medical History"
                        className="text-center"
                      >
                        <i class="fa fa-medkit" aria-hidden="true"></i>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((data, index) => (
                      <tr
                        key={index}
                        style={{
                          backgroundColor: getColor(data?.reportStatus),
                        }}
                      >
                        <td data-title={"S.No"} className="text-center">
                          {index + finalIndex}

                          {data?.isUrgent === 1 && <img src={urgentGIF}></img>}
                          {data?.IsVip === 1 && <img src={VIP}></img>}
                        </td>
                        <td data-title={"Reg Date"}>
                          <div>{dateConfig(data.Date)}</div>
                        </td>
                        <td data-title={"RateType"}>{data?.RateType}</td>

                        <td data-title={"Visit No"}>
                          {data?.LedgerTransactionNo}
                        </td>
                        <td
                          data-title={"Patient Name"}
                          className="d-flex align-items-center"
                        >
                          {showPatientImage.loading &&
                          index == showPatientImage.index ? (
                            <Loading />
                          ) : (
                            <span
                              className="fa fa-user custom-pointer"
                              onClick={() =>
                                handlePatientImage(data?.PatientGuid, index)
                              }
                            ></span>
                          )}
                          &nbsp;&nbsp;&nbsp;
                          <span>
                            {data?.FirstName +
                              " " +
                              data?.MiddleName +
                              " " +
                              data?.LastName}
                          </span>
                        </td>

                        <td data-title={"Remarks"}>{data?.Remarks}</td>
                        <td data-title={"Age/Gender"}>
                          <div>
                            {data?.Age} / {data?.Gender}
                          </div>
                        </td>

                        <td data-title={"Mobile No"}>{data?.Mobile}</td>

                        <td data-title={"Gross Amt"}>{data?.GrossAmount}</td>
                        <td data-title={"Dis Amt"}>
                          {data?.DiscountOnTotal.toFixed(2)}
                        </td>

                        <td data-title={"Net Amt"}>{data?.NetAmount}</td>
                        <td data-title={"Due Amt"}>{data?.DueAmount}</td>
                        <td data-title={"Paid Amt"}>{data?.Adjustment}</td>

                        <td data-title={"Centre"}>{data?.Centre}</td>
                        <td data-title={"Doctor"}>{data?.DoctorName}</td>
                        <td data-title={"User"}>{data?.CreatedByName}</td>
                        <td data-title={"Edit Info"} className="text-center">
                          {
                            <Link
                              to={`/EditPatientDetails`}
                              state={{ data: data?.LedgerTransactionNo }}
                            >
                              <Tooltip label={"Edit Patient Info"}>
                                <i
                                  title="Edit Patient Info"
                                  class="fa fa-pencil-square "
                                  aria-hidden="true"
                                ></i>
                              </Tooltip>
                            </Link>
                          }
                        </td>
                        <td data-title="Rec Edit">
                          {
                            <Link
                              to={`/EditPatientInfo`}
                              state={{ data: data?.LedgerTransactionNo }}
                            >
                              {"Edit Info"}
                            </Link>
                          }
                        </td>

                        <td data-title={"Cash Receipt"}>
                          {printLoading.loading &&
                          printLoading.index === index ? (
                            <Loading />
                          ) : (
                            data?.HideReceipt != 1 && (
                              <i
                                className="pi pi-money-bill text-primary"
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  getReceipt(
                                    data?.LedgertransactionIDHash,
                                    index
                                  )
                                }
                              />
                            )
                          )}
                        </td>
                        <td data-title={"FullyPaid"}>
                          {printLoadingFP.loading &&
                          printLoadingFP.index === index ? (
                            <Loading />
                          ) : (
                            data?.HideReceipt != 1 && (
                              <i
                                className="pi pi-money-bill text-primary"
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  getReceiptFullyPaid(
                                    data?.LedgertransactionIDHash,
                                    index
                                  )
                                }
                              />
                            )
                          )}
                        </td>

                        <td data-title={"Concent form"}>-</td>
                        <td
                          data-title={"View Details"}
                          onClick={() => {
                            setModal(true);
                            setVisitID(data?.LedgerTransactionNo);
                          }}
                        >
                          &nbsp; <i className="fa fa-search" />
                          &nbsp;
                        </td>

                        <td data-title={"Send Email"} className="text-centre">
                          &nbsp;{" "}
                          <i
                            className="pi pi-envelope"
                            onClick={() =>
                              setShowEmail({
                                ...showEmail,
                                modal: true,
                                patientData: data,
                              })
                            }
                          />
                          &nbsp;
                        </td>
                        <td data-title={"UploadDocumentCount"}>
                          <div
                            className="text-primary"
                            style={{
                              cursor: "pointer",
                              color:
                                data?.UploadDocumentCount > 0 ? "#4ea30c" : "",
                            }}
                            onClick={() => {
                              show2({
                                modal: true,
                                data: data?.PatientGuid,
                                index: index,
                              });
                            }}
                          >
                            &nbsp;
                            <i className="fa fa-cloud-upload">
                              &nbsp;{data?.UploadDocumentCount}
                            </i>
                            &nbsp;
                          </div>
                        </td>
                        <td data-title={"Medical History"}>
                          <div
                            className="text-primary"
                            style={{
                              cursor: "pointer",
                              color:
                                data?.MedicalHistoryCount > 0 ? "#4ea30c" : "",
                            }}
                            onClick={() => {
                              show({
                                modal: true,
                                data: data?.PatientGuid,
                                index: index,
                              });
                            }}
                          >
                            &nbsp;
                            <i className="fa fa-history">
                              &nbsp;{data?.MedicalHistoryCount}
                            </i>
                            &nbsp;
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </>
              );
            }}
          </Table>
          {modal && (
            <CustomModal
              show={modal}
              visitID={visitID}
              onHide={() => setModal(false)}
            />
          )}{" "}
        </>
      ) : (
        <NoRecordFound />
      )}
    </>
  );
};

export default ReceiptReprintTable;
