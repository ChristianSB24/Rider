import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { removeOneTrip } from '../../features/tripsSlice';
import { deleteTrip } from '../../services/TripService'

function TripMedia ({ trip, group, otherGroup }: any) {
  const user = trip[otherGroup];
  const photoUrl = user && user.photo ? new URL(user.photo, process.env.REACT_APP_BASE_URL).href : new URL('https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?cs=srgb&dl=pexels-mike-170811.jpg&fm=jpg').href;
  const href = group ? `/${group}/${trip.id}` : undefined;
  const dispatch = useDispatch()

  const handleTripDelete = (tripId:string, trip:object) => {
    deleteTrip(tripId, trip)
    dispatch(removeOneTrip(tripId))
  }

  return (
    <li className="media">
      <img
        alt={user}
        className='mr-3 rounded-circle'
        src={photoUrl}
        width={80}
        height={80}
      />
      <div className="media-body">
        <h5 className='mt-0 mb-1'>{user && user.first_name} {user && user.last_name}</h5>
        {trip.pick_up_address} to {trip.drop_off_address}<br />
        {trip.status}
        {href &&
          <Link to={href}>
            <button className="btn-lg btn-primary w-100 fs-5">Detail</button>
          </Link>
        }
        {trip.status === 'COMPLETED' && <button className="btn-lg btn-primary" onClick={() => handleTripDelete(trip.id, trip)}>Delete</button>}
      </div>
    </li>
  );
}

export default TripMedia;