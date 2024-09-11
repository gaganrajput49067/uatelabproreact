import React, { useEffect, useRef, useState } from "react";
import "../../zStyles/Header.css";
import defaultUserImg from "../../assets/image/user.png";
import {
  changeDarkMode,
  getCookie,
  toggleFullScreen,
  useClickOutside,
} from "../../utils/helpers";
import Input from "../CommonComponent/Input";
import ReactSelect from "../CommonComponent/ReactSelect";
import axios from "axios";
import { axiosInstance } from "../../utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logOutAction } from "../../store/reducers/loginSlice/loginSlice";
import { getCentreDetails } from "../../utils/NetworkApi/commonApi";
import { toast } from "react-toastify";

const Header = ({ handleSidebar, menuData, handlePage }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userProfile = useRef(null);
  const themeProfile = useRef(null);
  const inputProfile = useRef(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [centreData, setCentreData] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(
    menuData?.length > 0 ? menuData[0]?.value : []
  );

  useEffect(() => {
    setSelectedMenu(menuData?.length > 0 ? menuData[0]?.value : []);
  }, [menuData]);

  useEffect(() => {
    getCentreDetails(setCentreData);
  }, []);

  const handleUserProfile = () => {
    setShowUserProfile(false);
  };

  const handleThemeProfile = () => {
    setShowThemes(false);
  };

  const handleInputProfile = () => {
    setShowInput(false);
  };

  const handleThemeChange = () => {
    setShowThemes(true);
  };

  useClickOutside(userProfile, handleUserProfile, showUserProfile);
  useClickOutside(themeProfile, handleThemeProfile, showThemes);
  useClickOutside(inputProfile, handleInputProfile, showInput);

  const handleLogout = async () => {
    const payLoad = {
      Username: localStorage?.getItem("Username"),
    };
    try {
      await dispatch(logOutAction(payLoad))
        .unwrap()
        .then(() => {
          window.sessionStorage.clear();
          window.localStorage.clear();
          navigate("/login");
        });
    } catch (err) {
      toast.error(err?.message || "Error Occurred");
    }
  };

  const handleChange = (name, e) => {
    const { value } = e;
    if (name === "centre") {
      handleChangeCentre(value);
    } else if (name === "menu") {
      setSelectedMenu(value);
      handlePage(e.pageData);
    }
  };
  const handleChangeCentre = (value) => {
    axiosInstance
      .post("Users/ChangeCentre", {
        CentreID: value,
      })
      .then((res) => {
        window.localStorage.setItem("DefaultCentre", value);
        window.location.reload();
      })
      .catch((err) =>
        toast.error(
          err?.data?.response?.message
            ? err?.data?.response?.message
            : "Error Occur"
        )
      );
  };
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      window.localStorage.getItem("theme")
    );
  }, []);
  return (
    <div className="header-main-container">
      <div className="company-info">
        <img src={defaultUserImg} alt="" />
        <span className="ss-none ml-2">&nbsp;Itdose Infosystem</span>
        <div className="header-show-menu ls-none" onClick={handleSidebar}>
          <i className="fa fa-bars m-2" aria-hidden="true"></i>
        </div>
        <span style={{ fontSize: "1.5rem" }} className="ls-none">
          ITD
        </span>
      </div>
      <div className="header-item-container">
        {/* Menu Select Box */}
        <div type="button" className="header-menu mt-2">
          <ReactSelect
            name={"menu"}
            placeholderName=""
            dynamicOptions={menuData}
            searchable={true}
            value={Number(selectedMenu)}
            onChange={handleChange}
          />
        </div>
        {/* Centre Select Box */}
        <div type="button" className="header-centre mt-2">
          <ReactSelect
            name={"centre"}
            placeholderName=""
            dynamicOptions={centreData}
            value={window?.localStorage?.getItem("DefaultCentre")}
            onChange={handleChange}
          />
        </div>
        {/* Visit Box Small Screen */}
        <div className="header-search-btn ls-none" ref={inputProfile}>
          <i
            className="fa fa-barcode mr-3 ml-2 pointer ls-none "
            onClick={() => setShowInput(!showInput)}
          ></i>
          {showInput && (
            <div className="header-search-menu">
              <div className="header-search-input">
                <div className="maindiv mt-2">
                  <Input
                    type="text"
                    className="form-control"
                    id="text"
                    name="userName"
                    lable={"Visit No. / Barcode No."}
                    placeholder=" "
                    // value={payload?.userName}
                    // onChange={handleChange}
                  />
                </div>
                <i
                  className="fa fa-search m-2 pointer ls-none "
                  // onClick={() => setShowInput(!showInput)}
                ></i>
              </div>
            </div>
          )}
        </div>
        {/* Vsit Box */}
        <div className="header-visit ss-none " style={{ marginTop: "8px" }}>
          <Input
            type="text"
            id="userName"
            name="userName"
            lable={"Visit No. / Barcode No."}
            placeholder=" "
            // value={payload?.userName}
            // onChange={handleChange}
          />
        </div>
        {/* theme */}
        <div
          className="user-drop-container pointer"
          onClick={() => setShowThemes(!showThemes)}
          ref={themeProfile}
        >
          <i className="fas fa-palette mr-3 ml-2 mt-2 pointer ss-none"></i>
          {showThemes && (
            <div className="header-theme-menu">
              <ToggleTheme />
            </div>
          )}
        </div>
        {/* Home */}
        <i
          className="fa fa-home mr-3 pointer ss-none"
          onClick={() => navigate("/Dashboard")}
        ></i>
        <i
          className="pi pi-moon mr-3 pointer ss-none"
          style={{display:"none"}}
          onClick={changeDarkMode}
        ></i>
        {/* full Screen */}
        <i
          className="fa fa-expand mr-3 pointer ss-none"
          aria-hidden="true"
          onClick={toggleFullScreen}
        ></i>

        {/* User Profile */}
        <div
          className="user-Info-container"
          onClick={() => setShowUserProfile(!showUserProfile)}
          ref={userProfile}
        >
          <img src={defaultUserImg} alt="" className="user-info-image" />

          <span className="header-userName">&nbsp;&nbsp;&nbsp;Itd-Admin</span>
          {showUserProfile && (
            <div className="header-dropDown-menu">
              <UserHeader
                handleThemeChange={handleThemeChange}
                handleLogout={handleLogout}
              />
            </div>
          )}
        </div>
        {/* Logout */}
        <i
          className="fa fa-sign-out ml-3 pointer ss-none"
          aria-hidden="true"
          onClick={handleLogout}
        ></i>
      </div>
    </div>
  );
};

export default Header;

function UserHeader({ handleThemeChange, handleLogout }) {
  return (
    <div className="header-user-dropDown">
      <img src={defaultUserImg} alt="" className="user-dropdown-info-image" />
      <div className="row pt-2">
        <button className="btn btn-sm btn-light text-left">
          <i className="fa fa-home" aria-hidden="true">
            &nbsp;&nbsp;&nbsp;&nbsp;
          </i>
          Home
        </button>
      </div>
      <div className="row pt-2">
        <button
          className="btn btn-sm btn-light text-left"
          onClick={handleThemeChange}
          style={{ textAlign: "left" }}
        >
          <i className="fas fa-palette">&nbsp;&nbsp;&nbsp;</i> Theme
        </button>
      </div>
      <div className="row pt-2">
        <button className="btn btn-sm btn-light text-left">
          <i className="fa fa-edit">&nbsp;&nbsp;&nbsp;&nbsp;</i>Edit Profile
        </button>
      </div>
      <div className="row pt-2">
        <button
          className="btn btn-sm btn-light text-left"
          onClick={toggleFullScreen}
        >
          <i className="fa fa-expand " aria-hidden="true">
            &nbsp;&nbsp;&nbsp;&nbsp;
          </i>
          Full Screen
        </button>
      </div>
      <div className="row pt-2">
        <button
          className="btn btn-sm btn-danger text-left"
          onClick={handleLogout}
        >
          <i className="fa fa-sign-out pointer" aria-hidden="true">
            &nbsp;&nbsp;&nbsp;&nbsp;
          </i>
          Log Out
        </button>
      </div>
    </div>
  );
}

function ToggleTheme() {
  const [theme, setTheme] = useState(
    window.localStorage.getItem("theme") || "default"
  );

  // useEffect(() => {}, [theme]);

  const toggleTheme = (ele) => {
    setTheme(ele.value);
    if (theme && theme !== "") {
      document.documentElement.setAttribute("data-theme", ele.value);
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem("theme", ele.value);
  };

  const themeValue = [
    {
      Name: "Default",
      value: "",
      color: "#555299",
    },
    {
      Name: "Grey",
      value: "grey",
      color: "#666866",
    },
    {
      Name: "Brown",
      value: "brown",
      color: "#8b2424",
    },
    {
      Name: "Blue",
      value: "blue",
      color: "#03a0e7",
    },
    {
      Name: "Pale Pink",
      value: "palePink",
      color: "#f78e8e",
    },
    {
      Name: "Peach",
      value: "peach",
      color: "#bc8f3c",
    },
    {
      Name: "Green",
      value: "green",
      color: "#22d8a9",
    },
  ];

  return (
    <div className="header-theme-dropDown">
      {themeValue.map((ele, ind) => (
        <div className="theme-div" key={ind} onClick={() => toggleTheme(ele)}>
          <div
            className="theme-div-color"
            style={{ background: ele.color }}
          ></div>
          &nbsp; {ele.Name}
        </div>
      ))}
    </div>
  );
}
