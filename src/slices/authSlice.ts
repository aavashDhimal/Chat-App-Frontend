import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    token: localStorage.getItem("access_token"),
}


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken: (state, action) => {
                const payload = action.payload
                const token = payload?.token 
                const id = payload?.user.id
                state.token = token
                if (token) localStorage.setItem("access_token", token)
                if (id) localStorage.setItem("uid", id)

        },
        clearToken: (state) => {
            state.token = null
            localStorage.removeItem("access_token")
            localStorage.removeItem("uid")

        },
    },
})


export const { setToken, clearToken } = authSlice.actions
export default authSlice.reducer