import React from 'react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { DashboardButton } from './DashboardButton';

export const LandingPage = ({ userInfo }: any) => {
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