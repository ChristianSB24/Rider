import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { DashboardButton } from './DashboardButton';
import { selectAuthenticated } from '../../features/userSlice';
import ReactLogo from '../common/3dcar.svg'
import RotateChecklist from '../common/RotateChecklist2.png'


export const LandingPage = () => {
    const auth = useSelector(selectAuthenticated)
    return (
        <>
            {auth ? (
                <>
                    <div className="card bg-success-secondary text-white dashboard-main-img w-100">
                        <img src={RotateChecklist} className="card-img" />
                        <div className="card-img-overlay d-flex flex-column left-0">
                            <p className="card-title text-start text-white h5">Errands just got<br />easier</p>
                            <p className='h6'>Ride with Rider <i className="bi bi-arrow-right"></i></p>
                        </div>
                    </div>
                    <h1>Taxi</h1>
                    <DashboardButton />
                    <img src={ReactLogo} className="dashboard-main-img" />
                </>

            ) :
                <>
                    <Link id='signUp' className='btn btn-primary' to='/sign-up'>Sign up</Link>
                    <Link id='logIn' className='btn btn-primary' to='/log-in'>Log in</Link>
                </>}
        </>
    )
}