import React from 'react';
import { useSelector } from 'react-redux'
import { Routes, Route, Link } from 'react-router-dom';
import _ from 'lodash';

import { selectUser } from '../../features/userSlice'; 
import { RequireAuth } from '../../auth/Authorization'
import { DriverLayout } from '../Driver/DriverLayout';
import { RiderLayout } from '../Rider/RiderLayout';
import { LandingPage } from '../LandingPage/LandingPage';
import LogoutButton from './LogoutButton';

const PageLayout = () => {
    const userInfo = useSelector(selectUser)
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <Link to='/' className="navbar-brand">Taxi</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <ul className="navbar-nav">
                        {userInfo?.group === 'rider' &&
                            <li className='me-auto navbar-nav'>
                                <Link to='/rider/request'>Request a trip</Link>
                            </li>}
                        {!_.isEmpty(userInfo) &&
                            <li className='me-auto nav-item'>
                                <LogoutButton />
                            </li>
                        }
                    </ul>
                </div>
            </nav>
            <div className="d-flex center-alignment flex-column justify-content-center align-items-center px-2">
                <Routes>
                    <Route index element={<LandingPage userInfo={userInfo} />} />
                    <Route path='/driver/*' element={<RequireAuth userInfo={userInfo} group='driver' ><DriverLayout /></RequireAuth>} />
                    <Route path='/rider/*' element={<RequireAuth userInfo={userInfo} group='rider' > <RiderLayout /></RequireAuth>} />
                </Routes>
            </div>
        </>
    )
}

export default PageLayout