import React, { useState } from "react";
import PageHead from "../../components/CommonComponent/PageHead";
import SubPageHead from "../../components/CommonComponent/SubPageHead";
import { Button } from "react-bootstrap";
import UploadFile from "../utils/UploadFile";
import MedicalHistory from "../utils/MedicalHistory";

const DashBoard = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };
  return (
    <div>
      <button onClick={() => setShow(!show)}>Show</button>
      {show && <UploadFile handleClose={handleClose} />}
    </div>
  );
};

export default DashBoard;
