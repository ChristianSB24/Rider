import React from 'react';
import { useForm } from 'react-hook-form';
import TextField from './FormComponents/TextField'
import { Button } from '@mui/material';

interface logIn {
  logIn(username: string, password: string): Promise<any>
}

const defaultValues = {
  username: "",
  password: "",
};

function LogIn(props: logIn) {
  const {
    control,
    handleSubmit,
  } = useForm({ defaultValues: defaultValues });
  

  const onSubmit = async (values: any, actions: any) => {
    console.log(values, actions)
    try {
      const { response, isError } = await props.logIn(
        values.username,
        values.password
      );
      if (isError) {
        const data = response.response.data;
        for (const value in data) {
          actions.setFieldError(value, data[value].join(' '));
        }
      }
    }
    catch (error) {
      console.error(error);
    }
  }

  return (
    <>
        <TextField
          id="login_name"
          name="username"
          label="Name"
          control={control}
        />
        <TextField
          id="login_password"
          name="password"
          label="Password"
          control={control}
        />
        <Button color="primary" variant="contained"  onClick={handleSubmit(onSubmit)}>
          Submit
        </Button>
      </>
  );
}

export default LogIn;