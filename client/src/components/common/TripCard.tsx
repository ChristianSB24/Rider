import React from 'react';

import TripMedia from './TripMedia';

function TripCard({ title, trips, group, otherGroup }: any) {
  console.log(group)
  return (
    <div className='card mb-3' data-cy='trip-card'>
      <div className="card-header">{title}</div>
      <div className="card-body">
        <ul className='list-unstyled mb-0'>
          {trips.length !== 0 ?
            trips.map((trip: any) =>
              <TripMedia
                trip={trip}
                group={group}
                otherGroup={otherGroup}
                key={trip.id}
              />
            ) :
            <>No trips.</>}
        </ul>
      </div>
    </div>
  )
}

export default TripCard;