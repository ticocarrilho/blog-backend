import React from 'react';
import { AppBar, Toolbar, IconButton, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles((theme) => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const App = () => {
  const classes = useStyles();

  return (
    <AppBar position='static'>
      <Toolbar>
        <IconButton className={classes.menuButton} edge='start' color='inherit'>
          <MenuIcon />
        </IconButton>
        <Typography className={classes.title} variant='h6'>Blog</Typography>
        <IconButton color='inherit'>
          <AccountCircle />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default App;
