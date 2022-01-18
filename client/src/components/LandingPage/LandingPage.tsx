import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom';
import _ from 'lodash';

import { fetchTrips } from '../../features/tripsSlice';
import { DashboardButton } from './DashboardButton';

export const LandingPage = ({ userInfo }: any) => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchTrips())
    }, [])


    return (
        <>
            <h1>Taxi</h1>
            {_.isEmpty(userInfo) && (
                <>
                    <Link id='signUp' className='btn btn-primary' to='/sign-up'>Sign up</Link>
                    <Link id='logIn' className='btn btn-primary' to='/log-in'>Log in</Link>
                </>
            )}
            {!_.isEmpty(userInfo) && (<DashboardButton userInfo={userInfo} />)}
        </>
    )
}