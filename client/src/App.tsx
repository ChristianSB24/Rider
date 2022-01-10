import React, { useContext } from 'react';
import _ from 'lodash'
import { Route, Routes, Navigate } from 'react-router-dom';

import { RequireAuth, AccountContext } from './auth/Authorization'
import SignUp from './components/FormComponents/SignUp';
import LogIn from './components/FormComponents/LogIn';
import DriverDashboard from './components/Driver/DriverDashboard';
import { NotFound } from './components/NotFound';
import { RiderLayout } from './components/Rider/RiderLayout';
import { LandingPage } from './components/LandingPage';
import { Header } from './components/Header';

function App() {
  const auth = useContext(AccountContext)
  return (
    <div className="login-content">
      <Header auth={auth}/>
      <div className="d-flex max-width flex-column justify-content-center align-items-center px-2">
        <Routes>
          <Route path='/' element={<LandingPage userInfo={auth.userInfo} />} />
          <Route path='/sign-up' element={!_.isEmpty(auth.userInfo) ? <Navigate replace to={'/'} /> : <SignUp />} />
          <Route path='/log-in' element={!_.isEmpty(auth.userInfo) ? <Navigate replace to={'/'} /> : <LogIn />} />
          <Route path='/driver/*' element={<RequireAuth userInfo={auth.userInfo} group='driver' ><DriverDashboard /></RequireAuth>} />
          <Route path='/rider/*' element={<RequireAuth userInfo={auth.userInfo} group='rider' > <RiderLayout /></RequireAuth>}/>
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;