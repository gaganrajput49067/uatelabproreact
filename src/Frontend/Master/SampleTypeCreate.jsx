import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PageHead from "../../components/CommonComponent/PageHead";
import Input from "../../components/CommonComponent/Input";
import { axiosInstance } from "../../utils/axiosInstance";
import { validationForSampleType } from "../../utils/Schema";
import { getTrimmedData } from "../../utils/helpers";
import { toast } from "react-toastify";
import Table from "../../components/Table/Table";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import Loading from "../../components/Loading/Loading";

const SampleTypeCreate = () => {
  const [data, setData] = useState([]);
  const [Color, setColor] = useState([]);
  const [load, setLoad] = useState(false);
  const [err, setErr] = useState({});
  const [formData, setFormData] = useState({
    SampleName: "",
    Container: "",
    ColorName: "red",
    isActive: 1,
  });
  const { t } = useTranslation();

  const getDropDownData = (name) => {
    axiosInstance
      .post("Global/getGlobalData", { Type: name })
      .then((res) => {
        let data = res.data.message;
        let value = data.map((ele) => {
          return {
            value: ele.FieldDisplay,
            label: ele.FieldDisplay,
          };
        });

        switch (name) {
          case "Color":
            setColor(value);
            break;
        }
      })
      .catch((err) => console.log(err));
  };
  const handleSearch = () => {
    setLoad(true);
    axiosInstance
      .get("SampleType/getSampleType")
      .then((res) => {
        setData(res.data.message);

        setLoad(false);
      })
      .catch((err) => {
        setLoad(false);
        console.log(err);
      });
  };
  const postData = (url) => {
    let generatedError = validationForSampleType(formData);
    if (generatedError === "") {
      setLoad(true);
      axiosInstance
        .post(url, getTrimmedData({ ...formData, id: formData?.id ?? "" }))
        .then((res) => {
          setFormData({
            SampleName: "",
            Container: "",
            ColorName: "red",
            isActive: 0,
          });
          toast.success(res?.data?.message);
          handleSearch();
          setErr({});
          setLoad(false);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
          setLoad(false);
        });
    } else {
      setErr(generatedError);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(type);
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    handleSearch();
    getDropDownData("Color");
  }, []);

  const handleEdit = (data) => {
    console.log(data);
    setFormData({
      SampleName: data?.SampleName,
      Container: data?.Container,
      ColorName: data?.ColorName,
      isActive: data?.isActive,
      id: data?.id,
    });
  };
  return (
    <>
      <PageHead name="SampleTypeCreate" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <Input
                type="text"
                lable="Sample Name"
                id="SampleName"
                name="SampleName"
                placeholder=" "
                max={50}
                onChange={handleChange}
                value={formData?.SampleName}
              />
              {formData?.SampleName?.trim() === "" && (
                <span className="error-message">{err?.SampleName}</span>
              )}
            </div>
            <div className="col-sm-2">
              <Input
                type="text"
                lable="Container"
                id="Container"
                name="Container"
                placeholder=" "
                max={15}
                onChange={handleChange}
                value={formData?.Container}
              />
              {formData?.Container?.trim() === "" && (
                <span className="error-message">{err?.Container}</span>
              )}
            </div>

            <div className="col-sm-2">
              <SelectBox
                options={Color}
                name="ColorName"
                id="ColorName"
                lable="Color"
                selectedValue={formData?.ColorName}
                onChange={handleSelectChange}
              />
            </div>
            <div className="col-sm-1">
              <input
                name="isActive"
                type="checkbox"
                className="mb-3"
                checked={formData?.isActive}
                onChange={handleChange}
              />
              <label htmlFor="isActive" className="ml-2">
                {t("Active")}
              </label>
              &nbsp;
            </div>

            <div className="col-sm-1">
              <button
                type="button"
                className={`btn ${
                  formData?.id ? "btn-warning" : "btn-success"
                } btn-sm`}
                onClick={() =>
                  postData(
                    formData?.id
                      ? "SampleType/UpdateSampleType"
                      : "SampleType/SaveSampleType"
                  )
                }
              >
                {formData?.id ? t("Update") : t("Save")}
              </button>
            </div>
            <div className="col-sm-1">
              <button
                type="button"
                className="btn btn-block btn-danger btn-sm"
                id="Reset"
                title="Reset"
                onClick={() => {
                  setFormData({
                    SampleName: "",
                    Container: "",
                    ColorName: "red",
                    isActive: 0,
                  });
                  setErr({});
                }}
              >
                {t("Reset")}
              </button>
            </div>
          </div>
        </div>
        <div className="card">
          {load ? (
            <Loading />
          ) : (
            <Table>
              {" "}
              <thead className="cf">
                <tr>
                  <th>{t("S.No")}</th>
                  <th>{t("SampleName")}</th>
                  <th>{t("Container")}</th>
                  <th>{t("ColorName")}</th>
                  <th>{t("Active")}</th>
                  <th className="text-center">
                    <i class="fa fa-edit"></i>
                  </th>
                </tr>
              </thead>
              {data.map((data, i) => (
                <tbody>
                  <td data-title={t("S.No")}>{i + 1}&nbsp;</td>
                  <td data-title={t("SampleName")}>{data?.SampleName}&nbsp;</td>

                  <td data-title={t("Container")}>{data?.Container}&nbsp;</td>
                  <td data-title={t("ColorName")}>{data?.ColorName}&nbsp;</td>
                  <td data-title={t("IsActive")}>
                    {data?.isActive == 1 ? "Active" : "InActive"}&nbsp;
                  </td>
                  <td data-title="Select" className="text-center">
                    <button
                      className="btn btn-primary btn-sm btn-class"
                      onClick={() => {
                        handleEdit(data);
                      }}
                    >
                      <i class="fa fa-edit"></i>
                    </button>
                  </td>
                </tbody>
              ))}
            </Table>
          )}
        </div>
      </PageHead>
    </>
  );
};

export default SampleTypeCreate;
