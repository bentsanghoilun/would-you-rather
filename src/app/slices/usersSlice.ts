import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import { User } from '../types/user'

interface UserState{
    users: User[];
}

const initState: UserState = {
    users: []
}

export const usersSlice = createSlice({
    name: 'users',
    initialState: initState,
    reducers: {
        setUsers: (state, action: PayloadAction<User[]>) => {
            state.users = action.payload
        },
    }
})

export const selectUsers = (state: RootState) => state.users.users;

export const { setUsers } = usersSlice.actions;

export default usersSlice.reducer;