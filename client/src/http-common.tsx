import { BaseQueryFn } from '@reduxjs/toolkit/query/react';
import axios, { AxiosRequestConfig, AxiosError } from "axios";

//Initialize an axios instance
const client = axios.create();

//Add these settings to every axios request
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

//Set up an axios interceptor to add in token to header before every request
client.interceptors.request.use(
  (config: any) => {
    const token = JSON.parse(window.localStorage.getItem('taxi.auth') || 'null')
    config.baseURL = `${process.env.REACT_APP_BASE_URL}`
    config.headers.Authorization = token ? `Bearer ${token.access}` : ''
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//Every request made through RTK Query uses this function. Each endpoint has a query function. 
//Whatever that query function returns is passed into this function.
//For the getTrips endpoint, the url and method is passed into here. The data parameter is optional
const axiosBaseQuery = 
  //This is the typing for whatever is passed into this function. Provided by RTK Query.
  ():BaseQueryFn<
    {url: string, method: AxiosRequestConfig['method'], data?: AxiosRequestConfig['data']}, unknown, unknown
    > =>
  async ({ url, method, data }) => {
    //We set up a regular try/catch. In this case we use client.request because the method will vary depending on which call we make.
    //client.request allows you to pass in the url, method, and data. The url is appended to the already set base url in client.
    try {
      const result = await client.request({ url, method, data })
      return { data: result.data }
    } catch (axiosError) {
      //The RTKQ docs set the type for the error. There are special types for a variety of axios attributes.
      let err = axiosError as AxiosError
      return {
        error: { status: err.response?.status, data: err.response?.data },
      }
    }
  }


export default client
export { axiosBaseQuery }
