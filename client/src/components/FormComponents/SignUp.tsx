import React, { useState } from 'react';
import axios from 'axios';
import { Formik } from 'formik';
import { Form } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import * as yup from 'yup'

import { TextField } from './TextField'
import { FileField } from './FileField'
import { Select } from './Select'

function SignUp(props: any) {
  const [isSubmitted, setSubmitted] = useState(false);

  let validation = yup.object({
    username: yup.string()
      .required('Username is required.'),
    password: yup.string()
      .min(5, 'Password is too short.')
      .required('Password is required.')
  })

  const onSubmit = async (values: any, actions: any) => {
    const url = `${process.env.REACT_APP_BASE_URL}/api/sign_up/`;
    const formData = new FormData();
    formData.append('photo', values.photo[0])
    formData.append('username', values.username);
    formData.append('first_name', values.firstName);
    formData.append('last_name', values.lastName);
    formData.append('password1', values.password);
    formData.append('password2', values.password);
    formData.append('group', values.group);
    try {
      await axios.post(url, formData);
      setSubmitted(true);
    }
    catch (response: any) {
      const data = response.response.data;
      for (const value in data) {
        actions.setFieldError(value, data[value].join(' '));
      }
    }
  };

  if (isSubmitted) {
    return <Navigate replace to='/log-in' />
  }

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
          <div className='card mb-3'>
            <div className='card-header'>Sign up</div>
            <div className='card-body'>
              <Formik
                initialValues={{ username: '', firstName: '', lastName: '', password: '', group: 'rider', photo: [] }}
                initialTouched={{ username: false, password: false }}
                validateOnChange={true}
                validateOnBlur={false}
                validationSchema={validation}
                onSubmit={onSubmit}
              >
                {({
                  errors,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                  setFieldValue,
                  values
                }) => (
                  <Form noValidate onSubmit={handleSubmit}>
                    <TextField name="username" type="text" placeholder="Username" login={false} />
                    <TextField name="firstName" type="text" placeholder="First Name" login={false} />
                    <TextField name="lastName" type="text" placeholder="Last Name" login={false} />
                    <TextField name="password" type="text" placeholder="Password" login={false} />
                    {/* <Form.Group controlId='group'>
                      <Form.Label>Group:</Form.Label>
                      <Form.Control
                        as='select'
                        className={'group' in errors ? 'is-invalid' : ''}
                        name='group'
                        onChange={handleChange}
                        value={values.group}
                      >
                        <option value='rider'>Rider</option>
                        <option value='driver'>Driver</option>
                      </Form.Control>
                      {'group' in errors && <Form.Control.Feedback type='invalid'>{errors.group}</Form.Control.Feedback>}
                    </Form.Group> */}
                    <Select label="group" name="group">
                      <option value="">Select a job type</option>
                      <option value="driver">Driver</option>
                      <option value="rider">Rider</option>
                    </Select>
                    <FileField name="photo" type="file" setFieldValue={setFieldValue} errors={errors} />
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