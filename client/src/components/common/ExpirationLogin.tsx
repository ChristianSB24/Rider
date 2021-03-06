import React from 'react'
import { useLocation } from 'react-router-dom'


import LoginForm from './LoginForm'


const ExpirationLogin = () => {
    const location = useLocation()

    return (
        <div className="modal d-flex" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered w-100">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">Session expired, please log back in.</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <LoginForm redirectPath={location.pathname}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ExpirationLogin