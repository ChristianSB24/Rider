import React from 'react';
import { useSelector } from 'react-redux'
import { Routes, Route, Link } from 'react-router-dom';

import { selectUser, selectAuthenticated } from '../../features/userSlice';
import { RequireAuth } from '../../auth/Authorization'
import { DriverLayout } from '../Driver/DriverLayout';
import { RiderLayout } from '../Rider/RiderLayout';
import { LandingPage } from '../LandingPage/LandingPage';
import LogoutButton from './LogoutButton';
import { GlobalModal } from './GlobalModal';
import RiderAccountIcon from './RiderAccountIcon.png'
import RiderAccount from './user-128.png'

const PageLayout = () => {
    const userInfo = useSelector(selectUser)
    const auth = useSelector(selectAuthenticated)
    console.log('inside pagelayout')
    return (
        <>
            <nav className="nav position-fixed top-0 d-flex justify-content-end w-100 dashboard-container bg-white py-3">
                <Link className="rounded-circle text-grey bg-grey-secondary p-1 nav-icon-wrapper shadow" to='/'><img className="nav-icon rounded-circle" src={RiderAccount} /></Link>
            </nav>
            <div className="d-flex position-relative flex-column justify-content-center align-items-center dashboard-container mt-3">
                <GlobalModal>
                    <Routes>
                        <Route index element={<LandingPage />} />
                        <Route path='/driver/*' element={<RequireAuth userInfo={userInfo} group='driver' ><DriverLayout /></RequireAuth>} />
                        <Route path='/rider/*' element={<RequireAuth userInfo={userInfo} group='rider' > <RiderLayout /></RequireAuth>} />
                    </Routes>
                </GlobalModal>
            </div>
        </>
    )
}

export default PageLayout