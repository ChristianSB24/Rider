import { configureStore } from '@reduxjs/toolkit'
// import { setupListeners } from '@reduxjs/toolkit/query/react'

import userReducer from '../features/userSlice'
import { tripApi } from '../features/tripSliceRTKQuery'

const store = configureStore({
  reducer: {
    user: userReducer,
    [tripApi.reducerPath]: tripApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tripApi.middleware),
})

// export default setupListeners(store.dispatch)
export default store
