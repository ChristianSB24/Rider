import { createSlice } from '@reduxjs/toolkit'
import { User } from './types'

let auth: User = {first_name: '', group: '', id: 0, last_name: '', photo: '', username: ''}
let authenticated = false
let accessToken = JSON.parse(window.localStorage.getItem('taxi.auth') || 'null')
if (accessToken) {
  const [, payload,] = accessToken.access.split('.');
  const decoded = window.atob(payload);
  auth = JSON.parse(decoded)
  authenticated = true
}

console.log('authenticated', authenticated)

const accountSlice = createSlice({
  name: 'account',
  initialState: {
    user: auth,
    authenticated: authenticated
  },
  reducers: {
    setUser(state, action) {state.user = action.payload},
    setAuthenticated(state) {state.authenticated = true},
    removeUser(state) {state.user = auth},
    removeAuthenticated(state) {state.authenticated = false},
  },
})

export const {setUser, removeUser, setAuthenticated, removeAuthenticated} = accountSlice.actions

export default accountSlice.reducer

type stateUser = { user: User }

type StateAuthenticated = { authenticated: boolean }

interface UserState {
  account: stateUser
}

interface AuthenticatedState {
  account: StateAuthenticated
}

export const selectUser = (state:UserState) => state.account.user
export const selectAuthenticated = (state:AuthenticatedState) => state.account.authenticated
