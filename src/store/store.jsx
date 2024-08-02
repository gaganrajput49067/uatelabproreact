import { configureStore } from "@reduxjs/toolkit";

import {
  loadingSlice,
  loginSlice,
  logoutSlice,
  forgetPasswordSlice,
} from "./reducers";

const store = configureStore({
  reducer: {
    loginSlice: loginSlice,
    loadingSlice: loadingSlice,
    logoutSlice: logoutSlice,
    forgetPasswordSlice: forgetPasswordSlice,
  },
});

export default store;
