import React from 'react';
import validationClassName from '../../utils/validationClassName'
import { ErrorMessage, useField } from 'formik'

interface textValues {
  name: string,
  type: string,
  label: string,
  onChange: any,
}

const FileField = ({ ...props }: textValues) => {
  const [{ onChange, value, ...rest }, meta] = useField({ ...props });
  return (
    <div className="mb-3">
      <label htmlFor={props.name}>{props.label}:&nbsp;</label>
      <input {...props} {...rest} className={validationClassName({ error: meta.error, touched: meta.touched })} />
      <ErrorMessage name={props.name} render={msg => <span className="text-danger">{msg}</span>} />
    </div>
  );
};

export default FileField