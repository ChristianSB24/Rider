import { createApi } from '@reduxjs/toolkit/query/react';
import { toast } from 'react-toastify';
import { webSocket } from 'rxjs/webSocket';

import { axiosBaseQuery } from '../http-common';
import getToken from '../utils/getToken'

export type Channel = 'redux' | 'general'

export interface Message {
    id: number
    channel: Channel
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

export const tripApi = createApi({
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        getTrips: builder.query<Message[], Channel>({
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
                } catch {}
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

export const { useGetTripsQuery }: any = tripApi