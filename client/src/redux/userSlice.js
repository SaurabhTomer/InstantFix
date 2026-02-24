import { createSlice, current } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    currentCity: null,
    currentState: null,
    currentAddress: null,
     location:{
        lat:null,
        lon:null
       },
       address:null
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
      setLocation:(state,action)=>{
        //data comes but no store in state
        const {lat,lon}=action.payload
        //now store in state
        state.location.lat=lat
        state.location.lon=lon
       },
       setAddress:(state,action)=>{
        state.address=action.payload
       }
  },
});

export const {
  setUserData,
  setCurrentAddress,
  setCurrentCity,
  setCurrentState,
  setLocation,
  setAddress

} = userSlice.actions;
export default userSlice.reducer;
