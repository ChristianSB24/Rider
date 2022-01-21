import axios from "axios";

const client = axios.create();

function getCookie(name:any) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
          var cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

const csrftoken = getCookie('csrftoken');

axios.defaults.headers.common['X-CSRFToken'] = csrftoken;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

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
export { getCookie }
