import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom'; 

import DriverDashboard from './DriverDashboard'; 
import DriverDetail from './DriverDetail';
import { isDriver } from '../services/AuthService';

function Driver () {
  if (!isDriver()) {
    return <Navigate to='/' />
  }

  return (
    <Routes>
      <Route path='/driver/:id' element={DriverDetail} />
      <Route element={DriverDashboard} />
    </Routes>
  );
}

export default Driver;