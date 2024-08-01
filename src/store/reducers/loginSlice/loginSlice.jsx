import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const initialState = {
  user: {},
  loading: false,
  error: "",
  message: "",
  success: false,
};

export const signInAction = createAsyncThunk();
export const loginSlice = createSlice({
  name: "loginSlice",
  initialState,
  reducers: {},
});
export default loginSlice.reducer;
