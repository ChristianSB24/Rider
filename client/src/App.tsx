import React, { useContext } from 'react';
import _ from 'lodash'
import { Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { AccountContext } from './auth/Authorization'
import SignUp from './common/SignUp';
import LogIn from './common/LogIn';
import { NotFound } from './common/NotFound';
import PageLayout from './Layout/PageLayout';

import 'bootstrap';
import './scss/app.scss'
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const auth = useContext(AccountContext)
  return (
    <div className="login-content">
        <Routes>
          <Route path='/*' element={<PageLayout auth={auth}/>}/>
          <Route path='/sign-up' element={!_.isEmpty(auth.userInfo) ? <Navigate replace to={'/'} /> : <SignUp />} />
          <Route path='/log-in' element={!_.isEmpty(auth.userInfo) ? <Navigate replace to={'/'} /> : <LogIn />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        <ToastContainer />
    </div>
  );
}

export default App;