import { useEffect } from "react";
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

export const useLocalStorage = (key, type, valueToStore) => {
  if (type === "set") {
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  } else if (type === "get") {
    return JSON.parse(window.localStorage.getItem(key));
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
    return (e.target.value = e.target.value.replace(".",""));
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
