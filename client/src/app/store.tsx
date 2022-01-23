import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query/react'

import tripsReducer from '../features/tripsSlice'
import { tripApi } from '../features/tripSliceRTKQuery'

const store = configureStore({
  reducer: {
    trips: tripsReducer,
    [tripApi.reducerPath]: tripApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tripApi.middleware),
})

// export default setupListeners(store.dispatch)
export default store
