import React, { useState, createContext, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

const AccountContext = createContext({})

// export const AccountProvider = ({ children }: any) => {
//     const [accountData, setAccountData] = useState({})
//     return <AccountContext.Provider value={}>{children} </AccountContext.Provider>
// }


export const getIsAuthorized = () => {
    const authorized = localStorage.getItem('taxi.auth')
    return authorized ? true : false
}

export const RequireAuth = ({children}: any) => {
    console.log(children)
    let navigate = useNavigate()
    const authorized = localStorage.getItem('taxi.auth')
    return authorized ? children : navigate('/log-in')
}