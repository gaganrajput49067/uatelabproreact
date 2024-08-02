import React, { useEffect, useRef, useState } from "react";
import "../../zStyles/Header.css";
import defaultUserImg from "../../assets/image/user.png";
import { toggleFullScreen, useClickOutside } from "../../utils/helpers";
import Input from "../CommonComponent/Input";
import SelectBox from "../CommonComponent/SelectBox";

const Header = () => {
  const userProfile = useRef(null);
  const themeProfile = useRef(null);
  const inputProfile = useRef(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const handleUserProfile = () => {
    setShowUserProfile(false);
  };

  const handleThemeProfile = () => {
    setShowThemes(false);
  };

  const handleInputProfile = () => {
    setShowInput(false);
  };

  useClickOutside(userProfile, handleUserProfile, showUserProfile);
  useClickOutside(themeProfile, handleThemeProfile, showThemes);
  useClickOutside(inputProfile, handleInputProfile, showInput);

  return (
    <div className="header-main-container">
      <div className="company-info">
        <span>ITD </span>
        <span className="ss-none">&nbsp;Itdose Infosystem</span>
      </div>
      <div className="header-item-container">
        {/* Menu Select Box */}
        <div type="button" className="header-menu mt-2">
          <SelectBox
            placeholderName="Registration"
            // dynamicOptions={GetEmployeeWiseCenter?.map((ele) => {
            //   return { label: ele.CentreName, value: ele.CentreID };
            // })}
            searchable={true}
            // value={Number(localData?.defaultCentre)}
            respclass="roll-off"
            // handleChange={handleChangeCentre}
            plcN="center"
          />
        </div>
        {/* Centre Select Box */}
        <div type="button" className="header-centre mt-2">
          <SelectBox
            placeholderName="Select Centre"
            // dynamicOptions={GetEmployeeWiseCenter?.map((ele) => {
            //   return { label: ele.CentreName, value: ele.CentreID };
            // })}
            searchable={true}
            // value={Number(localData?.defaultCentre)}
            respclass="roll-off"
            // handleChange={handleChangeCentre}
            plcN="center"
          />
        </div>
        <div className="header-search-btn">
          <i
            class="fa fa-search mr-3 ml-2 pointer ls-none "
            onClick={() => setShowInput(!showInput)}
          ></i>
          {showInput && (
            <div className="header-search-menu" ref={inputProfile}>
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
              </div>
            </div>
          )}
        </div>
        {/* Vsit Box */}
        <div className="header-visit ss-none">
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
        </div>
        {/* theme */}
        <div
          className="user-drop-container pointer"
          onClick={() => setShowThemes(!showThemes)}
        >
          <i className="fas fa-palette mr-3 ml-2 pointer"></i>
          {showThemes && (
            <div className="header-dropDown-menu" ref={themeProfile}>
              <ToggleTheme />
            </div>
          )}
        </div>
        <i className="fa fa-home mr-3 pointer"></i>
        <i
          className="fa fa-expand mr-3 pointer ss-none"
          aria-hidden="true"
          onClick={toggleFullScreen}
        ></i>
        <div
          className="user-Info-container"
          onClick={() => setShowUserProfile(!showUserProfile)}
        >
          <img src={defaultUserImg} alt="" className="user-info-image" />

          <span className="header-userName">&nbsp;&nbsp;&nbsp;Itd-Admin</span>
          {showUserProfile && (
            <div className="header-dropDown-menu" ref={userProfile}>
              <UserHeader />
            </div>
          )}
        </div>
        <i className="fa fa-sign-out ml-3 pointer" aria-hidden="true"></i>
      </div>
    </div>
  );
};

export default Header;

function UserHeader() {
  return (
    <div className="header-user-dropDown">
      <img src={defaultUserImg} alt="" className="user-dropdown-info-image" />
      <div className="row pt-2">
        <button className="btn btn-sm btn-primary">Edit Profile</button>
      </div>
      <div className="row pt-2">
        <button className="btn btn-sm btn-danger">Log Out</button>
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
      color: "#bc3c8b",
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
