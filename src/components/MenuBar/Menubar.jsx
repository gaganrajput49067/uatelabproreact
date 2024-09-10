import React, { useEffect, useRef, useState } from "react";
import "../../zStyles/menubar.css";
import { useLocation, useNavigate } from "react-router-dom";
const Menubar = ({ pageData = [], handleSidebar }) => {
  const navigate = useNavigate();
  const [filterdMenu, setFilterdMenu] = useState([]);
  useEffect(() => {
    setFilterdMenu(pageData ? pageData : []);
  }, [pageData]);

  const containerRef = useRef(null);
  const location = useLocation();
  useEffect(() => {
    const handleScroll = (event) => {
      if (event.deltaY !== 0) {
        event.preventDefault(); // Prevent vertical scrolling
        containerRef.current.scrollLeft += event.deltaY;
        // containerRef.current.scrollBy({
        //   left: event.deltaY, // Scroll horizontally based on the vertical delta
        //   behavior: 'smooth', // Enable smooth scrolling
        // });
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

  const handleScrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -100, // Adjust scroll distance as needed
        behavior: "smooth", // Smooth scrolling
      });
    }
  };

  const handleScrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: 100, // Adjust scroll distance as needed
        behavior: "smooth", // Smooth scrolling
      });
    }
  };

  return (
    <div className="menubar-main-container ss-none">
      <i
        className="fa fa-bars mr-2 pointer menubar-navbar fw-bold"
        onClick={handleSidebar}
      ></i>
      <i
        className="fa fa-angle-left px-1 pointer mr-2 text-white"
        onClick={handleScrollLeft}
      ></i>
      <div className="main-menu-container" ref={containerRef}>
        {filterdMenu.map((ele, key) => {
          return (
            <span
              key={ele?.PageName}
              onClick={() => navigate(ele?.PageUrl)}
              className={`nav-item mr-1 fw-normal ${
                location.pathname.toLowerCase() == ele?.PageUrl.toLowerCase()
                  ? "active-tab-menu"
                  : ""
              }`}
            >
              <i className="fas fa-tachometer-alt nav-icon"></i> {ele?.PageName}
            </span>
          );
        })}
      </div>
      <i
        className="fa fa-angle-right mr-2 px-1 pointer text-white"
        onClick={handleScrollRight}
      ></i>
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
