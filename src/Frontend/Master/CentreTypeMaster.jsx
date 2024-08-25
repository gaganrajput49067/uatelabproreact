import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { PreventSpecialCharacter, getTrimmedData } from "../../utils/helpers";
import { axiosInstance } from "../../utils/axiosInstance";
import Loading from "../../components/Loading/Loading";
import Input from "../../components/CommonComponent/Input";
import PageHead from "../../components/CommonComponent/PageHead";
import Table from "../../components/Table/Table";

const CentreTypeMaster = () => {
  const [load, setLoad] = useState(false);
  const [formData, setFormData] = useState({
    CentreType: "",
    IsActive: true,
  });
  const [tableData, setTableData] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const reg = /^([^0-9$%]*)$/;
    if (type == "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      if (PreventSpecialCharacter(value)) {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    }
  };

  const UpdateCentreType = () => {
    const payload = {
      type: formData?.CentreType?.trim(),
      id: formData?.id,
      IsActive: formData?.IsActive == true ? 1 : 0,
    };
    setLoad(true);
    if (payload?.type.length > 2) {
      axiosInstance
        .post("/Centre/UpdateCentreType", getTrimmedData(payload))
        .then((res) => {
          toast.success(res?.data?.message);
          setFormData({
            CentreType: "",
            IsActive: false,
          });
          getTableData();
          setLoad(false);
        })
        .catch((err) => {
          setLoad(false);
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Could Not Update"
          );
        });
    } else {
      setLoad(false);
      toast.error("CentreType must have atleast 3 characters");
    }
  };
  const SaveCentreType = () => {
    const payload = {
      type: formData?.CentreType.trim(),
      IsActive: formData?.IsActive == true ? 1 : 0,
    };
    if (payload?.type.length > 2) {
      setLoad(true);
      axiosInstance
        .post("/Centre/SaveCentreType", payload)
        .then((res) => {
          toast.success(
            res?.data?.message
              ? res?.data?.message
              : "CentreType Saved Successfully"
          );
          setFormData({
            CentreType: "",
            IsActive: false,
          });
          getTableData();
          setLoad(false);
        })
        .catch((err) => {
          setLoad(false);
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Could Not Save"
          );
        });
    } else {
      setLoad(false);
      toast.error("CentreType must have atleast 3 characters");
    }
  };

  const handleEditCentreType = (ele) => {
    setFormData({
      id: ele?.id,
      CentreType: ele?.type,
      IsActive: ele?.IsActive == 1 ? true : false,
    });
    window.scroll(0, 0);
  };

  const getTableData = () => {
    axiosInstance
      .get("Centre/GetCentreTypeData")
      .then((res) => {
        if (res?.data.success) {
          setTableData(res?.data?.message);
        } else {
          setTableData([]);
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        console.log(err?.response?.data?.message);
      });
  };

  useEffect(() => {
    getTableData();
  }, []);

  return (
    <>
      <PageHead name="Centre Type Master">
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <Input
                onChange={handleChange}
                value={formData?.CentreType}
                name="CentreType"
                type="text"
                placeholder=""
                lable="Centre Type"
                id="Centre Type"
                max={20}
              />
            </div>
            <div className="col-sm-1 flex">
              <input
                name="IsActive"
                id="IsActive"
                className="mb-3"
                type="checkbox"
                onChange={handleChange}
                checked={formData.IsActive}
              />
              <label htmlFor="IsActive" className="ml-2">
                {"IsActive"}
              </label>
            </div>

            {load ? (
              <Loading />
            ) : (
              <div className="col-sm-1">
                {!formData?.id && (
                  <button
                    type="button"
                    className="btn btn-success btn-sm"
                    onClick={SaveCentreType}
                  >
                    Save
                  </button>
                )}
                {formData?.id && (
                  <button
                    type="button"
                    className="btn btn-warning btn-sm"
                    onClick={UpdateCentreType}
                  >
                    Update
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </PageHead>

      <div className="card mt-2">
        <Table paginate={true} data={tableData ?? []} itemsPerPage={10}>
          {({ currentItems, finalIndex }) => {
            return (
              <>
                <thead className="cf thead-class" style={{ zIndex: 99 }}>
                  <tr>
                    <th className="text-center">{"S.No"}</th>
                    <th className="text-center">{"CentreType"}</th>
                    <th className="text-center">{"Status"}</th>
                    <th className="text-center">{"Select"}</th>
                  </tr>
                </thead>

                <tbody>
                  {currentItems.map((ele, index) => (
                    <>
                      <tr key={ele.ID}>
                        <td data-title="#" className="text-center">
                          {index + finalIndex}
                        </td>
                        <td data-title="CentreType" className="text-center">
                          {ele?.type} &nbsp;
                        </td>
                        <td data-title="Active" className="text-center">
                          {ele?.IsActive == 1 ? "Active" : "Inactive"} &nbsp;
                        </td>
                        <td data-title="Select" className="text-center">
                          <button
                            className="btn btn-primary btn-sm btn-class"
                            onClick={() => {
                              handleEditCentreType(ele);
                            }}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </>
            );
          }}
        </Table>{" "}
      </div>
    </>
  );
};

export default CentreTypeMaster;
