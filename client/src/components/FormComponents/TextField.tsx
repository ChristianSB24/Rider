import React from 'react';
import validationClassName from './validationClassName'
import { ErrorMessage, useField } from 'formik'

interface textValues {
  name: string,
  placeholder: string
  type: string,
}

const TextField = (props: textValues) => {
  const [field, meta] = useField(props);
  return (
    <div className="mb-3">
      <input {...props} {...field} className={validationClassName({ error: meta.error, touched: meta.touched })} />
      <ErrorMessage name={props.name} render={msg => <div className="text-danger">{msg}</div>} />
    </div>
  );
};

export default TextField

// onChange={(event: any) => {
//   setFieldValue("photo", event.target.files[0])
// }}