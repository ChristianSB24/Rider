import React from 'react';
import validationClassName from './validationClassName'
import { ErrorMessage, useField } from 'formik'

interface textValues {
  name: string,
  type: string,
  onChange: any,
}

const FileField = ({ ...props }: textValues) => {
  const [{ onChange, value, ...rest }, meta] = useField({ ...props });
  return (
    <div className="mb-3">
      <input {...props} {...rest} className={validationClassName({ error: meta.error, touched: meta.touched })} />
      <ErrorMessage name={props.name} render={msg => <div className="invalid-feedback">{msg}</div>} />
    </div>
  );
};

export default FileField