import React from 'react';
import { Container, makeStyles } from '@material-ui/core';
import Navbar from '../components/Navbar';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
  },
}));

const Layout = ({ children }) => {
  const classes = useStyles();
  return (
    <>
      <Navbar />
      <Container className={classes.root}>{children}</Container>
    </>
  );
};

export default Layout;
