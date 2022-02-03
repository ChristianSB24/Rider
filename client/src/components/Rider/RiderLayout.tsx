import React from 'react';
import { Routes, Route } from 'react-router-dom'

import RiderDetail from './RiderDetail';
import RiderRequest from './RiderRequest';
import RiderDashboard from './RiderDashboard'

export const RiderLayout = () => {
    console.log('inside RiderLayout')
    return (
        <div className='row'>
            <div className='col-lg-12'>
                <Routes>
                    <Route index element={<RiderDashboard />} />
                    <Route path='request' element={<RiderRequest />} />
                    <Route path=':id' element={<RiderDetail />} />
                </Routes>
            </div>
        </div>
    )
}