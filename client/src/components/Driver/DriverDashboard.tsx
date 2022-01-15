import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { webSocket } from 'rxjs/webSocket';
import { toast } from 'react-toastify';

import TripCard from '../common/TripCard';
import { connect, getTrips, messages } from '../../services/TripService';
import { getAccessToken } from '../../services/AuthService'

function DriverDashboard() {
    const [trips, setTrips] = useState<any>([]);

    useEffect(() => {
        const loadTrips = async () => {
            const { response, isError } = await getTrips();
            if (isError) {
                setTrips([]);
            } else {
                setTrips(response.data);
            }
        }
        loadTrips();
    }, []);

    useEffect(() => {
        const token = getAccessToken();
        const ws = webSocket(`ws://localhost:8003/taxi/?token=${token}`);
        const subscription = ws.subscribe((message: any) => {
          setTrips((prevTrips: any) => [
            ...prevTrips.filter((trip: any) => trip.id !== message.data.id),
            message.data
          ]);
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