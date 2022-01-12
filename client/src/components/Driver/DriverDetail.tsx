import React, { useEffect, useState } from 'react';
import {
    Breadcrumb, Button, Card, Col, Row
} from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom'

import TripMedia from '../TripMedia';
import { getUser } from '../../services/AuthService';
import { getTrip, updateTrip } from '../../services/TripService';

// function DriverDetail({ match }: { match: { isExact: boolean, params: {id: string}, path: string, url: string } }) {
function DriverDetail() {
    const [trip, setTrip] = useState<any>({});
    const { id } = useParams()

    const updateTripStatus = (status: string) => {
        const driver = getUser();
        const updatedTrip = { ...trip, driver, status };
        updateTrip({
            ...updatedTrip,
            driver: updatedTrip?.driver?.id,
            rider: updatedTrip.rider.id
        });
        setTrip(updatedTrip);
    };

    useEffect(() => {
        const loadTrip = async (id: string | undefined) => {
            const { response, isError } = await getTrip(id);
            if (isError) {
                setTrip({});
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
                otherGroup='rider'
            />
        )
    }

    return (
        <Row>
            <Col lg={12}>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/driver">Dashboard</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Trip</li>
                    </ol>
                </nav>
                <Card className='mb-3' data-cy='trip-card'>
                    <Card.Header>Trip</Card.Header>
                    <Card.Body>{tripMedia}</Card.Body>
                    <Card.Footer>
                        {
                            trip !== null && trip.status === 'REQUESTED' && (
                                <Button
                                    data-cy='status-button'
                                    block
                                    variant='primary'
                                    onClick={() => updateTripStatus('STARTED')}
                                >Drive to pick up
                                </Button>
                            )
                        }
                        {
                            trip !== null && trip.status === 'STARTED' && (
                                <Button
                                    data-cy='status-button'
                                    block
                                    variant='primary'
                                    onClick={() => updateTripStatus('IN_PROGRESS')}
                                >Drive to drop off
                                </Button>
                            )
                        }
                        {
                            trip !== null && trip.status === 'IN_PROGRESS' && (
                                <Button
                                    data-cy='status-button'
                                    block
                                    variant='primary'
                                    onClick={() => updateTripStatus('COMPLETED')}
                                >Complete trip
                                </Button>
                            )
                        }
                        {
                            trip !== null && !['REQUESTED', 'STARTED', 'IN_PROGRESS'].includes(trip.status) && (
                                <span className='text-center'>Completed</span>
                            )
                        }
                    </Card.Footer>
                </Card>
            </Col>
        </Row>
    );
}

export default DriverDetail;