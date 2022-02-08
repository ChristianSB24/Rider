import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { DashboardButton } from './DashboardButton';
import { selectAuthenticated } from '../../features/userSlice';
import RotateChecklist from '../common/RotateChecklist2.png'
import RiderCarIcon from './RiderCarIcon.png'
import RiderFoodIcon from './RiderFoodIcon.png'
import RiderPackageIcon from './RiderPackageIcon.png'
import Map from '../common/Map';
import { MyMapComponent } from './Map2';


export const LandingPage = () => {
    const auth = useSelector(selectAuthenticated)
    const [zoom, setZoom] = React.useState(12); // initial zoom
    const [lat, setLat] = useState(38.897957);
    const [lng, setLng] = useState(-77.036560);    

    useEffect(() => {
        if (window.navigator.geolocation) {
            window.navigator.geolocation.getCurrentPosition((position) => {
                setLat(position.coords.latitude);
                setLng(position.coords.longitude);
            });
        }
    }, []);
    return (
        <>
            {auth ? (
                <>
                    <div className="card bg-success-secondary text-white dashboard-main-img w-100 mb-3">
                        <img src={RotateChecklist} className="card-img dashboard-main-img" />
                        <div className="card-img-overlay d-flex flex-column left-0">
                            <p className="card-title text-start text-white t2">Errands just got<br />easier</p>
                            <p className='t5'>Ride with Rider <i className="bi bi-arrow-right"></i></p>
                        </div>
                    </div>
                    <div className="d-flex flex-row justify-content-between w-100 mb-3">
                        <button className='btn btn-grey-secondary dashboard-buttons pt-0 pb-1'><img className="dashboard-main-img" src={RiderCarIcon} /><p className='m-0 t6'>Ride</p></button>
                        <button className='btn btn-grey-secondary dashboard-buttons p-0 pb-1'><img className="dashboard-main-img" src={RiderFoodIcon} /><p className='m-0 t6'>Food</p></button>
                        <button className='btn btn-grey-secondary dashboard-buttons p-0 pb-1'><img className="dashboard-main-img" src={RiderPackageIcon} /><p className='m-0 t6'>Package</p></button>
                    </div>
                    <div className="d-flex justify-content-between flex-row bg-grey-secondary w-100 p-2 ps-3 pe-2 mb-4">
                        <div className="t1 fw-600 align-self-center">Where to?</div>
                        <div className="border-start border-grey p-1 ps-4 text-primary align-self-center">
                            <div className="bg-white rounded-pill p-1 px-2 t4"><i className="bi bi-clock-fill pe-2"></i>Now<i className="bi bi-caret-down-fill ps-2"></i></div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center w-100 ps-2 mb-4">
                        <div className="d-flex justify-content-center align-items-center rounded-circle bg-grey-secondary p-2 mb-4 star-wrapper">
                            <i className="bi bi-star-fill rounded-circle t4"></i>
                        </div>
                        <div className="d-flex ms-2 justify-content-between border-bottom pb-4 w-100">
                            <div className="fw-600 t3">Choose a saved place</div>
                            <i className="bi bi-caret-right-fill t4"></i>
                        </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center w-100 ps-2 mb-2">
                        <div className="d-flex justify-content-center align-items-center rounded-circle bg-grey-secondary p-2 mb-4 star-wrapper">
                        <i className="bi bi-geo-fill t3"></i>
                        </div>
                        <div className="d-flex ms-2 justify-content-between border-bottom pb-4 w-100">
                            <div className="fw-600 t3">Set destination on map</div>
                            <i className="bi bi-caret-right-fill t3"></i>
                        </div>
                    </div>
                    <div className="align-self-start t3 mb-4 ps-1 fw-600 ">Around you</div>
                    <Map lat={lat} lng={lng} zoom={zoom} pickUpAddress={''} dropOffAddress={''}/>
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