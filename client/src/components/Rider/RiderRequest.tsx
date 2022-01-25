import React, { useState, useEffect, useContext } from 'react';
import { Formik, Form } from 'formik';
import { Navigate, Link } from 'react-router-dom';
import * as yup from 'yup'

import Map from '../common/Map'
import { AccountContext } from '../../auth/Authorization';
// import { createTrip } from '../../services/TripService';
import ValidatedTextField from '../FormComponents/ValidatedTextField';
import { useCreateTripMutation } from '../../features/tripSliceRTKQuery'

function RiderRequest() {
    const [isSubmitted, setSubmitted] = useState(false);
    const [createTrip, {isLoading}] = useCreateTripMutation();
    if(isLoading) {
        console.log('loading')
    }
    const auth = useContext(AccountContext)

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

    let validationSchema = yup.object({
        pickUpAddress: yup.string()
            .required('Pick up address is required.'),
        dropOffAddress: yup.string()
            .required('Drop off address is required.')
    })

    const onSubmit = (values: { pickUpAddress: string, dropOffAddress: string }) => {
        const rider = auth.userInfo;
        if (typeof rider !== 'undefined') {
            // createTrip({
            //     pick_up_address: values.pickUpAddress,
            //     drop_off_address: values.dropOffAddress,
            //     rider: rider.id
            // });
            createTrip({
                pick_up_address: values.pickUpAddress,
                drop_off_address: values.dropOffAddress,
                rider: rider.id
            })
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
            <div className="card mb-3">
                <div className="card-header">Request Trip</div>
                <div className="card-body">
                    <Formik
                        initialValues={{pickUpAddress: '', dropOffAddress: ''}}
                        validateOnChange={false}
                        validateOnBlur={false}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}
                    >
                        {({
                            isSubmitting,
                            values,
                            setFieldValue,
                            setFieldError
                        }) => (
                            <Form>
                                <ValidatedTextField
                                    name='pickUpAddress'
                                    type="text"
                                    placeholder='Pick Up Address'
                                    data-cy='pick-up-address'
                                    onChange={(event: any) => {
                                        setFieldError("pickUpAddress", '')
                                        setFieldValue("pickUpAddress", event.target.value)
                                    }} />
                                <Map
                                    lat={lat}
                                    lng={lng}
                                    zoom={13}
                                    pickUpAddress={values.pickUpAddress}
                                    dropOffAddress={values.dropOffAddress}
                                />
                                <ValidatedTextField
                                    name="dropOffAddress"
                                    type="text"
                                    placeholder="Drop Off Address"
                                    data-cy="drop-off-address"
                                    onChange={(event: any) => {
                                        setFieldError("dropOffAddress", '')
                                        setFieldValue("dropOffAddress", event.target.value)
                                    }} />
                                <button
                                    className="btn-lg btn-primary w-100 fs-5"
                                    data-cy='submit'
                                    disabled={isSubmitting}
                                    type='submit'
                                >Submit</button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </>
    )
}

export default RiderRequest;