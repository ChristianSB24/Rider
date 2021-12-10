import React from 'react';
import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

export default ({ id, name, control, label }) => {
  return (
    <form>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              id={id}
              variant="outlined"
              onChange={onChange}
              value={value}
              label={label}
            />
        )}
      />
    </form>
  );
};