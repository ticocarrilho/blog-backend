import React from 'react';
import {
  makeStyles,
  Paper,
  TextField,
  Button,
  Typography,
  FormControlLabel,
  Checkbox,
  Box,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  formContainter: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    '& .MuiTextField-root': {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    '& .MuiButton-root': {
      width: '100%',
    },
  },
}));

function FormContainer({ register, handleSubmit, errors, type, clearErrors }) {
  const classes = useStyles();

  return (
    <Box margin='auto' maxWidth='600px'>
      <Paper className={classes.formContainter}>
        <Typography variant='h5'>
          {type === 'login' ? 'Login' : 'Sign Up'}
        </Typography>
        <form onSubmit={handleSubmit}>
          {type === 'signup' ? (
            <TextField
              inputRef={register({
                required: { value: true, message: 'Name is required.' },
              })}
              label='Name'
              name='name'
              fullWidth
              required
              type='text'
              color='secondary'
              helperText={errors.name?.message}
              error={errors.name !== undefined}
              onChange={() => clearErrors('name')}
            />
          ) : (
            ''
          )}

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
            helperText={
              errors.email?.message || errors.wrongEmailOrPwd?.message
            }
            error={
              errors.email !== undefined || errors.wrongEmailOrPwd !== undefined
            }
            onChange={() => {
              clearErrors('email');
              clearErrors('wrongEmailOrPwd');
            }}
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
            helperText={
              errors.password?.message || errors.wrongEmailOrPwd?.message
            }
            error={
              errors.password !== undefined ||
              errors.wrongEmailOrPwd !== undefined
            }
            onChange={() => {
              clearErrors('password');
              clearErrors('wrongEmailOrPwd');
            }}
          />
          <FormControlLabel
            inputRef={register()}
            control={<Checkbox name='keepSignIn' color='primary' />}
            label='Keep me signed in'
            name='keepSignIn'
          />
          <Button type='Submit' color='primary'>
            {type === 'login' ? 'Login' : 'Sign Up'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default FormContainer;
