import React from 'react';
import { useField, ErrorMessage } from 'formik'

const Select = ({ label, ...props }: any) => {
  const [field, meta] = useField(props);
  return (
    <div className="mb-3">
      <label htmlFor={props.id || props.name}>{label}</label>
      <select {...field} {...props} />
      <ErrorMessage name={props.name} render={msg => <div className="invalid-feedback">{msg}</div>} />
    </div>
  );
};

export default Select
