
import React, { useEffect, useState } from 'react';
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