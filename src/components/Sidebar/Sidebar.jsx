import React, { useEffect, useRef, useState } from "react";
import "../../zStyles/Sidebar.css";
import logo from "../../assets/image/logo.png";
import ReactSelect from "../CommonComponent/ReactSelect";

const Sidebar = ({ closeSidebar, menuData }) => {
  const [selectedMenu, setSelectedMenu] = useState({
    menuValue: menuData ? menuData[0]?.value : "",
    pageData: menuData ? menuData[0]?.pageData : [],
  });
  const handleChange = (name, e) => {
    const { value, pageData } = e;
    if (name === "MenuBar") {
      setSelectedMenu({
        menuValue: value,
        pageData: pageData,
      });
    }
  };
  const [originalPageData] = useState(selectedMenu?.pageData);

  const handleSearchPage = (value) => {
      if (!value) {
          setSelectedMenu({
              ...selectedMenu,
              pageData: originalPageData,
          });
          return;
      }
      const filteredPages = originalPageData?.filter((page) =>
        page?.PageName?.toLowerCase()?.includes(value?.toLowerCase())
      );
  
      setSelectedMenu({
        ...selectedMenu,
        pageData: filteredPages,
      });
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
        <div className="nav-main-menu">
          <ReactSelect
            className="required-fields"
            name="MenuBar"
            placeholderName="MenuBar"
            id="MenuBar"
            dynamicOptions={menuData}
            value={selectedMenu?.menuValue}
            onChange={handleChange}
          />
        </div>

        <input
          type="text"
          className="nav-main-menu-input"
          placeholder="Search Menu"
          onChange={(e) => handleSearchPage(e?.target?.value)}
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
