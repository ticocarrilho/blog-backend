import React from 'react';
import { useForm } from 'react-hook-form';
import FormContainer from './FormContainer';
import useSubmit from '../../hooks/useSession';

function Login() {
  const { register, handleSubmit, errors, setError, clearErrors } = useForm();
  const { login } = useSubmit('/user/login', 200, setError);

  const onSubmit = (data) => {
    login({
      email: data.email,
      password: data.password,
      keepSignIn: data.keepSignIn,
    });
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
