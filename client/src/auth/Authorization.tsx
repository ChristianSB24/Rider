import React, { useState, createContext } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { Ok, Err, Result } from 'ts-results';
import _ from 'lodash'


interface loginInfo {
  username: string,
  password: string,
}

type Errors = "CANNOT_AUTHORIZE";


const AccountContext = createContext({ userInfo: {id: 0, first_name: '', last_name: '', group: '', username: ''}, logIn: ({ username, password }: loginInfo) => { }, logOut: () => { } })

export const AccountProvider = ({ children }: any) => {
  const [userInfo, setUserInfo]: any = useState(() => {
    let auth = JSON.parse(window.localStorage.getItem('taxi.auth') || 'null')
    if (auth) {
      const [, payload,] = auth.access.split('.');
      const decoded = window.atob(payload);
      console.log(JSON.parse(decoded))
      return JSON.parse(decoded)
    } else {
      return {}
    }
    })

  const navigate = useNavigate()

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

  const logIn = ({ username, password }: loginInfo): Promise<Result<object, Errors>> => {
    const url = `${process.env.REACT_APP_BASE_URL}/api/log_in/`;
    return axios.post(url, { username, password })
      .then(
        (response) => {
          window.localStorage.setItem('taxi.auth', JSON.stringify(response.data))
          const [, payload,] = response.data.access.split('.');
          const decoded = window.atob(payload);
          setUserInfo(JSON.parse(decoded))
          return Ok({ response })
        })
      .catch(
        (error) => {
          console.error(error);
          return Err("CANNOT_AUTHORIZE")
        });
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