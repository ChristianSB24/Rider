import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../http-common';

export const tripApi = createApi({
 baseQuery: axiosBaseQuery({
     baseUrl: `${process.env.REACT_APP_BASE_URL}`,
 }),
 endpoints: (builder) => ({
   getTrips: builder.query({
        query: () => ({ url: '/api/trip', method: 'GET' })
   }),
 }),
});

export const { useGetTripsQuery }: any = tripApi