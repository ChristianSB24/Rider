import React from 'react'

import LoginForm from './LoginForm'


const ExpirationLogin = () => {
    return (
        <div className="modal d-flex" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered w-100">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="staticBackdropLabel">Session expired, please log back in.</h5>
                            </div>
                            <div className="modal-body">
                                <LoginForm />
                            </div>
                        </div>
                    </div>
                </div>
    )
}

export default ExpirationLogin