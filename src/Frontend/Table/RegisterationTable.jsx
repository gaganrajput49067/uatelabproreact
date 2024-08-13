import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { number } from "yup";
import { useLocation } from "react-router-dom";
import DOSModal from "../utils/DOSModal";
import TestNameModal from "../utils/TestNameModal";

function RegisterationTable({
  data,
  slotOpen,
  setSlotOpen,
  handleSelectSlot,
  tableData,
  LTData,
  handleFilter,
  coupon,
  index,
  handleDiscount,
  handlePLOChange,
  handleUrgent,
  handleRateTypePaymode,
  Edit,
  member,
  state,
  setTableData,
}) {
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [dos, setDos] = useState(false);
  const location = useLocation();
  const [mouseHover, setMouseHover] = useState({
    index: -1,
    data: "",
  });

  const handleClose = () => {
    setShow(false);
  };

  const handleClose2 = () => {
    setShow2(false);
  };

  const handleMainClose = () => {};
  const handleChangeDelieveryDate = (e, index, datas) => {
    console.log(datas);
    const data = [...tableData];
    if (e.target.checked) {
      data[index]["deleiveryDate"] = datas?.UrgentdeleiveryDate;
      data[index]["IsUrgent"] = 1;
      setTableData(data);
    } else {
      data[index]["deleiveryDate"] = datas?.Del_Date;
      data[index]["IsUrgent"] = 0;
      setTableData(data);
    }
  };

  return (
    <>
      {/* {show && (
        <UrgentModal
          show={show}
          handleClose={handleClose}
          handleMainClose={handleMainClose}
          handleUrgent={handleUrgent}
          handlePLOChange={handlePLOChange}
          index={index}
        />
      )}
      {slotOpen?.show && (
        <SlotBookModal
          slotOpen={slotOpen}
          setSlotOpen={setSlotOpen}
          handleSelectSlot={handleSelectSlot}
          LTData={LTData}
          tableData={tableData}
        />
      )}*/}
      {show2 && (
        <TestNameModal
          show={show2}
          onHandleShow={handleClose2}
          id={data?.InvestigationID}
        />
      )}
      {dos && (
        <DOSModal
          show={dos}
          LTData={LTData}
          onHandleShow={() => setDos(false)}
          id={data?.InvestigationID}
        />
      )}
      <td data-title="S.No">
        <div style={{ display: "flex" }}>
          {index + 1}&nbsp;
          {location.pathname === "/EditPatientDetails" ? (
            data?.isPrimary && (
              <button
                className="btn btn-danger btn-sm"
                onClick={() => {
                  handleFilter(data);
                }}
              >
                X
              </button>
            )
          ) : (
            <button
              className="btn btn-danger btn-sm"
              onClick={() => {
                handleFilter(data);
              }}
            >
              X
            </button>
          )}
        </div>
      </td>
      <td data-title="Slot">
        {data?.Radiology == 1 ? (
          <i
            className="btn fa fa-search"
            onClick={() => {
              setSlotOpen({
                data: data,
                show: true,
              });
            }}
          />
        ) : (
          ""
        )}
      </td>

      <td data-title="TestCode">{data.TestCode}</td>
      <td
        data-title="TestName"
        style={{
          wordWrap: "break-word",
          whiteSpace: "normal",
        }}
      >
        <div
          onMouseEnter={() => {
            if (data?.SampleRemarks != "") {
              setMouseHover({
                index: index,
                data: data?.SampleRemarks,
              });
            }
          }}
          onMouseLeave={() => {
            if (data?.SampleRemarks != "") {
              setMouseHover({
                index: -1,
                data: "",
              });
            }
          }}
        >
          {mouseHover?.index === index && data?.SampleRemarks && (
            <div className="sampleremarktest">
              <span>{mouseHover?.data}</span>
            </div>
          )}
          {data?.TestName}
        </div>
        <small className="text-danger">
          {data?.RequiredAttachment !== "" &&
            data?.RequiredAttachment + " Req."}
        </small>
      </td>
      <td onClick={() => setShow2(true)} data-title="View">
        <i className="fa fa-search" />
      </td>
      <td onClick={() => setDos(true)} data-title="DOS">
        <i className="fa fa-home" />
      </td>
      <td data-title="MRP">
        {state?.HideAmount == 1 ? "" : Number(data?.SetMRP).toFixed(2)}
      </td>
      <td data-title="Rate">{state?.HideAmount == 1 ? "" : data?.Rate}</td>
      <td data-title="Discount">
        {state?.HideAmount != 1 ? (
          <input
            style={{ width: "50px" }}
            type="number"
            onInput={(e) => number(e, 20)}
            min={0}
            value={data?.Discount}
            onChange={(e) => {
              if (coupon?.field == true) {
                toast.error("Remove Coupon First");
              } else {
                if (Number(data?.Rate) < Number(e.target.value)) {
                  toast.error(t("Please Give Valid Discount"));
                } else {
                  handleDiscount(e.target.value, index);
                }
              }
            }}
            disabled={
              handleRateTypePaymode === "Credit" || member
                ? true
                : LTData?.DiscountApprovedBy != ""
                ? true
                : location.pathname === "/EditPatientDetails"
                ? true
                : member
                ? true
                : false
            }
          />
        ) : (
          ""
        )}
      </td>
      <td data-title="NetAmount">
        {state?.HideAmount != 1 ? (
          <input
            className="currency"
            value={Number(data?.NetAmount).toFixed(2)}
            disabled
            style={{ width: "50px" }}
          />
        ) : (
          ""
        )}
      </td>
      <td data-title="DeleiveryDate">{data.deleiveryDate}</td>
      <td data-title="SC">
        <input
          type="checkbox"
          name="Status"
          value={data?.Status}
          disabled={data?.isDisable}
          checked={data?.Status === 2 ? true : false}
          onChange={(e) => handlePLOChange(e, index)}
        />
      </td>
      <td data-title="IsUrgent">
        <input
          type="checkbox"
          name={"IsUrgent"}
          checked={data?.IsUrgent}
          disabled={data?.isDisable}
          onChange={(e) => {
            handleChangeDelieveryDate(e, index, data);
          }}
        />
      </td>
    </>
  );
}

export default RegisterationTable;
