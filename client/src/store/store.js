import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import electricianReducer from "./electricianSlice";
import customerReducer from "./customerSlice";
import adminReducer from "./adminSlice";
import themeReducer from "./themeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    electrician: electricianReducer,
    customer: customerReducer,
    admin: adminReducer,
    theme: themeReducer,
  },
});