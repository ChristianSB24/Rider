import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { isRider } from '../services/AuthService';

export const Rider = (props: any) => {
    if (!isRider()) {
        return <Navigate to='/' />
    }
    return (
            <Outlet />
    )
}