import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { removeUser, removeAuthenticated } from '../../features/userSlice';
import { util, _socket } from '../../features/tripSliceRTKQuery';

const LogoutButton = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const logOut = () => {
        window.localStorage.removeItem('taxi.auth');
        dispatch(removeUser())
        dispatch(removeAuthenticated())
        dispatch(util.resetApiState())
        _socket?.unsubscribe()
        navigate('/')
    };

    return (
        <button type='button' className="btn btn-primary" onClick={() => logOut()}>Log out</button>
    )
}

export default LogoutButton