import axios, {AxiosResponse} from 'axios';
import { share } from 'rxjs/operators'; 
import { webSocket } from 'rxjs/webSocket';

import getToken from '../utils/getToken'

let _socket: any;
export let messages: any; 

interface Trip {
  // id: string, 
  driver: number | undefined, 
  rider: number, 
  // created: string, 
  // updated: string, 
  status: string, 
  // pick_up_address: string, 
  // drop_off_address: string
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

export const getTrip = async (id: string | undefined): Promise<{response: AxiosResponse<object>, isError: boolean}> => {
  const url = `${process.env.REACT_APP_BASE_URL}/api/trip/${id}/`;
  const headers = { Authorization: `Bearer ${getToken()}` };
  try {
    const response = await axios.get<object>(url, { headers });
    console.log(response.data)
    return { response, isError: false };
  } catch (response: any) {
    return { response, isError: true };
  }
};

export const getTrips = async (): Promise<{response: AxiosResponse<object[]>, isError: boolean}> => {
  const url = `${process.env.REACT_APP_BASE_URL}/api/trip/`;
  const headers = { Authorization: `Bearer ${getToken()}` };
  try {
    const response = await axios.get<object[]>(url, { headers });
    console.log(response.data)
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