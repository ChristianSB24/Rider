import { createSlice } from '@reduxjs/toolkit'
import { User } from './types'

let auth: User = {first_name: '', group: '', id: 0, last_name: '', photo: '', username: ''}
let accessToken = JSON.parse(window.localStorage.getItem('taxi.auth') || 'null')
if (accessToken) {
  const [, payload,] = accessToken.access.split('.');
  const decoded = window.atob(payload);
  auth = JSON.parse(decoded)
}

console.log('auth', auth)
const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: auth
  },
  reducers: {
    setUser(state, action) {state.user = action.payload},
    removeUser(state) {state.user = auth}
  },
})

export const {setUser, removeUser} = userSlice.actions

export default userSlice.reducer

type stateUser = { user: User }

interface UserState {
  user: stateUser
}

export const selectUser = (state:UserState) => state.user.user
