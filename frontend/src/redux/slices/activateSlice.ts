import { IActivate } from "../../types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState:IActivate = {
    name: '',
    avatar: ''
}

export const activateSlice = createSlice({
    name: 'activate',
    initialState,
    reducers : {
        setName: (state, action:PayloadAction<any>) => {
            state.name = action.payload;
        },
        setAvatar: (state, action:PayloadAction<any>) => {
            state.avatar = action.payload
        }
    }
})

export const { setName, setAvatar } = activateSlice.actions;
export default activateSlice.reducer; 