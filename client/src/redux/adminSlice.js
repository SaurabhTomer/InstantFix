import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { serverUrl } from '../App';

// Async thunks for admin data
export const fetchAdminStats = createAsyncThunk(
  'admin/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${serverUrl}/api/admin/stats`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch admin stats');
    }
  }
);

export const fetchAdminProfile = createAsyncThunk(
  'admin/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${serverUrl}/api/admin/profile`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch admin profile');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    // Admin profile
    profile: {
      name: '',
      email: '',
      phone: '',
      role: 'ADMIN',
      avatar: null,
      joinDate: null
    },
    
    // Statistics
    stats: {
      totalUsers: 0,
      totalElectricians: 0,
      totalServiceRequests: 0,
      pendingRequests: 0,
      inProgressRequests: 0,
      completedRequests: 0,
      pendingElectricians: 0,
      approvedElectricians: 0,
      rejectedElectricians: 0,
      suspendedElectricians: 0,
      totalRevenue: 0,
      monthlyRevenue: 0,
      averageRating: 0,
      activeElectricians: 0
    },
    
    // Status
    loading: false,
    error: null,
    lastUpdated: null
  },
  
  reducers: {
    // Update admin profile
    updateAdminProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
    
    // Update specific stats
    updateStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    
    // Increment specific stat
    incrementStat: (state, action) => {
      const { stat, value = 1 } = action.payload;
      if (state.stats.hasOwnProperty(stat)) {
        state.stats[stat] += value;
      }
    },
    
    // Decrement specific stat
    decrementStat: (state, action) => {
      const { stat, value = 1 } = action.payload;
      if (state.stats.hasOwnProperty(stat)) {
        state.stats[stat] -= value;
      }
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Set last updated timestamp
    setLastUpdated: (state) => {
      state.lastUpdated = new Date().toISOString();
    },
    
    // Reset admin state
    resetAdminState: (state) => {
      return adminSlice.getInitialState();
    }
  },
  
  extraReducers: (builder) => {
    // Fetch admin stats
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = { ...state.stats, ...action.payload };
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    
    // Fetch admin profile
    builder
      .addCase(fetchAdminProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = { ...state.profile, ...action.payload };
        state.lastUpdated = new Date().toISOString();
        state.error = null;
      })
      .addCase(fetchAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  updateAdminProfile,
  updateStats,
  incrementStat,
  decrementStat,
  clearError,
  setLastUpdated,
  resetAdminState
} = adminSlice.actions;

// Selectors
export const selectAdminProfile = (state) => state.admin.profile;
export const selectAdminStats = (state) => state.admin.stats;
export const selectAdminLoading = (state) => state.admin.loading;
export const selectAdminError = (state) => state.admin.error;
export const selectLastUpdated = (state) => state.admin.lastUpdated;

// Computed selectors
export const selectElectricianStats = (state) => ({
  total: state.admin.stats.totalElectricians,
  pending: state.admin.stats.pendingElectricians,
  approved: state.admin.stats.approvedElectricians,
  rejected: state.admin.stats.rejectedElectricians,
  suspended: state.admin.stats.suspendedElectricians,
  active: state.admin.stats.activeElectricians
});

export const selectRequestStats = (state) => ({
  total: state.admin.stats.totalServiceRequests,
  pending: state.admin.stats.pendingRequests,
  inProgress: state.admin.stats.inProgressRequests,
  completed: state.admin.stats.completedRequests
});

export const selectRevenueStats = (state) => ({
  total: state.admin.stats.totalRevenue,
  monthly: state.admin.stats.monthlyRevenue
});

export default adminSlice.reducer;
