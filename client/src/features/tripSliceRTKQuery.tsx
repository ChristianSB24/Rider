import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../http-common';
import { webSocket } from 'rxjs/webSocket';
import getToken from '../utils/getToken'

export type Channel = 'redux' | 'general'

export interface Message {
    id: number
    channel: Channel
    userName: string
    text: string
}

export const tripApi = createApi({
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        getTrips: builder.query<Message[], Channel>({
            query: () => ({ url: '/api/trip/', method: 'GET' }),
            async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
                console.log('before websocket')
                const ws: any = webSocket(`ws://localhost:8003/taxi/?token=${getToken()}`)
                try {
                    await cacheDataLoaded;

                    ws.subscribe((message: any) => {
                        updateCachedData((draft: any) => {
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