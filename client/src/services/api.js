import axios from 'axios';

let baseURL;

if (process.env.NODE_ENV === 'production') {
  baseURL = 'https://blog-node-react.herokuapp.com/api';
} else {
  baseURL = 'http://localhost:3001/api';
}
const api = axios.create({
  baseURL,
});

export default api;
