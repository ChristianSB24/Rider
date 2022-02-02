import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query/react'

import accountReducer from '../features/userSlice'
import { tripApi } from '../features/tripSliceRTKQuery'

const store = configureStore({
  reducer: {
    account: accountReducer,
    [tripApi.reducerPath]: tripApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tripApi.middleware),
})

//This enables refetchOnFocus and refetchOnReconnect
setupListeners(store.dispatch)
export default store

//Visit this page for a good explaination of why you need to call store.getState to type the store state correctly.
//https://stackoverflow.com/questions/59814381/typing-redux-toolkits-store-in-typescript
export type StoreState = ReturnType<typeof store.getState>
