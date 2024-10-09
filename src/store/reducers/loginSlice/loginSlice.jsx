import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setLoading } from "../loadingSlice/loadingSlice";
import { axiosInstance } from "../../../utils/axiosInstance";
import { toast } from "react-toastify";
import axios from "axios";

const initialState = {
  user: {},
  token:"",
  loading: false,
  error: "",
  message: "",
  success: false,
};

export const signInAction = createAsyncThunk(
  "login",
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.post("login/login", credentials);

      dispatch(setLoading(false));
      toast.success("Login is succeed!");
      console.log(response);
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      dispatch(setLoading(false));
      return rejectWithValue(error.response.data);
    }
  }
);

export const logOutAction = createAsyncThunk(
  "logout",
  async (credentials, { rejectWithValue, dispatch }) => {
    try {
      dispatch(setLoading(true));
      const response = await axiosInstance.post("login/logout", credentials);
      dispatch(setLoading(false));
      toast.success("LogOut Successfully !!");
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
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
        console.log(action);
        state.user = action.payload.user;
        state.token=action.payload.token
        state.loading = false;
        state.success = true;
        state.error = "";
        // document.cookie = `tokend=${action.payload.token}; path=/`;
      })
      .addCase(signInAction.rejected, (state, error) => {
        state.loading = false;
        // state.error = error.payload.data.message;
        state.success = false;
      });
    builder
      .addCase(logOutAction.pending, (state) => {
        state.loading = true;
        state.error = "";
        state.success = false;
      })
      .addCase(logOutAction.fulfilled, (state) => {
        state.user = {};
        state.loading = false;
        state.success = false;
        state.error = "";
        document.cookie = "tokend=; Max-Age=-99999999; path=/";
      })
      .addCase(logOutAction.rejected, (state, error) => {
        state.loading = false;
        // state.error = error.payload.message;
        state.success = false;
        // state.message = error.payload.message;
      });
  },
});

export default loginSlice.reducer;
