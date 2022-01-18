import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { webSocket } from 'rxjs/webSocket';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux'

import TripCard from '../common/TripCard';
import { getAccessToken } from '../../services/AuthService'
import { selectTrips, addOneTrip } from '../../features/tripsSlice'

function RiderDashboard(props: any) {
    const trips = useSelector(selectTrips)
    const dispatch = useDispatch()

    useEffect(() => {
        const token = getAccessToken();
        const ws = webSocket(`ws://localhost:8003/taxi/?token=${token}`);
        const subscription = ws.subscribe((message: any) => {
          dispatch(addOneTrip({id: `${message.id}`, trip: `${message.data}`}))
          updateToast(message.data);
        });
        return () => {
          subscription.unsubscribe();
        }
      }, []);

    const getCurrentTrips = () => {
        return trips.filter((trip: any) => {
            return (
                trip.driver !== null &&
                trip.status !== 'REQUESTED' &&
                trip.status !== 'COMPLETED'
            );
        });
    };
    const getCompletedTrips = () => {
        return trips.filter((trip: any) => {
            return trip.status === 'COMPLETED';
        });
    };

    const updateToast = (trip: any) => {
        if (trip.status === 'STARTED') {
          toast.info(`Driver ${trip.driver.username} is coming to pick you up.`);
        } else if (trip.status === 'IN_PROGRESS') {
          toast.info(`Driver ${trip.driver.username} is headed to your destination.`);
        } else if (trip.status === 'COMPLETED') {
          toast.info(`Driver ${trip.driver.username} has dropped you off.`);
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
                group='rider'
                otherGroup='driver'
            />
            <TripCard
                title='Recent Trips'
                trips={getCompletedTrips()}
                group='rider'
                otherGroup='driver'
            />
        </>
    );
}

export default RiderDashboard;