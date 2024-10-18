import React, { useState } from "react";
import Modal from "../../components/Modal/Modal";
import { useTranslation } from "react-i18next";
import Input from "../../components/CommonComponent/Input";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import Table from "../../components/Table/Table";
import { RoundUpTo } from "../../utils/Constants";
import { axiosInstance } from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const MachineParamModal = ({
  show,
  handleClose,
  data,
  active,
  onclickmachinedata,
  bindlabobservationdata,
}) => {
  console.log(data, active);
  const [payload, setPayload] = useState({
    Machine_ParamID: data?.Machine_ParamID ? data?.Machine_ParamID : "",
    MACHINEID: data?.Machineparam ?? "",
    MachineParam: "",
    Suffix: "",
    AssayNo: "",
    RoundUpTo: (data?.RoundUpTo ?? 0).toString(),
    IsOrderable: data?.IsOrderable == "FALSE" ? 0 : 1,
    Decimalcalc: data?.Decimalcalc ?? "",
    IsRound: data?.IsRound == "1" ? 1 : 0,
  });

  const { t, i18n } = useTranslation();
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setPayload({
      ...payload,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleSubmit = (url) => {
    axiosInstance
      .post(url, payload)
      .then((res) => {
        toast.success(res?.data?.message);
        onclickmachinedata(active, true);
        bindlabobservationdata(data?.Machine_ParamID);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };
  return (
    <>
      <Modal
        title={t("Machine Param Basic Information")}
        handleClose={() => {
          handleClose();
        }}
      >
        <div className="card" style={{ width: "500px" }}>
          <Table>
            <tbody>
              <tr>
                <td className="py-2">
                  <label for="usr">{t("MachineID")}:</label>
                </td>
                <td className="py-2">
                  <Input
                    name="MACHINEID"
                    id="MACHINEID"
                    type="text"
                    onChange={handleChange}
                    className="select-input-box form-control input-sm"
                    readonly="readonly"
                    disabled={data?.isId ? true : false}
                    value={payload?.MACHINEID}
                  />
                </td>
              </tr>
              <tr>
                <td className="py-2">
                  <label for="usr">{t("Machine_ParamID")}:</label>
                </td>
                <td className="py-2">
                  <Input
                    name="Machine_ParamID"
                    type="text"
                    onChange={handleChange}
                    className="select-input-box form-control input-sm"
                    disabled={data?.isEnable ? true : false}
                    value={payload?.Machine_ParamID}
                    readonly={payload?.Machine_ParamID ? true : false}
                  />
                </td>
              </tr>
              <tr>
                <td className="py-2">
                  <label for="usr">{t("Param Alias")}:</label>
                </td>
                <td className="py-2">
                  <Input
                    name="MachineParam"
                    type="text"
                    value={payload?.MachineParam}
                    onChange={handleChange}
                    className="select-input-box form-control input-sm"
                  />
                </td>
              </tr>
              <tr>
                <td className="py-2">
                  <label for="usr">{t("Suffix")}:</label>
                </td>
                <td className="py-2">
                  <Input
                    name="Suffix"
                    type="text"
                    value={payload?.Suffix}
                    onChange={handleChange}
                    className="select-input-box form-control input-sm"
                  />
                </td>
              </tr>
              <tr>
                <td className="py-2">
                  <label for="usr">{t("Assay No")}:</label>
                </td>
                <td className="py-2">
                  <Input
                    name="AssayNo"
                    type="text"
                    value={payload?.AssayNo}
                    onChange={handleChange}
                    className="select-input-box form-control input-sm"
                  />
                </td>
              </tr>

              <tr>
                <td className="py-2">
                  <label for="usr">{t("isOrderable")}:</label>
                </td>
                <td className="py-2">
                  <Input
                    name="IsOrderable"
                    type="checkbox"
                    checked={payload?.IsOrderable}
                    onChange={handleChange}
                  />
                </td>
              </tr>

              <tr>
                <td className="py-2">
                  <label for="usr">{t("Multiple")}:</label>
                </td>
                <td className="py-2">
                  <Input
                    name="Decimalcalc"
                    type="text"
                    onChange={handleChange}
                    className="select-input-box form-control input-sm"
                    value={payload?.Decimalcalc}
                  />
                </td>
              </tr>
              <tr>
                <td className="py-2">
                  <label for="usr">{t("RoundUpTo")}:</label>
                </td>
                <td className="py-2">
                  <SelectBox
                    name="RoundUpTo"
                    options={RoundUpTo}
                    onChange={handleChange}
                    className="select-input-box form-control input-sm"
                    selectedValue={payload?.RoundUpTo}
                  />
                </td>
              </tr>
              <tr>
                <td className="py-2">
                  <label for="usr">{t("IsRound")}:</label>
                </td>
                <td className="py-2">
                  <Input
                    name="IsRound"
                    type="checkbox"
                    checked={payload?.IsRound}
                    onChange={handleChange}
                  />
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
        <div className="box-footer">
          <div className="row">
            {data?.Machine_ParamID ? (
              <div className="col-sm-3">
                <button
                  className="btn  btn-primary btn-sm"
                  onClick={() =>
                    handleSubmit("MachineGroup/UpdateParam")
                  }
                >
                  {t("Update & Close")}
                </button>
              </div>
            ) : (
              <div className="col-sm-3">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleSubmit("MachineGroup/AddParam")}
                >
                  {t("Set & Close")}
                </button>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MachineParamModal;
