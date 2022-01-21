import axios, {AxiosResponse} from 'axios';
import { share } from 'rxjs/operators'; 
import { webSocket } from 'rxjs/webSocket';

import client from '../http-common';
import getToken from '../utils/getToken'

let _socket: any;
export let messages: any; 

interface Trip {
  driver: number | undefined, 
  rider: number, 
  status: string, 
}

interface newTrip {
  rider: any
  pick_up_address: string, 
  drop_off_address: string
}

export const connect = () => {
  if (!_socket || _socket.closed) {
    _socket = webSocket(`ws://localhost:8003/taxi/?token=${getToken()}`);
    messages = _socket.pipe(share());
    messages.subscribe((message: object) => console.log(message));
  }
};

export const createTrip = (trip: newTrip) => {
  connect();
  const message = {
    type: 'create.trip',
    data: trip
  };
  _socket.next(message);
};

export const getTrip = async (id: string | undefined): Promise<AxiosResponse> => {
  const url = `${process.env.REACT_APP_BASE_URL}/api/trip/${id}/`;
  try {
    const response = await client.get<object>(url);
    return response
  } catch (error: any) {
    throw new Error(error);
  }
};

export const deleteTrip = async (id: string | undefined, tripData: any): Promise<AxiosResponse> => {
  const url = `${process.env.REACT_APP_BASE_URL}/api/trip/${id}/delete/`;
  try {
    const response = await client.delete<object>(url, {data: tripData});

    return response
  } catch (error: any) {
    throw new Error(error);
  }
};

export const updateTrip = (trip: Trip) => {
    connect();
    const message = {
      type: 'update.trip',
      data: trip
    };
    _socket.next(message);
  };