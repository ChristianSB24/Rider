import React from 'react';
import { Navigate, Route, Outlet, Routes } from 'react-router-dom';

import RiderDashboard from './RiderDashboard';
import RiderDetail from './RiderDetail';
import RiderRequest from './RiderRequest';
import { isRider } from '../services/AuthService';

export const Rider = (props: any) => {
    if (!isRider()) {
        return <Navigate to='/' />
    }
    return (
            <Outlet />
    )
}