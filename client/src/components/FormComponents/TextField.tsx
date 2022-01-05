import React from 'react';
import { ErrorMessage, useField } from 'formik'

interface Values {
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
    <div className="mb-3">
      <input placeholder={props.placeholder} {...field} className={validationClass(meta.error, meta.touched, meta.value)} />
      <ErrorMessage name={props.name} render={msg => <div className="invalid-feedback">{msg}</div>} />
    </div>
  );
};