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
        address: null
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
    setCurrentPincode

} = userSlice.actions;
export default userSlice.reducer;
