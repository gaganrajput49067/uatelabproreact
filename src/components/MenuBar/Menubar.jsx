import React, { useEffect, useRef, useState } from "react";
import "../../zStyles/menubar.css";
import { useNavigate } from "react-router-dom";
const Menubar = ({ pageData = [], handleSidebar }) => {
  const navigate = useNavigate();
  const [filterdMenu, setFilterdMenu] = useState([]);
  console.log(pageData);
  useEffect(() => {
    setFilterdMenu(pageData ? pageData : []);
  }, [pageData]);

  console.log(filterdMenu);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = (event) => {
      if (event.deltaY !== 0) {
        event.preventDefault(); // Prevent vertical scrolling
        containerRef.current.scrollLeft += event.deltaY; // Scroll horizontally
      }
    };

    const currentRef = containerRef.current;
    if (currentRef) {
      currentRef.addEventListener("wheel", handleScroll);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("wheel", handleScroll);
      }
    };
  }, []);

  const handleChange = (event) => {
    const { value } = event.target;
    let menu = pageData;
    setFilterdMenu(
      menu.filter((item) =>
        item.PageName.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  return (
    <div className="menubar-main-container ss-none">
      <i
        className="fa fa-bars mr-2 pointer menubar-navbar"
        onClick={handleSidebar}
      ></i>
      <div className="main-menu-container" ref={containerRef}>
        {filterdMenu.map((ele, key) => {
          return (
            <span key={ele?.PageName} onClick={() => navigate(ele?.PageUrl)}>
              <i className="fas fa-tachometer-alt nav-icon"></i> {ele?.PageName}
            </span>
          );
        })}
      </div>
      <div className="search-container">
        <input
          className="search-menu-container"
          type="text"
          placeholder="Search Menu"
          onChange={handleChange}
        />
        <i className="fa fa-search"></i>
      </div>
    </div>
  );
};

export default Menubar;
