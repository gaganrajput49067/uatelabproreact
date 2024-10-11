import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { axiosInstance } from "../utils/axiosInstance";
import { toast } from "react-toastify"; // Ensure you have this import if using toast notifications
import { getLocalStorageDecryptData } from "./Storage";

const PrivateRoute = ({ element, path }) => {
  const CompanyCode = getLocalStorageDecryptData("CompanyCode");
  const Showdashboard = getLocalStorageDecryptData("ShowDashboard");
  const token = localStorage.getItem("token");

  const accessedURL = async (value) => {
    try {
      const res = await axiosInstance.post("Menu/ValidMenuPageData", {
        Url: value,
      });
      return res.data;
    } catch (err) {
      console.log(err.response ? err.response.data : "Something Went Wrong");
      return null;
    }
  };

  const checkAccessRights = async () => {
    const accessedData = await accessedURL(window.location.pathname);
    const accessiblePaths = [
      "/dashboard",
      "/designations",
      "/pagemaster",
      "/menumaster",
      "/subpagemaster",
      "/apireportxyg",
      "/welcome",
      "/login",
      "/forgotpassword",
      "/"
    ];

    if (!accessiblePaths.includes(window.location.pathname.toLowerCase())) {
      const restrictedPaths = [
        "/companymasterlist",
        "/companymaster",
        "/companypaymentdetail",
      ];

      if (
        (CompanyCode?.toLowerCase() !== "itd" &&
          restrictedPaths.includes(window.location.pathname.toLowerCase())) ||
        accessedData?.message === "False"
      ) {
        toast.error(
          "You have not rights to access this page, Redirecting to Home.........."
        );

        const redirectPath = Showdashboard == 1 ? "/Dashboard" : "/Welcome";
        window.location.replace(redirectPath);
      }
    }
  };

  useEffect(() => {
    checkAccessRights();
  }, [window.location.pathname]);

  return token ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
