import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { webSocket } from 'rxjs/webSocket';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux'

import TripCard from '../common/TripCard';
import { selectTrips, addOneTrip } from '../../features/tripsSlice'
import getToken from '../../utils/getToken';

function RiderDashboard() {
    const trips = useSelector(selectTrips)
    const dispatch = useDispatch()

    useEffect(() => {
        const ws = webSocket(`ws://localhost:8003/taxi/?token=${getToken()}`);
        const subscription = ws.subscribe((message: any) => {
          dispatch(addOneTrip({id: `${message.id}`, trip: `${message.data}`}))
          updateToast(message.data);
        });
        return () => {
          subscription.unsubscribe();
        }
      }, [dispatch]);

    const getCurrentTrips = () => {
        return trips.filter((trip: any) => {
            return (
                trip.driver !== null &&
                // trip.status !== 'REQUESTED' &&
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