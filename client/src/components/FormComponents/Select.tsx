import React from 'react';
import { ErrorMessage, useField} from 'formik'
import _ from 'lodash';

export const Select = ({ label, ...props }: any) => {
    const [field, meta] = useField(props);
    return (
      <div>
        <label htmlFor={props.id || props.name}>{label}</label>
        <select {...field} {...props} />
        {meta.touched && meta.error ? (
          <div className="error">{meta.error}</div>
        ) : null}
      </div>
    );
  };