import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { DashboardButton } from './DashboardButton';
import { selectAuthenticated } from '../../features/userSlice';
import ReactLogo from '../common/3dcar.svg'
import RotateChecklist from '../common/RotateChecklist2.png'
import WhiteSedan from './64418.jpg'
import RiderCarIcon from './RiderCarIcon.png'
import RiderFoodIcon from './RiderFoodIcon.png'
import RiderPackageIcon from './RiderPackageIcon.png'


export const LandingPage = () => {
    const auth = useSelector(selectAuthenticated)
    return (
        <>
            {auth ? (
                <>
                    <div className="card bg-success-secondary text-white dashboard-main-img w-100 mb-3">
                        <img src={RotateChecklist} className="card-img dashboard-main-img" />
                        <div className="card-img-overlay d-flex flex-column left-0">
                            <p className="card-title text-start text-white t2">Errands just got<br />easier</p>
                            <p className='t3'>Ride with Rider <i className="bi bi-arrow-right"></i></p>
                        </div>
                    </div>
                    <div className="d-flex flex-row justify-content-between w-100 mb-3">
                        <button className='btn btn-grey-secondary dashboard-buttons pt-0 pb-1'><img className="dashboard-main-img mb-1" src={RiderCarIcon} /><p className='m-0 t2'>Ride</p></button>
                        <button className='btn btn-grey-secondary dashboard-buttons p-0 pb-1'><img className="dashboard-main-img" src={RiderFoodIcon} /><p className='m-0 t2'>Food</p></button>
                        <button className='btn btn-grey-secondary dashboard-buttons p-0 pb-1'><img className="dashboard-main-img" src={RiderPackageIcon} /><p className='m-0 t2'>Package</p></button>
                    </div>
                    <div className="d-flex flex-row bg-grey-secondary w-100 p-2 px-3">
                        <div className="t1 fw-normal">Where to?</div>
                        <div className=""></div>
                    </div>
                    <h1>Taxi</h1>
                    <DashboardButton />
                </>

            ) :
                <>
                    <Link id='signUp' className='btn btn-primary' to='/sign-up'>Sign up</Link>
                    <Link id='logIn' className='btn btn-primary' to='/log-in'>Log in</Link>
                </>}
        </>
    )
}