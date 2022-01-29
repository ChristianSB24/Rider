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

const riderToast = (trip: any) => {
    if (trip.data.status === 'STARTED') {
        return toast.info(`Driver ${trip.data.driver.username} is coming to pick you up.`);
    } else if (trip.data.status === 'IN_PROGRESS') {
        return toast.info(`Driver ${trip.data.driver.username} is headed to your destination.`);
    } else if (trip.data.status === 'COMPLETED' && trip.action !== 'delete') {
        return toast.info(`Driver ${trip.data.driver.username} has dropped you off.`);
    }
}

const driverToast = (trip: any) => {
    if (trip.data.driver === null) {
        return toast.info(`Rider ${trip.data.rider.username} has requested a trip.`)
    }
    else if (trip.action === 'delete' && (trip.data.status === 'STARTED' || trip.data.status === 'IN_PROGRESS')) {
        return toast.info(`Rider ${trip.data.rider.username} has canceled their trip.`)
    }
}

let ReceiveSub: any
let _socket:any
let Initiate:any
let Receive: any

const connect = () => {
    if (!_socket || _socket.closed) {
        console.log('inside connect function')
        _socket = webSocket(`ws://localhost:8003/taxi/?token=${getToken()}`);
        
        Initiate = _socket.multiplex(
            () => ({subscribe: 'Initiate'}),
            () => ({unsubscribe: 'Initiate'}),
            (message:any) => message.type === 'initiate.message'
        )

        Receive = _socket.multiplex(
            () => ({subscribe: 'Reciever'}),
            () => ({unsubscribe: 'Reciever'}),
            (message:any) => message.type === 'receive.message'
        )
    }
};

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
                        console.log('tripcontent', tripContent)
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
                connect()
                return new Promise(resolve => {
                    Initiate.subscribe((message: any) => resolve({data: message.data}))
                    const message = {type: 'update.trip', data: tripContent}
                    _socket.next(message)
                })
            },
        }),
        getTrips: builder.query<any, any>({
            query: () => ({ url: '/api/trip/', method: 'GET' }),
            async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                try {
                    await cacheDataLoaded;
                    connect()
                    ReceiveSub = Receive.subscribe((message: any) => {
                        console.log('message', message)
                        updateCachedData((draft: any) => {
                            if (message.action === 'update') {
                                const trip = draft.find((trip: any) => trip.id === message.data.id)
                                console.log('trip', message.data)
                                trip.status = message.data.status
                                trip.driver = message.data.driver
                                riderToast(message)
                            }
                            else if (message.action === 'delete') {
                                const trip = draft.find((trip: any) => trip.id === message.data)
                                const indexOfElement = draft.indexOf(trip)
                                console.log('message.data.id', message.data)
                                draft.splice(indexOfElement, 1);
                                driverToast(message)
                            }
                            else if (message.action === 'create') {
                                draft.push(message.data)
                                driverToast(message)
                            }
                        })
                    });
                } catch(error: any){
                    console.error('error', error)
                    console.log('error.response in try catch', error.response)
                 }
                await cacheEntryRemoved
                console.log('in cacheEntryRemoved', ReceiveSub)
                ReceiveSub.unsubscribe();
            }
        }),
    }),
});

export const { useGetTripsQuery, useCreateTripMutation, useDeleteTripMutation, useUpdateTripMutation, util}: any = tripApi
export { connect, _socket } 