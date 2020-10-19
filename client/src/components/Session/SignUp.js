import React from 'react';
import { useForm } from 'react-hook-form';
import FormContainer from './FormContainer';
import useSubmit from '../../hooks/useSession';

function SignUp() {
  const { register, handleSubmit, errors, setError, clearErrors } = useForm();
  const { login } = useSubmit('/user', 201, setError);

  const onSubmit = (data) => {
    login({
      name: data.name,
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
      type='signup'
    />
  );
}

export default SignUp;
