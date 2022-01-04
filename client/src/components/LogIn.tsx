import React from 'react';
import { Formik, Field, ErrorMessage } from 'formik';
import * as yup from 'yup'

interface logIn {
    logIn(username: string, password: string): Promise<any>
}

const validationClass = (error: string | undefined, touched: boolean | undefined, value: string) => {
    console.log('error', error, 'touched', touched)
    if (!error && touched && value.length > 0) {
        return "form-control is-valid"
    } else if (error && touched) {
        return "form-control is-invalid"
    } else {
        return "form-control"
    }
}

function LogIn({ logIn }: logIn) {
    let validation = yup.object({
        username: yup.string()
            .required('Required'),
        password: yup.string()
            .required('Required')
    })
    return (
        <Formik
            initialValues={{ username: '', password: '' }}
            initialTouched={{username: false, password: false}}
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
            {({
                values,
                errors,
                touched,
                handleSubmit,
            }) => (
                <form className="d-flex flex-column align-items-center" onSubmit={handleSubmit}>
                    <div className="mb-3 w-50">
                        <label htmlFor="login_username" className="form-label">User Name</label>
                        <Field name="username" placeholder="username" aria-describedby="emailHelp" className={validationClass(errors.username, touched.username, values.username)}/>
                        <ErrorMessage name="username" render={msg => <div className="invalid-feedback">{msg}</div>} />
                    </div>
                    <div className="mb-3 w-50">
                        <label htmlFor="login_password" className="form-label">Password</label>
                        <Field name="password" placeholder="password" className={validationClass(errors.password, touched.password, values.password)}/>
                        <ErrorMessage name="password" render={msg => <div className="invalid-feedback">{msg}</div>} />
                    </div>
                    <button type="submit" className="btn btn-info w-50">Submit</button>
                </form>
            )}
        </Formik>
    )
}

export default LogIn;