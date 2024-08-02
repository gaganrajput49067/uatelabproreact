import React, { useEffect, useRef } from "react";
import "../../zStyles/Sidebar.css";
import logo from "../../assets/image/logo.png";
import SelectBox from "../CommonComponent/SelectBox";

const Sidebar = ({ closeSidebar }) => {
  return (
    <div className="navBar-Container">
      <div className="navBar-header">
        <div>
          <img style={{ width: "25px", height: "25px" }} src={logo} alt="" />{" "}
          <span>ItDose Infosystem</span>
        </div>
        <div onClick={closeSidebar} className="pointer">
          <i class="fa fa-bars" aria-hidden="true"></i>
        </div>
      </div>
      <div className="navBar-menu">
        <div type="button" className="nav-main-menu">
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

        <input
          type="text"
          className="nav-main-menu-input"
          placeholder="Search Menu"
        />

        <span>sad</span>
        <span>sfa</span>
      </div>
    </div>
  );
};

export default Sidebar;
