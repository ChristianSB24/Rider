import React from 'react';
import { Formik, Form } from 'formik';
import * as yup from 'yup'

import { TextField } from './FormComponents/TextField'
import logo from '../logo.png'

interface logIn {
    logIn(username: string, password: string): Promise<any>
}

function LogIn({ logIn }: logIn) {
    let validation = yup.object({
        username: yup.string()
            .required('Required'),
        password: yup.string()
            .min(5, 'Password is too short')
            .required('Required')
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
            {
                <div className="d-flex flex-column justify-content-center w-100">
                    <img src={logo} className="logo align-self-center mb-4" />
                    <Form className="align-self-center w-100">
                        <TextField name="username" type="text" placeholder="Username" />
                        <TextField name="password" type="password" placeholder="Password" />
                        <button type="submit" className="btn-lg btn-primary w-100">Submit</button>
                    </Form>
                </div>}
        </Formik>
    )
}
export default LogIn;