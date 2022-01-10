import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom';
import Map from '../Map'

import { getUser } from '../../services/AuthService';
import { createTrip } from '../../services/TripService';

function RiderRequest() {
    const [isSubmitted, setSubmitted] = useState(false);

    const [lat, setLat] = useState(38.897957);
    const [lng, setLng] = useState(-77.036560);

    useEffect(() => {
        if (window.navigator.geolocation) {
            window.navigator.geolocation.getCurrentPosition((position) => {
                setLat(position.coords.latitude);
                setLng(position.coords.longitude);
            });
        }
    }, []);

    const onSubmit = (values: { pickUpAddress: string, dropOffAddress: string }) => {
        const rider = getUser();
        if (typeof rider !== 'undefined') {
            createTrip({
                pick_up_address: values.pickUpAddress,
                drop_off_address: values.dropOffAddress,
                rider: rider.id
            });
            setSubmitted(true);
        }
    };

    if (isSubmitted) {
        return <Navigate to='/rider' />
    }

    return (
        <>
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item"><Link to="/rider">Dashboard</Link></li>
                    <li className="breadcrumb-item active" aria-current="page">Request</li>
                </ol>
            </nav>
            <Card className='mb-3'>
                <Card.Header>Request Trip</Card.Header>
                <Card.Body>
                    <Formik
                        initialValues={{
                            pickUpAddress: '',
                            dropOffAddress: ''
                        }}
                        onSubmit={onSubmit}
                    >
                        {({
                            handleChange,
                            handleSubmit,
                            isSubmitting,
                            values
                        }) => (
                            <Form noValidate onSubmit={handleSubmit}>
                                <Form.Group controlId='pickUpAddress'>
                                    <Form.Label>Pick up address:</Form.Label>
                                    <Form.Control
                                        data-cy='pick-up-address'
                                        name='pickUpAddress'
                                        onChange={handleChange}
                                        value={values.pickUpAddress}
                                        required
                                    />
                                </Form.Group>
                                <Map
                                    lat={lat}
                                    lng={lng}
                                    zoom={13}
                                    pickUpAddress={values.pickUpAddress}
                                    dropOffAddress={values.dropOffAddress}
                                />
                                <Form.Group controlId='dropOffAddress'>
                                    <Form.Label>Drop off address:</Form.Label>
                                    <Form.Control
                                        data-cy='drop-off-address'
                                        name='dropOffAddress'
                                        onChange={handleChange}
                                        value={values.dropOffAddress}
                                    />
                                </Form.Group>
                                <Button
                                    block
                                    data-cy='submit'
                                    disabled={isSubmitting}
                                    type='submit'
                                    variant='primary'
                                >Submit</Button>
                            </Form>
                        )}
                    </Formik>
                </Card.Body>
            </Card>
        </>
    )
}

export default RiderRequest;