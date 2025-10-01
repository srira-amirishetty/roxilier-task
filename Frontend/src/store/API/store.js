import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL;

export const createStore = createAsyncThunk(
  "create/store",
  async (Data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/store/`, Data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const getStores = createAsyncThunk(
   "get/stores",
  async ({ page = 1, name = "", address = "" }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/store/`,{
        params: { page, name, address }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
      }
  }
);
