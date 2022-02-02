
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import TripMedia from '../common/TripMedia';
import { useGetTripsQuery } from '../../features/tripSliceRTKQuery';
import { Trip } from '../../features/types'

function RiderDetail() {
    const { data: trips, isLoading } = useGetTripsQuery()
    const user = {first_name: '', group: '', id: 0, last_name: '', photo: '', username: ''}
    const [trip, setTrip] = useState<Trip>({created: '', driver: undefined, drop_off_address: '', id: '', pick_up_address: '', rider: user, status: '', updated: ''})
    const { id } = useParams()

    useEffect(() => {
        if(trips) {
            let triptest = trips.find((trip: Trip) => trip.id === id)
            if(triptest) {
                setTrip(triptest)
            }
        }
    }, [isLoading])

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
        <div className="row">
            <div className="col-lg-12">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/rider">Dashboard</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">Trip</li>
                    </ol>
                </nav>
                <div className='card mb-3' data-cy='trip-card'>
                    <div className="card-header">Trip</div>
                    <div className="card-body">{tripMedia}</div>
                </div>
            </div>
        </div>
    );
}

export default RiderDetail;