import React, { useEffect, useState } from 'react';
import {
    Breadcrumb, Col, Row
} from 'react-bootstrap';

import TripCard from './TripCard';
import { connect, getTrips, messages } from '../services/TripService';;

function RiderDashboard(props: any) {
    const [trips, setTrips] = useState<any>([]);

    useEffect(() => {
        const loadTrips = async () => {
            const { response, isError }: any = await getTrips();
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
                    group='rider'
                    otherGroup='driver'
                />

                <TripCard
                    title='Recent Trips'
                    trips={getCompletedTrips()}
                    group='rider'
                    otherGroup='driver'
                />

            </Col>
        </Row>
    );
}

export default RiderDashboard;