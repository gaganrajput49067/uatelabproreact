import React, { useEffect, useState } from "react";
import "./UploadFile.css";
import Modal from "../../../components/Modal/Modal";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../../utils/axiosInstance";
import { SelectBox } from "../../../components/CommonComponent/SelectBox";
import { dateConfig } from "../../../utils/helpers";
import { Image } from "primereact/image";
import { toast } from "react-toastify";

const UploadFile = ({
  options,
  show,
  handleClose,
  documentId,
  pageName,
  handleUploadCount,
  getDocumentType,
  formData,
  isPrintHeader = 0,
  showHeader = true,
}) => {
  const { t } = useTranslation();
  const [state, setState] = useState({
    DocumentName: "",
    DocumentID: documentId ?? "",
    file: null, // Updated to store file
    previewUrl: null, // State to store the preview URL
  });
  const [load, setLoad] = useState(false);
  const [err, setErr] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [printHeader, setPrintHeader] = useState(isPrintHeader);

  const handleDrop = (event) => {
    event.preventDefault();
    const newFile = event.dataTransfer.files[0];
    setFile(newFile);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;
      if (fileType.startsWith("image/")) {
        // Generate a preview URL for the image
        const previewUrl = URL.createObjectURL(file);
        setState({
          ...state,
          file,
          previewUrl,
        });
      } else {
        setState({
          ...state,
          file: null,
          previewUrl: null,
        });
        toast.error(t("Only image files are allowed for preview"));
      }
    }
  };

  const handleFileRemove = () => {
    setState({
      ...state,
      file: null,
      previewUrl: null,
    });
    document.getElementById("file-upload").value = ""; // Reset the file input
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    const data = options.find((ele) => ele.value == value);
    setState({
      ...state,
      [name]: data?.value,
      DocumentName: data?.label,
    });
  };

  const getDocumentFiletype = (data) => {
    let TypeDocument = [];
    data.map((ele) => {
      return TypeDocument.push(ele?.DocumentName);
    });
    getDocumentType(TypeDocument);
  };

  const Fetch = async () => {
    try {
      const response = await axiosInstance.post(
        "CommonController/GetDocument",
        {
          Page: pageName,
          Guid: documentId,
        }
      );
      const documents = response?.data?.message || [];
      const tableData = await Promise.all(
        documents.map(async (data) => {
          const imgUrl = await getimgurl(data?.awsKey);
          return { ...data, imgUrl };
        })
      );
      setTableData(tableData);

      if (["Patient Registration"].includes(pageName)) {
        handleUploadCount(
          "UploadDocumentCount",
          documents.length,
          "IsDocumentUploaded"
        );
        if (
          ["/EditPatientDetails", "/patientregister"].includes(
            window.location.pathname
          )
        ) {
          getDocumentFiletype(documents);
        }
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message
          ? err?.response?.data?.message
          : t("Something Went Wrong")
      );
    }
  };

  const DeleteImage = (id) => {
    axiosInstance
      .post("CommonController/InActiveDocument", {
        Hash_Id: id,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        Fetch();
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : t("Something Went Wrong")
        );
      });
  };

  const UploadDocumentModalValidation = (state) => {
    let err = "";
    if (state?.DocumentID === "") {
      err = { ...err, DocumentID: "This Field is Required" };
    }
    return err;
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    const generatedError = UploadDocumentModalValidation(state);
    if (generatedError === "") {
      if (!state.file) {
        toast.error("Please attach a file first.");
      } else {
        const names = [
          "EmployeMaster",
          "CentreMaster",
          "RateTypeMaster",
          "MembershipCardLogo",
          "MembershipCardIssue",
          "CentreMaster",
          "RateTypeMaster",
          "attachmentHeader",
          "attachmentfooter",
          "CompanyLogo",
        ];
        if (names.includes(pageName) && tableData?.length > 0) {
          toast.error(t("Please Remove Image to Upload New Image"));
        } else {
          setLoad(true);

          let formData = new FormData();
          formData.append("file", state.file);
          formData.append("DocumentID", state.DocumentID);
          formData.append("Page", pageName);
          formData.append(
            "DocumentName",
            pageName === "centreMasterNabl" ? "Nabl Logo" : state.DocumentName
          );
          formData.append("Guid", documentId);
          formData.append("FileName", "");
          await axiosInstance
            .post("CommonController/UploadDocument", formData)
            .then((res) => {
              toast.success(res?.data?.message);
              Fetch();
              setLoad(false);
              setState({ ...state, file: null, previewUrl: null });
            })
            .catch((err) => {
              setLoad(false);
              toast.error(
                err?.response?.data?.message
                  ? err?.response?.data?.message
                  : t("Something Went Wrong")
              );
            });
        }
      }
    } else {
      setErr(generatedError);
    }
  };

  const getS3url = (id) => {
    axiosInstance
      .post("CommonController/GetFileUrl", {
        Key: id,
      })
      .then((res) => {
        const url = res?.data?.message;
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "image.png"); //or any other extension
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : t("Something went Wrong")
        );
      });
  };

  const getimgurl = async (id) => {
    try {
      const response = await axiosInstance.post("CommonController/GetFileUrl", {
        Key: id,
      });
      return response?.data?.message;
    } catch (err) {
      toast.error(
        err?.response?.data?.message
          ? err?.response?.data?.message
          : t("Something went Wrong")
      );
      return null; // Return null or a placeholder URL if there's an error
    }
  };

  console.log(state);

  useEffect(() => {
    Fetch();
  }, []);
  return (
    <Modal handleClose={handleClose} top={"50px"}>
      <div className="main-upload-container">
        <div className="upload-file-cont mt-3">
          <div className="d-flex justify-content-between px-3  mb-2">
            <label>Upload File</label>
            {options && (
              <div style={{ width: "50%" }}>
                <SelectBox
                  options={options}
                  name="DocumentID"
                  lable="DocumentType"
                  selectedValue={state?.DocumentID}
                  onChange={handleChange}
                />
                {state?.DocumentID === "" && (
                  <div className="golbal-Error">{err?.DocumentID}</div>
                )}
              </div>
            )}
          </div>
          <div
            className="file-upload-container"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              type="file"
              name="file"
              id="file-upload"
              className="file-upload-input"
              onChange={handleFileChange}
              accept={
                pageName === "CompanyMaster"
                  ? "image/png; image/jpeg"
                  : pageName === "Add Report"
                  ? ".pdf"
                  : "image/*"
              }
            />
            <label htmlFor="file-upload" className="file-upload-message">
              Drag and drop files here or click to upload <br />
              {["Add Report"].includes(pageName) ? (
                <span className="text-warning">
                  ( {t("Only Pdf is allowed")})
                </span>
              ) : (
                <span className="text-warning">
                  ( {t("jpg,jpeg,png and gif are allowed")})
                </span>
              )}
            </label>
          </div>
          {state?.file && (
            <>
              <label className="py-3 px-3">Preview</label>
              <div className="px-3" style={{ width: "100%" }}>
                <div className="file-upload-preview">
                  <div className="preview-file">
                    {state.previewUrl && (
                      <img src={state.previewUrl} alt="Image" />
                    )}
                  </div>
                  <div className="document-details">
                    <span>{state.DocumentName}</span>
                    <span>{state.file.name}</span>
                  </div>
                  <i
                    className="fa fa-trash mt-2 mr-2"
                    onClick={handleFileRemove}
                  ></i>
                  <button
                    type="button"
                    className="btn btn-success btn-block btn-sm"
                    id="btnSave"
                    onClick={handleUpload}
                    disabled={formData?.SampleStatus === "5" ? true : false}
                  >
                    {t("Upload File")}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="uploaded-file-preview mt-3">
          <div className="d-flex justify-content-between px-3 ">
            <label className="mb-3">Uploaded Files</label>
            {pageName === "Add Report" && showHeader && (
              <label>
                <input
                  className="px-2"
                  type="checkbox"
                  onChange={(e) => setPrintHeader(e.target.checked ? 1 : 0)}
                  checked={printHeader === 1 ? true : false}
                />
                <span>Print with Header/Footer</span>
              </label>
            )}
          </div>
          <div className="upload-file-preview-cont">
            {tableData && tableData.length > 0 ? (
              tableData.map((ele, index) => {
                return (
                  <div className="upload-file-preview" key={index}>
                    <div className="preview-file">
                      {["jpeg", "jpg", "png"].includes(
                        ele?.awsKey.split(".").pop().toLowerCase() // Use split() correctly and convert to lowercase
                      ) ? (
                        <img src={ele?.imgUrl} alt={"imgUrl"} />
                      ) : (
                        <span>No Preview Available</span>
                      )}
                    </div>
                    <div className="document-details">
                      <span>{ele?.DocumentName}</span>
                      <span>{dateConfig(ele?.dtEntry)}</span>
                      <span>{ele?.FileName}</span>
                      <span>{ele?.CreatedByName}</span>
                    </div>
                    <div>
                      <i
                        style={{ cursor: "pointer" }}
                        className="fa fa-trash mt-2 mr-2"
                        onClick={() =>
                          formData?.SampleStatus !== "5"
                            ? DeleteImage(ele?.ID_Hash)
                            : null
                        }
                      ></i>
                      <br />
                      <i
                        style={{ cursor: "pointer" }}
                        className="fa fa-download mt-1 mr-2"
                        onClick={() => getS3url(ele?.awsKey)}
                      ></i>
                    </div>
                  </div>
                );
              })
            ) : (
              <span className="w-100 text-center">No files uploaded</span>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UploadFile;
