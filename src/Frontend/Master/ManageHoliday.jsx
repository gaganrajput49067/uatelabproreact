import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import { getTrimmedData } from "../../utils/helpers";
import moment from "moment";
import { toast } from "react-toastify";
import PageHead from "../../components/CommonComponent/PageHead";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import DatePicker from "../../components/CommonComponent/DatePicker";
import Loading from "../../components/Loading/Loading";
import Table from "../../components/Table/Table";
import { Link } from "react-router-dom";

const ManageHoliday = () => {
  const [tableData, setTableData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [AllCenter, setAllCenter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    CentreID: "",
    Holiday: new Date(),
    IsActive: "",
    ID: "",
  });
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    if (name == "CentreID") {
      setPayload({
        ...payload,
        [name]: value,
      });
      value == ""
        ? getTableDataHandler(AllCenter?.map((ele) => ele?.value))
        : getTableDataHandler([Number(value)]);
    } else {
      setPayload({ ...payload, [name]: type === "checkbox" ? checked : value });
    }
  };

  const dateSelect = (date, name) => {
    setPayload({
      ...payload,
      [name]: date,
    });
  };

  const EditTableDataHandler = (ele) => {
    setPayload({
      ...payload,
      CentreID: ele?.CentreID,
      Holiday: new Date(ele?.Holiday),
      ID: ele?.ID,
      IsActive: ele?.IsActive == 1 ? true : false,
    });
  };
  const getTableDataHandler = (id) => {
    setLoading(true);
    axiosInstance
      .post("ManageDeliveryDays/getHolidays", {
        CentreID: Array.isArray(id) ? id : [id],
      })
      .then((res) => {
        if (res?.data.success) {
          setTableData(res?.data?.message);
        } else {
          setTableData([]);
          toast.error(res?.data?.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        setTableData([]);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Wents Wrong"
        );
        setLoading(false);
      });
  };

  const handleSubmit = () => {
    if (payload?.CentreID) {
      setLoading(true);

      axiosInstance
        .post(
          `ManageDeliveryDays/${update ? "UpdateHolidays" : "saveHolidays"}`,
          getTrimmedData({
            ...payload,
            ID: payload?.ID?.toString(),
            CentreID: payload.CentreID,
            IsActive: payload.IsActive ? 1 : 0,
            Holiday: moment(payload?.Holiday).format("DD-MMM-YYYY"),
          })
        )
        .then((res) => {
          setUpdate(false);
          toast.success(res?.data?.message);
          getTableDataHandler(payload.CentreID);
          setLoading(false);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data.message
              ? err?.response?.data.message
              : "Something Went wrong"
          );
          setLoading(false);
        });
    } else {
      toast.error("Please Select Centre");
    }
  };
  const getAccessCentres = () => {
    axiosInstance
      .get("Centre/getAccessCentres")
      .then((res) => {
        let data = res.data.message;
        console.log(data);
        let CentreDataValue = data.map((ele) => {
          return {
            value: ele.CentreID,
            label: ele.Centre,
          };
        });

        getTableDataHandler(CentreDataValue?.map((ele) => ele?.value));
        setAllCenter(CentreDataValue);
      })
      .catch((err) => {
        getTableDataHandler([]);
        console.log(err);
      });
  };
  useEffect(() => {
    getAccessCentres();
  }, []);
  return (
    <>
      <PageHead name="Manage Holiday" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <SelectBox
                options={[{ value: "", label: "Select Centre" }, ...AllCenter]}
                name="CentreID"
                selectedValue={payload?.CentreID}
                onChange={handleChange}
                lable="Centre Name"
              />
            </div>
            <div className="col-sm-2">
              <DatePicker
                name="Holiday"
                id="ToDate"
                placeholder=" "
                value={payload?.Holiday}
                onChange={dateSelect}
                minDate={new Date()}
                lable="Holiday Date"
              />
            </div>
            <div className="col-sm-1">
              <input
                id="IsActive"
                type="checkbox"
                name="IsActive"
                checked={payload?.IsActive}
                onChange={handleChange}
                lable="isActive"
              />
              <label className="col-sm-10">IsActive</label>
            </div>
            <div className="col-sm-1">
              {loading ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-primary btn-sm btn-block"
                  onClick={handleSubmit}
                >
                  {update ? "Update" : "Add"}
                </button>
              )}
            </div>
          </div>
        </div>
      </PageHead>
      <div className="card">
        {tableData.length > 0 && (
          <>
            <Table>
              <thead className="cf" style={{ position: "sticky", top: 1 }}>
                <tr>
                  <th>Sr No.</th>
                  <th>Centre Name</th>
                  <th>Holiday Date</th>
                  <th>IsActive</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((ele, index) => (
                  <tr key={index}>
                    <td data-title="Sr No.">{index + 1}</td>
                    <td data-title="Centre Name">{ele?.Centre}</td>
                    <td data-title="Holiday Date">{ele?.Holiday}</td>
                    <td data-title="IsActive">
                      {ele?.IsActive == 1 ? "Active" : "In Active"}
                    </td>
                    <td data-title="Edit">
                      {ele?.IsEdit == 1 ? (
                        <Link
                          onClick={() => {
                            window.scroll(0, 0);
                            EditTableDataHandler(ele);
                            setUpdate(true);
                          }}
                        >
                          <i
                            className="fa fa-edit"
                            style={{
                              color: "#605ca8",
                              cursor: "pointer",
                            }}
                          ></i>
                        </Link>
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </div>
    </>
  );
};

export default ManageHoliday;

