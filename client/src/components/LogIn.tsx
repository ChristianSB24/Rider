import React from 'react';
import { Formik, Form } from 'formik';
import * as yup from 'yup'

import { TextField } from './FormComponents/TextField'

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
            {() => (
                <Form className="d-flex flex-column align-items-center">
                    <TextField name="username" type="text" label="User Name" placeholder="username" />
                    <TextField name="password" type="password" label="Password" placeholder="password" />
                    <button type="submit" className="btn btn-primary w-50">Submit</button>
                    <button type="submit" className="btn btn-purple w-50">Submit</button>

                </Form>
            )}
        </Formik>
    )
}
export default LogIn;