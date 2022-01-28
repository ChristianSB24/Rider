import React from 'react';
import { Link } from 'react-router-dom';

import TripCard from '../common/TripCard';
import { useGetTripsQuery } from '../../features/tripSliceRTKQuery';

function RiderDashboard() {
  const { data: trips, isLoading } = useGetTripsQuery()

  if (isLoading) {
    return <h1>Loading</h1>
  }

  console.log('trips', trips)

  const getRequestedTrips = () => {
    return trips.filter((trip: any) => {
      return trip.status === 'REQUESTED';
    });
  }

  const getCurrentTrips = () => {
    return trips.filter((trip: any) => {
      return (
        trip.status === 'STARTED' || trip.status === 'IN_PROGRESS'
      );
    });
  };
  const getCompletedTrips = () => {
    return trips.filter((trip: any) => {
      return trip.status === 'COMPLETED';
    });
  };

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
        </ol>
      </nav>
      <TripCard
        title='Requested Trips'
        trips={getRequestedTrips()}
        group='rider'
        otherGroup='driver'
      />
      <TripCard
        title='Current Trip'
        trips={getCurrentTrips()}
        group='rider'
        otherGroup='driver'
      />
      <TripCard
        title='Recent Trips'
        trips={getCompletedTrips()}
        group='rider'
        otherGroup='driver'
      />
    </>
  );
}

export default RiderDashboard;