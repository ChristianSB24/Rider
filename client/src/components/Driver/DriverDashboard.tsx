import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { webSocket } from 'rxjs/webSocket';
import { toast } from 'react-toastify';

import TripCard from '../common/TripCard';
import { getTrips } from '../../services/TripService';
import { selectAllTrips } from '../../features/tripsSlice';
import { getAccessToken } from '../../services/AuthService'

function DriverDashboard() {
    const [trips, setTrips] = useState<any>([]);
    const testTrips = useSelector(selectAllTrips)
    // const tripsStatus = useSelector(state => state.trips.status)

    useEffect(() => {
        setTrips(testTrips.todos.entities)
        // const loadTrips = async () => {
        //     const { response, isError } = await getTrips();
        //     if (isError) {
        //         setTrips([]);
        //     } else {
        //         setTrips(response.data);
        //     }
        // }
        // loadTrips();
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
        return Object.keys(trips).filter((trip: any) => {
            console.log(trip)
            console.log('in getCurrentTrips', trip.driver)
            return trips[trip].driver !== null && trips[trip].status !== 'COMPLETED';
        });
    }

    const getRequestedTrips = () => {
        return Object.keys(trips).filter((trip: any) => {
            return trips[trip].status === 'REQUESTED';
        });
    }

    const getCompletedTrips = () => {
        return Object.keys(trips).filter((trip: any) => {
            return trips[trip].status === 'COMPLETED';
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