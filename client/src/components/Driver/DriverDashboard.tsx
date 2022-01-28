import React from 'react';
import { Link } from 'react-router-dom';

import TripCard from '../common/TripCard';
import { useGetTripsQuery } from '../../features/tripSliceRTKQuery';

function DriverDashboard() {
    const { data: trips, isLoading, error } = useGetTripsQuery()
    console.log('trips', trips)
    console.log('error', error)

    if (isLoading) {
        return <h1>Loading</h1>
    }

    const getCurrentTrips = () => {
        return trips.filter((trip: any) => {
            return trip.status === 'STARTED' || trip.status === 'IN_PROGRESS';
        });
    }

    const getRequestedTrips = () => {
        return trips.filter((trip: any) => {
            return trip.status === 'REQUESTED';
        });
    }

    const getCompletedTrips = () => {
        return trips.filter((trip: any) => {
            return trip.status === 'COMPLETED';
        });
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
                title='Current Trip'
                trips={getCurrentTrips()}
                group='driver'
                otherGroup='rider'
            />

            <TripCard
                title='Requested Trips'
                trips={getRequestedTrips()}
                group='driver'
                otherGroup='rider'
            />

            <TripCard
                title='Recent Trips'
                trips={getCompletedTrips()}
                group='driver'
                otherGroup='rider'
            />
        </>
    );
}

export default DriverDashboard;