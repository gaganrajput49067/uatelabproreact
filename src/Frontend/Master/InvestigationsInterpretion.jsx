import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../utils/axiosInstance";
import PageHead from "../../components/CommonComponent/PageHead";
import Input from "../../components/CommonComponent/Input";
import FullTextEditor from "../../components/CommonComponent/TextEditor";
import Loading from "../../components/Loading/Loading";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
const InvestigationsInterpretion = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const [CentreData, setCentreData] = useState([]);
  const [load, setLoad] = useState(false);
  const [Machine, setMachine] = useState([]);
  const [Editable, setEditable] = useState(false);
  const [Editor, setEditor] = useState("");
  const [payload, setPayload] = useState({
    CentreID: "",
    MacID: "",
    Interpretation: "",
    InvestigationID: state?.InvestigationID ? state?.InvestigationID : "",
    PrintInterPackage: "",
  });

  const { t } = useTranslation();

  console.log(state);

  const fetch = (centre, mac) => {
    axiosInstance
      .post(state?.url, {
        CentreID: centre,
        InvestigationID: payload?.InvestigationID,
        MacID: mac?.toString(),
      })
      .then((res) => {
        if (res?.data?.message.length === 0) {
          toast.success("No Data Found");
          setPayload({
            ...payload,
            CentreID: centre,
            MacID: mac,
            Interpretation: "",
          });
          setEditor("");
          setEditable(true);
        } else {
          const data = res?.data?.message[0];
          setPayload({
            ...payload,
            CentreID: data?.CentreID,
            MacID: data?.MacID,
            Interpretation: data?.Interpretation,
            InvestigationID: data?.InvestigationID,
            PrintInterPackage: "",
          });
          setEditor(data?.Interpretation);
          setEditable(true);
        }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  console.log(payload);

  const SaveInterpretion = () => {
    if (payload?.CentreID && payload?.MacID) {
      setLoad(true);
      axiosInstance
        .post("Investigations/SaveInterpretation", {
          ...payload,
          PrintInterPackage: payload?.PrintInterPackage?.toString(),
          CentreID: payload?.CentreID,
          MacID: payload?.MacID,
        })
        .then((res) => {
          if (res.data.message) {
            setLoad(false);
            toast.success(res.data.message);
            // navigate(-1);
          } else {
            toast.error("Something went wrong");
          }
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          setLoad(false);
          if (err?.response?.status === 504) {
            toast.error("Something went wrong");
          }
        });
    } else {
      toast.error("Please Choose Centre and Machine");
    }
  };

  const getMachine = () => {
    axiosInstance
      .get("Investigations/BindMachineList")
      .then((res) => {
        let data = res.data.message;
        let Machine = data.map((ele) => {
          return {
            value: ele.MachineId,
            label: ele.MachineName,
          };
        });
        setMachine(Machine);
      })
      .catch((err) => console.log(err));
  };

  const getAccessCentres = () => {
    axiosInstance
      .get("Centre/getAccessCentres")
      .then((res) => {
        let data = res.data.message;
        let CentreDataValue = data.map((ele) => {
          return {
            value: ele.CentreID,
            label: ele.Centre,
          };
        });
        setCentreData(CentreDataValue);
        getMachine();
      })
      .catch((err) => console.log(err));
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;

    name === "CentreID"
      ? fetch(value, payload?.MacID)
      : fetch(payload?.CentreID, value);
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setPayload({
      ...payload,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  useEffect(() => {
    setPayload({ ...payload, Interpretation: Editor });
  }, [Editor]);

  useEffect(() => {
    getAccessCentres();
  }, []);

  return (
    <>
      <PageHead name="Investigations Interpretion" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-2">
              <Input
                placeholder=" "
                lable="TestName"
                id="TestName"
                disabled={true}
                value={state?.data}
                name="TestName"
              />
            </div>

            <div className="col-sm-2">
              <SelectBox
                options={[{ label: "Select Centre", value: "" }, ...CentreData]} //CentreData
                onChange={handleSelectChange}
                name="CentreID"
                id="Centre Name"
                lable="Centre Name"
                selectedValue={payload?.CentreID}
              />
            </div>

            <div className="col-sm-2">
              <SelectBox
                options={[{ label: "Select Machine", value: "" }, ...Machine]}
                id="Machine"
                lable="Machine"
                onChange={handleSelectChange}
                name="MacID"
                selectedValue={payload?.MacID}
              />
            </div>

            <div className="col-sm-2">
              <input
                name="PrintInterPackage"
                type="checkbox"
                checked={payload?.PrintInterPackage}
                onChange={handleChange}
              />
              <label className="control-label ml-2">
                {t("For All Centre")}
              </label>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <FullTextEditor
                value={payload?.Interpretation}
                setValue={setEditor}
                EditTable={Editable}
                setEditTable={setEditable}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-1">
              {load ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-block btn-success btn-sm "
                  onClick={SaveInterpretion}
                >
                  {t("Save")}
                </button>
              )}
            </div>
            <div className="col-sm-1">
              {state?.flag ? (
                <Link
                  to="/Investigations"
                  state={{
                    other: {
                      button: "Update",
                      pageName: "Edit",
                      showButton: true,
                    },
                    url1: state?.url1,
                    url: "Investigations/UpdateInvestigation",
                  }}
                >
                  <span className="btn btn-block btn-primary btn-sm">Back</span>
                </Link>
              ) : (
                <button
                  className="btn btn-block btn-primary btn-sm"
                  onClick={() => navigate(-1)}
                >
                  Back
                </button>
              )}
            </div>
          </div>
        </div>
      </PageHead>
    </>
  );
};

export default InvestigationsInterpretion;
