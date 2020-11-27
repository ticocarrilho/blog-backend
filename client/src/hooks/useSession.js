import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { setSession, logoutSession } from '../slices/sessionSlice';
import api from '../services/api';

const useSession = (route, statusCodeSucess, setError) => {
  const [cookies, setCookie, removeCookie] = useCookies([
    'keepSession',
    'session',
  ]);
  const [validSession, setValidSession] = useState();
  const history = useHistory();
  const dispatch = useDispatch();

  const removeSessionCookie = () => {
    removeCookie('session');
  };

  useEffect(() => {
    //!!TODO colocar aqui requisição para verficiar se o token jwt ainda é válido.
    const verifySession = async () => {
      try {
        await api.get('/me');
        setValidSession(true);
      } catch (error) {
        setValidSession(false);
      }
    };

    verifySession();

    if (cookies.session == 1) {
      dispatch(setSession(true));
    }

    if (cookies.keepSession === 'false') {
      window.addEventListener('beforeunload', removeSessionCookie);
    } else {
      window.removeEventListener('beforeunload', removeSessionCookie);
    }
    return () => {
      window.removeEventListener('beforeunload', removeSessionCookie);
    };
  }, [cookies.keepSession, cookies.session]);

  useEffect(() => {
    if (validSession === false) {
      removeSessionCookie();
      dispatch(setSession(false));
    }
  }, [validSession]);

  const login = async (data) => {
    try {
      const response = await api.post(route, data, { withCredentials: true });
      if (response.status === statusCodeSucess) {
        setCookie('keepSession', data.keepSignIn, {
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 1000,
        });
        setCookie('session', 1, {
          secure: process.env.NODE_ENV === 'production',
          maxAge: 60 * 60 * 1000,
        });
        history.push('/');
      }
    } catch ({ response }) {
      const { data } = response;
      if (Array.isArray(data?.error)) {
        data.error.forEach((error) => {
          setError(`${error.param}`, {
            type: 'manual',
            message: error.msg,
          });
        });
      }
    }
  };

  const logout = async () => {
    dispatch(logoutSession());
    removeCookie('session');
    removeCookie('keepSession');
  };

  return { login, logout };
};

export default useSession;
