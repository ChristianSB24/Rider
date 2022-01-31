import React from 'react';
import { Link } from 'react-router-dom';

import { useDeleteTripMutation } from '../../features/tripSliceRTKQuery'


function TripMedia ({ trip, group, otherGroup }: any) {
  const user = trip[otherGroup];
  const photoUrl = user && user.photo ? new URL(user.photo, process.env.REACT_APP_BASE_URL).href : new URL('https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?cs=srgb&dl=pexels-mike-170811.jpg&fm=jpg').href;
  const href = group ? `/${group}/${trip.id}` : undefined;
  const [deleteTrip] = useDeleteTripMutation();

  const handleTripDelete = (trip:any) => {
    deleteTrip(trip)
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
        {group === 'rider' && <button className="btn-lg btn-primary" onClick={() => handleTripDelete(trip)}>Delete</button>}
      </div>
    </li>
  );
}

export default TripMedia;