import React from 'react';
import {
  makeStyles,
  Paper,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { useForm } from 'react-hook-form';
import api from '../services/api';

const useStyles = makeStyles((theme) => ({
  formContainter: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  errorAlert: {
    marginBottom: theme.spacing(1),
    '& ul': {
      margin: 0,
      paddingLeft: theme.spacing(1),
    },
  },
}));

function Login() {
  const classes = useStyles();
  const { register, handleSubmit, errors, setError } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await api.post('/user/login', {
        email: data.email,
        password: data.password,
      });
      console.log(response);
    } catch (error) {
      setError('wrongEmailOrPwd', {
        type: 'manual',
        message: error.response.data.error,
      });
    }
  };

  const renderErrors = () => {
    return (
      <Alert className={classes.errorAlert} severity='error'>
        <ul>
          {Object.values(errors).map((error) => (
            <li key={error.message}>{error.message}</li>
          ))}
        </ul>
      </Alert>
    );
  };

  const teste = async () => {
    try {
      const response = await axios.get('/user');
      console.log(response);
    } catch (error) {
      setError('wrongEmailOrPwd', {
        type: 'manual',
        message: error.response.data.error,
      });
    }
  }

  return (
    <Paper className={classes.formContainter}>
      {Object.keys(errors).length !== 0 ? renderErrors() : ''}
      <Typography variant='h5'>Welcome back</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          inputRef={register({
            required: { value: true, message: 'E-mail is required.' },
          })}
          label='E-mail'
          name='email'
          fullWidth
          required
          type='text'
          color='secondary'
        />
        <TextField
          inputRef={register({
            required: { value: true, message: 'Password is required.' },
          })}
          label='Password'
          name='password'
          fullWidth
          required
          type='password'
          color='secondary'
        />
        <FormControlLabel
          inputRef={register()}
          control={<Checkbox name='checkedB' color='primary' />}
          label='Keep me signed in'
          name='keepSignIn'
        />
        <Button type='Submit' color='primary'>
          Login
        </Button>
      </form>
      <Button onClick={teste}>Teste Auth</Button>
    </Paper>
  );
}

export default Login;
