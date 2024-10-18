import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import PageHead from "../../components/CommonComponent/PageHead";
import DatePicker from "../../components/CommonComponent/DatePicker";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import Loading from "../../components/Loading/Loading";
import Table from "../../components/Table/Table";
import moment from "moment";
import { isChecked } from "../util/Commonservices";

const MergeDoctor = () => {
  const { t } = useTranslation();
  const [load, setLoad] = useState(false);

  const [payload, setPayload] = useState({
    formDate: new Date(),
    ToDate: new Date(),
    Status: "0",
  });

  const [tableData, setTableData] = useState([]);

  const handleDate = (value, name) => {
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const handleSelect = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
    handleSearch(value);
  };

  const handleSave = (url) => {
    const data = tableData.filter((ele) => ele?.isChecked === "1");
    if (data.length > 0) {
      axiosInstance
        .post(`DoctorReferal/${url}`, data)
        .then((res) => {
          toast.success(res?.data?.message);
          setTableData([]);
          handleSearch();
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message);
        });
    } else {
      toast.error("Select One Data");
    }
  };

  const handleCheck = (e, index) => {
    const { name, checked } = e.target;
    if (index >= 0) {
      const data = [...tableData];
      data[index][name] = checked ? "1" : "0";
      setTableData(data);
    } else {
      const data = tableData.map((ele) => {
        return {
          ...ele,
          [name]: checked ? "1" : "0",
        };
      });
      setTableData(data);
    }
  };

  const handleSearch = (Status) => {
    setLoad(true);
    axiosInstance
      .post("DoctorReferal/getTempDoctorData", {
        FromDate: moment(payload?.formDate).format("DD/MMM/YYYY"),
        ToDate: moment(payload?.ToDate).format("DD/MMM/YYYY"),
        Status: Status,
      })
      .then((res) => {
        if (res?.data?.success) {
          const data = res?.data?.message;
          if (data?.length === 0) {
            toast.error("No data Found");
            setTableData([]);
            return;
          }
          const val = data.map((ele) => {
            return {
              ...ele,
              isChecked: "0",
            };
          });
          setTableData(val);
        } else {
          setTableData([]);
          toast.error(res?.data?.message);
        }
        setLoad(false);
      })
      .catch((err) => {
        setLoad(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occur"
        );
      });
  };
  return (
    <>
      <PageHead name={t("Merge Doctor")} showDrop="true">
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <DatePicker
                maxDate={new Date()}
                value={payload?.formDate}
                name={"formDate"}
                id="formDate"
                lable={t("Form Date")}
                onChange={handleDate}
              />
            </div>
            <div className="col-sm-2">
              <DatePicker
                maxDate={new Date()}
                value={payload?.ToDate}
                minDate={payload?.formDate}
                name={"ToDate"}
                id="ToDate"
                lable={t("To Date")}
                onChange={handleDate}
              />
            </div>
            <div className="col-sm-2">
              <SelectBox
                options={[
                  {
                    label: "Non Merge",
                    value: "0",
                  },
                  {
                    label: "Merge",
                    value: "1",
                  },
                ]}
                selectedValue={payload?.Status}
                name="Status"
                id="Status"
                labe={t("Status")}
                onChange={handleSelect}
              />
            </div>
            <div className="col-sm-1">
              {load ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => handleSearch(payload?.Status)}
                >
                  {t("Search")}
                </button>
              )}
            </div>
          </div>
        </div>
      </PageHead>
      {tableData?.length > 0 && (
        <div className="card">
          <Table>
            <thead>
              <tr>
                {[
                  "S.no",
                  "Doctor Name",
                  "Contact No.",
                  "Email",
                  <input
                    type="checkbox"
                    name={"isChecked"}
                    onChange={handleCheck}
                    checked={
                      tableData.length > 0
                        ? isChecked("isChecked", tableData, "1").includes(false)
                          ? false
                          : true
                        : false
                    }
                  />,
                ].map((ele, index) => (
                  <th key={index}>{ele}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData?.map((ele, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{ele?.DoctorName}</td>
                  <td>{ele?.ContactNo}</td>
                  <td>{ele?.Email}</td>
                  <td>
                    <input
                      type="checkbox"
                      name={"isChecked"}
                      checked={ele?.isChecked === "1" ? true : false}
                      onChange={(e) => handleCheck(e, index)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div 
          className="row"
            style={{
              marginTop: "5px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {payload?.Status == 0 ? (
                <div className="col-sm-2">
              <button
                className="btn btn-sm btn-success mx-2"
                onClick={() => handleSave("InsertTempDoctor")}
              >
                Save
              </button>
              </div>
            ) : (
                <div className="col-sm-2">
              <button
                className="btn btn-sm btn-danger mx-2"
                onClick={() => handleSave("RemoveTempDoctor")}
              >
                Remove
              </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MergeDoctor;
