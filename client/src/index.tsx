import React from "react";
import ReactDOM from "react-dom"
import axios from 'axios';
import 'bootstrap';
import './scss/custom.scss'
import App from './App'
import { AccountProvider } from './auth/Authorization'
import { HashRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

ReactDOM.render(
  <HashRouter>
    <AccountProvider>

      <App />
    </AccountProvider >
  </HashRouter>,
  document.getElementById("root")
);

reportWebVitals();