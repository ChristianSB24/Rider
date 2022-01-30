import React, { useState } from 'react';
import { Link } from 'react-router-dom'

import logo from './logo.png'
import LoginForm from './LoginForm'

function LogIn() {
    const [errorMessage, setErrorMessage] = useState('')

    return (
        <div className="d-flex center-alignment flex-column justify-content-center align-items-center px-2">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Log in</li>
                </ol>
            </nav>
            {errorMessage !== '' && <div className="alert alert-danger d-flex align-items-center w-100" role="alert">
                <i className="bi bi-info-circle"></i> &nbsp;&nbsp;
                <div>
                    {errorMessage}
                </div>
            </div>}
            <img src={logo} alt="rider logo" className="pb-4 logos" />
            <LoginForm setErrorMessage={setErrorMessage}/>
        </div>
    )
}
export default LogIn;