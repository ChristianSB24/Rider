import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom';
import { webSocket } from 'rxjs/webSocket';
import { toast } from 'react-toastify';

import TripCard from '../common/TripCard';
import { selectTrips, addOneTrip } from '../../features/tripsSlice'
import { getAccessToken } from '../../services/AuthService'

function DriverDashboard() {
    const trips = useSelector(selectTrips)
    const dispatch = useDispatch()

    useEffect(() => {
        const token = getAccessToken();
        const ws = webSocket(`ws://localhost:8003/taxi/?token=${token}`);
        const subscription = ws.subscribe((message: any) => {
            dispatch(addOneTrip({id: `${message.data.id}`,trip: `${message.data}`}))
            updateToast(message.data);
        });
        return () => {
            subscription.unsubscribe();
        }
    }, []);

    const getCurrentTrips = () => {
        return trips.filter((trip: any) => {
            return trip.driver !== null && trip.status !== 'COMPLETED';
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

    const updateToast = (trip: any) => {
        if (trip.driver === null) {
            toast.info(`Rider ${trip.rider.username} has requested a trip.`);
        }
    };

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