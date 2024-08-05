import React, { useEffect, useRef, useState } from "react";
import "../../zStyles/Sidebar.css";
import logo from "../../assets/image/logo.png";
import SelectBox from "../CommonComponent/SelectBox";

const Sidebar = ({ closeSidebar, menuData }) => {
  const [selectedMenu, setSelectedMenu] = useState(menuData ? menuData[0] : []);

  const handleChange = (e) => {
    const { name, value, option } = e.target;
    console.log(e.target);
    if (name === "menu") {
      setSelectedMenu(option);
    }
  };

  return (
    <div className="navBar-Container">
      <div className="navBar-header">
        <div>
          <img style={{ width: "25px", height: "25px" }} src={logo} alt="" />{" "}
          <span>ItDose Infosystem</span>
        </div>
        <div onClick={closeSidebar} className="pointer">
          <i className="fa fa-bars" aria-hidden="true"></i>
        </div>
      </div>
      <div className="navBar-menu">
        <div type="button" className="nav-main-menu">
          <SelectBox
            name={"menu"}
            placeholderName="Registration"
            dynamicOptions={menuData}
            searchable={true}
            value={Number(selectedMenu?.value)}
            respclass="roll-off"
            handleChange={handleChange}
            plcN="Menu"
          />
        </div>

        <input
          type="text"
          className="nav-main-menu-input"
          placeholder="Search Menu"
        />
      </div>

      <div className="sidebarMenu Flipped">
        <SidebarMenu pageData={selectedMenu.pageData ?? []} />
      </div>
    </div>
  );
};

export default Sidebar;

function SidebarMenu(pageData = []) {
  let page = pageData.pageData || [];
  console.log(pageData.pageData);

  const divRef = useRef(null);
  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollLeft = 0;
    }
  }, []);
  return (
    <div ref={divRef} style={{ direction: "ltr" }}>
      {page &&
        page.length > 0 &&
        page.map((ele) => {
          return (
            <p className="sidebar-submenu">
              <i className="fa fa-bullseye" aria-hidden="true">
                &nbsp;&nbsp;
              </i>
              {ele?.PageName}
            </p>
          );
        })}
    </div>
  );
}
