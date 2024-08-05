import { useEffect, useRef, useState } from "react";
import "./App.css";
import "./zStyles/Sidebar.css";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import { getCookie, useClickOutside } from "./utils/helpers";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "./utils/axiosInstance";
import { getPageData } from "./utils/NetworkApi/commonApi";
function App() {
  const navigate = useNavigate();
  const sideBarRef = useRef(null);
  const [showSidebar, setShowSideBar] = useState(false);
  const [menuData, setMenuData] = useState(null);

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
    getPageData(setMenuData);
  }, []);

  return (
    <div>
      <div className="text-run">
        <span>Your Subscription is going to expire on 12th August 2024</span>
      </div>
      <Header handleSidebar={handleSidebar} menuData={menuData} />
      <div
        className={`main-nav-bar ${showSidebar ? "open" : ""}`}
        ref={sideBarRef}
      >
        {showSidebar && (
          <Sidebar
            showSidebar={showSidebar}
            closeSidebar={closeSidebar}
            menuData={menuData}
          />
        )}
      </div>
    </div>
  );
}

export default App;
