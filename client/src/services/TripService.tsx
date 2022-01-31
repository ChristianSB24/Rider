import {AxiosResponse} from 'axios';

import client from '../http-common';

export let messages: any; 

export const getTrip = async (id: string | undefined): Promise<AxiosResponse> => {
  const url = `${process.env.REACT_APP_BASE_URL}/api/trip/${id}/`;
  try {
    const response = await client.get<object>(url);
    return response
  } catch (error: any) {
    throw new Error(error);
  }
};