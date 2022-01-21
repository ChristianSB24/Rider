import React from "react";
import ReactDOM from "react-dom"
import axios from 'axios';
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom';

import App from './App'
import { AccountProvider } from './auth/Authorization'
import store from './app/store'
import reportWebVitals from './reportWebVitals';

// axios.defaults.xsrfCookieName = 'csrftoken';
// axios.defaults.xsrfHeaderName = 'X-CSRFToken';

ReactDOM.render(
  <HashRouter>
    <Provider store={store}>
      <AccountProvider>
        <App />
      </AccountProvider >
    </Provider>
  </HashRouter>,
  document.getElementById("root")
);

reportWebVitals();