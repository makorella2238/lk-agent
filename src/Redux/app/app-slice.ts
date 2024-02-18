import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
    initialized: false,
    isAuth: false,
    FIO: '',
    agentId: null
}

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        initializedSuccess(state, action: PayloadAction<boolean>) {
            state.initialized = action.payload
        },
        setIsAuthFalse(state) {
            state.isAuth = false
        },
        setIsAuthTrue(state) {
            state.isAuth = true
        },
        setFIO(state, action: PayloadAction<string>) {
            state.FIO = action.payload
        },
        checkAuth(state) {
            if (Cookies.get('token')) {
                state.isAuth = true
            }
        }
    },
})
// @ts-ignore
export const initializeApp = () => async (dispatch) => {
    const promise = await dispatch(checkAuth())
    Promise.all([promise])
        .then(() => {
            dispatch(initializedSuccess(true));
        });
};

export const { initializedSuccess, checkAuth, setIsAuthFalse, setIsAuthTrue, setFIO } = appSlice.actions;
export default appSlice.reducer