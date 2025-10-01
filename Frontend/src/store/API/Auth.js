import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const userRegister = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const userLogin = createAsyncThunk(
   "user/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
      }
  }
);
