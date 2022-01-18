import { configureStore } from '@reduxjs/toolkit'

import tripsReducer from '../features/tripsSlice'

const store = configureStore({
  reducer: {
    trips: tripsReducer,
  },
})

export default store
