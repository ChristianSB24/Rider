import React from 'react';
import { useSelector } from 'react-redux'
import { Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { selectAuthenticated } from './features/userSlice';
import SignUp from './components/common/SignUp';
import LogIn from './components/common/LogIn';
import { NotFound } from './components/common/NotFound';
import PageLayout from './components/Layout/PageLayout';

import 'bootstrap';
import './scss/app.scss'
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const auth = useSelector(selectAuthenticated)
  console.log('auth', auth)
  return (
    <div className="rider-container">
        <Routes>
          <Route path='/*' element={<PageLayout />}/>
          <Route path='/sign-up' element={auth ? <Navigate replace to={'/'} /> : <SignUp />} />
          <Route path='/log-in' element={auth ? <Navigate replace to={'/'} /> : <LogIn />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        <ToastContainer />
    </div>
  );
}

export default App;