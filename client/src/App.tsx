import React from 'react';
import _ from 'lodash'
import { useSelector } from 'react-redux'
import { Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { selectUser } from './features/userSlice';
import SignUp from './components/common/SignUp';
import LogIn from './components/common/LogIn';
import { NotFound } from './components/common/NotFound';
import PageLayout from './components/Layout/PageLayout';

import 'bootstrap';
import './scss/app.scss'
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const userInfo = useSelector(selectUser)
  return (
    <div className="login-content">
        <Routes>
          <Route path='/*' element={<PageLayout />}/>
          <Route path='/sign-up' element={!_.isEmpty(userInfo) ? <Navigate replace to={'/'} /> : <SignUp />} />
          <Route path='/log-in' element={!_.isEmpty(userInfo) ? <Navigate replace to={'/'} /> : <LogIn />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        <ToastContainer />
    </div>
  );
}

export default App;