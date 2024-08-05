import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
