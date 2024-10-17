import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../utils/axiosInstance";
import { InvestigationCommentMasterValidation } from "../../utils/Schema";
import PageHead from "../../components/CommonComponent/PageHead";
import ReactSelect from "../../components/CommonComponent/ReactSelect";
import FullTextEditor from "../../components/CommonComponent/TextEditor";
import Input from "../../components/CommonComponent/Input";
import Loading from "../../components/Loading/Loading";
import { getTrimmedData } from "../../utils/helpers";

const InvestigationCommentMaster = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const [Investigation, setInvestigation] = useState([]);
  const [Editor, setEditor] = useState("");
  const [load, setLoad] = useState(false);
  const [err, setErr] = useState({});
  const [Editable, setEditable] = useState(false);
  const [payload, setPayload] = useState({
    InvestigationID: "",
    Template: "",
    TemplateText: "",
    isActive: "",
  });

  const ID = {
    CommentID: state?.other?.CommentID ? state?.other?.CommentID : "",
  };
  const { t } = useTranslation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const handleSelectChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (name == "isActive") {
      setPayload({
        ...payload,
        [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
      });
    } else {
      setPayload({ ...payload, [name]: value });
    }
  };

  const Fetch = () => {
    axiosInstance
      .post(state?.url1, {
        CommentID: ID.CommentID,
      })
      .then((res) => {
        const data = res.data.message;
        setPayload(...data);
      })
      .catch((err) => console.log(err));
  };

  const getInvestigationList = () => {
    axiosInstance
      .get("Investigations/BindInvestigationList")
      .then((res) => {
        let data = res.data.message;
        let InvestigationData = data.map((ele) => {
          return {
            value: ele.InvestigationID,
            label: ele.TestName,
          };
        });
        InvestigationData.unshift({ label: "All Investigations", value: "" });
        setInvestigation(InvestigationData);
      })
      .catch((err) => console.log(err));
  };

  const postData = () => {
    let generatedError = InvestigationCommentMasterValidation(payload);
    if (generatedError === "") {
      setLoad(true);
      axiosInstance
        .post(
          state?.url
            ? state?.url
            : "InvestigationCommentMaster/InsertInvestigationComment",
          getTrimmedData({
            ...payload,
          })
        )
        .then((res) => {
          if (res.data.success) {
            setLoad(false);
            navigate("/InvestigationCommentMasterList");
            toast.success(res.data.message);
          } else {
            toast.error(res?.data?.message);
            setLoad(false);
          }
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
      setLoad(false);
    }
  };

  useEffect(() => {
    setPayload({ ...payload, TemplateText: Editor });
  }, [Editor]);

  useEffect(() => {
    Fetch();
    getInvestigationList();
  }, []);

  return (
    <>
      <PageHead name="Investigation Comment Master" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <ReactSelect
                dynamicOptions={Investigation}
                isDisabled={state?.url1}
                placeholderName="Investigation ID"
                value={payload?.InvestigationID}
                onChange={(_, e) => {
                  setPayload({
                    ...payload,
                    InvestigationID: e?.value,
                  });
                }}
              />
              <div className="error-message">{err?.InvestigationID}</div>
            </div>

            <div className="col-sm-2">
              <Input
                lable="Template"
                id="Template"
                placeholder=" "
                onChange={handleChange}
                name="Template"
                max={50}
                value={payload?.Template}
              />
            </div>

            <div className="col-sm-1">
              <input
                type="checkbox"
                name="isActive"
                value={payload?.isActive}
                checked={payload?.isActive}
                onChange={handleSelectChange}
              />
              <label className="ml-2">IsActive</label>
            </div>
          </div>
        </div>{" "}
        <div className="card">
          <div className="row">
            <div className="col-sm-12">
              <FullTextEditor
                value={payload?.TemplateText}
                setValue={setEditor}
                editable={Editable}
                setEditTable={setEditable}
              />
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-sm-2">
              {load ? (
                <Loading />
              ) : (
                <button
                  type="button"
                  className="btn btn-block btn-success btn-sm"
                  id="btnSearch"
                  title="Search"
                  onClick={postData}
                  disabled={payload?.Template.length > 0 ? false : true}
                >
                  {state?.other?.button ? state?.other?.button : t("Save")}
                </button>
              )}
            </div>
            <div className="col-sm-2">
              <Link to="/InvestigationCommentMasterList">
                {t("Back to List")}
              </Link>
            </div>
          </div>
        </div>
      </PageHead>
    </>
  );
};

export default InvestigationCommentMaster;
