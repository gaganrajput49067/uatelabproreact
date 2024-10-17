import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import Table from "../../components/Table/Table";
import { isChecked } from "../util/Commonservices";
import Modal from "../../components/Modal/Modal";
import Input from "../../components/CommonComponent/Input";
import Loading from "../../components/Loading/Loading";

const DoctorTypeDefaultShareModal = ({ show, handleClose, DocID }) => {
  const [Department, setDepartment] = useState([]);
  const [RateTypeData, setRateTypeData] = useState([]);
  const [load, setLoad] = useState(false);

  const getDepartment = () => {
    axiosInstance
      .get("Department/getDepartment")
      .then((res) => {
        let data = res.data.message;
        let Department = data.map((ele) => {
          return {
            DepartmentID: ele.DepartmentID,
            Department: ele.Department,
            isChecked: false,
            SharePer: "",
            DocID: DocID,
          };
        });
        setDepartment(Department);
      })
      .catch((err) => console.log(err));
  };

  const RemoveDefaultShare = () => {
    let data = RateTypeData.filter((ele) => ele?.isChecked === true);
    if (data.length > 0) {
      setLoad(true);
      axiosInstance
        .post("DoctorShare/RemoveDoctorDefaultShare", data)
        .then((res) => {
          setLoad(false);
          toast.success(res?.data?.message);
          getDoctorData();
          getDepartment();
        })
        .catch((err) => {
          setLoad(false);
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something Went Wrong"
          );
        });
    } else {
      toast.error("Please Select one row");
    }
  };

  const getDoctorData = () => {
    axiosInstance
      .post("DoctorShare/getDefaultShareData", {
        DocID: DocID,
      })
      .then((res) => {
        if (res.status === 200) {
          const data = res.data.message;
          const val = data.map((ele) => {
            return {
              ...ele,
              isChecked: false,
            };
          });
          setRateTypeData(val);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (e, index) => {
    const { name, value, type, checked } = e.target;
    if (index >= 0) {
      const data = [...Department];
      data[index][name] =
        type === "checkbox"
          ? checked
          : name === "SharePer"
          ? parseInt(value) > 100
            ? ""
            : value
          : value;
      setDepartment(data);
    } else {
      if (type === "checkbox") {
        if (checked) {
          const data = Department.map((ele) => {
            return {
              ...ele,
              [name]: checked,
            };
          });
          setDepartment(data);
        } else {
          const data = Department.map((ele) => {
            return {
              ...ele,
              SharePer: name === "SharePer" ? "" : value,
              [name]: checked,
            };
          });
          setDepartment(data);
          document.getElementById("SharePer").value = "";
        }
      } else {
        const data = Department.map((ele) => {
          return {
            ...ele,
            SharePer:
              name === "SharePer" ? (parseInt(value) > 100 ? "" : value) : "",
          };
        });
        setDepartment(data);
        if (name === "SharePer") {
          let data = document.getElementById("SharePer").value;
          if (parseInt(data) > 100) {
            document.getElementById("SharePer").value = "";
          }
        }
      }
    }
  };

  const Save = () => {
    const data = Department?.filter((ele) => ele.isChecked === true);
    if (data.length > 0) {
      setLoad(true);
      axiosInstance
        .post("DoctorShare/DefaultDoctorShareCreate", {
          SaveDoctorShare: data,
        })
        .then((res) => {
          if (res.data.message) {
            toast.success(res.data.message);
            getDoctorData();
            getDepartment();
          } else {
            toast.error("Something went wrong");
          }
          setLoad(false);
        })
        .catch((err) => {
          setLoad(false);
          toast.error(err.response.data.message);
        });
    } else {
      toast.error("Please Select one Row");
    }
  };

  useEffect(() => {
    getDepartment();
    getDoctorData();
  }, []);

  return (
    <Modal title="Global Share" handleClose={handleClose}>
      <div className="card">
        {Department.length > 0 && (
          <Table>
            <thead className="cf">
              <tr>
                <th>S.no</th>
                <th>Department Name</th>
                <th>
                  <Input
                    type="number"
                    placeholder="Share %"
                    name="SharePer"
                    onChange={handleChange}
                    onInput={(e) => number(e, 3)}
                    id="SharePer"
                    disabled={
                      Department?.length > 0
                        ? isChecked("isChecked", Department, true).includes(
                            false
                          )
                          ? true
                          : false
                        : false
                    }
                  />
                </th>
                <th>
                  <input
                    type="checkbox"
                    name="isChecked"
                    onChange={handleChange}
                    checked={
                      Department?.length > 0
                        ? isChecked("isChecked", Department, true).includes(
                            false
                          )
                          ? false
                          : true
                        : false
                    }
                  />
                  All
                </th>
              </tr>
            </thead>
            <tbody>
              {Department?.map((ele, index) => (
                <tr key={index}>
                  <td data-title={"S.no"}>{index + 1}</td>
                  <td data-title={"Department Name"}>{ele?.Department}</td>
                  <td data-title={"SharePer"}>
                    <Input
                      disabled={ele?.isChecked ? false : true}
                      type="number"
                      name="SharePer"
                      id="SharePer"
                      value={ele?.SharePer}
                      onChange={(e) => handleChange(e, index)}
                      onInput={(e) => number(e, 3)}
                    />
                  </td>
                  <td data-title={"#"}>
                    <input
                      type="checkbox"
                      name="isChecked"
                      onChange={(e) => handleChange(e, index)}
                      checked={ele?.isChecked}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        <div className="row">
          <div className="col-sm-3">
            {load ? (
              <Loading />
            ) : (
              <button
                type="button"
                className="btn btn-block btn-success btn-sm"
                id="btnSave"
                onClick={Save}
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
      {RateTypeData.length > 0 && (
        <>
          <div className="card">
            <Table>
              <thead className="cf">
                <tr>
                  <th>S.no</th>
                  <th>Department Name</th>
                  <th>Share %</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {RateTypeData?.map((ele, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{ele?.Department}</td>
                    <td>{ele?.SharePer}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={ele?.isChecked}
                        name="isChecked"
                        onChange={(e) => {
                          const { name, checked } = e.target;
                          const data = [...RateTypeData];
                          data[index][name] = checked;
                          setRateTypeData(data);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>{" "}
          <div className="card">
            <div className="row">
              <div className="col-sm-3">
                {load ? (
                  <Loading />
                ) : (
                  <button
                    type="button"
                    className="btn btn-block btn-danger btn-sm"
                    id="btnSave"
                    onClick={RemoveDefaultShare}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>{" "}
        </>
      )}
    </Modal>
  );
};

export default DoctorTypeDefaultShareModal;
