import React, { useState } from 'react';
import axios from 'axios';
import { Formik, Form } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup'

import ValidatedTextField from '../FormComponents/ValidatedTextField'
import TextField from '../FormComponents/TextField'
import FileField from '../FormComponents/FileField'
import Select from '../FormComponents/Select'

interface formValues {
  username: string,
  firstName: string,
  lastName: string,
  password1: string,
  password2: string,
  group: string,
  photo: string
}


const SignUp = () => {
  const [isError, setIsError] = useState(false)
  let navigate = useNavigate()

  let validationSchema = yup.object({
    username: yup.string()
      .required('Username is required.'),
    password1: yup.string()
      .required('Password is required.'),
      // .matches(
      //   /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      //   "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      // ),
    password2: yup.string()
      .required('Please confirm password.')
  })

  const onSubmit = async (values: formValues, actions: any) => {
    const url = `${process.env.REACT_APP_BASE_URL}/api/sign_up/`;
    const formData = new FormData();
    for (const prop in values) { formData.append(`${prop}`, values[prop as keyof formValues]) }
    try {
      await axios.post(url, formData);
      navigate("/log-in")
    }
    catch (error: any) {
      try {
        const data = error.response.data;
        for (const value in data) {
          actions.setFieldError(value, data[value].join(' '));
          if (value === 'non_field_errors') {
            actions.setFieldError('password1', data[value].join(' '))
            actions.setFieldError('password2', data[value].join(' '))
          }
        }
      } catch {
        setIsError(true)
      }
    }
  };

  return (
    <div className="d-flex center-alignment flex-column justify-content-center align-items-center px-2">
      <div className='row'>
        <div className='col-lg-12'>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active" aria-current="page">Sign up</li>
            </ol>
          </nav>
          {isError && <div className="alert alert-danger d-flex align-items-center w-100" role="alert">
            <i className="bi bi-info-circle"></i> &nbsp;&nbsp;
            <div>
              An error has occured. Please try again.
            </div>
          </div>}
          <div className='card mb-3'>
            <div className='card-header'>Sign up</div>
            <div className='card-body'>
              <Formik
                initialValues={{ username: '', firstName: '', lastName: '', password1: '', password2: '', group: 'rider', photo: '' }}
                validateOnChange={false}
                validateOnBlur={false}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {({ setFieldValue, setFieldError }) => (
                  <Form>
                    <ValidatedTextField name="username" type="text" placeholder="Username" onChange={(event: any) => {
                      setFieldError("username", '')
                      setFieldValue("username", event.target.value)
                    }} />
                    <TextField name="firstName" type="text" placeholder="First Name" />
                    <TextField name="lastName" type="text" placeholder="Last Name" />
                    <ValidatedTextField name="password1" type="password" placeholder="Password" onChange={(event: any) => {
                      setFieldError("password1", '')
                      setFieldValue("password1", event.target.value)
                    }} />
                    <ValidatedTextField name="password2" type="password" placeholder="Confirm Password" onChange={(event: any) => {
                      setFieldError("password2", '')
                      setFieldValue("password2", event.target.value)
                    }} />
                    <Select label="Group" name="group">
                      <option value="driver">Driver</option>
                      <option value="rider">Rider</option>
                    </Select>
                    <FileField name="photo" type="file" label="Photo" onChange={(event: any) => {
                      setFieldValue("photo", event.target.files[0])
                    }} />
                    <button type="submit" className="btn-lg btn-primary w-100 fs-5">Sign Up</button>
                  </Form>
                )}
              </Formik>
            </div>
            <p className='mt-3 text-center'>
              Already have an account? <Link to='/log-in'>Log in!</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;