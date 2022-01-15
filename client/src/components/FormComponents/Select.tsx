import React from 'react';
import { useField } from 'formik'

const Select = ({ ...props }: any) => {
  const [field] = useField(props);
  return (
    <div className="mb-3">
      <label htmlFor={props.name}>{props.label}:&nbsp;</label>
      <select {...field} {...props} />
    </div>
  );
};

export default Select
