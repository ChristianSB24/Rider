import React from 'react';
import { Button, Media } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function TripMedia ({ trip, group, otherGroup }: any) {
  const user = trip[otherGroup];
  const photoUrl = user && user.photo ? new URL(user.photo, process.env.REACT_APP_BASE_URL).href : new URL('https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?cs=srgb&dl=pexels-mike-170811.jpg&fm=jpg').href;
  const href = group ? `/${group}/${trip.id}` : undefined;

  return (
    <Media as='li'>
      <img
        alt={user}
        className='mr-3 rounded-circle'
        src={photoUrl}
        width={80}
        height={80}
      />
      <Media.Body>
        <h5 className='mt-0 mb-1'>{user && user.first_name} {user && user.last_name}</h5>
        {trip.pick_up_address} to {trip.drop_off_address}<br />
        {trip.status}
        {
          href &&
          <Link to={href}>
            <Button variant='primary' block>Detail</Button>
          </Link>
        }
      </Media.Body>
    </Media>
  );
}

export default TripMedia;