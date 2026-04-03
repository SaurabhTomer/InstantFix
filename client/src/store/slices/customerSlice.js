import { createSlice } from '@reduxjs/toolkit'

const customerSlice = createSlice({
  name: 'customer',
  initialState: {
    // requests
    requests: [],
    requestsLoading: false,
    requestsError: null,
    pagination: null,

    // single request
    selectedRequest: null,
    selectedLoading: false,

    // create request
    creating: false,
    createSuccess: false,
    createdRequest: null,

    // cancel
    cancellingId: null,

    // profile
    profileSaving: false,

    // toast
    toast: null,
  },
  reducers: {
    // requests list
    setRequestsLoading: (state) => {
      state.requestsLoading = true
      state.requestsError = null
    },
    setRequests: (state, action) => {
      state.requests = action.payload.requests
      state.pagination = action.payload.pagination
      state.requestsLoading = false
    },
    setRequestsError: (state, action) => {
      state.requestsError = action.payload
      state.requestsLoading = false
    },

    // single request
    setSelectedLoading: (state) => { state.selectedLoading = true },
    setSelectedRequest: (state, action) => {
      state.selectedRequest = action.payload
      state.selectedLoading = false
    },

    // create
    setCreating: (state, action) => { state.creating = action.payload },
    setCreateSuccess: (state, action) => {
      state.createSuccess = action.payload.success
      state.createdRequest = action.payload.request || null
      state.creating = false
    },
    resetCreateSuccess: (state) => {
      state.createSuccess = false
      state.createdRequest = null
    },

    // cancel
    setCancellingId: (state, action) => { state.cancellingId = action.payload },
    updateRequestStatus: (state, action) => {
      const { id, status } = action.payload
      state.requests = state.requests.map(r =>
        r._id === id ? { ...r, status } : r
      )
      state.cancellingId = null
    },

    // profile
    setProfileSaving: (state, action) => { state.profileSaving = action.payload },

    // toast
    showToast: (state, action) => { state.toast = action.payload },
    clearToast: (state) => { state.toast = null },
  },
})

export const {
  setRequestsLoading, setRequests, setRequestsError,
  setSelectedLoading, setSelectedRequest,
  setCreating, setCreateSuccess, resetCreateSuccess,
  setCancellingId, updateRequestStatus,
  setProfileSaving,
  showToast, clearToast,
} = customerSlice.actions

export default customerSlice.reducer