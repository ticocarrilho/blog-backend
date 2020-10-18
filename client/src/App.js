import React, { useEffect } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Layout from './pages/Layout';
import Login from './components/Session/Login';
import SignUp from './components/Session/SignUp';
import PostList from './components/Post/PostsList'
import theme from './theme';
import api from './services/api';
import { fetchPosts } from './slices/postSlice';

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const getCsrfToken = async () => {
      await api.get('/csrf-token', { withCredentials: true });
    };
    getCsrfToken();
    dispatch(fetchPosts())
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Switch>
          <Route path='/' component={PostList} exact />
          <Route path='/login' component={Login} />
          <Route path='/signup' component={SignUp} />
        </Switch>
      </Layout>
    </ThemeProvider>
  );
};

export default App;
