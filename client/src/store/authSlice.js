import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    isLoggedIn: false,
    otpSent: false,
    otpVerified: false,
    resetDone: false,
    isDark: true,       
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      // Save token to localStorage for axios interceptor
      if (action.payload) {
        localStorage.setItem('accessToken', action.payload);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      // Clear token from localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
     toggleTheme: (state) => {     
      state.isDark = !state.isDark;
    },
    setOtpSent: (state, action) => {
      state.otpSent = action.payload;
    },
    setOtpVerified: (state, action) => {
      state.otpVerified = action.payload;
    },
    setResetDone: (state, action) => {
      state.resetDone = action.payload;
    },
    clearForgotPassword: (state) => {
      state.otpSent = false;
      state.otpVerified = false;
      state.resetDone = false;
    },
  },
});

export const {
  setUser, setToken, logout, toggleTheme,
  setOtpSent, setOtpVerified, setResetDone, clearForgotPassword,
} = authSlice.actions;
export default authSlice.reducer;