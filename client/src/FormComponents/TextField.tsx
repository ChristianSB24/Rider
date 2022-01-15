import React from 'react';
import { useField } from 'formik'

interface textValues {
  name: string,
  placeholder: string
  type: string,
}

const TextField = (props: textValues) => {
  const [field] = useField(props);
  return (
    <div className="mb-3">
      <input {...props} {...field} className="form-control" />
    </div>
  );
};

export default TextField