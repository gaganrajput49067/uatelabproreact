import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import moment from "moment";
import DeptModal from "../utils/DeptModal";
import PageHead from "../../components/CommonComponent/PageHead";
import DatePicker from "../../components/CommonComponent/DatePicker";
import Input from "../../components/CommonComponent/Input";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import { getTrimmedData, number } from "../../utils/helpers";
import Loading from "../../components/Loading/Loading";
import Table from "../../components/Table/Table";
import TestDetailViewModal from "../utils/TestDetailViewModal";
import DependentMemberDetailModal from "../utils/DependentMemberDetailModal";

const MembershipCardSearch = () => {
  const { t } = useTranslation();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cardloading, setCardLoading] = useState({
    loading: false,
    id: "",
  });
  const [details, setDetails] = useState({ no: "", id: "" });
  const handleClosedep = () => setShowdep(false);
  const [showdep, setShowdep] = useState(false);
  const [Cards, setCards] = useState([]);
  const [MemberDetailsModal, setMemberDetailsModal] = useState(false);
  const [MemberShipCardData, setMemberShipCardData] = useState(false);
  const [TestViewModal, setTestViewModal] = useState(false);
  const [payload, setPayload] = useState({
    FromDate: new Date(),
    ToDate: new Date(),
    Cardtype: "",
    Cardno: "",
    UHIDNo: "",
    Mobileno: "",
  });
  const [MembershipID, setMembershipID] = useState("");
  const Navigate = useNavigate();
  const handleShowdep = () => {
    setShowdep(true);
  };
  const handleChange = (e) => {
    const { value, name } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const dateSelect = (date, name) => {
    setPayload({ ...payload, [name]: date });
  };
  const getCardType = () => {
    axiosInstance
      .get(`MembershipCardMaster/BindMembership`)
      .then((res) => {
        let data = res.data.message;
        let cardData = data.map((ele) => {
          return {
            value: ele.Id,
            label: ele.Name,
          };
        });
        cardData.unshift({ label: "Select", value: "" });
        setCards(cardData);
      })
      .catch((err) => console.log(err));
  };

  const getSearchCard = () => {
    setLoading(true);
    axiosInstance
      .post(
        "MembershipCardMaster/SearchCardData",
        getTrimmedData({
          ...payload,
          FromDate: moment(payload?.FromDate).format("YYYY-MM-DD"),
          ToDate: moment(payload?.ToDate).format("YYYY-MM-DD"),
          CardType: payload?.Cardtype,
          CardNo: payload?.Cardno,
          UHIDNo: payload?.UHIDNo,
          MobileNo: payload?.Mobileno,
        })
      )
      .then((res) => {
        if (res.status === 200) {
          setTableData(res.data.message);
          toast.success(res?.data?.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        setTableData([]);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "No Records found"
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    getCardType();
  }, []);

  const getMemberCard = (id, index) => {
    setCardLoading({ loading: true, id: index });
    axiosInstance
      .post("/reports/v1/generateMemberShipCard", {
        CardNo: id,
      })
      .then((res) => {
        window.open(res?.data?.Url, "_blank");
        setCardLoading({ loading: false, id: "" });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
        setCardLoading({ loading: false, id: "" });
      });
  };
  const getReceipt = (id) => {
    axiosInstance
      .post("/reports/v1/MembershipReceipt", {
        LedgerTransactionId: id,
      })
      .then((res) => {
        window.open(res?.data?.Url, "_blank");
      })
      .catch((err) => {
        toast.error(
          err?.data?.response?.message
            ? err?.data?.response?.message
            : "Error Occured"
        );
      });
  };
  return (
    <>
      {MemberDetailsModal && (
        <DependentMemberDetailModal
          show={MemberDetailsModal}
          data={MemberShipCardData}
          onHide={() => {
            setMemberDetailsModal(false);
          }}
        />
      )}
      {TestViewModal && (
        <TestDetailViewModal
          show={TestViewModal}
          data={MemberShipCardData}
          onHide={() => {
            setTestViewModal(false);
          }}
        />
      )}
      {showdep && (
        <DeptModal
          show={showdep}
          handleClose={handleClosedep}
          DiscountData={{ CardNo: details?.no, CardID: details?.id }}
          url={"abc"}
          title={"membership"}
        />
      )}
      <PageHead name="Membership Card Search" showDrop="true">
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <DatePicker
                name="FromDate"
                id="FromDate"
                value={payload?.FromDate}
                onChange={dateSelect}
                maxDate={payload?.ToDate}
                lable="Issue Date From"
              />
            </div>
            <div className="col-sm-2">
              <DatePicker
                name="ToDate"
                id="ToDate"
                onChange={dateSelect}
                value={payload?.ToDate}
                minDate={payload?.FromDate}
                lable="Issue Date To"
              />
            </div>
            <div className="col-sm-2">
              <Input
                type="text"
                id="MemberShipCard"
                name="Cardno"
                value={payload?.Cardno}
                onChange={handleChange}
                placeholder=""
                lable="Card No"
              />
            </div>
            <div className="col-sm-2">
              <SelectBox
                options={Cards}
                id="CardType"
                name="Cardtype"
                selectedValue={payload?.Cardtype}
                onChange={handleChange}
                lable="Card Type"
              />
            </div>
            <div className="col-sm-2">
              <Input
                type="text"
                id="UHID"
                name="UHIDNo"
                onChange={handleChange}
                value={payload?.UHIDNo}
                placeholder=""
                lable="UHID No"
              />
            </div>
            <div className="col-sm-1">
              <Input
                type="number"
                id="Mobile"
                name="Mobileno"
                value={payload?.Mobileno}
                onChange={handleChange}
                onInput={(e) => number(e, 10)}
                placeholder=""
                lable="Mobile No"
              />
            </div>
            <div className="col-sm-1">
              <button
                className="btn btn-block btn-sm btn-primary"
                onClick={getSearchCard}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </PageHead>
      {loading ? (
        <Loading />
      ) : (
        <>
          {tableData.length > 0 && (
            <div className="card">
              <Table>
                <thead>
                  <tr>
                    <th>S.N.</th>
                    <th>Card Name</th>
                    <th>Card No.</th>
                    <th>Issue Date</th>
                    <th>Mobile No.</th>
                    <th>Member Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Expiry Date</th>
                    <th>Card Price</th>
                    <th>Issue By</th>
                    <th>View</th>
                    <th>Edit</th>
                    <th>Centre</th>
                    <th>Receipt</th>
                    <th>Card</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData?.map((ele, index) => (
                    <tr kay={index}>
                      <td
                        data-title="S.N."
                        onClick={() => {
                          setMemberDetailsModal(true);
                          setMemberShipCardData(ele);
                        }}
                      >
                        <button
                          className="btn btn-primary btn-sm"
                          id="NewReferDoc"
                          type="button"
                        >
                          <i className="fa fa-plus-circle fa-sm"></i>
                        </button>
                      </td>
                      <td data-title="Card Name">{ele?.cardName}&nbsp;</td>
                      <td data-title="Card No.">{ele?.cardno}&nbsp;</td>
                      <td data-title="Issue Date">
                        {new Date(ele?.entrydate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td data-title="Mobile No.">{ele?.mobile}&nbsp;</td>
                      <td data-title="Member Name">{ele?.name}&nbsp;</td>
                      <td data-title="Age">{ele?.age}&nbsp;</td>
                      <td data-title="Gender">{ele?.gender}&nbsp;</td>
                      <td data-title="Expiry Date">{ele?.ValidTo}&nbsp;</td>
                      <td data-title="Card Price">
                        {Number(ele?.amount).toFixed(2)}&nbsp;
                      </td>
                      <td data-title="Issue By">{ele?.issueby}&nbsp;</td>
                      <td
                        data-title="View"
                        style={{ cursor: "pointer", textAlign: "center" }}
                        onClick={() => {
                          setTestViewModal(true);
                          setMemberShipCardData(ele);
                        }}
                      >
                        <Link>
                          <i className="fa fa-search" />
                        </Link>
                        &nbsp;
                      </td>
                      <td
                        data-title="Edit"
                        style={{ cursor: "pointer", textAlign: "center" }}
                      >
                        <i
                          className="fa fa-edit"
                          onClick={() => {
                            Navigate("/MemberShipCardEdit", {
                              state: { data: ele },
                            });
                          }}
                        ></i>
                        &nbsp;
                      </td>
                      <td
                        data-title={t("Centre Access")}
                        style={{ cursor: "pointer", textAlign: "center" }}
                      >
                        <span
                          title="Centre Access"
                          className="pi pi-building"
                          onClick={() => {
                            handleShowdep();
                            setDetails({ no: ele?.cardno, id: ele?.ID });
                            setMembershipID(ele?.name);
                          }}
                        ></span>
                        &nbsp;
                      </td>
                      <td data-title="Receipt">
                        <span
                          onClick={() =>
                            getReceipt(ele?.LedgerTransactionID, index)
                          }
                        >
                          <i
                            style={{
                              cursor: "pointer",
                              textAlign: "center",
                            }}
                            class="pi pi-file-excel"
                            aria-hidden="true"
                          ></i>{" "}
                        </span>
                      </td>
                      <td>
                        {cardloading.loading && cardloading.id === index ? (
                          <Loading />
                        ) : (
                          <span
                            style={{
                              cursor: "pointer",
                              textAlign: "center",
                            }}
                            onClick={() => getMemberCard(ele?.cardno, index)}
                          >
                            <i class="pi pi-id-card"></i>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default MembershipCardSearch;
