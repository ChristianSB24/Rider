import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import { DashboardButton } from './DashboardButton';
import { selectAuthenticated } from '../../features/userSlice';

export const LandingPage = () => {
    const auth = useSelector(selectAuthenticated)
    return (
        <>
            <h1>Taxi</h1>
            {auth ? (
                <DashboardButton />
            ) :
                <>
                    <Link id='signUp' className='btn btn-primary' to='/sign-up'>Sign up</Link>
                    <Link id='logIn' className='btn btn-primary' to='/log-in'>Log in</Link>
                </>}
        </>
    )
}