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

const connect = () => {
    if (!_socket || _socket.closed) {
        return webSocket(`ws://localhost:8003/taxi/?token=${getToken()}`);
}};

export const tripApi = createApi({
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        createTrip: builder.mutation<any, any>({
            queryFn: async (tripContent: string) => {
                return new Promise(resolve => {
                    _socket = connect()
                    messages = _socket.pipe(share())
                    messages.subscribe((message: any) => {return (
                        console.log('message', message), 
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
                  const patchResult = dispatch(
                    tripApi.util.updateQueryData('getTrips', undefined, (draft: any) => {
                        console.log('newTrip', newTrip)
                      draft.push(newTrip)
                    })
                  )
                  console.log('patchResult', patchResult)
                } catch {}
              },
        }),
        getTrips: builder.query<any, any>({
            query: () => ({ url: '/api/trip/', method: 'GET' }),
            async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                const ws: any = webSocket(`ws://localhost:8003/taxi/?token=${getToken()}`)
                try {
                    await cacheDataLoaded;
                    ws.subscribe((message: any) => {
                        updateCachedData((draft: any) => {
                            updateToast(message.data)
                            if (message.action === 'update') {
                                const trip = draft.find((trip: any) => trip.id === message.data.id)
                                trip.status = message.data.status
                            }
                            else if (message.action === 'delete') {
                                const trip = draft.find((trip: any) => trip.id === message.data.id)
                                const indexOfElement = draft.indexOf(trip)
                                draft.splice(indexOfElement, 1);
                            }
                            else {
                                draft.push(message.data)
                            }
                        })
                    });
                } catch { }
                await cacheEntryRemoved
                ws.unsubscribe();
                console.log('after cacheEntryRemoved')
            }
        }),
    // deleteTrips: builder.mutation<Message[], Channel>({
    //     query: (id) => ({ url: `/api/trip/${id}/delete`, method: 'DELETE'}),
    // }),
}),
});

export const { useGetTripsQuery, useCreateTripMutation }: any = tripApi

// queryFn: async (tripContent: string) => {
//     return new Promise(resolve => {
//         _socket = connect()
//         messages = _socket.pipe(share())
//         messages.subscribe((message: any) => {return (
//             console.log('message', message), 
//             resolve({data: message.data})
//         )})
//         const message = {
//             type: 'create.trip',
//             data: tripContent
//         };
//         _socket.next(message)
//     })
// },
// }),

// queryFn: async (tripContent: string) => {
//     _socket = connect()
//     messages = _socket.pipe(share())
//     messages.subscribe((message: any) => console.log('message', message))
//     const message = {
//         type: 'create.trip',
//         data: tripContent
//     };
//     _socket.next(message)
// },
// }),