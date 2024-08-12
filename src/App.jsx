import { useEffect, useRef, useState } from "react";
import "./App.css";
import "./index.css";
import "./zStyles/Sidebar.css";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import { getCookie, useClickOutside } from "./utils/helpers";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { axiosInstance } from "./utils/axiosInstance";
import { getPageData } from "./utils/NetworkApi/commonApi";
import Menubar from "./components/MenuBar/Menubar";
function App() {
  const navigate = useNavigate();
  const sideBarRef = useRef(null);
  const [showSidebar, setShowSideBar] = useState(false);
  const [menuData, setMenuData] = useState(null);
  const [notification, setNotification] = useState(false);
  const [pageData, setPageData] = useState([]);

  const { user, loading, error, success } = useSelector(
    (state) => state.loginSlice
  );

  const handleSidebar = () => {
    setShowSideBar(!showSidebar);
  };

  const closeSidebar = () => {
    setShowSideBar(false);
  };

  useClickOutside(sideBarRef, closeSidebar, showSidebar);

  useEffect(() => {
    const tokenValue = getCookie("tokend");
    if (tokenValue == "" || tokenValue === undefined) {
      window.sessionStorage.clear();
      window.localStorage.clear();
      navigate("/login");
    }
  }, [success, navigate]);

  useEffect(() => {
    getPageData(setMenuData, setPageData);
  }, []);

  const handlePage = (e) => {
    setPageData(e);
  };

  return (
    <div>
      {notification && (
        <div className="text-notification">
          <span>Your Subscription is going to expire on 12th August 2024</span>
          <i className="fa fa-close" onClick={() => setNotification(false)}></i>
        </div>
      )}
      <div className="main-header-sidebar-container">
        <Header
          handleSidebar={handleSidebar}
          menuData={menuData}
          handlePage={handlePage}
        />
        <div
          className={`main-nav-bar ${showSidebar ? "open" : ""}`}
          ref={sideBarRef}
        >
          {showSidebar && (
            <Sidebar
              showSidebar={showSidebar}
              closeSidebar={closeSidebar}
              menuData={menuData}
              handlePage={handlePage}
            />
          )}
        </div>
      </div>
      <Menubar pageData={pageData} handleSidebar={handleSidebar} />
      <div className="outer-container-main">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
