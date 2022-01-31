import React from 'react';
import { Link, Navigate } from 'react-router-dom';

import TripCard from '../common/TripCard';
import { useGetTripsQuery } from '../../features/tripSliceRTKQuery';
import ExpirationLogin from '../common/ExpirationLogin';
import { getRequestedTrips, getCurrentTrips, getCompletedTrips } from '../../utils/getTripsFromCache'

function DriverDashboard() {
    const { data: trips, isLoading, error } = useGetTripsQuery()
    console.log('trips', trips)

    if (isLoading) {
        return <h1>Loading</h1>
    }
    console.log('trips', trips)

    if (error) {
        const hasErrStatus = (error as { status: number }).status;
        if (hasErrStatus === 401) {
            return (
                <ExpirationLogin />
            )
        }
        else {
            <Navigate to='/' />
        }
    }

    return (
        <>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
                </ol>
            </nav>
            <TripCard
                title='Requested Trips'
                trips={getRequestedTrips(trips)}
                group='driver'
                otherGroup='rider'
            />

            <TripCard
                title='Current Trip'
                trips={getCurrentTrips(trips)}
                group='driver'
                otherGroup='rider'
            />

            <TripCard
                title='Recent Trips'
                trips={getCompletedTrips(trips)}
                group='driver'
                otherGroup='rider'
            />
        </>
    );
}

export default DriverDashboard;