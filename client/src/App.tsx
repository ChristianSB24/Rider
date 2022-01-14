import React, { useContext } from 'react';
import _ from 'lodash'
import { Route, Routes, Navigate } from 'react-router-dom';

import { AccountContext } from './auth/Authorization'
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import { NotFound } from './components/NotFound';
import PageLayout from './components/PageLayout';

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
    </div>
  );
}

export default App;