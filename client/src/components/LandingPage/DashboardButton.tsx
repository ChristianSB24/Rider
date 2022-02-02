import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { selectUser } from '../../features/userSlice';

export const DashboardButton = () => {
    const userInfo = useSelector(selectUser)
    return <Link className='btn btn-primary' to={`/${userInfo.group}`}>Dashboard</Link>
}