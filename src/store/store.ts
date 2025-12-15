import { configureStore } from "@reduxjs/toolkit"
import { api } from "../services/authApi"
import authReducer from "../slices/authSlice"
import userSlices from "../slices/userSlices"
import roomSlice from "../slices/roomSlice"
import { apis } from "../services/api"
export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        auth: authReducer,
        [apis.reducerPath]: apis.reducer,
        rooms : roomSlice,
        users: userSlices
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware).concat(apis.middleware),
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch