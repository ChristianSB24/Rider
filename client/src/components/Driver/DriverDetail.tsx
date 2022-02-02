import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom'

import TripMedia from '../common/TripMedia';
import { useUpdateTripMutation, useGetTripsQuery } from '../../features/tripSliceRTKQuery'
import { selectUser } from '../../features/userSlice'
import { Trip } from '../../features/types';


function DriverDetail() {
    const user = {first_name: '', group: '', id: 0, last_name: '', photo: '', username: ''}
    const [trip, setTrip] = useState<Trip>({created: '', driver: undefined, drop_off_address: '', id: '', pick_up_address: '', rider: user, status: '', updated: ''})
    const { id } = useParams()
    const userInfo = useSelector(selectUser)
    const {data: trips, isLoading, error} = useGetTripsQuery()
    const [updateTrip] = useUpdateTripMutation();

    useEffect(() => {
        if(trips) {
            let triptest = trips.find((trip: Trip) => trip.id === id)
            if(triptest) {
                setTrip(triptest)
            }
        }
    }, [isLoading])

    const updateTripStatus = (status: string, trip: Trip) => {
        const driver = userInfo;
        const updatedTrip = { ...trip, driver, status };
        updateTrip({
            ...updatedTrip,
            driver: updatedTrip?.driver?.id,
            rider: updatedTrip.rider.id
        });
        setTrip({...trip, status})
    };

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
        <div className="row">
            <div className="col-lg-12">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/driver">Dashboard</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Trip</li>
                    </ol>
                </nav>
                <div className='card mb-3' data-cy='trip-card'>
                    <div className="card-header">Trip</div>
                    <div className="card-body">{tripMedia}</div>
                    <div className="card-footer">
                        {
                            trip !== null && trip.status === 'REQUESTED' && (
                                <button
                                    className="btn-lg btn-primary w-100 fs-5"
                                    data-cy='status-button'
                                    onClick={() => updateTripStatus('STARTED', trip)}
                                >Drive to pick up
                                </button>
                            )
                        }
                        {
                            trip !== null && trip.status === 'STARTED' && (
                                <button
                                    className="btn-lg btn-primary w-100 fs-5"
                                    data-cy='status-button'
                                    onClick={() => updateTripStatus('IN_PROGRESS', trip)}
                                >Drive to drop off
                                </button>
                            )
                        }
                        {
                            trip !== null && trip.status === 'IN_PROGRESS' && (
                                <button
                                    className="btn-lg btn-primary w-100 fs-5"
                                    data-cy='status-button'
                                    onClick={() => updateTripStatus('COMPLETED', trip)}
                                >Complete trip
                                </button>
                            )
                        }
                        {
                            trip !== null && !['REQUESTED', 'STARTED', 'IN_PROGRESS'].includes(trip.status) && (
                                <span className='text-center'>Completed</span>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DriverDetail;