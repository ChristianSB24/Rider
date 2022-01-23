import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit'
import client from '../http-common'


const tripsAdapter = createEntityAdapter()

const initialState = tripsAdapter.getInitialState({
  status: 'idle',
})

const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    completedTripsCleared(state, action) {
      const completedIds = Object.values(state.entities)
        .filter((trip: any) => trip.status === "COMPLETED")
        .map((trip: any) => trip.id)
      tripsAdapter.removeMany(state, completedIds)
    },
    removeOneTrip: tripsAdapter.removeOne,
  },
})

export const {
  completedTripsCleared,
  removeOneTrip,
} = tripsSlice.actions

export default tripsSlice.reducer

export const {
  selectAll: selectTrips,
  selectById: selectTripById,
} = tripsAdapter.getSelectors((state: any) => state.trips)