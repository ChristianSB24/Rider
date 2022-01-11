import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom'
import { Formik, Form } from 'formik';
import * as yup from 'yup'


import { AccountContext } from '../../auth/Authorization'
import { TextField } from './TextField'
import logo from '../../logo.png'

function LogIn() {
    let [open, setOpen] = useState(false)
    const auth: any = useContext(AccountContext)

    let validation = yup.object({
        username: yup.string()
            .required('Username is required.'),
        password: yup.string()
            .min(5, 'Password is too short.')
            .required('Password is required.')
    })
    return (
        <div className="d-flex center-alignment flex-column justify-content-center align-items-center px-2">
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Log in</li>
                </ol>
            </nav>
            <Formik
                initialValues={{ username: '', password: '' }}
                initialTouched={{ username: false, password: false }}
                validateOnChange={true}
                validateOnBlur={false}
                validationSchema={validation}
                onSubmit={({ username, password }) => {
                    auth.logIn({ username, password }).then((res: any) => res.err === true && setOpen(true))
                }}
            >
                <>
                {open && <div className="alert alert-danger d-flex align-items-center w-100" role="alert">
                    <i className="bi bi-info-circle"></i> &nbsp;&nbsp;
                    <div>
                        Your password and email do not match. Please try again or Reset Your Password.
                    </div>
                </div>}
                <img src={logo} alt="rider logo" className="pb-4 logos" />
                <Form className="w-100">
                    <TextField name="username" type="text" placeholder="Username" login />
                    <TextField name="password" type="password" placeholder="Password" login />
                    <button type="submit" className="btn-lg btn-primary w-100 fs-5">Submit</button>
                </Form>
                <Link to="/account/forgotpassword" className="align-self-start py-2 text-decoration-none link-info fs-6">Forgot Password?</Link>
                </>
            </Formik>
        </div>
    )
}
export default LogIn;