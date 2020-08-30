import axios from 'axios';

const api = axios.create({
  baseURL: 'https://blog-node-react.herokuapp.com/api',
});

export default api;
