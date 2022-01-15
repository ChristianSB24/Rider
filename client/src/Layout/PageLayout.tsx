import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import _ from 'lodash';

import { RequireAuth } from '../auth/Authorization'
import { DriverLayout } from '../Driver/DriverLayout';
import { RiderLayout } from '../Rider/RiderLayout';
import { LandingPage } from '../LandingPage/LandingPage';

const PageLayout = ({ auth }: any) => {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <Link to='/' className="navbar-brand">Taxi</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <ul className="navbar-nav">
                        {auth.userInfo.group === 'rider' &&
                            <li className='me-auto navbar-nav'>
                                <Link to='/rider/request'>Request a trip</Link>
                            </li>}
                        {!_.isEmpty(auth.userInfo) &&
                            <li className='me-auto nav-item'>
                                <button type='button' className="btn btn-primary" onClick={() => auth.logOut()}>Log out</button>
                            </li>
                        }
                    </ul>
                </div>
            </nav>
            <div className="d-flex center-alignment flex-column justify-content-center align-items-center px-2">
                <Routes>
                    <Route index element={<LandingPage userInfo={auth.userInfo} />} />
                    <Route path='/driver/*' element={<RequireAuth userInfo={auth.userInfo} group='driver' ><DriverLayout /></RequireAuth>} />
                    <Route path='/rider/*' element={<RequireAuth userInfo={auth.userInfo} group='rider' > <RiderLayout /></RequireAuth>} />
                </Routes>
            </div>
        </>
    )
}

export default PageLayout