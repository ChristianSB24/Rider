import React, { useState, createContext } from 'react'
import { useDispatch } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios';
import _ from 'lodash'

import { fetchTrips } from '../features/tripsSlice';

const AccountContext = createContext({ userInfo: { id: 0, first_name: '', last_name: '', group: '', username: '' },  logIn: (username: string, password: string) => { }, logOut: () => { } })

export const AccountProvider = ({ children }: any) => {
  const [userInfo, setUserInfo]: any = useState(() => {
    let auth = JSON.parse(window.localStorage.getItem('taxi.auth') || 'null')
    if (auth) {
      const [, payload,] = auth.access.split('.');
      const decoded = window.atob(payload);
      return JSON.parse(decoded)
    } else {
      return {}
    }
  })

  const navigate = useNavigate()

  const dispatch = useDispatch()

  // No longer necessary but clever enough to keep
  // If there is a page refresh the AccountProvider will render first since it is at the top of the dom. 
  // It encounters this if statement on initial render. Since there is a setState function this will trigger a rerender.
  // Once it rerenders userInfo will have the updated information and React will then continue rendering the children components.
  // This is why userInfo is up to date once it reaches the RequireAuth component further down the dom tree.
  // if (_.isEmpty(userInfo)) {
  //   let auth = JSON.parse(window.localStorage.getItem('taxi.auth') || 'null')
  //   if (auth) {
  //     const [, payload,] = auth.access.split('.');
  //     const decoded = window.atob(payload);
  //     setUserInfo(JSON.parse(decoded))
  //   }
  // }

  const logIn = async (username: string, password: string) => {
    try {
      let response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/log_in/`, { username, password })
      window.localStorage.setItem('taxi.auth', JSON.stringify(response.data))
      const [, payload,] = response.data.access.split('.');
      const decoded = window.atob(payload);
      setUserInfo(JSON.parse(decoded))
      dispatch(fetchTrips())
    }
    catch (error: any) {
      if (error?.response?.data?.detail) {
        console.log('error', error.response)
        throw new Error(error.response.data.detail)
      } else {
        throw new Error('Something went wrong with your request. Please try again.')
      }
    }
  };

  const logOut = () => {
    window.localStorage.removeItem('taxi.auth');
    setUserInfo({})
    navigate('/')
  };


  return <AccountContext.Provider value={{ userInfo: userInfo, logIn, logOut }}>{children} </AccountContext.Provider>
}

export const RequireAuth = ({ children, userInfo, group }: any) => {
  return !_.isEmpty(userInfo) && userInfo.group === group ? children : <Navigate to="/" />
}

export { AccountContext }