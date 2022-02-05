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

export const getRefeshToken = async (): Promise<AxiosResponse> => {
  const url = `${process.env.REACT_APP_BASE_URL}/api/token/refresh/`;
  const token = JSON.parse(window.localStorage.getItem('taxi.auth') || 'null')
  try {
    const response = await client.post<object>(url, {refresh: token.refresh});
    console.log('response', response)
    return response
  } catch (error: any) {
    throw new Error(error);
  }
};
