import { createSlice } from "@reduxjs/toolkit";
import { getStores } from "../API/store";

const getstoresSlice = createSlice({
  name: "stores",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStores.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default getstoresSlice.reducer;
