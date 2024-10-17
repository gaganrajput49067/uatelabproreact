import React from "react";
import { useTranslation } from "react-i18next";

import { useState } from "react";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import { BindEmployeeReports } from "../../utils/NetworkApi/commonApi";
import PageHead from "../../components/CommonComponent/PageHead";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import { SelectBoxWithCheckbox } from "../../components/CommonComponent/MultiSelectBox";
import Table from "../../components/Table/Table";
const CenterAccess = () => {
  const [center, setCenter] = useState([]);
  const [allCenter, setAllCenter] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState({
    Data: [],
    CentreID: "",
    EmployeeID: "",
  });
  const [centerTable, setCenterTable] = useState([]);
  const [Employee, setEmployee] = useState([]);

  const { t } = useTranslation();

  const fetchCenter = () => {
    axiosInstance
      .get("Centre/getGlobalCentres")
      .then((res) => {
        let data = res.data.message;
        let value = data.map((ele) => {
          return {
            value: ele.CentreID,
            label: ele.Centre,
            DefaultCentreId: ele.DefaultCentreId,
          };
        });
        console.log(data);
        setCenter(value);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      });
  };

  const fetchAllCenter = () => {
    axiosInstance
      .get("Employee/GetAllCentres")
      .then((res) => {
        const data = res?.data?.message;
        const val = data.map((ele) => {
          return {
            value: ele?.CentreID,
            label: ele?.Centre,
          };
        });
        setAllCenter(val);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchCenter(center);
    fetchAllCenter();
  }, []);

  const handleChanges = (select, name) => {
    const mappedData = select.map((ele) => ele?.value);
    console.log(mappedData);
    setSelectedCenter({ ...selectedCenter, [name]: mappedData });
  };

  const handleSave = () => {
    if (
      selectedCenter?.CentreID === "" &&
      selectedCenter?.Data.length === 0 &&
      selectedCenter?.EmployeeID === ""
    ) {
      toast.error("All feilds are required to save");
    } else if (selectedCenter?.CentreID === "") {
      toast.error("Please select a center");
    } else if (selectedCenter?.Data.length === 0) {
      toast.error("Please select an access center");
    } else if (selectedCenter?.EmployeeID === "") {
      toast.error("Please select an Employee");
    } else {
      axiosInstance
        .post("CentreAccess/saveCentreAccess", selectedCenter)
        .then((res) => {
          window.location.reload();
          toast.success("Saved Successfully");
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong");
        });
    }
  };

  const handleRemove = (id) => {
    const payLoad = {
      CentreID: selectedCenter.CentreID,
      Data: [
        {
          dataCentreAccess: id?.dataCentreAccess,
          isActive: "0",
          EmployeeID: id?.EmployeeID,
        },
      ],
    };
    axiosInstance
      .post("CentreAccess/DeleteCentreAccess", payLoad)
      .then((res) => {
        window.location.reload();
        toast.success("Deleted successfully");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      });
  };

  const handleRemoveAll = () => {
    const mappedData = centerTable.map((ele) => {
      return {
        dataCentreAccess: ele.dataCentreAccess,
        isActive: "0",
        EmployeeID: ele?.EmployeeID,
      };
    });
    const payLoad = {
      CentreID: selectedCenter.CentreID,
      Data: mappedData,
    };
    console.log(payLoad);
    axiosInstance
      .post("CentreAccess/DeleteCentreAccess", payLoad)
      .then((res) => {
        window.location.reload();
        toast.success("All Center Deleted successfully");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      });
  };

  const getData = (id) => {
    axiosInstance
      .post("CentreAccess/GetAccessData", {
        CentreID: id,
      })
      .then((res) => {
        if (res?.data?.success) {
          const data = res?.data?.message;
          setCenterTable(data);
        } else {
          setCenterTable([]);
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      });
  };
  const handleSelectChange = (event) => {
    const { name, value, checked, type } = event?.target;
    setSelectedCenter({ ...selectedCenter, [name]: value });
    getData(value);
  };

  useEffect(() => {
    BindEmployeeReports(setEmployee);
  }, []);

  return (
    <>
      <PageHead name="Center Access Detail" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <SelectBox
                lable="Centre"
                id="Centre"
                name="CentreID"
                onChange={handleSelectChange}
                selectedValue={selectedCenter?.CentreID}
                options={[{ label: "Select Center", value: "" }, ...center]}
              />
            </div>

            <div className="col-sm-2">
              <SelectBoxWithCheckbox
                name="Data"
                placeholder=" "
                lable="Center Access"
                id="Center Access"
                options={allCenter}
                onChange={handleChanges}
              />
            </div>

            <div className="col-sm-2">
              <SelectBox
                lable="Employee"
                id="Employee"
                name="EmployeeID"
                onChange={handleSelectChange}
                selectedValue={selectedCenter?.EmployeeID}
                options={[{ label: "Select Employee", value: "" }, ...Employee]}
              />
            </div>
            <div className="col-sm-1 col-xs-12">
              <button
                type="button"
                className="btn btn-block btn-info btn-sm"
                onClick={handleSave}
              >
                {t("Save")}
              </button>
            </div>
          </div>{" "}
        </div>
      </PageHead>

      <div className="card">
        <Table>
          <thead
            className="cf text-center"
            style={{ position: "sticky", top: 0 }}
          >
            <tr>
              <th className="text-center">{t("S. No.")}</th>
              <th className="text-center">{t("Center")}</th>
              <th className="text-center">{t("Access Center")}</th>
              <th className="text-center">{t("Employee Name")}</th>
              <th className="text-center">
                <button
                  className="btn  btn-info btn-sm w-5"
                  onClick={handleRemoveAll}
                >
                  {t("Remove")}
                </button>{" "}
              </th>
            </tr>
          </thead>

          <tbody>
            {centerTable &&
              centerTable.map((ele, index) => (
                <>
                  <tr key={index}>
                    <td data-title="S.No." className="text-center">
                      {index + 1}
                    </td>
                    <td data-title="Center" className="text-center">
                      {ele.Centre}&nbsp;
                    </td>
                    <td data-title="Access Center" className="text-center">
                      {ele.dataCentreAccessName}&nbsp;
                    </td>
                    <td data-title="Access Center" className="text-center">
                      {ele.Name}&nbsp;
                    </td>
                    <td data-title="Remove" className="text-center">
                      <button
                        className="btn  btn-danger btn-sm w-4"
                        onClick={() => handleRemove(ele)}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                </>
              ))}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default CenterAccess;
