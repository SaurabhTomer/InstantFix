import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  usersMeta: { total: 0, page: 1, pages: 1 },
  pendingElectricians: [],
  allRequests: [],
  requestsMeta: { total: 0, page: 1, pages: 1 },
  stats: {
    totalUsers: 0,
    totalElectricians: 0,
    totalRequests: 0,
    completedRequests: 0,
    pendingRequests: 0,
    cancelledRequests: 0,
    revenue: 0,
    monthlyData: [],
  },
  toast: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setUsers(state, action) {
      state.users = action.payload.users;
      state.usersMeta = action.payload.meta;
    },
    updateUserInList(state, action) {
      const idx = state.users.findIndex(u => u._id === action.payload._id);
      if (idx !== -1) state.users[idx] = action.payload;
    },
    setPendingElectricians(state, action) {
      state.pendingElectricians = action.payload;
    },
    removeFromPending(state, action) {
      state.pendingElectricians = state.pendingElectricians.filter(
        e => e._id !== action.payload
      );
    },
    setAllRequests(state, action) {
      state.allRequests = action.payload.requests;
      state.requestsMeta = action.payload.meta;
    },
    setStats(state, action) {
      state.stats = action.payload;
    },
    setToast(state, action) {
      state.toast = action.payload;
    },
    clearToast(state) {
      state.toast = null;
    },
  },
});

export const {
  setUsers, updateUserInList,
  setPendingElectricians, removeFromPending,
  setAllRequests, setStats,
  setToast, clearToast,
} = adminSlice.actions;

export default adminSlice.reducer;