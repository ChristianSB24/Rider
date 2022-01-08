import React from 'react';
import { Formik, Form, ErrorMessage} from 'formik';
import * as yup from 'yup'

import { TextField } from './FormComponents/TextField'
import logo from '../logo.png'

interface logIn {
    logIn(username: string, password: string): Promise<any>
}

function LogIn({ logIn }: logIn) {
    let validation = yup.object({
        username: yup.string()
            .required('Username is required.'),
        password: yup.string()
            .min(5, 'Password is too short.')
            .required('Password is required.')
    })
    return (
        <Formik
            initialValues={{ username: '', password: '' }}
            initialTouched={{ username: false, password: false }}
            validateOnChange={true}
            validateOnBlur={false}
            validationSchema={validation}
            onSubmit={({ username, password }) => {
                try {
                    logIn(username, password);
                }
                catch (error) {
                    console.error(error);
                }
            }}
        >
            <>
                <div className="alert alert-danger d-flex align-items-center w-100" role="alert">
                <i className="bi bi-info-circle"></i> &nbsp;&nbsp;
                    <div>
                    Your password and email do not match. Please try again or Reset Your Password.
                    </div>
                </div>
                <img src={logo} alt="rider logo" className="pb-4 logos" />
                <Form className="w-100">
                    <TextField name="username" type="text" placeholder="Username" />
                    <TextField name="password" type="password" placeholder="Password" />
                    <button type="submit" className="btn-lg btn-primary w-100 fs-5">Submit</button>
                </Form>
                <a href="/account/forgotpassword" className="align-self-start py-2 text-decoration-none link-info fs-6">Forgot Password?</a>
            </>
        </Formik>
    )
}
export default LogIn;