import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setLoading } from "../loadingSlice/loadingSlice";
import axios from "axios";

const initialState = {
  user: {},
  loading: false,
  error: "",
  message: "",
  success: false,
};

// Define the signInAction
export const signInAction = createAsyncThunk(
  "login/signIn",
  async (credentials, { rejectWithValue,dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await axios.post("/api/v1/Users/login", credentials);
      dispatch(setLoading(false));
      return response.data;
    } catch (error) {
      dispatch(setLoading(false));
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginSlice = createSlice({
  name: "loginSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signInAction.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(signInAction.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.success = true;
        state.error = "";
        state.message = action.payload.message;
      })
      .addCase(signInAction.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message;
        state.success = false;
        state.message = error.message;
      });
  },
});

export default loginSlice.reducer;
