import axios from "axios";

console.log('gets here on login')

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
    Promise.reject(error);
  }
);

export default client


// const client = () => {
//   const token = getAccessToken();
//   return axios.create({
//     baseURL: `${process.env.REACT_APP_BASE_URL}`,
//     headers: { Authorization: `Bearer ${token}` }
//   })
// }

// export default axios.create({
//   baseURL: `${process.env.REACT_APP_BASE_URL}`,
//   headers: { Authorization: `Bearer ${token}` }
// });
