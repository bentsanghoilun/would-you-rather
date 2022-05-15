import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import { User } from '../types/user'

interface AuthUserState{
    authUser: User | null;
    isInit: boolean;
}

const initState: AuthUserState = {
    authUser: null,
    isInit: false
}

export const authUserSlice = createSlice({
    name: 'authUser',
    initialState: initState,
    reducers: {
        setAuthUser: (state, action: PayloadAction<User | null>) => {
            state.authUser = action.payload
        },
        setAuthUserIsInit: (state, action: PayloadAction<boolean>) => {
            state.isInit = action.payload
        }
    }
})

export const selectAuthUser = (state: RootState) => state.authUser.authUser;
export const authUserIsInit = (state: RootState) => state.authUser.isInit;

export const { setAuthUser, setAuthUserIsInit } = authUserSlice.actions;

export default authUserSlice.reducer;