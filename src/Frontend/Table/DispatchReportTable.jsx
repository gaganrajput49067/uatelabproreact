import React, { useState } from "react";
import parse from "html-react-parser";

import VIP from "../../assets/image/vip.gif";
import { toast } from "react-toastify";
import { axiosReport, axiosInstance } from "../../utils/axiosInstance";
import Table from "../../components/Table/Table";
import { dateConfig } from "../../utils/helpers";
import Loading from "../../components/Loading/Loading";
import CustomModal from "../utils/CustomModal";
import NoRecordFound from "../../components/CommonComponent/NoRecordFound";
import FlexContainer from "../../components/CommonComponent/ResultEntrytest";
function DispatchTable({ dispatchData, show, show2, users }) {
  const [modal, setModal] = useState(false);
  const [visitID, setVisitID] = useState();
  const [printLoading, setPrintLoading] = useState({
    With: false,
    Without: false,
    index: -1,
  });
  const [formData, setFormData] = useState(dispatchData);
  const handleSelectChange = (event, ind) => {
    const { name, value } = event?.target;
    const updatedData = formData.map((ele, index) => {
      return {
        ...ele,
        [name]: value ? value : "",
      };
    });
    setFormData(updatedData);
  };
  const handleCourierSave = () => {
    const CourierData = formData
      .filter((ele, ind) => ele?.IsCourier == 1 && ele?.DocketNo !== "")
      .map((ele, ind) => {
        return {
          DocketNo: ele?.DocketNo,
          LedgertransactionId: ele?.LedgerTransactionID,
        };
      });

    axiosInstance
      .post("Dispatch/SaveDocketNo", { CourierDetail: CourierData })
      .then((res) => {
        toast.success(res?.data?.message);
      })
      .catch((err) => {
        console(err);
      });
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

  const hideButton = () => {
    const val = dispatchData?.filter((ele) => ele?.IsCourier == 1);
    return val.length > 0 ? true : false;
  };

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

  const extractValuesFromHtml = (htmlString) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;

    const inputElements = tempDiv.querySelectorAll('input[type="checkbox"]');
    const extractedValues = Array.from(inputElements).map(
      (input) => input.value
    );

    return extractedValues;
  };
  return (
    <>
      {dispatchData.length > 0 ? (
        <Table>
          <div
            style={{
              maxHeight: "400px",
              overflowY: "auto",
            }}
          >
            <thead
              class="cf"
              style={{
                position: "sticky",
                zIndex: 99,
                top: 0,
              }}
            >
              <tr>
                <th>{"S.No"}</th>
                <th>{"Reg Date"}</th>
                <th>{"Visit No"}</th>
                <th>{"SIN NO"}</th>
                <th>{"Doctor"}</th>
                <th>{"Name"}</th>
                <th>{"Remarks"}</th>
                <th>{"Age/Gender"}</th>
                <th>{"Test"}</th>
                <th>{"Print"}</th>
                <th>{"UHID"}</th>
                <th>{"Centre"}</th>

                {hideButton() && (
                  <>
                    <th>
                      <button
                        className="btn btn-success btn-sm btn-block"
                        onClick={handleCourierSave}
                      >
                        {"SaveCourier"}
                      </button>
                    </th>
                  </>
                )}

                {!users && (
                  <>
                    <th
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Uploaded Document"
                    >
                      <i
                        className="fa fa-file text-centre "
                        style={{ margin: "2px 8px" }}
                      ></i>
                    </th>
                    <th
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Medical History"
                    >
                      <i
                        className="fa fa-calendar text-centre "
                        style={{ margin: "2px 8px" }}
                      ></i>
                    </th>
                  </>
                )}
                <th>
                  {" "}
                  <i className="fa fa-search" />{" "}
                </th>
              </tr>
            </thead>
            <tbody>
              {dispatchData.map((data, index) => (
                <tr key={index}>
                  <td data-title={"S.No"} className="text-center">
                    {index + 1}&nbsp;
                    {data?.IsVip === 1 && <img src={VIP}></img>}&nbsp;
                  </td>
                  <td data-title={"Reg Date"}>
                    <div>{dateConfig(data.Date)}</div>
                  </td>

                  <td data-title={"Visit No"}>{data?.VisitNo}&nbsp;</td>
                  <td data-title={"SIN NO"}>{data?.SinNo}&nbsp;</td>
                  <td data-title={"Doctor"}>{data?.DoctorName}&nbsp;</td>
                  <td data-title={"Name"}>
                    {data?.PatientName}
                    &nbsp;
                  </td>
                  <td data-title={"Remarks"}>{data?.Remarks}&nbsp;</td>
                  <td data-title={"Age/Gender"}>
                    <div>
                      {data?.Age}/{data?.Gender}&nbsp;
                    </div>
                  </td>

                  <td className="w-100 result-entry-test" data-title={"Test"}>
                    <FlexContainer>{parse(data?.Test)}</FlexContainer>
                  </td>

                  <td data-title={"Print"}>
                    {handleCheck(data) && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
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
                        &nbsp;&nbsp;
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

                  <td data-title={"UHID"}>{data?.PatientCode}&nbsp;</td>
                  <td data-title={"Centre"}>{data?.Centre}&nbsp;</td>
                  {data.IsCourier == 1 && (
                    <td data-title="Courier Detail">
                      <Input
                        name="DocketNo"
                        className="form-control input-sm"
                        placeholder="Docket No"
                        type="text"
                        max={20}
                        value={formData?.DocketNo}
                        onChange={(e) => handleSelectChange(e, index)}
                      />
                    </td>
                  )}

                  {!users && (
                    <>
                      <td data-title={"Upload"}>
                        <div
                          className="text-primary"
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
                            className="fa fa-cloud-upload iconStyle "
                            style={{
                              color:
                                data?.UploadDocumentCount > 0 ? "#4ea30c" : "",
                            }}
                          >
                            &nbsp;{data?.UploadDocumentCount}
                          </i>
                        </div>
                      </td>

                      <td data-title={"Medical History"}>
                        <div
                          className="text-primary"
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
                            &nbsp;{data?.MedicalHistoryCount}
                          </i>
                        </div>
                      </td>
                    </>
                  )}
                  <td>
                    <i
                      className="fa fa-search pointer text-primary"
                      onClick={() => {
                        setModal(true);
                        setVisitID(data?.VisitNo);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </div>
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
    </>
  );
}

export default DispatchTable;
