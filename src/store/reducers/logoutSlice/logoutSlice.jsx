import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setLoading } from "../loadingSlice/loadingSlice";

const initialState = {
  loading: false,
  error: "",
  message: "",
  success: false,
};
export const logoutAction = createAsyncThunk(
  "logout",
  async ({ rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.get("Users/logout");
      dispatch(setLoading(false));
      return response.data;
    } catch (error) {
      console.log(error);
      dispatch(setLoading(false));
      return rejectWithValue(error.response.data);
    }
  }
);

export const logoutSlice = createSlice({
  name: "logoutSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logoutAction.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(logoutAction.fulfilled, (state, action) => {
        localStorage.clear();
        state.loading = false;
        state.success = true;
      })
      .addCase(logoutAction.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
      });
  },
});

export default logoutSlice.reducer;
