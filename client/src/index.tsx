import React from "react";
import ReactDOM from "react-dom"
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom';

import App from './App'
import store from './app/store'
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <BrowserRouter>
  {/* Having the Provider wrap around the rest of the application ensures that redux will render first on a potential refresh.
  This is important because we need the store to be up to date before the rest of the app renders. */}
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);

reportWebVitals();