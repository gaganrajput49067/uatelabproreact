import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  Active,
  ActiveTemplateID,
  DDLData,
  Dynamic,
  DynamicReportType,
  FontFamily,
  LableID,
  PageOrientation,
  PageSize,
  ReportType,
  TypePlaceHolder,
} from "../../utils/Constants";
import Input from "../../components/CommonComponent/Input";
import { number } from "../../utils/helpers";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
import { getBase64 } from "../../utils/helpers";
import { isChecked } from "../util/Commonservices";
import Loading from "../../components/Loading/Loading";
// import SeeImage from "../../Frontend/util/SeeImage";
// import SeeText from "../../Frontend/util/SeeText";
import { useTranslation } from "react-i18next";
import { axiosInstance, axiosReport } from "../../utils/axiosInstance";
import Table from "../../components/Table/Table";
import TableSelectBox from "../../components/TableComponent/TableSelectBox";
import PageHead from "../../components/CommonComponent/PageHead";
function ReportBill() {
  const [headerSetupData, setHeaderSetupData] = useState(LableID);

  const [Editable, setEditable] = useState(false);
  const [index, setIndex] = useState("");
  const [load, setLoad] = useState(false);
  const [ModalValue, SetModalValue] = useState({
    text: "",
    image: "",
  });
  const [template, setTemplate] = useState([]);
  const [DynamicField, setDynamicField] = useState(Dynamic);
  const [DynamicReport, setDynamicReport] = useState([]);
  const [show, setShow] = useState(false);
  const [documentId, setDocumentID] = useState("");
  const [showImage, setShowImage] = useState(false);
  const [id, setId] = useState("");
  const [activeTemplate, setActiveTemplate] = useState([]);
  const [PageSetup, setPageSetup] = useState({
    ActiveTemplateID: "",
    FooterHeight: "",
    HeaderHeight: "",
    MarginBottom: "",
    MarginLeft: "",
    MarginRight: "",
    MarginTop: "",
    PageOrientation: "",
    PageSize: "",
    ReportName: ReportType[1]?.value,
    ReportType: ReportType[1]?.value,
    ReportTypeId: "1",
    TemplateID: "",
    TemplateName: "",
  });

  const handleShow = () => {
    setShow(false);
  };

  const handleShowImage = () => {
    setShowImage(false);
  };
  const { t } = useTranslation();

  const handleChange = (event) => {
    const { name, value, selectedIndex } = event?.target;
    const label = event?.target?.children[selectedIndex]?.text;
    const commonProperties = {
      ...PageSetup,
      [name]: label,
    };

    switch (name) {
      case "ReportType":
        switch (label) {
          case "Lab Report":
            getTemplateType("2", label);
            break;
          case "Bill":
            getTemplateType("1", label);
            break;
          case "TRF":
            getTemplateType("3", label);
            break;
          case "Department Slip":
            getTemplateType("4", label);
            break;
          default:
            setPageSetup(commonProperties);
            break;
        }
        break;
      case "TemplateName":
        setPageSetup({
          ...commonProperties,
          TemplateID: value,
        });
        fetch(PageSetup?.ReportTypeId, value, label, PageSetup?.ReportType);
        break;
      default:
        setPageSetup({ ...PageSetup, [name]: value });
        break;
    }
  };

  const S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };

  const guidNumber = () => {
    const guidNumber =
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4();

    setDocumentID(guidNumber);
  };

  const handleSelectDynamic = (event) => {
    const { name, value } = event.target;
    setDynamicField({
      ...DynamicField,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    setLoad(true);
    const data = [...DynamicReport];
    axiosInstance
      .post("ReportMaster/UpdateReportSetting", {
        id: id,
        PageSetup: PageSetup,
        headerSetup: headerSetupData,
        DynamicReportData: data.map((ele) => {
          let data = ele?.fontSize;
          delete ele?.fontSize;
          return {
            ...ele,
            Text: ele?.Text + "#" + data,
          };
        }),
      })
      .then((res) => {
        setLoad(false);
        toast.success(res.data.message);
      })
      .catch((err) => {
        setLoad(false);
        console.log(err);
        toast.error(err.response.data.message);
      });
  };

  const handleHeader = (e, index) => {
    const { name, value, checked } = e.target;
    if (index >= 0) {
      const data = [...headerSetupData];
      data[index][name] = value ? value : checked ? 1 : 0;
      setHeaderSetupData(data);
    } else {
      const val = headerSetupData.map((ele) => {
        return {
          ...ele,
          [name]: value ? value : checked ? 1 : 0,
        };
      });
      setHeaderSetupData(val);
    }
  };

  const handleChangeDynamic = (e) => {
    const { name, value } = e.target;
    setDynamicField({ ...DynamicField, [name]: value });
  };

  const validationData = (fields) => {
    let valid = true;
    for (let i = 0; i < fields.length; i++) {
      if (["ImageData", "Text"].includes(fields[i])) {
      } else if (DynamicField[fields[i]] === "") {
        valid = false;
        break;
      }
    }
    return valid;
  };

  const handleAdd = (index) => {
    const data = Object.keys(DynamicField);
    const valid = validationData(data);
    if (valid) {
      if (index < 0 || index === "") {
        setDynamicReport([...DynamicReport, DynamicField]);
        setDynamicField(Dynamic);
      } else {
        const data = [...DynamicReport];
        data[index] = DynamicField;
        setDynamicReport(data);
        setDynamicField(Dynamic);
        setIndex("");
      }
    } else {
      toast.error("Please All Required Fields");
    }
  };

  const handleEdit = (data, index) => {
    setDynamicField({ ...data, IsActive: "1" });
    setIndex(index);
    window.scrollTo(0, 0);
  };

  const handleDelete = (index) => {
    const data = DynamicReport.filter((ele, ind) => ind !== index);
    setDynamicReport(data);
    toast.success("Successfully Deleted");
  };
  // console.log(id);
  const fetch = (val1, val2, labelTemp, labelReport) => {
    // debugger
    axiosInstance
      .post("ReportMaster/GetReportSettingData", {
        ReportTypeId: val1,
        TemplateID: val2,
      })
      .then((res) => {
        if (res?.data?.ActiveTemplate?.length > 0)
          setActiveTemplate(res?.data?.ActiveTemplate);
        else setActiveTemplate([]);

        if (res?.data?.message?.length > 0)
          setHeaderSetupData(
            JSON.parse(res?.data?.message[0]?.ReportConfiguration)?.headerSetup
          );
        else setHeaderSetupData(LableID);

        const data = JSON.parse(res?.data?.message[0]?.ReportConfiguration);

        const dynamicData = data?.DynamicReportData.map((ele, index) => {
          if (ele?.Text.includes("#")) {
            const finalText = ele?.Text.split("#");
            return {
              ...ele,
              Text: finalText[0],
              fontSize:
                finalText[finalText.length - 1] === "undefined"
                  ? 10
                  : finalText[finalText.length - 1],
            };
          } else {
            return {
              ...ele,
              Text: ele?.Text,
              fontSize: 10,
            };
          }
        });

        setDynamicReport(dynamicData);

        setPageSetup({
          // ...data?.PageSetup,
          ...PageSetup,
          ReportTypeId: val1,
          TemplateID: val2,
          TemplateName: labelTemp,
          ReportType: labelReport,
          ReportName: labelReport,
          ActiveTemplateID: data?.PageSetup?.ActiveTemplateID,
          FooterHeight: data?.PageSetup?.FooterHeight,
          HeaderHeight: data?.PageSetup?.HeaderHeight,
          MarginBottom: data?.PageSetup?.MarginBottom,
          MarginLeft: data?.PageSetup?.MarginLeft,
          MarginRight: data?.PageSetup?.MarginRight,
          MarginTop: data?.PageSetup?.MarginTop,
          PageOrientation: data?.PageSetup?.PageOrientation,
          PageSize: data?.PageSetup?.PageSize,
        });
        // setId(data?.id);
        console.log(res?.data?.message[0]?.id);
        setId(res?.data?.message[0]?.id);
      })
      .catch((err) => console.log(err));
  };

  const handleText = (data) => {
    setShow(true);
    SetModalValue({ ...ModalValue, text: data });
  };

  console.log(PageSetup);

  const handleUploadImage = (e) => {
    const { files, name } = e.target;
    const lengths = files[0].name.split(".");
    if (lengths[lengths.length - 1] === "png") {
      getBase64(files[0])
        .then((res) => {
          setDynamicField({ ...DynamicField, [name]: res.trim() });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      document.getElementById("ImageData").value = "";
      toast.error("Please Choose Png image");
    }
  };

  const handleImage = (data) => {
    setShowImage(true);
    SetModalValue({ ...ModalValue, image: data });
  };

  const handlePreviewURL = (id) => {
    return id == 1 ? "getReceiptDemo" : "commonReports/GetLabReportDemo";
  };

  const handlePreview = () => {
    console.log(handlePreviewURL(PageSetup?.ReportTypeId));
    axiosReport
      .post(handlePreviewURL(PageSetup?.ReportTypeId), {
        ReportTypeId: PageSetup?.ReportTypeId,
        TemplateID: PageSetup?.TemplateID,
      })

      .then((res) => {
        window.open(res?.data?.Url, "_blank");
      })

      .catch((err) => {
        console.log(err);
      });
  };

  const getTemplateType = (reportTypeId, reportName) => {
    axios
      .post("ReportMaster/BindTemplate", { ReportTypeId: reportTypeId })
      .then((res) => {
        let data = res?.data?.message;
        let templates = data?.map((ele) => {
          return {
            value: ele?.TemplateID,
            label: ele?.TemplateName,
          };
        });
        setPageSetup({
          ...PageSetup,
          TemplateID: templates[0]?.value,
          TemplateName: templates[0]?.label,
          ReportTypeId: reportTypeId,
          ReportName: reportName,
        });
        fetch(
          reportTypeId,
          templates[0]?.value,
          templates[0]?.label,
          reportName
        );
        setTemplate(templates);
      })
      .catch((err) =>
        toast.error(err?.res?.data ? err?.res?.data : "Something Went Wrong")
      );
  };
  useEffect(() => {
    guidNumber();
    getTemplateType("1", "Bill");
  }, []);

  return (
    <>
      {/* {ModalValue?.text && show && (
        <SeeText show={show} handleShow={handleShow} data={ModalValue?.text} />
      )}
      {ModalValue?.image && showImage && (
        <SeeImage
          show={showImage}
          handleShow={handleShowImage}
          data={ModalValue?.image}
        />
      )} */}
      <PageHead
        name={`Report Type Template Master ( ${
          activeTemplate?.length > 0
            ? activeTemplate[0]?.TemplateName + " Is Active"
            : "No Template Is Active )"
        }`}
        showDrop={"true"}
      >
        <div className="box-header with-border">
          <div className="row">
            <h3
              className="box-title col-sm-2"
              style={{
                color: activeTemplate?.length > 0 ? "green" : "red",
              }}
            ></h3>
          </div>
        </div>
        <div className="card">
          <div className="row">
            <div className="col-sm-2 ">
              <SelectBox
                lable="ReportType"
                id="ReportType"
                options={ReportType}
                name="ReportType"
                onChange={handleChange}
                selectedValue={PageSetup?.ReportType}
              />
            </div>

            <div className="col-sm-2">
              <SelectBox
                lable="Template"
                id="Template"
                name="TemplateName"
                options={template}
                onChange={handleChange}
                selectedValue={PageSetup?.TemplateID}
              />
            </div>

            <div className="col-sm-2">
              <SelectBox
                lable="ActiveTemplateID"
                id="ActiveTemplateID"
                options={ActiveTemplateID}
                name="ActiveTemplateID"
                selectedValue={PageSetup?.ActiveTemplateID}
                onChange={handleChange}
              />
            </div>

            <div className="col-sm-2">
              <Input
                name="TypeName"
                id="Report Name"
                lable="Report Name"
                placeholder=" "
                value={PageSetup?.ReportName}
                disabled
              />
            </div>
            <div className="col-sm-2">
              <SelectBox
                lable="PageSize"
                id="PageSize"
                name="PageSize"
                options={PageSize}
                selectedValue={PageSetup?.PageSize}
                onChange={handleChange}
              />
            </div>

            <div className="col-sm-2">
              <SelectBox
                lable="PageOrientation"
                id="PageOrientation"
                name="PageOrientation"
                options={PageOrientation}
                selectedValue={PageSetup?.PageOrientation}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-2">
              <Input
                name="MarginLeft"
                id="MarginLeft"
                lable="MarginLeft"
                placeholder=" "
                value={PageSetup?.MarginLeft}
                onChange={handleChange}
              />
            </div>

            <div className="col-sm-2">
              <Input
                name="MarginRight"
                id="MarginRight"
                lable="MarginRight"
                placeholder=" "
                value={PageSetup?.MarginRight}
                onChange={handleChange}
              />
            </div>
            <div className="col-sm-2">
              <Input
                name="MarginTop"
                id="MarginTop"
                lable="MarginTop"
                placeholder=" "
                value={PageSetup?.MarginTop}
                onChange={handleChange}
              />
            </div>

            <div className="col-sm-2">
              <Input
                name="MarginBottom"
                id="MarginBottom"
                lable="MarginBottom"
                placeholder=" "
                value={PageSetup?.MarginBottom}
                onChange={handleChange}
              />
            </div>
            <div className="col-sm-2">
              <Input
                name="HeaderHeight"
                id="HeaderHeight"
                lable="HeaderHeight"
                placeholder=" "
                value={PageSetup?.HeaderHeight}
                onChange={handleChange}
              />
            </div>

            <div className="col-sm-2">
              <Input
                name="FooterHeight"
                id="FooterHeight"
                lable="FooterHeight"
                placeholder=" "
                value={PageSetup?.FooterHeight}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div className="card">
          <Table>
            <thead className="cf">
              <tr>
                <th>{t("LabelID")}</th>
                <th>{t("LabelDetail")}</th>
                <th>{t("DetailXPosition")}</th>
                <th>{t("Top")}</th>
                <th>{t("Left")}</th>
                <th>
                  <Input
                    className="mt-2 form-control input-sm"
                    type="number"
                    name="FontSize"
                    onInput={(e) => number(e, 10)}
                    onChange={handleHeader}
                  />
                </th>
                <th>
                  <TableSelectBox
                    options={FontFamily}
                    name="FontFamily"
                    onChange={handleHeader}
                  ></TableSelectBox>
                </th>
                <th>
                  <label>{t("Bold")}</label>
                  <input
                    type="checkbox"
                    name="Bold"
                    checked={
                      isChecked("Bold", headerSetupData, 1).includes(false)
                        ? false
                        : true
                    }
                    onChange={handleHeader}
                  />
                </th>
                <th>
                  <label>{t("Italic")}</label>
                  <input
                    type="checkbox"
                    name="Italic"
                    checked={
                      isChecked("Italic", headerSetupData, 1).includes(false)
                        ? false
                        : true
                    }
                    onChange={handleHeader}
                  />
                </th>
                <th>
                  <label>{t("UnderLine")}</label>
                  <input
                    type="checkbox"
                    name="Underline"
                    checked={
                      isChecked("Underline", headerSetupData, 1).includes(false)
                        ? false
                        : true
                    }
                    onChange={handleHeader}
                  />
                </th>
                <th>
                  <label>{t("Print")}</label>
                  <input
                    type="checkbox"
                    name="Print"
                    checked={
                      isChecked("Print", headerSetupData, 1).includes(false)
                        ? false
                        : true
                    }
                    onChange={handleHeader}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {headerSetupData.map((data, index) => (
                <tr key={index}>
                  <td data-title={t("LabelID")}>{data?.LabelID}</td>
                  <td data-title={t("LabelDetail")}>
                    <Input
                      value={data?.LabelDetail}
                      className="form-control mt-2 input-sm"
                      type="text"
                      name="LabelDetail"
                      onChange={(e) => handleHeader(e, index)}
                    />
                  </td>
                  <td data-title={t("DetailXPosition")}>
                    <Input
                      value={data?.DetailXPosition}
                      className="form-control mt-2 input-sm"
                      name="DetailXPosition"
                      text="number"
                      onChange={(e) => handleHeader(e, index)}
                    />
                  </td>
                  <td data-title={t("Top")}>
                    <Input
                      value={data?.Top}
                      name="Top"
                      type="number"
                      onChange={(e) => handleHeader(e, index)}
                      className="form-control mt-2 input-sm"
                    />
                  </td>
                  <td data-title={t("Number")}>
                    <Input
                      value={data?.Left}
                      name="Left"
                      type="number"
                      onChange={(e) => handleHeader(e, index)}
                      className="form-control mt-2 input-sm"
                    />
                  </td>
                  <td data-title={t("FontSize")}>
                    <Input
                      value={data?.FontSize}
                      name="FontSize"
                      type="number"
                      onChange={(e) => handleHeader(e, index)}
                      className="form-control mt-2 input-sm"
                    />
                  </td>
                  <td data-title={t("FontFamily")}>
                    <select
                      className="form-control mt-2 input-sm"
                      name="FontFamily"
                      onChange={(e) => handleHeader(e, index)}
                      value={data?.FontFamily}
                    >
                      {FontFamily.map((item, ind) => (
                        <option value={item.value} key={ind}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td data-title={t("Bold")}>
                    <input
                      type="checkbox"
                      checked={data?.Bold === 1 ? true : false}
                      name="Bold"
                      onChange={(e) => handleHeader(e, index)}
                    />
                  </td>
                  <td data-title={t("Italic")}>
                    <input
                      type="checkbox"
                      checked={data?.Italic === 1 ? true : false}
                      name="Italic"
                      onChange={(e) => handleHeader(e, index)}
                    />
                  </td>
                  <td data-title={t("Underline")}>
                    <input
                      type="checkbox"
                      checked={data?.Underline === 1 ? true : false}
                      name="Underline"
                      onChange={(e) => handleHeader(e, index)}
                    />
                  </td>
                  <td data-title={t("Print")}>
                    <input
                      type="checkbox"
                      checked={data?.Print === 1 ? true : false}
                      name="Print"
                      onChange={(e) => handleHeader(e, index)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </PageHead>

      <div className="card">
        <div className="row mb-3">
          <h3 className="card-header">{t("Dynamic Field")}</h3>
        </div>

        <div className="row">
          <div className="col-sm-2">
            <SelectBox
              lable="DynamicReportType"
              id="DynamicReportType"
              name="DynamicReportType"
              className="required"
              options={DynamicReportType}
              onChange={handleSelectDynamic}
              selectedValue={DynamicField?.DynamicReportType}
            />
          </div>

          <div className="col-sm-2">
            <SelectBox
              lable="TypePlaceHolder"
              id="TypePlaceHolder"
              name="TypePlaceHolder"
              options={TypePlaceHolder}
              onChange={handleSelectDynamic}
              selectedValue={DynamicField?.TypePlaceHolder}
            />
          </div>

          <div className="col-sm-2">
            <SelectBox
              lable="Data"
              id="Data"
              name="Data"
              options={DDLData}
              onChange={handleSelectDynamic}
              selectedValue={DynamicField?.Data}
            />
          </div>

          <div className="col-sm-2">
            <Input
              name="PositionLeft"
              id="PositionLeft"
              lable="PositionLeft"
              placeholder=" "
              value={DynamicField?.PositionLeft}
              type="number"
              onChange={handleChangeDynamic}
            />
          </div>
          <div className="col-sm-2">
            <Input
              name="PositionTop"
              id="PositionTop"
              lable="PositionTop"
              placeholder=" "
              value={DynamicField?.PositionTop}
              type="number"
              onChange={handleChangeDynamic}
            />
          </div>

          <div className="col-sm-2">
            <Input
              name="Width"
              id="Width"
              lable="Width"
              placeholder=" "
              value={DynamicField?.Width}
              type="number"
              onChange={handleChangeDynamic}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-2">
            <Input
              name="Height"
              id="Height"
              lable="Height"
              placeholder=" "
              value={DynamicField?.Height}
              type="number"
              onChange={handleChangeDynamic}
            />
          </div>

          <div className="col-sm-2">
            <SelectBox
              lable="IsActive"
              id="IsActive"
              name="IsActive"
              options={Active}
              onChange={handleSelectDynamic}
              selectedValue={DynamicField?.IsActive}
            />
          </div>
          <div className="col-sm-2">
            <Input
              name="fontSize"
              id="fontSize"
              lable="FontSize"
              placeholder=" "
              value={DynamicField?.fontSize}
              type="number"
              onChange={handleChangeDynamic}
            />
          </div>
          <div className="col-sm-2">
            <Input
              type="file"
              name="ImageData"
              id="ImageData"
              onChange={handleUploadImage}
              accept={"image/png"}
            />
          </div>
          <div className="col-sm-2">
            <button
              className="btn btn-block btn-primary btn-sm"
              type="button"
              onClick={() => handleImage(DynamicField?.ImageData)}
              disabled={
                DynamicField?.ImageData?.trim() !== "undefined" ? false : true
              }
            >
              {t("View Image")}
            </button>
          </div>

          <div className="col-sm-1">
            <button
              className="btn btn-block btn-warning btn-sm"
              onClick={() => {
                handleAdd(index);
              }}
            >
              {index === "" || DynamicReport.length === 0
                ? t("Add Fields")
                : t("Update")}
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12">
            <textarea
              name="Text"
              placeholder="Enter your text"
              className="form-control h-100"
              value={DynamicField?.Text}
              onChange={handleChangeDynamic}
              rows="10"
              cols="50"
            />
          </div>
        </div>
      </div>
      <div className="card">
        {DynamicReport.length > 0 && (
          <Table
            className="table table-bordered table-hover table-striped tbRecord"
            cellPadding="{0}"
            cellSpacing="{0}"
          >
            <thead className="cf">
              <tr>
                <th>{t("Edit")}</th>
                <th>{t("Remove")}</th>
                <th>{t("DynamicReportType")}</th>
                <th>{t("TypePlaceHolder")}</th>
                <th>{t("Data")}</th>
                <th>{t("PositionLeft")}</th>
                <th>{t("PositionTop")}</th>
                <th>{t("Width")}</th>
                <th>{t("Height")}</th>
                <th>{t("Action")}</th>
                <th>{t("Text")}</th>
                <th>{t("Image")}</th>
              </tr>
            </thead>
            <tbody>
              {DynamicReport.map((ele, index) => (
                <tr key={index}>
                  <td data-title={t("Edit")}>
                    <button
                      className="btn btn-block btn-success btn-sm"
                      onClick={() => {
                        handleEdit(ele, index);
                        setEditable(true);
                      }}
                    >
                      {t("Edit")}
                    </button>
                  </td>
                  <td data-title={t("Remove")}>
                    <button
                      className="btn btn-block btn-danger btn-sm"
                      onClick={() => {
                        handleDelete(index);
                      }}
                    >
                      {t("Remove")}
                    </button>
                  </td>
                  <td data-title={t("DynamicReportType")}>
                    {ele?.DynamicReportType}&nbsp;
                  </td>
                  <td data-title={t("TypePlaceHolder")}>
                    {ele?.TypePlaceHolder}&nbsp;
                  </td>
                  <td data-title={t("Data")}>{ele?.Data}&nbsp;</td>
                  <td data-title={t("PositionLeft")}>
                    {ele?.PositionLeft}&nbsp;
                  </td>
                  <td data-title={t("PositionTop")}>
                    {ele?.PositionTop}&nbsp;
                  </td>
                  <td data-title={t("Width")}>{ele?.Width}&nbsp;</td>
                  <td data-title={t("Height")}>{ele?.Height}&nbsp;</td>
                  <td data-title={t("IsActive")}>{ele?.IsActive}&nbsp;</td>
                  <td data-title={t("See Text")}>
                    <button
                      className="btn btn-block btn-info btn-sm"
                      onClick={() => handleText(ele?.Text)}
                      disabled={ele?.Text ? false : true}
                    >
                      {t("See Text")}
                    </button>
                  </td>
                  <td data-title={t("See Image")}>
                    <button
                      className="btn btn-block btn-info btn-sm"
                      onClick={() => handleImage(ele?.ImageData)}
                      disabled={
                        ele?.ImageData?.trim() !== "undefined" ? false : true
                      }
                    >
                      {t("See Image")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        <div className="row mt-2">
          <div className="col-sm-1">
            {load ? (
              <Loading />
            ) : (
              <button
                className="btn btn-block btn-success btn-sm"
                onClick={handleSubmit}
              >
                {t("Update")}
              </button>
            )}
          </div>
          <div className="col-sm-2">
            <button
              className="btn btn-block btn-warning btn-sm"
              onClick={handlePreview}
            >
              {t("Lab Report Preview")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default ReportBill;
