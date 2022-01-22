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

// Thunk functions
export const fetchTrips = createAsyncThunk('trips/fetchTrips', async () => {
  const url = `${process.env.REACT_APP_BASE_URL}/api/trip/`;
  const response = await client.get(url)
  return response.data
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
    addOneTrip: tripsAdapter.addOne,
    removeOneTrip: tripsAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrips.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        tripsAdapter.setAll(state, action.payload)
        state.status = 'idle'
      })
  },
})

export const {
  completedTripsCleared,
  addOneTrip,
  removeOneTrip,
} = tripsSlice.actions

export default tripsSlice.reducer

export const {
  selectAll: selectTrips,
  selectById: selectTripById,
} = tripsAdapter.getSelectors((state: any) => state.trips)