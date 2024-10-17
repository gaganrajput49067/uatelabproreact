import React from "react";
import { useEffect } from "react";
import { useState } from "react";

import * as XLSX from "xlsx";
import ExportFile from "../../components/CommonComponent/ExportFile";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import PageHead from "../../components/CommonComponent/PageHead";
import Input from "../../components/CommonComponent/Input";
import { useTranslation } from "react-i18next";
import Loading from "../../components/Loading/Loading";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import Table from "../../components/Table/Table";

function ImportExportExcel() {
  const [CentreId, setCentreId] = useState([]);
  const [ExportExcel, setExportExcel] = useState([]);
  const [show, setShow] = useState(false);
  const [ExcelPreview, setExcelPreview] = useState({
    header: [],
    body: [],
    exportJSON: [],
  });
  const [load, setLoad] = useState(false);

  const [payload, setPayload] = useState({
    CentreId: "",
    ImportExportData: "",
  });
  const { t } = useTranslation();
  const options = [
    {
      label: "RateList",
      value: "RateList",
    },
    {
      label: "DoctorReferal",
      value: "DoctorReferal",
    },
    {
      label: "Ratetypeshare",
      value: "Ratetypeshare",
    },
  ];

  const uploadFile = (event) => {
    if (payload?.CentreId && payload?.ImportExportData) {
      let fileObj = event.target.files[0];

      var reader = new FileReader();

      reader.readAsArrayBuffer(fileObj);

      reader.onload = () => {
        // Make a fileInfo Object
        var data = new Uint8Array(reader.result);
        var work_book = XLSX.read(data, { type: "array" });
        var sheet_name = work_book.SheetNames;
        var exportJSON = XLSX.utils.sheet_to_json(
          work_book.Sheets[sheet_name[0]]
        );
        var sheet_data = XLSX.utils.sheet_to_json(
          work_book.Sheets[sheet_name[0]],
          {
            header: 1,
          }
        );
        setExcelPreview({
          ...ExcelPreview,
          header: sheet_data[0],
          body: sheet_data.slice(1, sheet_data.length),
          exportJSON: exportJSON,
        });
      };
    } else {
      toast.error("Please Select Center And Import Method");
      document.getElementById("file").value = "";
    }
  };

  const handleSaveToDatabase = (url) => {
    setLoad(true);
    axiosInstance
      .post(url, ExcelPreview?.exportJSON)
      .then((res) => {
        if (res?.data?.success) {
          toast.success(res?.data?.message);
          setPayload({
            CentreId: "",
            ImportExportData: "",
          });
          document.getElementById("file").value = "";
          setExportExcel([]);
          setExcelPreview({ header: [], body: [], exportJSON: [] });
        } else {
          toast.error(res?.data?.message);
        }
        setLoad(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Found"
        );
        setLoad(false);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value, ItemValue: "" });
    document.getElementById("file").value = "";
  };

  useEffect(() => {
    if (payload?.CentreId && payload?.ImportExportData) fetch();
  }, [payload]);

  const fetch = () => {
    axiosInstance
      .post("CommonController/DownloadRateList", payload)
      .then((res) => {
        setExportExcel(res?.data?.message);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };

  const APiURL = (type) => {
    console.log(type);
    switch (type) {
      case "RateList":
        return "/CommonController/SaveReferalListExcelToDataBase";
        break;
      case "DoctorReferal":
        return "/CommonController/SaveDoctorReferalExcelToDataBase";
        break;
      case "Ratetypeshare":
        return "/CommonController/SaveRateTypeShare";
        break;
      default:
        break;
    }
  };

  const getRateCenters = (state) => {
    axiosInstance
      .get("/centre/getRateList")
      .then((res) => {
        let data = res.data.message;

        let CentreDataValue = data.map((ele) => {
          return {
            value: ele.CentreID,
            label: ele.Centre,
          };
        });

        state(CentreDataValue);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getRateCenters(setCentreId);
  }, []);

  return (
    <>
      <PageHead name="ImportExportExcel" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <SelectBox
                options={[{ label: "Select", value: "" }, ...options]}
                id="SelectType"
                lable="Select Type"
                name="ImportExportData"
                value={payload?.ImportExportData}
                onChange={handleChange}
              ></SelectBox>
            </div>

            <div className="col-sm-2">
              <SelectBox
                options={[{ label: "Select Centre", value: "" }, ...CentreId]}
                name="CentreId"
                id="CentreID"
                lable="CentreID"
                value={payload?.CentreId}
                onChange={handleChange}
              ></SelectBox>
            </div>

            <div className="col-sm-3">
              <Input
                type="file"
                className="form-control-file"
                onChange={uploadFile}
                id="file"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-2">
              <ExportFile dataExcel={ExportExcel} />
            </div>
            <div className="col-sm-2">
              <button
                className="btn btn-block btn-success btn-sm"
                onClick={() => {
                  setShow(true);
                }}
                disabled={
                  document.getElementById("file")?.value === "" ? true : false
                }
              >
                {t("Upload")}
              </button>
            </div>
            <div className="col-sm-2">
              {load ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-block btn-success btn-sm"
                  onClick={() =>
                    handleSaveToDatabase(APiURL(payload?.ImportExportData))
                  }
                  disabled={
                    ExcelPreview?.exportJSON?.length === 0 ? true : false
                  }
                >
                  {t("Save To Database")}
                </button>
              )}
            </div>
          </div>
        </div>
        {show && (
          <div className=" card">
            <Table>
              <thead>
                <tr>
                  {ExcelPreview?.header?.map((ele, index) => (
                    <th key={index}>{ele}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ExcelPreview?.body?.map((ele, index) => (
                  <tr key={index}>
                    {ele?.map((data, ind) => (
                      <td data-title={ele} key={ind}>
                        {data} &nbsp;
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </PageHead>
    </>
  );
}
export default ImportExportExcel;
