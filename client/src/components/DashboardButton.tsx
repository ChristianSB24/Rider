import React from 'react';
import { Link } from 'react-router-dom';

export const DashboardButton = ({userInfo}: any) => {
    return <Link className='btn btn-primary' to={`/${userInfo.group}`}>Dashboard</Link>
}