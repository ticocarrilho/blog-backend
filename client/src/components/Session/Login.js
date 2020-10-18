import React from 'react';
import { useForm } from 'react-hook-form';
import FormContainer from './FormContainer';
import api from '../../services/api';

function Login() {
  const { register, handleSubmit, errors, setError, clearErrors } = useForm();

  const onSubmit = async (data) => {
    try {
      await api.post(
        '/user/login',
        {
          email: data.email,
          password: data.password,
        },
        { withCredentials: true }
      );
    } catch ({ response }) {
      const { data } = response;
      data.error.forEach((error) => {
        setError(`${error.param}`, {
          type: 'manual',
          message: error.msg,
        });
      });
    }
  };

  return (
    <FormContainer
      register={register}
      handleSubmit={handleSubmit(onSubmit)}
      errors={errors}
      clearErrors={clearErrors}
      type='login'
    />
  );
}

export default Login;
