import { configureStore } from '@reduxjs/toolkit'
import appSlice from "./app/app-slice";

export const store = configureStore({
    reducer: {
        app: appSlice,
    },
})