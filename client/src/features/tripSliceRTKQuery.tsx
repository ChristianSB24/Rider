import { createApi } from '@reduxjs/toolkit/query/react';
import { toast } from 'react-toastify';
import { webSocket } from 'rxjs/webSocket';

import { axiosBaseQuery } from '../http-common';
import getToken from '../utils/getToken'

export type Channel = 'redux' | 'general'

export interface Message {
    id: number
    userName: string
    text: string
}

const updateToast = (trip: any) => {
    if (trip.driver === null) {
        return toast.info(`Rider ${trip.rider.username} has requested a trip.`)
    }
    if (trip.status === 'STARTED') {
        return toast.info(`Driver ${trip.driver.username} is coming to pick you up.`);
    } else if (trip.status === 'IN_PROGRESS') {
        return toast.info(`Driver ${trip.driver.username} is headed to your destination.`);
    } else if (trip.status === 'COMPLETED') {
        return toast.info(`Driver ${trip.driver.username} has dropped you off.`);
    }
};

let ReceiveSub: any

console.log('getToken()', getToken())
let _socket = webSocket(`ws://localhost:8003/taxi/?token=${getToken()}`);

const connect = () => {
    if (!_socket || _socket.closed) {
        console.log('inside connect function')
        _socket = webSocket(`ws://localhost:8003/taxi/?token=${getToken()}`);
}};

let Initiate = _socket.multiplex(
  () => ({subscribe: 'Initiate'}),
  () => ({unsubscribe: 'Initiate'}),
  (message:any) => message.type === 'initiate.message'
);

// let Receive = _socket.multiplex(
//   () => ({subscribe: 'Reciever'}),
//   () => ({unsubscribe: 'Reciever'}),
//   (message:any) => message.type === 'receive.message'
// );

export const tripApi = createApi({
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        createTrip: builder.mutation<any, any>({
            queryFn: async (tripContent: string) => {
                return new Promise(resolve => {Initiate.subscribe((message: any) => resolve({data: message.data}))
                    const message = {type: 'create.trip', data: tripContent};
                    _socket.next(message)
                })
            },
            async onQueryStarted({...tripContent}, { dispatch, queryFulfilled }) {
                try {
                  const { data: newTrip } = await queryFulfilled
                  dispatch(tripApi.util.updateQueryData('getTrips', undefined, (draft: any) => {
                        draft.push(newTrip)
                    })
                  )
                } catch {}
              },
        }),
        deleteTrip: builder.mutation<any, any>({
            queryFn: async (tripContent: string) => {
                return new Promise(resolve => {Initiate.subscribe((message: any) => resolve({data: message.data}))
                    const message = {type: 'delete.trip', data: tripContent}
                    _socket.next(message)
                })
            },
            async onQueryStarted({...tripContent}, { dispatch, queryFulfilled }) {
                  const patchResult = dispatch(
                    tripApi.util.updateQueryData('getTrips', undefined, (draft: any) => {
                        const trip = draft.find((trip: any) => trip.id === tripContent.id)
                        const indexOfElement = draft.indexOf(trip)
                        draft.splice(indexOfElement, 1);
                    })
                  )
                  try {
                    await queryFulfilled
                  } catch {
                    patchResult.undo()
                  }
              }
        }),
        updateTrip: builder.mutation<any, any>({
            queryFn: async (tripContent: string) => {
                return new Promise(resolve => {
                    Initiate.subscribe((message: any) => resolve({data: message.data}))
                    const message = {type: 'update.trip', data: tripContent}
                    _socket.next(message)
                })
            },
            async onQueryStarted({...tripContent}, { dispatch, queryFulfilled }) {
                  const patchResult = dispatch(
                    tripApi.util.updateQueryData('getTrips', undefined, (draft: any) => {
                        const trip = draft.find((trip: any) => trip.id === tripContent.id)
                        trip.status = tripContent.status
                    })
                  )
                  try {
                    await queryFulfilled
                  } catch {
                    patchResult.undo()
                  }
              }
        }),
        getTrips: builder.query<any, any>({
            query: () => ({ url: '/api/trip/', method: 'GET' }),
            async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                console.log('onCacheEntryAdded')
                // connect()
                let _socket:any = webSocket(`ws://localhost:8003/taxi/?token=${getToken()}`);
                let Receive = _socket.multiplex(
                    () => ({subscribe: 'Reciever'}),
                    () => ({unsubscribe: 'Reciever'}),
                    (message:any) => message.type === 'receive.message'
                  );
                try {
                    await cacheDataLoaded;
                    ReceiveSub = Receive.subscribe((message: any) => {
                        console.log('message', message)
                        updateCachedData((draft: any) => {
                            if (message.action === 'update') {
                                const trip = draft.find((trip: any) => trip.id === message.data.id)
                                trip.status = message.data.status
                                updateToast(message.data)
                            }
                            else if (message.action === 'delete') {
                                const trip = draft.find((trip: any) => trip.id === message.data.id)
                                const indexOfElement = draft.indexOf(trip)
                                draft.splice(indexOfElement, 1);
                            }
                            else if (message.action === 'create') {
                                draft.push(message.data)
                                updateToast(message.data)
                            }
                        })
                    });
                } catch(error: any){
                    console.error(error)
                    console.log(error.response)
                 }
                await cacheEntryRemoved
                ReceiveSub.unsubscribe();
            }
        }),
    }),
});

export const { useGetTripsQuery, useCreateTripMutation, useDeleteTripMutation, useUpdateTripMutation, util}: any = tripApi