import React from 'react';
import { ErrorMessage, useField } from 'formik'

interface textValues {
  name: string,
  placeholder: string
  type: string,
  login: boolean,
}

interface validationValues {
  error: string | undefined,
  touched: boolean | undefined,
  value: string,
  login: boolean,
}

const validationClass = ({error, touched, value, login}: validationValues) => {
  if (!login && !error && touched && value.length > 0) {
    return "form-control is-valid"
  } else if (error && touched) {
    return "form-control is-invalid"
  } else {
    return "form-control"
  }
}

export const TextField = (props: textValues) => {
  const [field, meta] = useField(props);
  return (
    <div className="mb-3">
      <input placeholder={props.placeholder} {...field} className={validationClass({error: meta.error, touched: meta.touched, value: meta.value, login: props.login})} />
      <ErrorMessage name={props.name} render={msg => <div className="invalid-feedback">{msg}</div>} />
    </div>
  );
};