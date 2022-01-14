
import React, { useEffect, useState } from 'react';
import {Card, Col, Row} from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom';

import TripMedia from '../TripMedia';
import { getTrip } from '../../services/TripService';

function RiderDetail({ match }: any) {
    const [trip, setTrip] = useState(null);
    const { id } = useParams()

    useEffect(() => {
        const loadTrip = async (id: any) => {
            const { response, isError }: any = await getTrip(id);
            if (isError) {
                setTrip(null);
            } else {
                setTrip(response.data);
            }
        }
        loadTrip(id);
    }, [id]);
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
                <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/rider">Dashboard</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Trip</li>
                </ol>
            </nav>
                <Card className='mb-3' data-cy='trip-card'>
                    <Card.Header>Trip</Card.Header>
                    <Card.Body>{tripMedia}</Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

export default RiderDetail;