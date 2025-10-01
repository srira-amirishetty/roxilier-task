import { configureStore } from "@reduxjs/toolkit";

import LoginUserReducer from "./Slice/loginSlice";
import getStoresReducer from "./Slice/getStoresSlice";

export const store = configureStore({
  reducer: {
    LoginAPI: LoginUserReducer,
    getStores: getStoresReducer,
  },
});