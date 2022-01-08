
import React, { useEffect, useState } from 'react';
import {
    Breadcrumb, Card, Col, Row
} from 'react-bootstrap'
import { Link } from 'react-router-dom';

import TripMedia from './TripMedia';
import { getTrip } from '../services/TripService';

function RiderDetail({ match }: any) {
    const [trip, setTrip] = useState(null);

    useEffect(() => {
        const loadTrip = async (id: any) => {
            const { response, isError }: any = await getTrip(id);
            if (isError) {
                setTrip(null);
            } else {
                setTrip(response.data);
            }
        }
        loadTrip(match.params.id);
    }, [match]);
    let tripMedia;

    if (trip === null) {
        tripMedia = <>Loading...</>;
    } else {
        tripMedia = (
            <TripMedia
                trip={trip}
                otherGroup='driver'
            />
        )
    }

    return (
        <Row>
            <Col lg={12}>
                <Breadcrumb>
                    <Link to='/rider'>
                        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
                    </Link>
                    <Breadcrumb.Item active>Trip</Breadcrumb.Item>
                </Breadcrumb>
                <Card className='mb-3' data-cy='trip-card'>
                    <Card.Header>Trip</Card.Header>
                    <Card.Body>{tripMedia}</Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

export default RiderDetail;