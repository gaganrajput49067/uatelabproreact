import React, { useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { axiosReport } from "../../utils/axiosInstance";
import Table from "../../components/Table/Table";

import parse from "html-react-parser";
import VIP from "../../assets/image/vip.gif";
import { dateConfig } from "../../utils/helpers";
import NoRecordFound from "../../components/CommonComponent/NoRecordFound";
import CustomModal from "../utils/CustomModal";
import Loading from "../../components/Loading/Loading";
function DynamicLabSearchTable({ dispatchData, show, show2 }) {
  const [modal, setModal] = useState(false);
  const [visitID, setVisitID] = useState();
  const [printLoading, setPrintLoading] = useState({
    With: false,
    Without: false,
    index: -1,
  });

  const APiReport = (TestIDHash, loader, index, PHead) => {
    if (printLoading.index === -1) {
      setPrintLoading({
        [loader]: true,
        index: index,
      });
      axiosReport
        .post(`commonReports/GetLabReport`, {
          TestIDHash: TestIDHash,
          PHead: PHead,
        })
        .then((res) => {
          window.open(res?.data?.Url, "_blank");
          setPrintLoading({
            [loader]: false,
            index: -1,
          });
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : err?.data?.message
          );
          setPrintLoading({
            [loader]: false,
            index: -1,
          });
        });
    } else {
      toast.warn("Please wait Generating Report");
    }
  };
  const handleAllAprovedChecked = (e, data) => {
    const { checked } = e.target;
    let documentlength = document.getElementsByClassName(
      data?.LedgerTransactionID
    );
    for (let i = 0; documentlength.length > i; i++) {
      if (documentlength[i].id == data?.LedgerTransactionID) {
        documentlength[i].checked = checked;
      }
    }
  };
  const handleReport = (data, loader, index, PHead) => {
    let TestIDHash = [];
    let documentlength = document.getElementsByClassName(
      data?.LedgerTransactionID
    );
    let isChecked = false;
    for (let i = 0; documentlength.length > i; i++) {
      if (
        documentlength[i].checked &&
        documentlength[i].id == data?.LedgerTransactionID
      ) {
        TestIDHash.push(
          document.getElementsByClassName(data?.LedgerTransactionID)[i].value
        );
      }
    }
    if (TestIDHash.length > 0) {
      APiReport(TestIDHash, loader, index, PHead);
    } else {
      toast.error("Please Select Test");
    }
  };

  const { t } = useTranslation();

  const handleCheck = (data) => {
    let check = true;
    const datas = parse(data?.Test);
    if (datas.length > 0) {
      const val = datas?.map((ele) => {
        return ele?.props?.className;
      });
      if (val.includes("round Status-5") || val.includes("round Status-6")) {
        return (check = true);
      } else {
        return (check = false);
      }
    } else {
      return (check =
        datas?.props?.className.includes("round Status-5") ||
        datas?.props?.className.includes("round Status-6"));
    }
  };

  return (
    <div>
      {" "}
      {dispatchData?.length > 0 ? (
        <Table paginate={true} data={dispatchData ?? []} itemsPerPage={10}>
          {({ currentItems, finalIndex }) => {
            return (
              <>
                <thead class="cf">
                  <tr>
                    <th>{t("S.No")}</th>
                    <th>{t("Reg Date")}</th>
                    <th>{t("Visit No")}</th>
                    <th>{t("SIN NO")}</th>
                    <th>{t("UHID")}</th>
                    <th>{t("Name")}</th>
                    <th>{t("Age/Gender")}</th>
                    <th>
                      {t("Test")}
                      <input
                        type="checkbox"
                        onClick={(e) =>
                          handleAllAprovedChecked(e, dispatchData[0])
                        }
                      />
                    </th>
                    <th>{t("Print")}</th>
                    <th>{t("Doctor")}</th>
                    <th>{t("Centre")}</th>
                    <th>{t("View")}</th>
                    <th>{t("Audit Trial")}</th>
                    <th>{t("Document")}</th>
                    <th>{t("M.H")}</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((data, index) => (
                    <tr key={index}>
                      <td data-title={t("S.No")}>
                        {index + finalIndex}{" "}
                        {data?.IsVip === 1 && <img src={VIP}></img>}
                      </td>
                      <td data-title={t("Reg Date")}>
                        <div>{dateConfig(data.Date)}&nbsp;</div>
                      </td>
                      <td data-title={t("VisitNo")}>{data?.VisitNo}&nbsp;</td>
                      <td data-title={t("SIN NO")}>{data?.SinNo}&nbsp;</td>
                      <td data-title={t("UHID")}>
                        {data?.PatientCode === "" ? "" : data?.PatientCode}
                        &nbsp;
                      </td>
                      <td data-title={t("Name")}>
                        {data?.PatientName}
                        &nbsp;
                      </td>
                      <td data-title={t("Age/Gender")}>
                        <div>
                          {data?.Age}/{data?.Gender}&nbsp;
                        </div>
                      </td>
                      <td className="w-100" data-title={t("Test")}>
                        {parse(data?.Test)}&nbsp;
                      </td>
                      <td data-title={t("Print")}>
                        {handleCheck(data) && (
                          <>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              {printLoading.Without &&
                              printLoading.index === index ? (
                                <Loading />
                              ) : (
                                <i
                                  className="fa fa-print iconStyle"
                                  style={{
                                    cursor: "pointer",
                                    textAlign: "center",
                                  }}
                                  onClick={() =>
                                    handleReport(data, "Without", index, 0)
                                  }
                                  title="Print without header"
                                ></i>
                              )}
                              <br></br>
                              {printLoading.With &&
                              printLoading.index === index ? (
                                <Loading />
                              ) : (
                                <i
                                  className="fa fa-print iconStyle"
                                  style={{
                                    color: "red",
                                    cursor: "pointer",
                                    textAlign: "center",
                                  }}
                                  onClick={() =>
                                    handleReport(data, "With", index, 1)
                                  }
                                  title="Print with header"
                                ></i>
                              )}
                            </div>
                          </>
                        )}
                        &nbsp;
                      </td>
                      <td data-title={t("Doctor")}>{data?.DoctorName}&nbsp;</td>
                      <td data-title={t("Centre")}>{data?.Centre}&nbsp;</td>

                      <td
                        data-title={t("S.No")}
                        onClick={() => {
                          setModal(true);
                          setVisitID(data?.VisitNo);
                        }}
                      >
                        <div>
                          <i className="fa fa-search" />
                        </div>
                      </td>
                      <td>{}&nbsp;</td>
                      <td data-title={t("Upload")}>
                        <div
                          className="text-info"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            show2({
                              modal: true,
                              data: data?.PatientGuid,
                              index: index,
                            });
                          }}
                        >
                          <i
                            className="fa fa-cloud-upload iconStyle"
                            style={{
                              color:
                                data?.UploadDocumentCount > 0 ? "#4ea30c" : "",
                            }}
                          >
                            ({data?.UploadDocumentCount})
                          </i>
                        </div>
                      </td>
                      <td data-title={t("Medical History")}>
                        <div
                          className="text-info"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            show({
                              modal: true,
                              data: data?.PatientGuid,
                              index: index,
                            });
                          }}
                        >
                          <i
                            className="fa fa-history iconStyle"
                            style={{
                              color:
                                data?.MedicalHistoryCount > 0 ? "#4ea30c" : "",
                            }}
                          >
                            ({data?.MedicalHistoryCount})
                          </i>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </>
            );
          }}
        </Table>
      ) : (
        <NoRecordFound />
      )}
       {modal && (
        <CustomModal
          show={modal}
          visitID={visitID}
          onHide={() => setModal(false)}
        />
      )}
    </div>
  );
}

export default DynamicLabSearchTable;
