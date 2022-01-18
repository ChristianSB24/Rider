import axios from "axios";

const client = axios.create();

client.interceptors.request.use(
  (config) => {
    config.baseURL = `${process.env.REACT_APP_BASE_URL}`
    config.headers = {
      Authorization: `Bearer ${JSON.parse(window.localStorage.getItem('taxi.auth') || 'null').access}`,
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default client
