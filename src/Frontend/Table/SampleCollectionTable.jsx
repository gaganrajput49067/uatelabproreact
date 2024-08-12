import React, { useState, useEffect } from "react";

import { toast } from "react-toastify";
import axios from "axios";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import { NoOfPricks, SampleSource } from "../../utils/Constants";
import { getSampleType } from "../../utils/NetworkApi/commonApi";
import { axiosInstance } from "../../utils/axiosInstance";

function SampleCollectionTable({
  data,
  index,
  payload,
  setPayload,
  setSearchInvdata,
  searchInvdata,
  TableData,
  handleBarcode,
  handleCloseBarcodeModal,
  handleValQty,
  snr,
}) {
  const [sampleTypeDropdown, setSampleTypeDropdown] = useState([]);
  const [show, setShow] = useState(false);
  const [remarkShow, setRemarkShow] = useState(false);
  const [dos, setDos] = useState(false);
  const [mouseHover, setMouseHover] = useState({
    index: -1,
    data: "",
  });
  const handleShow = () => {
    setShow(!show);
  };
  console.log(snr);
  const handleChange = (e, index, sin, selected) => {
    const { name, value } = e.target;
    const data = [...searchInvdata];
    if (name === "SampleTypeID") {
      const selctedvalue = sampleTypeDropdown.find((ele) => ele.value == value);
      data[index][name] = selctedvalue?.value;
      data[index]["SampleType"] = selctedvalue?.label;
      setSearchInvdata(data);
    } else if (name === "NoOfPricks") {
      const newdata = searchInvdata.map((ele) => {
        if (
          sin === ele?.SINNo &&
          (ele.Status === 1 || ele.Status === 4) &&
          ele.PricksNotRequired == 0
        ) {
          return {
            ...ele,
            [name]: value,
            PricksRemarks: value === "" ? "" : ele?.PricksRemarks,
          };
        } else {
          return { ...ele };
        }
      });
      newdata[index][name] = value;
      setSearchInvdata(newdata);
    } else if (name === "PricksRemarks") {
      const newdata = searchInvdata.map((ele) => {
        if (
          sin === ele?.SINNo &&
          (ele.Status === 1 || ele.Status === 4) &&
          ele.PricksNotRequired == 0
        ) {
          return {
            ...ele,
            [name]: value,
          };
        } else {
          return { ...ele };
        }
      });
      newdata[index][name] = value;
      setSearchInvdata(newdata);
    } else {
      data[index][name] = value;
      setSearchInvdata(data);
    }
  };
  const getBarcodeData = (testId, VisitNo, SINNo) => {
    const arr = [];
    arr.push(testId);
    axiosInstance
      .post("SC/getBarcode", {
        LedgerTransactionNo: VisitNo,
        BarcodeNo: SINNo,
        TestID: arr,
      })
      .then((res) => {
        if (res?.data?.message != "") window.open(res?.data?.message);
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
  const handlePayload = (e, index, data) => {
    const { checked } = e.target;
    if (checked) {
      if (data?.SINNo?.length >= 3) {
        const val = [...searchInvdata];
        val[index]["isSelected"] = checked;
        setSearchInvdata(val);
        setPayload([...payload, data]);
      } else {
        toast.error(
          t("Barcode is Required Field and Should Contain atleast 3 character")
        );
      }
    } else {
      const val = [...searchInvdata];
      val[index]["isSelected"] = checked;
      setSearchInvdata(val);
      const filterdata = payload.filter((ele) => ele?.TestID !== data?.TestID);
      setPayload(filterdata);
    }
  };

  useEffect(() => {
    getSampleType(setSampleTypeDropdown, data?.InvestigationID);
  }, []);

  console.log(data?.isSelected);
  const handleShowRemark = () => {
    setRemarkShow((prev) => !prev);
  };
  console.log(searchInvdata);
  const handleSaveRemarks = (value, index, sin) => {
    handleShowRemark();
    const newdata = searchInvdata.map((ele) => {
      if (
        sin === ele?.SINNo &&
        (ele.Status === 1 || ele.Status === 4) &&
        ele.PricksNotRequired == 0
      ) {
        return {
          ...ele,
          ["PricksRemarks"]: value,
        };
      } else {
        return { ...ele };
      }
    });
    newdata[index]["PricksRemarks"] = value;
    setSearchInvdata(newdata);
  };

  return (
    <>
      <td className={`color-Status-${data.Status} `} data-title={"S.No"}>
        {index + 1}
        {data.StatSample == 1 ? (
          <span
            className="fa fa-cog fa-spin"
            data-toggle="tooltip"
            data-placement="top"
            title="STATSample"
          ></span>
        ) : (
          <></>
        )}
        &nbsp;
      </td>

      <td
        data-title={"Test"}
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
        {data?.Test}
      </td>
      <td data-title={"Sin No"}>
        <input
          value={data?.SINNo}
          name="SINNo"
          max={15}
          disabled={
            [1, 2].includes(data?.BarcodeLogic)
              ? true
              : data?.isSelected === true
              ? true
              : false
          }
          onChange={(e) =>
            handleBarcode(e, data?.BarcodeLogic, data?.SampleTypeID)
          }
          onBlur={(e) => {
            handleCloseBarcodeModal(
              e.target.value,
              data?.LedgerTransactionID,
              data?.BarcodeLogic,
              data?.SampleTypeID
            );
          }}
        />
        &nbsp;
      </td>
      <td
        data-title={"Barcode Print"}
        style={{ textAlign: "center", color: "black !important" }}
      >
        {data?.Status == 2 || data?.Status == 3 ? (
          <i
            className="fa fa-print "
            style={{ cursor: "pointer" }}
            onClick={() => {
              getBarcodeData(data?.TestID, data?.VisitNo, data?.SINNo);
            }}
          ></i>
        ) : (
          <> &nbsp;</>
        )}
      </td>
      <td data-title={"Source"}>
        <SelectBox
          className="mt-2"
          onChange={(e) => handleChange(e, index)}
          name="Source"
          options={SampleSource}
          selectedValue={data?.Source}
        ></SelectBox>
      </td>
      <td
        data-title={"DOS"}
        style={{
          textAlign: "center",
        }}
        onClick={() => setDos(true)}
      >
        <i className="fa fa-home iconStyle" />
      </td>

      <td
        data-title={"Vial Qty"}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {(data.Status === 1 || data.Status === 4) && data?.SINNo !== "" ? (
          <>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleValQty("sub", data?.SINNo, data?.isSelected)}
            >
              -
            </button>
            <span className="mx-2 ">{data?.valQty}</span>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => handleValQty("add", data?.SINNo, data?.isSelected)}
            >
              +
            </button>
          </>
        ) : (
          <>{data?.VialQty}</>
        )}
      </td>
      <td data-title={"No Of Pricks"}>
        <SelectBox
          options={NoOfPricks}
          id="NoOfPricks"
          name="NoOfPricks"
          isDisabled={
            !(data.Status === 1 || data.Status === 4) ||
            data?.PricksNotRequired == 1
          }
          selectedValue={data?.NoOfPricks}
          onChange={(e) => {
            handleChange(e, index, data?.SINNo, data?.isSelected);
          }}
        />
      </td>
      <td data-title={"Remarks"}>
        {!(data.Status === 1 || data.Status === 4) ||
        data?.NoOfPricks === "" ||
        !data?.NoOfPricks ? (
          <button className="btn btn-primary btn-sm form-control input-sm disabled">
            Remark
          </button>
        ) : (
          <button
            className="btn btn-primary btn-sm form-control input-sm"
            name="PricksRemarks"
            onClick={handleShowRemark}
          >
            Remark
          </button>
        )}
      </td>
      <td data-title={"SampleTypeID"}>
        <SelectBox
          name="SampleTypeID"
          className="mt-2"
          options={sampleTypeDropdown}
          onChange={(e) => handleChange(e, index)}
          selectedValue={data?.SampleTypeID}
        ></SelectBox>
      </td>
      <td data-title={"Reject"}>
        {data.Approved === 0 && data.Status != 4 && (
          <button
            className="btn btn-danger btn-sm"
            onClick={() => {
              handleShow();
            }}
          >
            {"Reject"}
          </button>
        )}
      </td>
      <td data-title={"Select"}>
        {data.Status !== 2 &&
          data.Status !== 3 &&
          data.Approved !== 1 &&
          (data.Status === 1 ||
            (data.Status === 4 && data?.isSampleReCollection == 1) ||
            snr) && (
            <input
              disabled={
                data.Status == 1 ||
                (data.Status === 4 && data?.isSampleReCollection == 1) ||
                snr
                  ? false
                  : true
              }
              checked={data?.isSelected}
              type="checkbox"
              onChange={(e) => {
                setTimeout(handlePayload(e, index, data), 3000);
              }}
            />
          )}
        &nbsp;
      </td>
    </>
  );
}

export default SampleCollectionTable;
