import { Trip } from "../features/types";

export const getCurrentTrips = (trips:Trip[] | undefined) => {
    if (trips) {
        return trips.filter((trip: Trip) => {
            return trip.status === 'STARTED' || trip.status === 'IN_PROGRESS';
        })
    } else {
        return []
    }
}

export const getRequestedTrips = (trips:Trip[] | undefined) => {
    if(trips) {
        return trips.filter((trip: Trip) => {
            return trip.status === 'REQUESTED';
        })
    } else {
        return []
    }
}

export const getCompletedTrips = (trips:Trip[] | undefined) => {
    if(trips) {
        return trips.filter((trip: Trip) => {
            return trip.status === 'COMPLETED';
        })
    } else {
        return []
    }
}