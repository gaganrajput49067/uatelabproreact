import { configureStore } from "@reduxjs/toolkit";

import { loadingSlice, loginSlice } from "./reducers";

const store = configureStore({
  reducer: {
    loginSlice: loginSlice,
    loadingSlice: loadingSlice,
  },
});

export default store;
