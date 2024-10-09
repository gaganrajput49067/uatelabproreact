import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../utils/axiosInstance";
import Modal from "../../components/Modal/Modal";
import TextEditor from "../../components/CommonComponent/TextEditor";

function TemplateMasterModal({ show, handleClose, handleSave }) {
  const [payload, setPayload] = useState(show?.data);
  const [Editor, setEditor] = useState("");
  const [TemplateDropdown, setTemplateDropDown] = useState([]);
  const [EditTable, setEditTable] = useState(false);

  const isCommentEmpty = Editor.trim() === "";
  useEffect(() => {
    setPayload({ ...payload, COMMENT: payload?.COMMENT ?? Editor });
  }, [Editor]);
  console.log(Editor);
  const handleSaveClick = () => {
    if (isCommentEmpty) {
      toast.error("Please fill the mandatory field");
    } else {
      handleSave(payload, "TemplateMaster");
    }
  };

  const fetch = () => {
    axiosInstance
      .post("InvestigationCommentMaster/getInvestigationCommentData", {
        InvestigationID: Array.isArray(show?.data?.labObservationID)
          ? show?.data?.labObservationID
          : [show?.data?.labObservationID],
        Template: "",
        TemplateText: "",
      })
      .then((res) => {
        const data = res?.data?.message;
        const val = data?.map((ele) => {
          return {
            ...ele,
            value: ele?.CommentID,
            label: ele?.Template,
          };
        });
        setTemplateDropDown(val);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const FetchTemplateID = (id) => {
    setEditTable(true);
    axios
      .post("api/v1/RE/BindReportTemplateByID", {
        ReportTypeID: id,
        InvestigationID: payload?.InvestigationID,
      })
      .then((res) => {
        setPayload({
          ...payload,
          COMMENT: res?.data?.message[0]?.TemplateText,
        });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const handleChange = (e) => {
    const { value } = e.target;
    const data = TemplateDropdown.find((ele) => ele.value == value);
    console.log(data);
    setEditTable(true);
    setPayload({
      ...payload,
      CommentID: parseInt(value),
      COMMENT: data?.TemplateText,
    });
  };

  // useEffect(() => {
  //   if (payload?.COMMENT) {
  //     handleSave();
  //   } else {
  //     toast.error("Please fill  field");
  //   }
  // }, []);

  useEffect(() => {
    fetch();
  }, []);

  return (
    <Modal title={"Enter Value"} handleClose={handleClose}>
      <div className="card">
        <div className="row">
          <div className="col-12">
            <select
              className="select-input-box form-control input-sm"
              onChange={handleChange}
              value={payload?.CommentID}
            >
              <option hidden>Select Template</option>
              {TemplateDropdown?.map((data, index) => (
                <option value={data?.value} key={index}>
                  {data?.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <TextEditor
              name="COMMENT"
              value={payload?.COMMENT}
              setValue={setEditor}
              EditTable={EditTable}
              setEditTable={setEditTable}
            />
          </div>
        </div>
      </div>
      <div className="card">
        <div className="row">
          <div className="col-sm-1">
            <button
              type="button"
              className="btn btn-success btn-sm mx-2"
              onClick={handleSaveClick}
            >
              Save
            </button>
          </div>
          <div className="col-sm-1">
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default TemplateMasterModal;
