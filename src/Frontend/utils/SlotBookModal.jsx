import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SelectBox } from "../../ChildComponents/SelectBox";
import DatePicker from "../Components/DatePicker";
import Loading from "./Loading";
import moment from "moment";
import { toast } from "react-toastify";
import Modal from "../../components/Modal/Modal";
import { axiosInstance } from "../../utils/axiosInstance";
const SlotBookModal = ({
  slotOpen,
  setSlotOpen,
  handleSelectSlot,
  LTData,
  tableData,
}) => {
  const { t } = useTranslation();
  const statusArray = [
    { status: "Available", color: "rgb(111 224 161)" },
    { status: "Already Booked", color: "rgb(97 176 215)" },
    { status: "Selected", color: "rgb(241 173 199)" },
    { status: "Expired", color: "rgb(192 191 191)" },
    { status: "Selected Slot In Current Booking", color: "#e0ba5e" },
    { status: "Temporary Hold", color: "#f63d3d" },
  ];
  const [slotData, setSlotData] = useState([]);
  const [modality, setModality] = useState([]);
  const [shift, setShift] = useState([]);
  const [load, setLoad] = useState(false);
  const [payload, setPayload] = useState({
    InvestigationDate: new Date(),
    ModalityId: "",
    SelectedTimeSlot: "",
    ModalityName: "",
    ShiftName: "",
  });
  const handleSingleClick = (_, index) => {
    const updatedSlotData = slotData.map((item, idx) => ({
      ...item,
      isSelected: idx === index ? (item?.isSelected === 1 ? 0 : 1) : 0,
    }));
    setSlotData(updatedSlotData);
  };
  const checkSelectedDate = (Invdate) => {
    const currentTime = new Date(slotOpen?.data?.InvestigationDate);

    const currentYear = currentTime.getFullYear();
    const currentMonth = currentTime.getMonth();
    const currentDay = currentTime.getDate();

    const investigateYear = Invdate.getFullYear();
    const investigateMonth = Invdate.getMonth();
    const investigateDay = Invdate.getDate();
    return (
      currentYear === investigateYear &&
      currentMonth === investigateMonth &&
      currentDay === investigateDay
    );
  };
  const checkColor = (ele, Invdate) => {
    const { status, StartTime } = ele;
    const currentTime = new Date();
    const startTime = new Date(
      `${moment(Invdate).format("YYYY-MM-DD")}T${StartTime}`
    );

    if (checkDate(Invdate)) {
      if (startTime < currentTime) {
        return "rgb(192 191 191)";
      }
    }
    switch (status) {
      case "0":
        return "rgb(111 224 161)";
      case "1":
        return "rgb(97 176 215)";
      default:
        return "#000000";
    }
  };

  const setSelectedSlot = (ele, shift, id, name, date) => {
    const table = tableData?.map((ele) => {
      return {
        ...ele,
        InvestigationDate: moment(ele?.InvestigationDate).format("DD/MMM/YYYY"),
      };
    });
    const pay = {
      ...payload,
      ModalityId: id,
      ModalityName: name,
      ShiftName: shift,
      InvestigationDate: moment(date).format("DD/MMM/YYYY"),
    };

    const payloadKeys = Object.keys(pay);
    const matchedObjects = table.filter((item) => {
      return payloadKeys.every(
        (key) => item.hasOwnProperty(key) && item[key] === pay[key]
      );
    });

    return matchedObjects.some(
      (obj) => obj?.StartEndTimeSlot === ele?.StartEndTimeSlot
    );
  };
  // console.log(slotData);
  const BindShift = () => {
    axiosInstance
      .get("ModalityMaster/BindShift")
      .then((res) => {
        let data = res.data.message;
        let responce = data.map((ele) => {
          return {
            value: ele.ShiftName,
            label: ele.ShiftName,
          };
        });
        setShift(responce);
        BindModality(responce);
      })
      .catch((err) =>
        console.log(err?.res?.data ? err?.res?.data : "Something Went Wrong")
      );
  };
  const IshandleBookedSlot = (payload, ele, slotOpen) => {
    const bookingData = {
      StartEndTimeSlot: ele?.StartEndTimeSlot,
      InvestigationDate: payload?.InvestigationDate,
      ModalityId: payload?.ModalityId,
      ShiftName: payload?.ShiftName,
      CentreId: LTData?.CentreID,
      DepartmentId: slotOpen?.DepartmentID,
    };
    axiosInstance
      .post("ModalityMaster/SaveTimeSlotHold", {
        ...bookingData,
      })
      .then((res) => {
        if (res?.data?.message == "True") {
          handleSelectSlot(payload, ele, slotOpen);
          setSlotOpen({
            ...slotOpen,
            show: false,
          });
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message ?? "Something Went Wrong");
      });
  };
  const BindModality = (shift) => {
    axiosInstance
      .post("ModalityMaster/BindModality", {
        DepartmentId: slotOpen?.data?.DepartmentID,
      })
      .then((res) => {
        let data = res.data.message;
        let responce = data.map((ele) => {
          return {
            value: ele.Id,
            label: ele.NAME,
          };
        });
        setModality(responce);
        setPayload({
          ...payload,
          ShiftName:
            slotOpen?.data?.ShiftName && slotOpen?.data?.ShiftName != ""
              ? slotOpen?.data?.ShiftName
              : shift[0]?.value,
          ModalityId:
            slotOpen?.data?.ModalityId &&
            (slotOpen?.data?.ModalityId != "" ||
              slotOpen?.data?.ModalityId != 0)
              ? slotOpen?.data?.ModalityId
              : responce[0]?.value,
          ModalityName:
            slotOpen?.data?.ModalityName && slotOpen?.data?.ModalityName != ""
              ? slotOpen?.data?.ModalityName
              : responce[0]?.label,
          InvestigationDate:
            slotOpen?.data?.InvestigationDate &&
            slotOpen?.data?.InvestigationDate != ""
              ? slotOpen?.data?.InvestigationDate
              : new Date(),
        });
        GetInvestigationTimeSlot(
          slotOpen?.data?.ShiftName && slotOpen?.data?.ShiftName != ""
            ? slotOpen?.data?.ShiftName
            : shift[0]?.value,
          slotOpen?.data?.ModalityId &&
            (slotOpen?.data?.ModalityId != "" ||
              slotOpen?.data?.ModalityId != 0)
            ? slotOpen?.data?.ModalityId
            : responce[0]?.value,
          slotOpen?.data?.ModalityName && slotOpen?.data?.ModalityName != ""
            ? slotOpen?.data?.ModalityName
            : responce[0]?.label,
          slotOpen?.data?.InvestigationDate &&
            slotOpen?.data?.InvestigationDate != ""
            ? slotOpen?.data?.InvestigationDate
            : new Date()
        );
      })
      .catch((err) => {
        setSlotData([]);

        console.log(err?.res?.data ? err?.res?.data : "Something Went Wrong");
      });
  };

  useEffect(() => {
    BindShift();
  }, []);

  const checkDate = (Invdate) => {
    const currentTime = new Date();

    const currentYear = currentTime.getFullYear();
    const currentMonth = currentTime.getMonth();
    const currentDay = currentTime.getDate();

    const investigateYear = Invdate.getFullYear();
    const investigateMonth = Invdate.getMonth();
    const investigateDay = Invdate.getDate();

    return (
      currentYear === investigateYear &&
      currentMonth === investigateMonth &&
      currentDay === investigateDay
    );
  };
  const GetInvestigationTimeSlot = (shift, id, name, date) => {
    setLoad(true);
    axiosInstance
      .post("ModalityMaster/GetInvestigationTimeSlot", {
        ShiftName: shift,
        ModalityId: id,
        ModalityName: name,
        DepartmentId: slotOpen?.data?.DepartmentID,
        InvestigationDate: moment(date).format("DD/MMM/YYYY"),
        DoctorId: LTData?.DoctorID,
        BookingType: 2,
        ItemId: slotOpen?.data?.InvestigationID,
        CentreId: LTData?.CentreID,
      })
      .then((res) => {
        setLoad(false);

        const data = res?.data?.message;
        const datas = data?.map((ele) => {
          return {
            ...ele,
            color: checkColor(ele, date),
            SelectedSlot: setSelectedSlot(ele, shift, id, name, date),
          };
        });
        setSlotData(datas);
      })
      .catch((err) => {
        setLoad(false);
        setSlotData([]);
        console.log(err?.res?.data ? err?.res?.data : "Something Went Wrong");
      });
  };
  const handleChange = (e) => {
    const { name, value, selectedIndex } = e.target;
    const label = e?.target?.children?.[selectedIndex]?.text;

    if (name === "ModalityId") {
      setPayload({
        ...payload,
        [name]: value,
        ModalityName: label,
      });
      GetInvestigationTimeSlot(
        payload?.ShiftName,
        value,
        label,
        payload?.InvestigationDate
      );
    }
    if (name === "ShiftName") {
      setPayload({
        ...payload,
        [name]: value,
      });
      GetInvestigationTimeSlot(
        value,
        payload?.ModalityId,
        payload?.ModalityName,
        payload?.InvestigationDate
      );
    }
  };

  const dateSelect = (date, name) => {
    setPayload({
      ...payload,
      [name]: date,
    });

    GetInvestigationTimeSlot(
      payload?.ShiftName,
      payload?.ModalityId,
      payload?.ModalityName,
      date
    );
  };
  return (
    <>
      <Modal
        title={"Slot Booking"}
        handleClose={() =>
          setSlotOpen({
            data: "",
            show: false,
          })
        }
      >
        <div
          className="box-success"
          style={{
            backgroundColor: "transparent",
            maxHeight: "600px",
            overflowY: "auto",
          }}
        >
          <div className="box-body ">
            <div className="row">
              <label
                className="col-md-2"
                style={{ textAlign: "end" }}
                htmlFor="Investigation Date"
              >
                {t("Investigation Date")} :
              </label>
              <div className="col-md-2">
                <DatePicker
                  name="InvestigationDate"
                  minDate={new Date()}
                  onChange={dateSelect}
                  className="select-input-box form-control input-sm required"
                  date={payload?.InvestigationDate}
                />
              </div>
              <label
                className="col-md-2"
                htmlFor="Modality "
                style={{ textAlign: "end" }}
              >
                {t("Modality")} :
              </label>
              <div className="col-md-2">
                <SelectBox
                  name="ModalityId"
                  options={modality}
                  className="select-input-box form-control input-sm required"
                  selectedValue={payload?.ModalityId}
                  onChange={handleChange}
                />
              </div>
              <label
                className="col-md-2"
                htmlFor="ShiftName "
                style={{ textAlign: "end" }}
              >
                {t("ShiftName")} :
              </label>
              <div className="col-md-2">
                <SelectBox
                  name="ShiftName"
                  options={shift}
                  className="select-input-box form-control input-sm required"
                  selectedValue={payload?.ShiftName}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="box">
            <div className="box-body">
              <div className="row">
                <label className="col-md-2" htmlFor="Investigation Date">
                  {payload?.ShiftName}
                </label>
                <label className="col-md-6">
                  <a style={{ color: "red" }}>
                    <i>* Only Available Slot Can be Selected</i>
                  </a>
                </label>
              </div>

              {load ? (
                <Loading />
              ) : slotData?.length !== 0 ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      maxHeight: "400px",
                      overflowY: "auto",
                    }}
                  >
                    {slotData?.map((ele, index) => (
                      <>
                        <span style={{ padding: "5px", cursor: "pointer" }}>
                          <button
                            className="circle"
                            style={{
                              backgroundColor:
                                ele?.SelectedSlot === true
                                  ? "#e0ba5e"
                                  : ele?.status == 1
                                  ? "rgb(97 176 215)"
                                  : ele?.tempHold == 1
                                  ? "#f63d3d"
                                  : ele?.isSelected == 1
                                  ? "rgb(241 173 199)"
                                  : ele?.color,
                              padding: "2px",
                              cursor: "pointer",
                            }}
                            title={ele?.status == 0 && "Double Click to Select"}
                            onClick={() => handleSingleClick(ele, index)}
                            // onDoubleClick={() => {
                            //   setSlotOpen({
                            //     ...slotOpen,
                            //     show: false,
                            //   });
                            //   handleSelectSlot(payload, ele, slotOpen?.data);
                            // }}
                            onDoubleClick={() =>
                              IshandleBookedSlot(payload, ele, slotOpen?.data)
                            }
                            disabled={
                              !(ele?.status == 0) ||
                              ele?.color == "rgb(192 191 191)" ||
                              ele?.SelectedSlot === true ||
                              ele?.tempHold == 1
                            }
                          >
                            <label
                              style={{ color: "black", cursor: "pointer" }}
                            >
                              {ele?.StartEndTimeSlot}
                            </label>
                          </button>
                        </span>
                      </>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ textAlign: "center", fontSize: "15px" }}>
                  <label style={{ fontWeight: "bold", color: "#b24040" }}>
                    No Slot Found
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="box-body">
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                unicodeBidi: "isolate",
              }}
            >
              {statusArray?.map((ele, _) => (
                <>
                  <span style={{ padding: "2px" }}>
                    <button
                      className="minicircle"
                      style={{
                        backgroundColor: ele?.color,
                        padding: "2px",
                      }}
                    ></button>
                    <label style={{ marginLeft: "4px", marginRight: "8px" }}>
                      {ele?.status}
                    </label>
                  </span>
                </>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SlotBookModal;
