import React, { useEffect } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { Route, Switch } from 'react-router-dom';
import Layout from './pages/Layout';
import Login from './components/Session/Login';
import SignUp from './components/Session/SignUp';
import theme from './theme';
import api from './services/api';

const App = () => {
  useEffect(() => {
    const getCsrfToken = async () => {
      await api.get('/csrf-token', { withCredentials: true });
    };
    getCsrfToken();
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Switch>
          {/* <Route path='/' component={MainPage} exact /> */}
          <Route path='/login' component={Login} />
          <Route path='/signup' component={SignUp} />
        </Switch>
      </Layout>
    </ThemeProvider>
  );
};

export default App;
