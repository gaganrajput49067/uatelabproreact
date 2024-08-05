import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mainMenu : null,
  pageData : null,
};

export const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  reducers: {
    getPageData: async(state, actions) => {
      if (state.mainMenu) {
        return state.mainMenu
      } else {
        try {
            const response = await axiosInstance.get("Menu/MainMenuPageData");
            state.mainMenu = response.data;
            return response.data;
          } catch (error) {
            toast.error(error?.response?.data?.message);
            return rejectWithValue(error.response.data);
          }
      }
    },
  },
});
export const { getPageData } = commonSlice.actions;
export default commonSlice.reducer;