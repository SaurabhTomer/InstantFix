import { createSlice } from '@reduxjs/toolkit'

const electricianSlice = createSlice({
  name: 'electrician',
  initialState: {
    jobs: [],
    jobsLoading: false,
    jobsError: null,

    nearbyJobs: [],
    nearbyLoading: false,

    history: [],
    historyLoading: false,
    historyMeta: null,

    stats: null,
    statsLoading: false,

    profile: null,
    profileLoading: false,
    profileSaving: false,

    locationSaving: false,

    actionLoadingId: null,
    toast: null,
  },
  reducers: {
    // jobs
    setJobsLoading:  (state) => { state.jobsLoading = true; state.jobsError = null },
    setJobs:         (state, action) => { state.jobs = action.payload; state.jobsLoading = false },
    setJobsError:    (state, action) => { state.jobsError = action.payload; state.jobsLoading = false },
    updateJobStatus: (state, action) => {
      const { id, status } = action.payload
      state.jobs = state.jobs.map(j => j._id === id ? { ...j, status } : j)
      state.actionLoadingId = null
    },
    removeJob: (state, action) => {
      state.jobs = state.jobs.filter(j => j._id !== action.payload)
      state.actionLoadingId = null
    },
    setActionLoadingId: (state, action) => { state.actionLoadingId = action.payload },

    // nearby
    setNearbyLoading: (state) => { state.nearbyLoading = true },
    setNearbyJobs:    (state, action) => { state.nearbyJobs = action.payload; state.nearbyLoading = false },
    setNearbyError:   (state) => { state.nearbyLoading = false },

    // history
    setHistoryLoading: (state) => { state.historyLoading = true },
    setHistory:        (state, action) => {
      state.history     = action.payload.jobs
      state.historyMeta = action.payload.meta
      state.historyLoading = false
    },

    // stats
    setStatsLoading: (state) => { state.statsLoading = true },
    setStats:        (state, action) => { state.stats = action.payload; state.statsLoading = false },

    // profile
    setProfileLoading: (state) => { state.profileLoading = true },
    setProfile:        (state, action) => { state.profile = action.payload; state.profileLoading = false },
    setProfileSaving:  (state, action) => { state.profileSaving = action.payload },

    // location
    setLocationSaving: (state, action) => { state.locationSaving = action.payload },

    // toast
    showToast: (state, action) => { state.toast = action.payload },
    clearToast: (state) => { state.toast = null },
  },
})

export const {
  setJobsLoading, setJobs, setJobsError,
  updateJobStatus, removeJob, setActionLoadingId,
  setNearbyLoading, setNearbyJobs, setNearbyError,
  setHistoryLoading, setHistory,
  setStatsLoading, setStats,
  setProfileLoading, setProfile, setProfileSaving,
  setLocationSaving,
  showToast, clearToast,
} = electricianSlice.actions

export default electricianSlice.reducer