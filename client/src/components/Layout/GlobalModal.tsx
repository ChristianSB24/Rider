import React, { useState, createContext, useContext, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';

import { selectExpiration, selectAuthenticated, setExpiration, removeExpiration, decrementExpiration } from '../../features/userSlice';
import LoginForm from '../common/LoginForm'
import LogoutButton from './LogoutButton'

interface GlobalModalContext {
    startTimer: () => void,
    removeTimer: () => void,
}

const initialState: GlobalModalContext = {
    startTimer: () => { },
    removeTimer: () => { }
}


export const CreateModal = () => {
    return (
        <div className="modal d-flex" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered w-100">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">Session expired, please log back in.</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {/* <LoginForm redirectPath={location.pathname} /> */}
                        <LoginForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

const CountDown = () => {
    const time = useSelector(selectExpiration)
    return (
        <div className="modal d-flex" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered w-100">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">Session Timeout</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {/* <LoginForm redirectPath={location.pathname} /> */}
                        {/* <LoginForm /> */}
                        <p>Your online session will expire in</p>
                        <h2>{time}</h2>
                        <p>Please click "Continue" to keep working;
                            or click "Log Off" to end your session now.
                        </p>
                        <LogoutButton />
                    </div>
                </div>
            </div>
        </div>
    )
}

const SessionExpired = () => {
    const time = useSelector(selectExpiration)
    return (
        <div className="modal d-flex" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered w-100">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">Session Expired</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {/* <LoginForm redirectPath={location.pathname} /> */}
                        {/* <LoginForm /> */}
                        <p>Your session has expired.</p>
                        <p>You will be redirected to the Login page.
                        </p>
                        <LogoutButton />
                    </div>
                </div>
            </div>
        </div>
    )
}

const GlobalModalContext = createContext(initialState)
export const useGlobalModalContext = () => useContext(GlobalModalContext);

export const GlobalModal: React.FC<{}> = ({ children }) => {
    // The time left or expiration of access token would be in localstorage
    // const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
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

    console.log('redux time', time)

    return (
        <>
            {time <= 0 && auth && <SessionExpired />}
            {time <= 60000 && time > 0 && auth && <CountDown />}
            {children}
        </>
    )
}