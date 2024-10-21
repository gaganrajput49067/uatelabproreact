import moment from "moment";
import { useEffect } from "react";
import { StatusCheck } from "./Constants";
import { getLocalStorageDecryptData } from "../Navigation/Storage";
import * as XLSX from "xlsx";
export function getCookie(name) {
  const matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
        "=([^;]*)"
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
};

export function useClickOutside(ref, handleClose, active) {
  useEffect(() => {
    if (!active) return;

    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, handleClose, active]);
}
export const changeDarkMode = () => {
  document.documentElement.getAttribute("data-theme") == "DarkMode"
    ? document.documentElement.removeAttribute("data-theme")
    : document.documentElement.setAttribute("data-theme", "DarkMode");
};
export const useLocalStorage = (key, type, valueToStore) => {
  if (type === "set") {
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  } else if (type === "get") {
    return JSON.parse(getLocalStorageDecryptData(key));
  }
};
export const PreventNumber = (value) => {
  const reg = /^([^0-9$%]*)$/;
  if (reg.test(value)) {
    return PreventSpecialCharacter(value);
    // return true;
  } else {
    return false;
  }
};
export const number = (e, sliceValue, valueGreater) => {
  if (handleCheckDot(e)) {
    return (e.target.value = e.target.value.replace(".", ""));
  } else {
    if (valueGreater) {
      return e.target.value > valueGreater
        ? (e.target.value = e.target.value.slice(0, e.target.value.length - 1))
        : (e.target.value = e.target.value.slice(0, sliceValue));
    } else {
      return (e.target.value = e.target.value.slice(0, sliceValue));
    }
  }
};
const handleCheckDot = (e) => {
  const data = [...e.target.value];
  return data.includes(".");
};

export const PreventSpecialCharacter = (value) => {
  const reg = /[^a-zA-Z 0-9 ]/g;
  if (!reg.test(value)) {
    return true;
  } else {
    return false;
  }
};
export const autocompleteOnBlur = (state) => {
  setTimeout(() => {
    state([]);
  }, 500);
};
export const getTrimmedData = (obj) => {
  if (obj && typeof obj === "object") {
    Object.keys(obj).map((key) => {
      if (typeof obj[key] === "object") {
        getTrimmedData(obj[key]);
      } else if (typeof obj[key] === "string") {
        obj[key] = obj[key].trim();
      }
    });
  }
  return obj;
};

export const AddBlankData = (state, name) => {
  return [{ label: name, value: "" }, ...state];
};
export const AllDataDropDownPayload = (data, state, key) => {
  if (data) {
    return [parseInt(data)];
  } else {
    const val = state?.map((ele) => ele[key]);
    return val;
  }
};

export const isChecked = (name, state, value, id) => {
  if (id) {
    const data = state?.map((ele) => {
      if (ele?.TestID === id) {
        return ele[name] === value ? true : false;
      } else {
        return ele;
      }
    });
    return data;
  } else {
    const data = state?.map((ele) => {
      return ele[name] == value ? true : false;
    });
    return data;
  }
};
export const dateConfig = (date, withTime) => {
  if (withTime === 0) {
    return moment(date && date).format("DD/MMM/YYYY") === "Invalid date"
      ? "-"
      : moment(date && date).format("DD/MMM/YYYY");
  } else {
    return moment(date && date).format("DD/MMM/YYYY hh:mm a") === "Invalid date"
      ? "-"
      : moment(date && date).format("DD/MMM/YYYY hh:mm a");
  }
};
export const Time = (date) => {
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
};
export const selectedValueCheck = (selectedState, state) => {
  const data = selectedState.find((ele) => ele.value == state);
  return data === undefined ? { label: "", value: "" } : data;
};
export const DyanmicStatusResponse = (state) => {
  let status = -1;
  for (let i = 0; i < state?.length; i++) {
    if (state[i].isChecked === true) {
      status = state[i].Status;
      break;
    }
  }
  return StatusCheck[status];
};
export const AllowCharactersNumbersAndSpecialChars = (value) => {
  const reg = /[^a-zA-Z0-9\-\/ ]|(\s{2,})|(\/{2,})|(-{2,})/g;
  return !reg.test(value);
};
export const IndexHandle = (currentPage, pageSize) => {
  return (currentPage - 1) * pageSize;
};

export const ExportToExcel = (data, fileName = "data.xlsx") => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, fileName);
};

export const isCheckedNew = (name, state, value, id, secondName) => {
  const data = state?.map((ele) => {
    if (ele[secondName] === id) {
      return ele[name] === value ? true : false;
    } else {
      return ele;
    }
  });
  return data;
};

export const getBase64 = (file) => {
  return new Promise((resolve) => {
    let baseURL = "";
    // Make new FileReader
    let reader = new FileReader();

    // Convert the file to base64 text
    reader.readAsDataURL(file);

    // on reader load somthing...
    reader.onload = () => {
      // Make a fileInfo Object
      baseURL = reader.result;
      resolve(baseURL);
    };
  });
};

export const getLabelUrl = (url) => {
  switch (url) {
    case "/patientregister":
      return <span className="linkStatecss">Patient Registration</span>;
    case "/samplecollection":
      return <span className="linkStatecss">Sample Collection</span>;
    case "/departmentreceive":
      return <span className="linkStatecss">Department Receive</span>;
    case "/resultentry":
      return <span className="linkStatecss">Result Entry</span>;
    case "/dispatchreport":
      return <span className="linkStatecss">Dispatch Lab Report</span>;
    case "/receiptreprint":
      return <span className="linkStatecss">Receipt Reprint</span>;
    case "/resultculture":
      return <span className="linkStatecss">Result Culture</span>;
  }
};

export const getLabIcons = (icon) => {
  switch (icon) {
    case "/patientregister":
      return <i className="fas fa-tachometer-alt nav-icon "></i>;
    case "/samplecollection":
      return <i className="fas fa-tachometer-alt nav-icon"></i>;
    case "/departmentreceive":
      return <i className="fas fa-tachometer-alt nav-icon"></i>;
    case "/resultentry":
      return <i className="fas fa-tachometer-alt nav-icon"></i>;
    case "/dispatchreport":
      return <i className="fas fa-tachometer-alt nav-icon"></i>;
    case "/receiptreprint":
      return <i className="fas fa-tachometer-alt nav-icon"></i>;
    case "/resultculture":
      return <i className="fas fa-tachometer-alt nav-icon"></i>;
  }
};

export function formatDate(dateString) {
  const date = new Date(dateString);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = monthNames[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}
