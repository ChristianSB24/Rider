import React, {useContext} from 'react'
import { Formik, Form } from 'formik';
import { Link } from 'react-router-dom'
import * as yup from 'yup'

import ValidatedTextField from '../FormComponents/ValidatedTextField';
import { AccountContext } from '../../auth/Authorization'

interface formValues {
    username: string,
    password: string,
}

const LoginForm = ({setErrorMessage = false}: any) => {
    const auth = useContext(AccountContext)

    let validation = yup.object({
        username: yup.string()
            .required('Username is required.'),
        password: yup.string()
            .required('Password is required.')
    })

    const onSubmit = async ({ username, password }: formValues) => {
        try {
            await auth.logIn(username, password)
        }
        catch (error: any) {
            if(setErrorMessage) {
                setErrorMessage(error.message)
            } else {
                console.error('error', error)
            }
        }
    }

    return (
        <>
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
            </>
    )
}

export default LoginForm