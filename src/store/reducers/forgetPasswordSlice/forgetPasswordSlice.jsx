import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setLoading } from "../loadingSlice/loadingSlice";
import { axiosInstance } from "../../../utils/axiosInstance";

const initialState = {
  user: {},
  loading: false,
  error: "",
  message: "",
  success: false,
};

export const forgetPasswordAction = createAsyncThunk(
  "forget",
  async ({ credentials, Api }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.post(Api, credentials);
      dispatch(setLoading(false));
      return response.data;
    } catch (error) {
      console.log(error);
      dispatch(setLoading(false));
      return rejectWithValue(error.response.data);
    }
  }
);

export const forgetPasswordSlice = createSlice({
  name: "forgetSlice",
  initialState,
  reducers: {
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(forgetPasswordAction.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(forgetPasswordAction.fulfilled, (state, action) => {

        state.loading = false;
        state.success = true;
        state.error = "";
      })
      .addCase(forgetPasswordAction.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
      });
  },
});
export const { resetState } = forgetPasswordSlice.actions;
export default forgetPasswordSlice.reducer;
