import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { removeUser, removeAuthenticated, removeExpiration } from '../../features/userSlice';
import { util, _socket } from '../../features/tripSliceRTKQuery';

const LogoutButton = ({className='btn btn-primary'}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const logOut = () => {
        window.localStorage.removeItem('taxi.auth');
        window.localStorage.removeItem('token.expiration')
        dispatch(removeUser())
        dispatch(removeAuthenticated())
        dispatch(removeExpiration())
        dispatch(util.resetApiState())
        _socket?.unsubscribe()
        navigate('/')
    };

    return (
        <button type='button' className={className} onClick={() => logOut()}>Log out</button>
    )
}

export default LogoutButton