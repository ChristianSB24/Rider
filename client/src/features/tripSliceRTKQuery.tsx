import { createApi } from '@reduxjs/toolkit/query/react';
import { toast } from 'react-toastify';
import { webSocket } from 'rxjs/webSocket';
import { share } from 'rxjs/operators';

import { axiosBaseQuery } from '../http-common';
import getToken from '../utils/getToken'

export type Channel = 'redux' | 'general'

export interface Message {
    id: number
    userName: string
    text: string
}

const updateToast = (trip: any) => {
    //Need to specify when it is being deleted to send custom notification
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

let _socket: any;
let messages: any;
let observableInitiater: any
let observableReciever: any

// const connect:any = ():any => {
//     if (!_socket || _socket.closed) {
        // _socket = webSocket(`ws://localhost:8003/taxi/?token=${getToken()}`);
// }};
// connect()

_socket = webSocket(`ws://localhost:8003/taxi/?token=${getToken()}`);



observableInitiater = _socket.multiplex(
  () => ({subscribe: 'Initiater'}),
  () => ({unsubscribe: 'Initiater'}),
  (message:any) => message.type === 'initiate.message'
);

observableReciever = _socket.multiplex(
  () => ({subscribe: 'Reciever'}),
  () => ({unsubscribe: 'Reciever'}),
  (message:any) => message.type === 'receive.message'
);

export const tripApi = createApi({
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        createTrip: builder.mutation<any, any>({
            queryFn: async (tripContent: string) => {
                return new Promise(resolve => {
                        observableInitiater.subscribe((message: any) => {return (
                        resolve({data: message.data})
                    )})
                    const message = {
                        type: 'create.trip',
                        data: tripContent
                    };
                    _socket.next(message)
                })
            },
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                  const { data: newTrip } = await queryFulfilled
                  console.log('in create')
                  const patchResult = dispatch(
                    tripApi.util.updateQueryData('getTrips', undefined, (draft: any) => {
                        draft.push(newTrip)
                    })
                  )
                } catch {}
              },
        }),
        deleteTrip: builder.mutation<any, any>({
            queryFn: async (tripContent: string) => {
                return new Promise(resolve => {
                    observableInitiater.subscribe((message: any) => {return (
                        resolve({data: message.data})
                    )})
                    const message = {type: 'delete.trip', data: tripContent}
                    _socket.next(message)
                })
            },
            async onQueryStarted({...tripContent}, { dispatch, queryFulfilled }) {
                  const patchResult = dispatch(
                    tripApi.util.updateQueryData('getTrips', undefined, (draft: any) => {
                        console.log('in delete')
                        const trip = draft.find((trip: any) => trip.id === tripContent.id)
                        const indexOfElement = draft.indexOf(trip)
                        draft.splice(indexOfElement, 1);
                    })
                  )
                  console.log('patchResult', patchResult)
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
                    observableInitiater.subscribe((message: any) => {return (
                        resolve({data: message.data})
                    )})
                    const message = {type: 'update.trip', data: tripContent}
                    _socket.next(message)
                })
            },
            async onQueryStarted({...tripContent}, { dispatch, queryFulfilled }) {
                  const patchResult = dispatch(
                    tripApi.util.updateQueryData('getTrips', undefined, (draft: any) => {
                        console.log('in here updating')
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
                try {
                    await cacheDataLoaded;
                    observableReciever.subscribe((message: any) => {
                        updateCachedData((draft: any) => {
                            console.log('message in getTrips', message)
                            updateToast(message.data)
                            if (message.action === 'update') {
                                console.log('message.group', message.group)
                                const trip = draft.find((trip: any) => trip.id === message.data.id)
                                trip.status = message.data.status
                            }
                            else if (message.action === 'delete') {
                                const trip = draft.find((trip: any) => trip.id === message.data.id)
                                const indexOfElement = draft.indexOf(trip)
                                draft.splice(indexOfElement, 1);
                            }
                            else if (message.action === 'create') {
                                draft.push(message.data)
                            }
                        })
                    });
                } catch { }
                await cacheEntryRemoved
                _socket.unsubscribe();
                console.log('after cacheEntryRemoved')
            }
        }),
    }),
});

export const { useGetTripsQuery, useCreateTripMutation, useDeleteTripMutation, useUpdateTripMutation }: any = tripApi