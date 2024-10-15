import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import Input from "../../components/CommonComponent/Input";
import { toast } from "react-toastify";
import { isCheckedNew } from "../../utils/helpers";
import Table from "../../components/Table/Table";
import { axiosInstance } from "../../utils/axiosInstance";
import Loading from "../../components/Loading/Loading";

const DesignationModal = ({ show, onHandleClose }) => {
  const [HeaderData, setHeaderData] = useState([]);
  const [TableData, setTableData] = useState([]);
  const [filterAllData, setFilterAllData] = useState([]);
  const [load, setLoad] = useState(false);
  const [activeSection, setActiveSection] = useState(null); 

  const fetchPageAccessRightsData = (id) => {
    axiosInstance
      .post("Menu/PageAccessRightsData", { DesignationID: id })
      .then((res) => {
        const data = res?.data?.message;
        setFilterAllData(data);
        setTableData(data);

        let id = "";
        let headerData = data.filter((ele) => {
          if (ele.MenuName !== id) {
            id = ele?.MenuName;
            return ele;
          } else {
            id = ele?.MenuName;
          }
        });
        setHeaderData(headerData);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };

  useEffect(() => {
    fetchPageAccessRightsData(show?.id);
  }, [show]);

  const handleChange = (e, index, find) => {
    const { name, checked } = e.target;

    if (index >= 0) {
      const data = [...TableData];
      data[index][name] = checked === true ? 1 : 0;
      setTableData(data);
    } else {
      const data = TableData.map((ele) => {
        if (ele?.MenuName === find) {
          return {
            ...ele,
            [name]: checked === true ? 1 : 0,
          };
        } else {
          return ele;
        }
      });
      setTableData(data);
    }
  };

  const handleSearch = (e, data) => {
    const { value } = e?.target;
    let val = [...filterAllData];

    let filterDataNew = val.filter((ele) => {
      if (ele.MenuID === data?.MenuID) {
        if (ele?.PageName?.toLowerCase().includes(value.toLowerCase())) {
          return ele;
        }
      } else {
        return ele;
      }
    });

    setTableData(value ? filterDataNew : val);
  };

  const handleSubmit = () => {
    const data = TableData.filter((ele) => ele?.Allow === 1);
    if (data.length > 0) {
      setLoad(true);
      const val = data.map((ele) => {
        return {
          ...ele,
          DesignationID: show?.id,
        };
      });
      axiosInstance
        .post("Menu/AddPageRightsData", val)
        .then((res) => {
          toast.success(res?.data?.message);
          setLoad(false);
          onHandleClose();
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something Went Wrong"
          );
          setLoad(false);
        });
    } else {
      toast.error("Please Select Atleast One");
    }
  };

  return (
    <>
      <Modal title="Page Rights:" handleClose={onHandleClose}>
        <div className="card" style={{ width: "500px" }}>
          <div className="row">
            {HeaderData?.map((ele, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                <button
                  className="btn btn-primary designation"
                  onClick={() =>
                    setActiveSection(
                      activeSection === ele.MenuName ? null : ele.MenuName
                    )
                  } 
                >
                  {ele?.MenuName}
                </button>
                {activeSection === ele.MenuName && (
                  <Table
                    className="table table-bordered table-hover table-striped tbRecord"
                    cellPadding="{0}"
                    cellSpacing="{0}"
                  >
                    <thead className="cf">
                      <tr>
                        <th>{ele?.MenuName}</th>
                        <th style={{ color: "black" }}>
                          <Input onChange={(e) => handleSearch(e, ele)} />
                        </th>
                        <th>
                          {show?.name !== "Sales Person" && (
                            <input
                              type="checkbox"
                              name="Allow"
                              onChange={(e) =>
                                handleChange(e, -1, ele?.MenuName)
                              }
                              checked={
                                TableData?.length > 0
                                  ? isCheckedNew(
                                      "Allow",
                                      TableData,
                                      1,
                                      ele?.MenuName,
                                      "MenuName"
                                    ).includes(false)
                                    ? false
                                    : true
                                  : false
                              }
                            />
                          )}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {TableData?.map(
                        (data, ind) =>
                          data?.MenuName === ele?.MenuName && (
                            <tr key={ind}>
                              <td data-title="PageName" colSpan={2}>
                                {data?.PageName}
                              </td>
                              <td data-title="Allow">
                                <input
                                  type="checkbox"
                                  checked={data?.Allow}
                                  name="Allow"
                                  onChange={(e) => handleChange(e, ind)}
                                />
                              </td>
                            </tr>
                          )
                      )}
                    </tbody>
                  </Table>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="box-footer">
          <div className="row">
            <div className="col-sm-2">
              {load ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-block btn-success btn-sm"
                  onClick={handleSubmit}
                >
                  Save
                </button>
              )}
            </div>
            <div className="col-sm-2">
              <button
                className="btn btn-block btn-danger btn-sm"
                onClick={onHandleClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DesignationModal;
