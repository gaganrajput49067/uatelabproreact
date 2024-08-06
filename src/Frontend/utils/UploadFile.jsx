import React, { useState } from "react";
import "./UploadFile.css";
import Modal from "../../components/Modal/Modal";

const UploadFile = ({ handleClose }) => {
  const [files, setFiles] = useState([]);

  const handleDrop = (event) => {
    event.preventDefault();
    const newFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleFileRemove = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <Modal handleClose={handleClose}>
      <div className="row" style={{ width: "800px" }}>
        <div
          className="col-md-6 d-flex"
          style={{ flexDirection: "column", width: "50%" }}
        >
          <label htmlFor="allergies">Upload File</label>
          <div
            className="file-upload-container"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              type="file"
              multiple
              id="file-upload"
              className="file-upload-input"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload" className="file-upload-message">
              Drag and drop files here or click to upload
            </label>
          </div>
        </div>
        <div
          className="d-flex ml-2"
          style={{
            flexDirection: "column",
            width: "49%",
          }}
        >
          <label>Preview</label>
          <div
            className="d-flex"
            style={{
              flexDirection: "column",
              width: "100%",
              height: "240px",
              overflowX: "auto",
              padding: "5px",
            }}
          >
            <div className="file-upload-preview">
              <div className="preview-file"></div>
              <div className="document-details">
                <span>Adhar card</span>
                <span>FIle Name</span>
              </div>
              <i className="fa fa-trash mt-2"></i>
            </div>
            {/* <ul className="upload-file-list">
              {files.map((file, index) => (
                <li key={index} className="upload-file-item">
                  <span className="upload-file-name">{file.name}</span>
                  <button
                    className="remove-button"
                    onClick={() => handleFileRemove(index)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul> */}
          </div>
        </div>
      </div>
      <label className="mt-2">Uploaded Files</label>
      <div style={{ width: "800px" }}>
        <div className="upload-file-preview">
          <div className="preview-file"></div>
          <div className="document-details">
            <span>Adhar card</span>
            <span>FIle Name</span>
          </div>
          <div>
            <i className="fa fa-trash mt-2 mr-2"></i>
            <br />
            <i class="fa fa-download mt-1 mr-2"></i>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UploadFile;
