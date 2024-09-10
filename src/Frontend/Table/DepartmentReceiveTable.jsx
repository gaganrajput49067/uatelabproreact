import React, { useState } from "react";
import parse from "html-react-parser";
import { toast } from "react-toastify";
import Table from "../../components/Table/Table";

import Urgent from "../../assets/image/Urgent.gif";

import VIP from "../../assets/image/vip.gif";
import { dateConfig, isChecked } from "../../utils/helpers";
import Loading from "../../components/Loading/Loading";
import CustomModal from "../utils/CustomModal";
import RejectModal from "../utils/RejectModal";
import HoldReason from "../utils/HoldReason";
import { axiosInstance } from "../../utils/axiosInstance";
import NoRecordFound from "../../components/CommonComponent/NoRecordFound";
function DepartmentReceiveTable({
  drdata,
  show,
  show2,
  TableData,
  setDrData,
  pageType,
}) {
  const [modal, setModal] = useState(false);
  const [visitID, setVisitID] = useState();
  const [show1, setShow1] = useState({
    modal: false,
    data: {},
  });
  const [load, setLoad] = useState({
    index: -1,
    load: false,
  });
  const [showHold, setShowHold] = useState({
    show: false,
    data: "",
    index: -1,
  });

  const handleShow = (data, type) => {
    setShow1({
      modal: type,
      data: data,
    });
  };
  const handleCheckbox = (e) => {
    const { checked } = e.target;
    const data = drdata?.map((ele) => {
      return {
        ...ele,
        IsChecked: checked ? 1 : 0,
      };
    });

    setDrData(data);
  };
  const handleTestID = (e, index) => {
    const { name, checked } = e.target;
    const datas = [...drdata];
    datas[index][name] = checked ? 1 : 0;
    setDrData(datas);
  };
  const handleHold = (data, index) => {
    if (load?.load) {
      toast.warn("Please Wait Other Test Are Holding");
    } else {
      setLoad({
        load: true,
        index: index,
      });
      axiosInstance
        .post(`${data?.Status == "16" ? "SC/UnHoldSample" : "SC/HoldSample"}`, {
          data: [
            {
              LedgerTransactionID: data?.LedgerTransactionID,
              VisitNo: data?.VisitNo,
              TestID: data?.TestID,
              Test: data?.ItemName,
              CentreID: data?.CentreID,
              SINNo: data?.SinNo,
              HoldReason: data?.HoldReason?.trim(),
            },
          ],
        })
        .then((res) => {
          setLoad({
            load: false,
            index: -1,
          });
          setShowHold({ data: "", show: false, index: -1 });
          toast.success(res?.data?.message);
          TableData(2);
        })
        .catch((err) => {
          setLoad({
            load: false,
            index: -1,
          });
          setShowHold({ data: "", show: false, index: -1 });
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something Went Wrong"
          );
        });
    }
  };
  console.log(show1);
  return (
    <>
      {show1?.modal && (
        <RejectModal
          show={show1?.modal}
          handleShow={() => handleShow(null, false)}
          data={show1?.data}
          TableData={TableData}
        />
      )}

      {showHold?.show && (
        <HoldReason
          showHold={showHold}
          setShowHold={setShowHold}
          handleHold={handleHold}
        />
      )}
      {drdata.length > 0 ? (
        <Table paginate={"true"} data={drdata}>
          {({ currentItems, finalIndex }) => {
            return (
              <>
                <thead>
                  <tr>
                    <th>{"S.No"}</th>
                    <th>{"Sin No"}</th>
                    <th>{"Reg Date"}</th>
                    <th>{"Visit No"}</th>
                    <th>{"UHID"}</th>
                    <th>{"Name"} </th>
                    <th>{"Remarks"} </th>
                    <th>{"Age"}</th>
                    <th>{"SampleType"}</th>
                    <th>{"Department"}</th>
                    <th>{"Vial Qty"}</th>
                    <th>{"Test"}</th>
                    <th>{"Reject"}</th>
                    <th>{"Hold"}</th>
                    <th
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Uploaded Document"
                    >
                      {"U.D"}
                    </th>
                    <th
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Medical History"
                    >
                      {"M.H"}
                    </th>
                    {pageType == 2 && (
                      <th>
                        <input
                          type="checkbox"
                          checked={
                            drdata?.length > 0
                              ? isChecked("IsChecked", drdata, 1).includes(
                                  false
                                )
                                ? false
                                : true
                              : false
                          }
                          onChange={handleCheckbox}
                        />
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((data, index) => (
                    <tr
                      key={index + finalIndex}
                      style={{
                        backgroundColor: data?.isOutSource == 1 ? "pink" : "",
                      }}
                    >
                      <td
                        data-title="SNo"
                        className={`color-Status-${data.Status}`}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                        >
                          <div>{index + 1}</div>
                          {data?.isUrgent === 1 && (
                            <div>
                              <img src={Urgent}></img>
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

                      <td data-title={"SinNo"}>{data?.SinNo}</td>
                      <td data-title={"Date"}>
                        <div>{dateConfig(data.Date)}</div>
                      </td>
                      <td data-title={"VisitNo"}>{data?.VisitNo}</td>
                      <td data-title={"PatientCode"}>{data?.PatientCode}</td>
                      <td data-title={"PName"}>{data?.PName}</td>

                      <td data-title={"Remarks"}>{data?.Remarks}</td>
                      <td data-title={"Gender"}>
                        <div>
                          {data?.Age}/{data?.Gender}
                        </div>
                      </td>
                      <td data-title={"SampleName"}>{data?.SampleName}</td>
                      <td data-title={"Department"}>
                        {parse(data?.Department)}
                      </td>
                      <td data-title={"Vial Qty"}>{data?.VialQty}</td>
                      <td data-title={"ItemName"}>{parse(data?.ItemName)}</td>
                      {data?.Status === 4 || data?.Status === 5 ? (
                        <td></td>
                      ) : (
                        <td data-title={"Reject"}>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleShow(data, true)}
                          >
                            {"Reject"}
                          </button>
                        </td>
                      )}
                      {data?.Status === 4 || data?.Status === 5 ? (
                        <td></td>
                      ) : (
                        <td
                          data-title={`${
                            data?.Status == "16" ? "UnHold" : "Hold"
                          }`}
                        >
                          {load?.load && load?.index == index ? (
                            <Loading />
                          ) : (
                            <button
                              className="btn btn-warning btn-sm"
                              onClick={() => {
                                if (data?.Status == "16") {
                                  handleHold(data, index);
                                } else
                                  setShowHold({
                                    data: { ...data },
                                    show: true,
                                    index: index,
                                  });
                              }}
                            >
                              {data?.Status == "16" ? "Un Hold" : "Hold"}
                            </button>
                          )}
                        </td>
                      )}

                      <td data-title={"File Count"}>
                        <div
                          className="text-primary "
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
                          <i className="fa fa-cloud-upload IconClass">
                            &nbsp;{data?.UploadDocumentCount}
                          </i>
                        </div>
                      </td>

                      <td data-title={"Medical History"}>
                        <div
                          className="text-primary"
                          style={{
                            cursor: "pointer",
                            color:
                              data?.MedicalHistoryCount > 0
                                ? "#4ea30c !important"
                                : "",
                          }}
                          onClick={() => {
                            show({
                              modal: true,
                              data: data?.PatientGuid,
                              index: index,
                            });
                          }}
                        >
                          <i className="fa fa-history IconClass">
                            &nbsp;{data?.MedicalHistoryCount}
                          </i>
                        </div>
                      </td>
                      {pageType == 2 && (
                        <td data-title={"Select"}>
                          {data?.Status == 2 && (
                            <input
                              type="checkbox"
                              name="IsChecked"
                              checked={data?.IsChecked}
                              onChange={(e) => handleTestID(e, index)}
                            />
                          )}
                        </td>
                      )}
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
    </>
  );
}

export default DepartmentReceiveTable;
