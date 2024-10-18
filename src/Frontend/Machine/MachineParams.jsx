import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import PageHead from "../../components/CommonComponent/PageHead";
import Loading from "../../components/Loading/Loading";
import Table from "../../components/Table/Table";
import MachineParamModal from "../utils/MachineParamModal";
import Input from "../../components/CommonComponent/Input";
import ReactSelect from "../../components/CommonComponent/ReactSelect";

const MachineParams = () => {
  const [Machine, setMachine] = useState([]);
  const [machineIdLoad, setmachineIdLoad] = useState(false);
  const [loadTableData, setLoadTableData] = useState(-1);
  const [loadFieldValue, setLoadFieldValue] = useState(-1);
  const [loadDelete, setLoadDelete] = useState(-1);
  const [show, setShow] = useState({
    modal: false,
    type: "Add",
  });
  const [FieldValue, setFieldValue] = useState({
    Machine_ParamID: "",
    LabObservation_ID: "",
  });
  const [active, setActive] = useState({});
  const [getTestBind, setGetTestBind] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [LabTableData, setLabTableData] = useState([]);
  const { t, i18n } = useTranslation();
  const getMachine = () => {
    setmachineIdLoad(true);
    axiosInstance
      .get("MachineGroup/getMachineName")
      .then((res) => {
        let data = res.data.message;
        let Machine = data.map((ele) => {
          return {
            value: ele.MachineID,
            label: ele.Machinename,
          };
        });
        setmachineIdLoad(false);
        setMachine(Machine);
      })
      .catch((err) => {
        setmachineIdLoad(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const getTestData = () => {
    axiosInstance
      .get("MachineGroup/getMachineinfo")
      .then((res) => {
        let data = res?.data?.message;
        let Test = data?.map((ele) => {
          return {
            value: ele?.LabObservation_ID,
            label: ele?.Name,
          };
        });
        setGetTestBind(Test);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const handleClick = (e) => {
    const { value } = e.target;
    setFieldValue({ ...FieldValue, LabObservation_ID: value });
  };
  console.log(tableData, active);
  const onclickmachinedata = (id, setBlank) => {
    setActive({ ...id, isId: true });
    console.log(id);
    setLoadTableData(id?.value);
    axiosInstance
      .post("MachineGroup/onclickmachinedata", {
        MachineId: id?.value,
      })
      .then((res) => {
        setTableData(res?.data?.message);
        if (!setBlank) {
          setFieldValue({
            Machine_ParamID: "",
            LabObservation_ID: "",
          });
        }
        setLoadTableData(-1);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        setLoadTableData(-1);
      });
  };

  const bindlabobservationdata = (id, ele) => {
    console.log(ele);
    setFieldValue({
      ...FieldValue,
      Machine_ParamID: id,
      RoundUpTo: ele?.RoundUpTo,
      Decimalcalc: ele?.Decimalcalc,
      IsRound: ele?.IsRound,
      IsOrderable: ele?.IsOrderable,
    });
    setLoadFieldValue(id);
    axiosInstance
      .post("MachineGroup/bindlabobservationdata", {
        Machine_ParamID: id,
      })
      .then((res) => {
        setLabTableData(res?.data?.message);
        console.log(res?.data?.message);
        setLoadFieldValue(-1);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const SaveObservationData = () => {
    axiosInstance
      .post("MachineGroup/SaveObservationData", FieldValue)
      .then((res) => {
        toast.success(res?.data?.message);
        bindlabobservationdata(FieldValue?.Machine_ParamID);
        setFieldValue({ ...FieldValue, LabObservation_ID: "" });
        onclickmachinedata(active, true);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const DeleteLabobservationData = (id) => {
    setLoadDelete(id?.LabObservation_ID);
    axiosInstance
      .post("MachineGroup/DeleteLabobservationData", {
        LabObservation_ID: id?.LabObservation_ID,
        Machine_ParamID: FieldValue?.Machine_ParamID,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        setLoadDelete(-1);
        bindlabobservationdata(FieldValue?.Machine_ParamID);
        onclickmachinedata(active, true);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        setLoadDelete(-1);
      });
  };

  useEffect(() => {
    getMachine();
    getTestData();
  }, []);
  return (
    <>
      {show?.modal && (
        <MachineParamModal
          show={show?.modal}
          data={{
            Machineparam: active?.value,
            Machine_ParamID:
              show?.type === "Add" ? "" : FieldValue?.Machine_ParamID,
            ID: active?.value,
            Decimalcalc: FieldValue?.Decimalcalc,
            RoundUpTo: FieldValue?.RoundUpTo,
            isEnable: show?.type == "Add" ? false : true,
            isId: active?.isId,
            IsRound: FieldValue?.IsRound,
            IsOrderable: FieldValue?.IsOrderable,
          }}
          active={active}
          onclickmachinedata={onclickmachinedata}
          bindlabobservationdata={bindlabobservationdata}
          handleClose={() =>
            setShow({
              modal: false,
              type: "",
            })
          }
        />
      )}
      <PageHead name={t("Machine Param")} showDrop="true">
        <div className="card">
          <div className="row">
            {machineIdLoad ? (
              <Loading />
            ) : (
              <div className="col-sm-3">
                <Table>
                  <thead className="cf">
                    <tr className="bg-primary">
                      <th>{t("Machine ID")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Machine.map((ele, index) => (
                      <tr
                        key={index}
                        className={`${
                          active?.value === ele?.value && "bg-success"
                        }`}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          onclickmachinedata(ele);
                        }}
                      >
                        <td data-title={t("Machine ID")}>
                          {loadTableData === ele?.value ? (
                            <Loading />
                          ) : (
                            ele?.label
                          )}
                        </td>
                      </tr>
                    ))}
                    <tr></tr>
                  </tbody>
                </Table>
              </div>
            )}

            <div className="col-sm-9">
              {tableData?.length > 0 && (
                <div className="card">
                  <div className="row">
                    <Table>
                      <thead className="cf">
                        <tr>
                          {[
                            t("Machine_ParamID"),
                            t("MACHINEID"),
                            t("Machine_Param"),
                            t("AssayNo"),
                            t("RoundUpTo"),
                            t("IsOrderable"),
                            t("Decimalcalc"),
                            t("Test"),
                          ].map((ele, index) => (
                            <th key={index}>{ele}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tableData?.map((ele, index) => (
                          <tr key={index}>
                            <td
                              data-title={t("Machine_ParamID")}
                              className="text-info"
                              style={{
                                cursor: "pointer",
                                textDecoration: "underline",
                              }}
                              onClick={() => {
                                bindlabobservationdata(
                                  ele?.Machine_ParamID,
                                  ele
                                );
                              }}
                            >
                              {loadFieldValue === ele?.Machine_ParamID ? (
                                <Loading />
                              ) : (
                                ele?.Machine_ParamID
                              )}
                            </td>
                            <td data-title={t("MACHINEID")}>
                              {ele?.MACHINEID}&nbsp;
                            </td>
                            <td data-title={t("Machine_Param")}>
                              {ele?.MachineParam}&nbsp;
                            </td>
                            <td data-title={t("AssayNo")}>
                              {ele?.AssayNo}&nbsp;
                            </td>
                            <td data-title={t("RoundUpTo")}>
                              {ele?.RoundUpTo}&nbsp;
                            </td>
                            <td data-title={t("IsOrderable")}>
                              {ele?.IsOrderable}&nbsp;
                            </td>
                            <td data-title={t("Decimalcalc")}>
                              {ele?.Decimalcalc}&nbsp;
                            </td>
                            <td data-title={t("Test")}>
                              {ele?.Test ? ele?.Test : "-"}&nbsp;
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <div className="col-sm-2">
                      {FieldValue?.Machine_ParamID && (
                        <button
                          className="btn btn-block btn-success btn-sm"
                          onClick={() => {
                            setShow({
                              modal: true,
                              type: "Modify",
                            });
                          }}
                        >
                          {t("Modify Param")}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className="row mt-2">
                <div className="col-sm-2">
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => {
                      setShow({
                        modal: true,
                        type: "Add",
                      });
                    }}
                  >
                    {t("Add Param")}
                  </button>
                </div>
              </div>
              {FieldValue?.Machine_ParamID && (
                <div className="box form-horizontal">
                  <div className="row mt-4">
                    <h3 className="card-header">{t("Param Mapping")}</h3>
                  </div>

                  <div className="box-body">
                    <div className="row">
                      <div className="col-sm-2 col-md-2">
                        <Input
                          type="text"
                          className="form-control input-sm"
                          value={FieldValue?.Machine_ParamID}
                        />
                      </div>

                      <div className="col-sm-4 col-md-4">
                        <ReactSelect
                          dynamicOptions={getTestBind}
                          value={FieldValue?.LabObservation_ID}
                          onChange={(selectedOption) => {
                            setFieldValue({
                              ...FieldValue,
                              LabObservation_ID: selectedOption?.value,
                            });
                          }}
                        />
                      </div>

                      <div
                        className="box-body table-responsive divResult boottable"
                        id="no-more-tables"
                      >
                        <div className="row">
                          <div className="col-sm-12">
                            <Table                            >
                              <thead className="cf">
                                <tr>
                                  {[t("LabObservation_ID"), t("Test Name")].map(
                                    (ele, index) => (
                                      <th key={index}>{ele}</th>
                                    )
                                  )}
                                </tr>
                              </thead>
                              <tbody>
                                {LabTableData?.map((ele, index) => (
                                  <tr key={index}>
                                    <td
                                      data-title={t("LabObservation_ID")}
                                      className="text-info"
                                      style={{
                                        cursor: "pointer",
                                        textDecoration: "underline",
                                      }}
                                      onClick={() => {
                                        if (
                                          window.confirm(
                                            "Are you sure you wish to delete this item?"
                                          )
                                        )
                                          DeleteLabobservationData(ele);
                                      }}
                                    >
                                      {loadDelete === ele?.LabObservation_ID ? (
                                        <Loading />
                                      ) : (
                                        ele?.LabObservation_ID
                                      )}
                                    </td>
                                    <td data-title={t("Test Name")}>
                                      {ele?.NAME}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="col-sm-1">
                          <button
                            className="btn btn-block btn-success btn-sm"
                            onClick={SaveObservationData}
                          >
                            {t("Add")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </PageHead>
    </>
  );
};

export default MachineParams;
