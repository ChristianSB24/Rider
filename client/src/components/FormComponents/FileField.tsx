import React from 'react';
import { ErrorMessage, useField } from 'formik'

interface textValues {
    name: string,
    type: string,
    showValid: boolean,
    onChange: any,
}

interface validationValues {
    error: string | undefined,
    touched: boolean | undefined,
    value: string,
    showValid: boolean,
  }

const validationClass = ({error, touched, value, showValid}: validationValues) => {
    if (!showValid && !error && touched && value.length > 0) {
      return "form-control is-valid"
    } else if (error && touched && value.length !== 0) {
      return "form-control is-invalid"
    } else {
      return "form-control"
    }
  }


export const FileField = ({ showValid, ...props }: textValues) => {
    const [field, meta] = useField({ ...props});
    return (
      <div>
          <input {...props} onChange={props.onChange} className={validationClass({error: meta.error, touched: meta.touched, value: meta.value, showValid: showValid})}/>
          <ErrorMessage name={props.name} render={msg => <div className="invalid-feedback">{msg}</div>} />
      </div>
    );
  };