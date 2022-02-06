import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { removeUser, removeAuthenticated, selectExpiration, setAuthenticated, selectAuthenticated, setExpiration, removeExpiration, decrementExpiration } from '../../features/userSlice';
import LogoutButton from './LogoutButton'
import { util, _socket } from '../../features/tripSliceRTKQuery';
import client from '../../http-common'

const CountDown = () => {
    const time = useSelector(selectExpiration)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const getRefeshToken = async () => {
        const url = `${process.env.REACT_APP_BASE_URL}/api/token/refresh/`;
        const token = JSON.parse(window.localStorage.getItem('taxi.auth') || 'null')
        try {
          const response = await client.post<any>(url, {refresh: token.refresh});
          const taxiAuthObject = {access:response.data.access, refresh:token.refresh}
          window.localStorage.setItem('taxi.auth', JSON.stringify(taxiAuthObject), )
          dispatch(setAuthenticated())
          dispatch(setExpiration())
          let expirationTime = new Date().getTime() + 1800000
          window.localStorage.setItem('token.expiration', JSON.stringify(expirationTime))
        } catch (error: any) {
          throw new Error(error);
        }
      };

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
        <div className="modal d-flex justify-content-center" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered w-75">
                <div className="modal-content">
                    <div className="modal-header bg-primary text-white py-2">
                        <h5 className="modal-title" id="staticBackdropLabel">Session Timeout</h5>
                        <button className="bg-primary text-white border-0" onClick={() => logOut()}><i className="bi bi-x fs-1"></i></button>
                    </div>
                    <div className="modal-body d-flex flex-column align-items-baseline">
                        <div className='d-flex flex-row align-items-center'>
                            <h2 className='me-3'>
                                <i className="bi bi-clock"></i>
                            </h2>
                            <p className="flex-grow-1">Your session will expire in</p>
                        </div>
                        <h1 className='modal-text-size align-self-center'>{time} seconds</h1>
                        <p>Please click "Continue" to keep working;
                            or click "Log Off" to end your session now.
                        </p>
                        <div className="d-flex justify-content-between w-100">
                            <button type='button' className="btn btn-primary btn-lg" onClick={() => getRefeshToken()}>Continue</button>
                            <LogoutButton className="btn btn-primary btn-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const SessionExpired = () => {
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
        <div className="modal d-flex justify-content-center" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered w-75">
                <div className="modal-content">
                    <div className="modal-header bg-primary text-white py-2">
                    <div className='d-flex flex-row align-items-center'>
                            <h2 className='me-3'>
                                <i className="bi bi-clock"></i>
                            </h2>
                        <h5 className="flex-grow-1" id="staticBackdropLabel">Session Expired</h5>
                        </div>
                        <button className="bg-primary text-white border-0" onClick={() => logOut()}><i className="bi bi-x fs-1"></i></button>
                    </div>
                    <div className="modal-body">
                        <p>Your session has expired.</p>
                        <p>You will be redirected to the home page.
                        </p>
                        <button type='button' className="btn btn-primary btn-lg px-5" onClick={() => logOut()}>OK</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const GlobalModal: React.FC<{}> = ({ children }) => {
    const dispatch = useDispatch()
    const time = useSelector(selectExpiration)
    const auth = useSelector(selectAuthenticated)

    useEffect(() => {
        if (time >= 0) {
            setTimeout(() => {
                dispatch(decrementExpiration())
            }, 1000)
        };
    })

    return (
        <>
            {time <= 0 && auth && <SessionExpired />}
            {time <= 60 && time > 0 && auth && <CountDown />}
            {children}
        </>
    )
}