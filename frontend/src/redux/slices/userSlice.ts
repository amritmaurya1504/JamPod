import { IStoreUser } from "../../types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState:IStoreUser = {
    isAuth: false,
    user: null,
    otp: {
        email: "",
        hash: ""
    }
}

export const userSlice = createSlice({
    name: 'auth',
    initialState,
    reducers : {
        setAuth: (state, action:PayloadAction<any>) => {
            const { auth, user } = action.payload;
            state.user = user;
            state.isAuth = auth;
        },
        setOtp: (state, action:PayloadAction<any>) => {
            const { email, hash } = action.payload;
            state.otp.email = email;
            state.otp.hash = hash
        }
    }
})

export const { setAuth, setOtp } = userSlice.actions;
export default userSlice.reducer; 