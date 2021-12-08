import React, { useEffect, useState } from 'react';
import {
    Breadcrumb, Col, Row
} from 'react-bootstrap';

import TripCard from './TripCard';
import { connect, getTrips, messages } from '../services/TripService'

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
        connect();
        const subscription = messages.subscribe((message: any) => {
            setTrips((prevTrips: any) => [
                ...prevTrips.filter((trip: any) => trip.id !== message.data.id),
                message.data
            ]);
        });
        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        }
    }, [setTrips]);

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

    return (
        <Row>
            <Col lg={12}>
                <Breadcrumb>
                    <Breadcrumb.Item href='/'>Home</Breadcrumb.Item>
                    <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
                </Breadcrumb>

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

            </Col>
        </Row>
    );
}

export default DriverDashboard;