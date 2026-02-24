import { createSlice, current } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        userData: null,
        currentCity: null,
        currentState: null,
        currentAddress: null,
        location: {
            latitude: null,
            longitude: null
        },
        currentPincode: null,
        address: null,
        requestCounts: {
            pending: 0,
            accepted: 0,
            'in-progress': 0,
            completed: 0,
            cancelled: 0,
            total: 0
        }
    },
    reducers: {
        setUserData: (state, action) => {
            state.userData = action.payload;
        },
        setCurrentCity: (state, action) => {
            state.currentCity = action.payload;
        },
        setCurrentState: (state, action) => {
            state.currentState = action.payload;
        },
        setCurrentAddress: (state, action) => {
            state.currentAddress = action.payload;
        },
        setCurrentPincode:(state , action) => {
            state.currentPincode = action.payload;
        },
        setLocation: (state, action) => {
            const { latitude, longitude } = action.payload;
            state.location.latitude = latitude;
            state.location.longitude = longitude;
        },
        setAddress: (state, action) => {
            state.address = action.payload
        },
        setRequestCounts: (state, action) => {
            state.requestCounts = action.payload;
        },
        updateRequestCount: (state, action) => {
            const { status, increment = 1 } = action.payload;
            if (state.requestCounts[status] !== undefined) {
                state.requestCounts[status] += increment;
                state.requestCounts.total += increment;
            }
        }
    },
});

export const {
    setUserData,
    setCurrentAddress,
    setCurrentCity,
    setCurrentState,
    setLocation,
    setAddress,
    setCurrentPincode,
    setRequestCounts,
    updateRequestCount

} = userSlice.actions;
export default userSlice.reducer;
