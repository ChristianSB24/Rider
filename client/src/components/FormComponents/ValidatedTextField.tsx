import React from 'react';
import validationClassName from '../../utils/validationClassName'
import { ErrorMessage, useField } from 'formik'

interface textValues {
  name: string,
  placeholder: string
  type: string,
  onChange: any,
}

const ValidatedTextField = (props: textValues) => {
  const [{onChange, ...field}, meta] = useField(props);
  return (
    <div className="mb-3">
      <input {...props} {...field} className={validationClassName({ error: meta.error, touched: meta.touched })} />
      <ErrorMessage name={props.name} render={msg => <span className="text-danger">{msg}</span>} />
    </div>
  );
};

export default ValidatedTextField