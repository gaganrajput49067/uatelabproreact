import { useRef, useState } from "react";
import "./App.css";
import "./zStyles/Sidebar.css";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import { useClickOutside } from "./utils/helpers";

function App() {
  const sideBarRef = useRef(null);
  const [showSidebar, setShowSideBar] = useState(false);

  const handleSidebar = () => {
    setShowSideBar(!showSidebar);
  };

  const closeSidebar = () => {
    console.log("object");
    setShowSideBar(false);
  };
  useClickOutside(sideBarRef, closeSidebar, showSidebar);
  return (
    <div>
      <Header handleSidebar={handleSidebar} />
      <div
        className={`main-nav-bar ${showSidebar ? "open" : ""}`}
        ref={sideBarRef}
      >
        {showSidebar && (
          <Sidebar showSidebar={showSidebar} closeSidebar={closeSidebar} />
        )}
      </div>
    </div>
  );
}

export default App;
