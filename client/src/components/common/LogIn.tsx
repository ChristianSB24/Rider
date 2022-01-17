import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Formik, Form } from 'formik';
import * as yup from 'yup'


import { AccountContext } from '../../auth/Authorization'
import ValidatedTextField from '../FormComponents/ValidatedTextField';
import { fetchTrips } from '../../features/tripsSlice'
import logo from './logo.png'

interface formValues {
    username: string,
    password: string,
}

function LogIn() {
    const [errorMessage, setErrorMessage] = useState('')
    const auth = useContext(AccountContext)
    const dispatch = useDispatch()

    let validation = yup.object({
        username: yup.string()
            .required('Username is required.'),
        password: yup.string()
            .required('Password is required.')
    })

    const onSubmit = async ({ username, password }: formValues) => {
        try {
            await auth.logIn(username, password);
            dispatch(fetchTrips())
        }
        catch (error: any) {
            setErrorMessage(error.message)
        }
    }

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
            <Formik
                initialValues={{ username: '', password: '' }}
                validateOnChange={false}
                validateOnBlur={false}
                validationSchema={validation}
                onSubmit={onSubmit}
            >
                {({ setFieldValue, setFieldError }) => (
                    <Form className="w-100">
                        <ValidatedTextField name="username" type="text" placeholder="Username" onChange={(event: any) => {
                            setFieldError("username", '')
                            setFieldValue("username", event.target.value)
                        }} />
                        <ValidatedTextField name="password" type="password" placeholder="Password" onChange={(event: any) => {
                            setFieldError("password", '')
                            setFieldValue("password", event.target.value)
                        }} />
                        <button type="submit" className="btn-lg btn-primary w-100 fs-5">Submit</button>
                    </Form>
                )}
            </Formik>
            <Link to="/account/forgotpassword" className="align-self-start py-2 text-decoration-none link-info fs-6">Forgot Password?</Link>
        </div>
    )
}
export default LogIn;