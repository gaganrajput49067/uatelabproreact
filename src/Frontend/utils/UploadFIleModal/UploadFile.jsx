import React, { useState } from "react";
import "./UploadFile.css";
import Modal from "../../../components/Modal/Modal";

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
      <div className="main-upload-container">
        <div className="upload-file-cont">
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
        <div className="uploaded-file-preview">
          <label>Preview</label>
          <div style={{ width: "100%" }}>
            <div className="file-upload-preview">
              <div className="preview-file"></div>
              <div className="document-details">
                <span>Adhar card</span>
                <span>FIle Name</span>
              </div>
              <i className="fa fa-trash mt-2 mr-2"></i>
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
      <div className="upload-file-preview-cont">
        <div className="upload-file-preview">
          <div className="preview-file"></div>
          <div className="document-details">
            <span>Adhar card</span>
            <span>FIle Name</span>
          </div>
          <div>
            <i className="fa fa-trash mt-2 mr-2"></i>
            <br />
            <i className="fa fa-download mt-1 mr-2"></i>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UploadFile;
