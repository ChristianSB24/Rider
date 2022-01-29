import React from 'react';
import { Routes, Route } from 'react-router-dom'

import DriverDetail from './DriverDetail';
import DriverDashboard from './DriverDashboard'

export const DriverLayout = () => {
    return (
        // <div className='row'>
        //     <div className='col-lg-12'>
                <Routes>
                    <Route index element={<DriverDashboard />} />
                    <Route path=':id' element={<DriverDetail />} />
                </Routes>
        //     </div>
        // </div>
    )
}