import React, { useEffect } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { Route, Switch } from 'react-router-dom';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import theme from './theme';
import api from './services/api';

const App = () => {
  useEffect(() => {
    const getCsrfToken = async () => {
      const { data } = await api.get('/csrf-token');
      api.defaults.headers.post['X-CSRF-Token'] = data.csrfToken;
    };
    getCsrfToken();
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Switch>
        <Route path='/' component={MainPage} exact />
        <Route path='/login' component={LoginPage} />
      </Switch>
    </ThemeProvider>
  );
};

export default App;
