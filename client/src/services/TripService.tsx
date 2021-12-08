import axios, {AxiosResponse} from 'axios';
import { share } from 'rxjs/operators'; 
import { webSocket } from 'rxjs/webSocket';

import { getAccessToken } from './AuthService';

let _socket: any;
export let messages: any; 

interface Trip {
  id: string, 
  driver: number, 
  rider: number, 
  created: string, 
  updated: string, 
  status: string, 
  pick_up_address: string, 
  drop_off_address: string
}

interface newTrip {
  rider: any
  pick_up_address: string, 
  drop_off_address: string
}

export const connect = () => {
  if (!_socket || _socket.closed) {
    const token = getAccessToken();
    _socket = webSocket(`ws://localhost:8003/taxi/?token=${token}`);
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

export const getTrip = async (id: string): Promise<{response: AxiosResponse<object>, isError: boolean}> => {
  const url = `${process.env.REACT_APP_BASE_URL}/api/trip/${id}/`;
  const token = getAccessToken();
  const headers = { Authorization: `Bearer ${token}` };
  try {
    const response = await axios.get<object>(url, { headers });
    console.log('trip', response)
    return { response, isError: false };
  } catch (response: any) {
    return { response, isError: true };
  }
};

export const getTrips = async (): Promise<{response: AxiosResponse<object[]>, isError: boolean}> => {
  const url = `${process.env.REACT_APP_BASE_URL}/api/trip/`;
  const token = getAccessToken();
  const headers = { Authorization: `Bearer ${token}` };
  try {
    const response = await axios.get<object[]>(url, { headers });
    return { response, isError: false };
  } catch (response: any) {
    return { response, isError: true };
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