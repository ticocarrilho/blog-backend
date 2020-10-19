import { useEffect } from 'react';
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
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (cookies.session == 1) {
      dispatch(setSession(true));
    }
    const removeSession = () => {
      removeCookie('session');
    };
    if (cookies.keepSession === 'false') {
      window.addEventListener('beforeunload', removeSession);
    } else {
      window.removeEventListener('beforeunload', removeSession);
    }
    return () => {
      window.removeEventListener('beforeunload', removeSession);
    };
  }, [cookies.keepSession, cookies.session]);

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
