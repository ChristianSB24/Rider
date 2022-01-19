import axios from "axios";

const client = axios.create();

client.interceptors.request.use(
  (config) => {
    const token = JSON.parse(window.localStorage.getItem('taxi.auth') || 'null')
    config.baseURL = `${process.env.REACT_APP_BASE_URL}`
    config.headers.Authorization = token ? `Bearer ${token.access}` : ''
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default client