import { createSlice } from "@reduxjs/toolkit";

// Refresh pe localStorage se hydrate karo
const token = localStorage.getItem('accessToken');
const user = (() => {
  try {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  } catch { return null; }
})();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: user,
    token: token,
    isLoggedIn: !!(token && user),  // dono hain tabhi true
    otpSent: false,
    otpVerified: false,
    resetDone: false,
    isDark: true,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      localStorage.setItem('user', JSON.stringify(action.payload)); // save karo
    },
    setToken: (state, action) => {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem('accessToken', action.payload);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user'); // clear karo
    },
    toggleTheme: (state) => {
      state.isDark = !state.isDark;
    },
    setOtpSent: (state, action) => { state.otpSent = action.payload; },
    setOtpVerified: (state, action) => { state.otpVerified = action.payload; },
    setResetDone: (state, action) => { state.resetDone = action.payload; },
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