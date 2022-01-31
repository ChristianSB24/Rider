import React  from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { Formik, Form } from 'formik';
import { Link } from 'react-router-dom'
import * as yup from 'yup'
import axios from 'axios'

import ValidatedTextField from '../FormComponents/ValidatedTextField';
import { setUser } from '../../features/userSlice'
import { connect } from '../../features/tripSliceRTKQuery';

interface formValues {
    username: string,
    password: string,
}

const LoginForm = ({setErrorMessage = false, redirectPath = false}: any) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const logIn = async (username: string, password: string) => {
        try {
          let response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/log_in/`, { username, password })
          window.localStorage.setItem('taxi.auth', JSON.stringify(response.data))
          const [, payload,] = response.data.access.split('.');
          const decoded = window.atob(payload);
          dispatch(setUser(JSON.parse(decoded)))
          connect()
          navigate('/')
        }
        catch (error: any) {
          if (error?.response?.data?.detail) {
            console.log('error', error.response)
            throw new Error(error.response.data.detail)
          } else {
            throw new Error('Something went wrong with your request. Please try again.')
          }
        }
      };

    let validation = yup.object({
        username: yup.string()
            .required('Username is required.'),
        password: yup.string()
            .required('Password is required.')
    })

    const onSubmit = async ({ username, password }: formValues) => {
        try {
            await logIn(username, password)
            if(redirectPath) {
                navigate(redirectPath)
            }
        }
        catch (error: any) {
            if(setErrorMessage) {
                setErrorMessage(error.message)
            } else {
                console.error('error', error.message)
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