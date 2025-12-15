import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    users : [],
}


const userSlice = createSlice({
    name: "User",
    initialState,
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload

        },
        clearUsers: (state) => {
            state.users = [];
        },
    },
})


export const { setUsers, clearUsers } = userSlice.actions
export default userSlice.reducer