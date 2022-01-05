import React from "react";
import ReactDOM from "react-dom"
import axios from 'axios';
import './custom.scss'
import  App  from './App'
import { HashRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById("root")
);

reportWebVitals();