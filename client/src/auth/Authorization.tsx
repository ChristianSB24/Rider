import React, { useState, useEffect, createContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { Ok, Err, Result } from 'ts-results';

interface loginInfo {
  username: string,
  password: string,
}

type Errors = "CANNOT_AUTHORIZE";


const AccountContext = createContext({ accountData: {}, logIn: ({ username, password }: loginInfo) => {}, logOut: () => {} })

export const AccountProvider = ({ children }: any) => {
  const [accountData, setAccountData]: any = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    const auth = JSON.parse(window.localStorage.getItem('taxi.auth') || 'null')
    if (auth) {
      const [, payload,] = auth.access.split('.');
      const decoded = window.atob(payload);
      setAccountData(decoded)
      console.log(accountData)
  }
  }, [accountData])

  const logIn = ({ username, password }: loginInfo): Promise<Result<object, Errors>>  => {
    const url = `${process.env.REACT_APP_BASE_URL}/api/log_in/`;
    return axios.post(url, { username, password })
      .then(        
        (response) => {
        window.localStorage.setItem('taxi.auth', JSON.stringify(response.data))
        const [, payload,] = response.data.access.split('.');
        const decoded = window.atob(payload);
        setAccountData(JSON.parse(decoded))
        return Ok({ response })})
      .catch(
          (error) => {
            console.error(error);
            return Err("CANNOT_AUTHORIZE")});
    };

  const logOut = () => {
    window.localStorage.removeItem('taxi.auth');
    setAccountData({})
    navigate('/')
  };

  return <AccountContext.Provider value={{ accountData: accountData, logIn, logOut }}>{children} </AccountContext.Provider>
}

export const getIsAuthorized = () => {
  const authorized = localStorage.getItem('taxi.auth')
  return authorized ? true : false
}

export const RequireAuth = ({ children }: any) => {
  console.log(children)
  let navigate = useNavigate()
  const authorized = localStorage.getItem('taxi.auth')
  return authorized ? children : navigate('/log-in')
}

export { AccountContext }