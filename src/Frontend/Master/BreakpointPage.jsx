import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import PageHead from "../../components/CommonComponent/PageHead";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import Loading from "../../components/Loading/Loading";
import Table from "../../components/Table/Table";
import Input from "../../components/CommonComponent/Input";
import { isChecked } from "../util/Commonservices";

const BreakpointPage = () => {
  const [options, setOptions] = useState([]);
  const [tabledata, setTableData] = useState([]);
  const [payload, setPayload] = useState({
    GroupID: "2",
  });
  const [load, setLoad] = useState(false);
  const [load2, setLoad2] = useState(false);
  const { t } = useTranslation();

  //State for input type text

  // API DROPDOWN BINDING START
  const BindCentre = () => {
    axiosInstance
      .post("CommonController/BindOrganism", {
        TypeID: 2,
      })
      .then((res) => {
        if (res?.data?.success) {
          let data = res?.data?.message;
          let Organisum = data.map((ele) => {
            return {
              value: ele.organismid,
              label: ele.organismname,
            };
          });
          Organisum.unshift({ label: "Organism", value: "0" });
          setOptions(Organisum);
        } else {
          setOptions([]);
          toast.error(res?.data?.message);
        }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  // API DROPDOWN BINDING END

  const handleCheckbox = (e) => {
    const { checked } = e.target;
    const data = tabledata?.map((ele) => {
      return {
        ...ele,
        isActive: checked ? "1" : "0",
      };
    });
    setTableData(data);
  };

  const handleCollection = (e, index) => {
    const { name, checked, type, value } = e.target;
    const datas = [...tabledata];
    datas[index][name] = type === "checkbox" ? (checked ? "1" : "0") : value;
    setTableData(datas);

    //  if the "breakpoint" input field is empty
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  useEffect(() => {
    BindCentre();
  }, []);

  // TABLE API BINDING START

  const handleSearch = () => {
    setLoad(true);
    axiosInstance
      .post("BreakPoint/GetAntibioticList", payload)
      .then((res) => {
        if (res?.data?.success) {
          let tablemap = res?.data?.message;
          let data = tablemap?.map((ele) => {
            return {
              ...ele,
              isActive: "0",
            };
          });
          setTableData(data);
        } else {
          toast.error(res?.data?.message);
          setTableData([]);
        }
        setLoad(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Data Can not found"
        );
        setLoad(false);
      });
  };

  // TABLE API BINDING END

  // Save Button API Start

  const handleSave = () => {
    const data = tabledata.filter((ele) => ele.isActive === "1");
    if (data?.length > 0) {
      setLoad2(true);
      // Check if the "breakpoint" input field is empty
      const isInputEmpty = data.some((item) => item.breakpoint.trim() === "");
      if (isInputEmpty) {
        toast.error("Please enter value in the Breakpoint field");
        setLoad2(false);
        return;
      }

      axiosInstance
        .post("BreakPoint/SaveBreakPoint", {
          BreakPointData: data,
        })
        .then((res) => {
          toast.success(res.data?.message);
          setLoad2(false);
          handleSearch();
        })
        .catch((err) => {
          toast.error(
            err?.data?.message ? err?.data?.message : "Error Occured"
          );
          setLoad2(false);
        });
    } else {
      toast.error("please Choose One Value");
    }
  };
  return (
    <>
      <PageHead name={t("Break Point Page")} showDrop="true">
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <SelectBox
                name={"GroupID"}
                id="GroupID"
                placeholder=""
                options={options}
                selectedValue={payload?.GroupID}
                onChange={handleChange}
                lable={t("Organism")}
              />
            </div>
            <div className="col-sm-2">
              {load ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-primary btn-sm btn-block"
                  onClick={handleSearch}
                >
                  {t("Search BreakPoint")}
                </button>
              )}
            </div>
          </div>
        </div>
      </PageHead>
      {tabledata.length > 0 && (
        <div className="card">
          <Table>
            <thead className="cf">
              <tr>
                <th>{t("Sr.No")}</th>
                <th>{t("Antibiotic Name")}</th>
                <th>{t("BreakPoint")} </th>
                <th>
                  <input
                    type="checkbox"
                    checked={
                      tabledata.length > 0
                        ? isChecked("isActive", tabledata, "1").includes(false)
                          ? false
                          : true
                        : false
                    }
                    onChange={handleCheckbox}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {tabledata?.map((item, index) => (
                <>
                  <tr key={index}>
                    <td data-title={t("Sr.No")}>{index + 1}&nbsp;</td>
                    <td data-title={t("Aniboitic Name")}>{item?.name}&nbsp;</td>
                    <td data-title={t("BreakPoint")}>
                      {/* user can enter value in input */}
                      <Input
                        className="select-input-box form-control input-sm"
                        // className={` form-control input-sm ${isInputEmpty ? 'is-invalid' : ''}`}
                        value={item?.breakpoint}
                        type="text"
                        name="breakpoint"
                        onChange={(e) => handleCollection(e, index)}
                      />
                    </td>
                    <td data-title="Status">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={item?.isActive === "1" ? true : false}
                        onChange={(e) => handleCollection(e, index)}
                      />
                    </td>
                  </tr>
                  {/* Save button start */}
                </>
              ))}
              {/* Save button End */}
            </tbody>
          </Table>
          {isChecked("isActive", tabledata, "1").includes(true) && (
            <>
              {/* Loading Start */}

              {load2 ? (
                <Loading />
              ) : (
                <div className="row">
                  <div className="col-sm-2" style={{ marginTop: "5px" }}>
                    <button
                      className="btn btn-success btn-sm btn-block ml-5"
                      onClick={handleSave}
                    >
                      {t("Save")}
                    </button>
                  </div>
                </div>
              )}

              {/* Loading End */}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default BreakpointPage;
