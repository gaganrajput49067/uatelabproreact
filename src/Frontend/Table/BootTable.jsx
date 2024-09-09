import React, { useState } from "react";
import parse from "html-react-parser";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { dateConfig } from "../../utils/helpers";
import Table from "../../components/Table/Table";
import Loading from "../../components/Loading/Loading";
import CustomModal from "../utils/CustomModal";
import CustomDateModal from "../utils/CustomDateModal";
function RETable({ redata, GetResultEntry, show, show2 }) {
  const [modal, setModal] = useState(false);
  const [datemodal, showDatemodal] = useState(false);
  const [visitID, setVisitID] = useState();
  const [TestID, setTestID] = useState();
  const [loading, setLoading] = useState(false);
  const [Index, setIndex] = useState(-1);
  const [printLoading, setPrintLoading] = useState({
    With: false,
    Without: false,
    index: -1,
  });

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

  const handleReport = (data, loader, index, PHead) => {
    if (printLoading.index === -1) {
      setPrintLoading({ ...printLoading, index: index });
      let TestIDHash = [];
      let documentlength = document.getElementsByClassName(
        data?.LedgerTransactionID
      );

      const extractedValues = extractValuesFromHtml(data?.Test);

      for (let i = 0; documentlength.length > i; i++) {
        const checkboxValue = documentlength[i].value;
        if (
          documentlength[i].checked &&
          extractedValues.includes(checkboxValue)
        ) {
          TestIDHash.push(
            document.getElementsByClassName(data?.LedgerTransactionID)[i].value
          );
        }
      }

      if (TestIDHash?.length === 0) {
        TestIDHash.push(...extractedValues);
      }

      setPrintLoading({
        [loader]: true,
        index: index,
      });
      axios
        .post(`/reports/v1/commonReports/GetLabReport`, {
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

  const handleClickResultEntry = (data, index) => {
    setIndex(index);
    console.log(data);
    GetResultEntry(
      {
        TestID: data?.TestID,
        LedgerTransactionID: "",
        DepartmentID: "",
        symbol: "",
        Mobile: data?.Mobile,
        VisitNo: data?.VisitNo,
        PEmail: data?.PEmail,
        MacID: "",
      },

      index,
      setLoading
    );
    // }
  };
  const extractValuesFromHtml = (htmlString) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;

    const inputElements = tempDiv.querySelectorAll('input[type="checkbox"]');
    const extractedValues = Array.from(inputElements).map(
      (input) => input.value
    );

    return extractedValues;
  };

  const handleAllAprovedChecked = (e, data) => {
    const { checked } = e.target;

    let documentlength = document.getElementsByClassName(
      data?.LedgerTransactionID
    );
    const extractedValues = extractValuesFromHtml(data?.Test);

    for (let i = 0; i < documentlength.length; i++) {
      const checkboxValue = documentlength[i].value;

      if (extractedValues.includes(checkboxValue)) {
        documentlength[i].checked = checked;
      }
    }
  };
  return (
    <>
      {redata.length > 0 ? (
        <Table>
          <thead className="cf">
            <tr>
              <th>{t("S.No")}</th>
              <th>{t("Reg Date")}</th>
              <th>{t("Visit No")}</th>
              <th>{t("Sin No")}</th>
              <th>{t("UHID")}</th>
              <th>{t("Name")} </th>

              <th>{t("Age")}</th>
              <th>{t("Test")}</th>
              <th>{t("Print")}</th>
              <th>{t("Doctor")}</th>
              <th>{t("Centre")}</th>
              <th>{t("Dep. Receive Time")}</th>
              <th>{t("Remarks")} </th>
              <th className="text-centre">
                <i class="fa fa-file"></i>
              </th>
              <th className="text-centre">
                <i class="fa fa-h-square"></i>
              </th>
              <th>
                <i class="fa fa-calendar"></i>
              </th>
            </tr>
          </thead>
          <tbody>
            {redata.map((data, index) => (
              <tr
                key={index}
                style={{
                  backgroundColor: data?.isOutSource == 1 ? "pink" : "",
                }}
              >
                <td data-title="SNo">
                  <div
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
                    <div>{index + 1}</div>
                    {data?.isUrgent === 1 && (
                      <div>
                        <img src={urgentGIF}></img>
                      </div>
                    )}
                    {data?.IsVip === 1 && (
                      <div>
                        <img src={VIP}></img>
                      </div>
                    )}
                    <div>
                      <i
                        className="fa fa-search"
                        onClick={() => {
                          setModal(true);
                          setVisitID(data?.VisitNo);
                        }}
                        style={{ cursor: "pointer" }}
                      />
                    </div>

                    {data.StatSample == 1 ? (
                      <div>
                        <span
                          className="fa fa-cog fa-spin"
                          data-toggle="tooltip"
                          data-placement="top"
                          title="STATSample"
                        ></span>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </td>
                <td data-title={t("Reg Date")}>
                  {dateConfig(data?.Date)}&nbsp;
                </td>
                <td
                  onClick={() => {
                    handleClickResultEntry(data, index);
                  }}
                  data-title={t("Visit No")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="text-primary">
                    {loading && index === Index ? <Loading /> : data?.VisitNo}
                  </div>
                </td>
                <td data-title={t("Sin No")}>{data?.SinNo}&nbsp;</td>
                <td data-title={t("UHID")}>{data?.PatientCode}&nbsp;</td>
                <td data-title={t("Name")}>{data?.PatientName}</td>

                <td data-title={t("Age/Gender")}>
                  <div>
                    {data?.Age}/{data?.Gender}
                  </div>
                </td>

                <td data-title={t("Test")}>{parse(data?.Test)}</td>
                <td
                  data-title={t("Print")}
                  //   className="d-flex flex-column w-100"
                >
                  {handleCheck(data) && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                        padding: "5px",
                      }}
                    >
                      {printLoading.Without && printLoading.index === index ? (
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
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      {printLoading.With && printLoading.index === index ? (
                        <Loading />
                      ) : (
                        <i
                          className="fa fa-print iconStyle"
                          style={{
                            color: "red",
                            cursor: "pointer",
                            textAlign: "center",
                          }}
                          onClick={() => handleReport(data, "With", index, 1)}
                          title="Print with header"
                        ></i>
                      )}
                    </div>
                  )}
                </td>

                <td data-title={t("Doctor")}>{data?.DoctorName} &nbsp;</td>
                <td data-title={t("Centre")}>{data?.Centre} &nbsp;</td>
                <td data-title={t("Centre")}>
                  {moment(data?.SampleReceiveDate).format(
                    "DD/MMM/YYYY hh:mm:ss"
                  )}{" "}
                  &nbsp;
                </td>
                <td data-title={t("Remarks")}>{data?.Remarks}&nbsp;</td>
                <td data-title={t("UploadDocumentCount")}>
                  <i
                    className="fa fa-cloud-upload iconStyle"
                    style={{
                      cursor: "pointer",
                      color: data?.UploadDocumentCount > 0 ? "#4ea30c" : "",
                    }}
                    onClick={() => {
                      show2({
                        modal: true,
                        data: data?.PatientGuid,
                        index: index,
                      });
                    }}
                  >
                    &nbsp; {data?.UploadDocumentCount}
                  </i>
                </td>

                <td data-title={t("MedicalHistoryCount")}>
                  <i
                    className="fa fa-history iconStyle"
                    style={{
                      cursor: "pointer",
                      color: data?.MedicalHistoryCount > 0 ? "#4ea30c" : "",
                    }}
                    onClick={() => {
                      show({
                        modal: true,
                        data: data?.PatientGuid,
                        index: index,
                      });
                    }}
                  >
                    &nbsp; &nbsp;{data?.MedicalHistoryCount}
                  </i>
                </td>
                <td data-title={t("Customize Date")}>
                  <i
                    className="fa fa-edit"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setTestID(data.TestID);
                      showDatemodal(true);
                    }}
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        t("No Data Found")
      )}
      {modal && (
        <CustomModal
          show={modal}
          visitID={visitID}
          onHide={() => setModal(false)}
        />
      )}
      {datemodal && (
        <CustomDateModal
          show={datemodal}
          data={TestID}
          onHide={() => showDatemodal(false)}
        />
      )}
    </>
  );
}

export default RETable;
