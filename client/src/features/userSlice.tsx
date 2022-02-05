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

let currentTime = new Date().getTime()
let expirationTime = JSON.parse(window.localStorage.getItem('token.expiration') || 'null')
let difference = Math.floor(((expirationTime - currentTime)/1000))

const accountSlice = createSlice({
  name: 'account',
  initialState: {
    user: auth,
    authenticated: authenticated,
    expiration: difference
  },
  reducers: {
    setUser(state, action) {state.user = action.payload},
    setAuthenticated(state) {state.authenticated = true},
    removeUser(state) {state.user = auth},
    removeAuthenticated(state) {state.authenticated = false},
    setExpiration(state) {state.expiration = 600},
    decrementExpiration(state) {state.expiration -= 1},
    removeExpiration(state) {state.expiration = 0}
  },
})

export const {
  setUser, 
  removeUser, 
  setAuthenticated, 
  removeAuthenticated, 
  setExpiration, 
  decrementExpiration,
  removeExpiration
} = accountSlice.actions

export default accountSlice.reducer

type StateUser = { user: User }

type StateAuthenticated = { authenticated: boolean }

type StateExpiration = { expiration: number}

interface UserState {
  account: StateUser
}

interface AuthenticatedState {
  account: StateAuthenticated
}

interface Expiration {
  account: StateExpiration
}

export const selectUser = (state:UserState) => state.account.user
export const selectAuthenticated = (state:AuthenticatedState) => state.account.authenticated
export const selectExpiration = (state:Expiration) => state.account.expiration
