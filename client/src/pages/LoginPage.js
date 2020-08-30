import React from 'react';
import {
  Container,
  makeStyles,
} from '@material-ui/core';
import Navbar from '../components/Navbar';
import Login from '../components/Login';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
    '& .MuiTextField-root': {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    '& .MuiButton-root': {
      width: '100%',
    },
  },
}));

function LoginPage() {
  const classes = useStyles();
  return (
    <>
      <Navbar />
      <Container maxWidth='sm' className={classes.root}>
        <Login />
      </Container>
    </>
  );
}

export default LoginPage;
