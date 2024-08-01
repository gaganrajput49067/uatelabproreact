import { configureStore } from "@reduxjs/toolkit";

import { loginSlice } from "./reducers";

const store = configureStore({
  reducer: {
    loginSlice: loginSlice,
  },
});

export default store;
