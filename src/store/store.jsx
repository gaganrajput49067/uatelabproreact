import { configureStore } from "@reduxjs/toolkit";

import { loadingSlice, loginSlice, forgetPasswordSlice } from "./reducers";

const store = configureStore({
  reducer: {
    loginSlice: loginSlice,
    loadingSlice: loadingSlice,
    forgetPasswordSlice: forgetPasswordSlice,
  },
});

export default store;
