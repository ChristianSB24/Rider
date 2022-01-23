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
                            draft.push(message.data)
                        })
                    });

                } catch {
                    // if cacheEntryRemoved resolved before cacheDataLoaded,
                    // cacheDataLoaded throws
                }
                await cacheEntryRemoved
                ws.unsubscribe();
            }
        }),
    }),
});

export const { useGetTripsQuery }: any = tripApi