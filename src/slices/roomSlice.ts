import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    roomList : [],


}


const roomSlice = createSlice({
    name: "User",
    initialState,
    reducers: {
        getRooms: (state, action) => {
            state.roomList = action.payload

        },
        addRoom: (state,action) => {
            state.roomList = [ action.payload,...state.roomList, ];
        },
    },
})


export const { getRooms, addRoom } = roomSlice.actions
export default roomSlice.reducer