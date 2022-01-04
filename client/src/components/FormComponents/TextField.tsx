import React from 'react';
import { ErrorMessage, useField } from 'formik'

interface Values {
  label: string,
  name: string,
  placeholder: string
  type: string,
}

const validationClass = (error: string | undefined, touched: boolean | undefined, value: string) => {
  if (!error && touched && value.length > 0) {
    return "form-control is-valid"
  } else if (error && touched) {
    return "form-control is-invalid"
  } else {
    return "form-control"
  }
}

export const TextField = (props: Values) => {
  const [field, meta] = useField(props);
  return (
    <div className="mb-3 w-50">
      <label htmlFor={props.name} className="form-label">{props.label}</label>
      <input placeholder={props.placeholder} {...field} className={validationClass(meta.error, meta.touched, meta.value)} />
      <ErrorMessage name={props.name} render={msg => <div className="invalid-feedback">{msg}</div>} />
    </div>
  );
};