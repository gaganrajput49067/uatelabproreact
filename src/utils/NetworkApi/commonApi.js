import { toast } from "react-toastify";
import { axiosInstance } from "../axiosInstance";

export const getCentreDetails = (state) => {
  axiosInstance
    .get("Centre/getGlobalCentres")
    .then((res) => {
      let data = res.data.message;
      let value = data.map((ele) => {
        return {
          value: ele.CentreID,
          label: ele.Centre,
          DefaultCentreId: ele.DefaultCentreId,
        };
      });
      let responce = {
        defaultCentreId: value[0].DefaultCentreId,
        centre: value,
      };
      state(responce);
    })
    .catch((err) => {
      console.log(err);
      toast.error("Something went wrong");
    });
};

export const getPageData = (state, state2) => {
  axiosInstance
    .get("Menu/MainMenuPageData")
    .then((res) => {
      let data = res?.data?.message;
      let finalData = filtermenu(data?.MenuData, data?.pageData);
      state(finalData);
      state2(finalData[0]);
    })
    .catch((err) => {
      toast.error(
        err?.response?.data?.message
          ? err?.response?.data?.message
          : "Something Went Wrong"
      );
    });
};

const filtermenu = (menu, page) => {
  let resultData = [];
  const menuData = [...menu];
  const pageData = [...page];
  for (const item of menuData) {
    let subMenu = pageData.filter(
      (ele) =>
        ele.MenuName === item?.MenuName &&
        ele.MenuID === item?.MenuID &&
        ele.PageName !== "" &&
        ele.PageUrl !== ""
    );
    subMenu = subMenu.map((ele) => {
      return { ...ele, label: ele?.PageName, value: ele.PageID };
    });
    item.value = item?.MenuID;
    item.label = item?.MenuName;
    item.pageData = subMenu;
    resultData.push(item);
  }
  return resultData;
};

export const getQuickLinks = (setState) => {
  axiosInstance
    .get("Menu/getQuickLinks")
    .then((res) => {
      const datas = res?.data?.message?.map((ele) => ele?.Url?.toLowerCase());
      setState(datas);
    })
    .catch((err) => {
      toast.error(
        err?.response?.data?.message
          ? err?.response?.data?.message
          : "Something Went Wrong"
      );
    });
};

export const getAccessCentres = ({ state, callbackFun }) => {
  axiosInstance
    .get("Centre/getAccessCentres")
    .then((res) => {
      let data = res.data.message;
      if (Array.isArray(data)) {
        let CentreDataValue = data.map((ele) => {
          return {
            value: ele.CentreID,
            label: ele.Centre,
          };
        });
        state(CentreDataValue);
        callbackFun(
          "CentreID",
          CentreDataValue?.map((ele) => ele?.value)
        );
      } else {
        console.error("Unexpected data format:", data);
      }
    })
    .catch((err) => {
      console.log("API call failed:", err); // Log error
    });
};
