import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { axiosInstance } from "../../utils/axiosInstance";
import PageHead from "../../components/CommonComponent/PageHead";
import HelpMenuModal from "../utils/HelpMenuModal";
import Input from "../../components/CommonComponent/Input";
import { SelectBox } from "../../components/CommonComponent/SelectBox";
const InvestigationsHelpMenu = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [Edit, setEdit] = useState(false);
  const [Value, setValue] = useState("");
  const [HelpMenu, setHelpMenu] = useState([]);
  const [formData, setFormData] = useState({
    HelpMenuId: "",
    InvestigationId: state?.data?.InvestigationID
      ? state?.data?.InvestigationID
      : "",
    IsActive: "1",
    MenuId: "",
    MenuName: "",
  });

  const { t } = useTranslation();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getHelpMenu = () => {
    axiosInstance
      .get("Investigations/GetHelpMenu")
      .then((res) => {
        let data = res.data.message;
        let helpMenu = data.map((ele) => {
          return {
            value: ele.MenuId,
            label: ele.MenuName,
          };
        });

        setHelpMenu(helpMenu);
      })
      .catch((err) => console.log(err));
  };

  const MapHelpMenu = () => {
    if (formData?.HelpMenuId) {
      axiosInstance
        .post("Investigations/MapHelpMenu", {
          HelpMenuId: formData?.HelpMenuId,
          InvestigationId: formData?.InvestigationId,
          IsActive: formData?.IsActive,
        })
        .then((res) => {
          if (res.data.message) {
            toast.success("Mapped successfully");
            handleShowMapMenu();
          } else {
            toast.error("Something went wrong");
          }
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        });
    } else {
      toast.error("please Choose Help menu");
    }
  };

  console.log(HelpMenu);

  const handleSelectChange = (event) => {
    const { name, value, selectedIndex } = event?.target;
    const label = event?.target?.children[selectedIndex].text;
    setFormData({ ...formData, [name]: value, MenuName: label });
  };

  const handleShowMapMenu = () => {
    axiosInstance
      .post("Investigations/ShowMapMenu", {
        InvestigationID: formData?.InvestigationId,
      })
      .then((res) => {
        setValue(res?.data?.message[0]?.HelpMenu);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  // console.log(Value)

  useEffect(() => {
    getHelpMenu();
    handleShowMapMenu();
  }, []);

  return (
    <>
      {" "}
      {show && (
        <HelpMenuModal
          show={show}
          handleClose={handleClose}
          Edit={Edit}
          getHelpMenu={getHelpMenu}
          state={formData}
          data={state?.data?.TestName}
        />
      )}{" "}
      <PageHead name="Help Menu" showDrop={"true"}>
        <div className="card">
          <div className="row">
            <div className="col-sm-6">
              <div className="row">
                <div className="col-sm-12">
                  <Input
                    type="text"
                    lable="Test Name"
                    id="Test Name"
                    placeholder=" "
                    disabled
                    value={state?.data?.TestName}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <SelectBox
                    options={[
                      { label: "select Help Menu", value: "" },
                      ...HelpMenu,
                    ]}
                    id="Help Menu"
                    lable="Help Menu"
                    name="HelpMenuId"
                    onChange={handleSelectChange}
                    selectedValue={formData?.HelpMenuId}
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-6">
              <div
                className="text-center"
                style={{
                  border: "1px solid black",
                  padding: "20px",
                //   width: "500px",
                }}
              >
                <h5>{t("Details")} : </h5>
                <span className="text-center">{Value}</span>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-1">
              <button
                className="btn btn-success btn-block btn-sm"
                onClick={MapHelpMenu}
              >
                {t("Map")}
              </button>
            </div>
            <div className="col-sm-1">
              <button
                className="btn btn-info btn-block btn-sm"
                onClick={() => {
                  handleShow();
                  setEdit(false);
                }}
                state={{ data: state?.data?.TestName }}
              >
                {t("Add New Help")}
              </button>
            </div>
            <div className="col-sm-1">
              <button
                className="margin btn btn-warning btn-block btn-sm"
                onClick={() => {
                  handleShow();
                  setEdit(true);
                }}
              >
                {t("Edit Help")}
              </button>
            </div>{" "}
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

export default InvestigationsHelpMenu;
