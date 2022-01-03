import React from 'react';
import { Formik } from 'formik';

interface logIn {
    logIn(username: string, password: string): Promise<any>
}

function LogIn(props: logIn) {
    const handleSubmit = async (event: any) => {
        event.preventDefault()
        let [{ value: username }, { value: password }] = event.target
        try {
            await props.logIn(username, password);
        }
        catch (error) {
            console.error(error);
        }
    }

    return (
        <Formik
        initialValues={{ username: '', password: '' }}
        onSubmit={({username, password}) => {
          try {
            props.logIn(username, password);
        }
        catch (error) {
            console.error(error);
        }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
            <form className="d-flex flex-column align-items-center" onSubmit={handleSubmit}>
            <div className="mb-3 w-50">
                <label htmlFor="login_username" className="form-label">User Name</label>
                <input type="text" name="username" value={values.username} onChange={handleChange} className="form-control" id="login_username" placeholder="User Name" aria-describedby="emailHelp" />
            </div>
            <div className="mb-3 w-50">
                <label htmlFor="login_password" className="form-label">Password</label>
                <input type="password" name="password" value={values.password} onChange={handleChange} className="form-control" id="login_password" placeholder="Password" />
            </div>
            <button type="submit" className="btn btn-info w-50">Submit</button>
        </form>
        )}
      </Formik>
        
    )
}

export default LogIn;