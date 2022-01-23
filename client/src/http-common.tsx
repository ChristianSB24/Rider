import { RequestOptions } from '@octokit/types/dist-types/RequestOptions';
import { BaseQueryFn } from '@reduxjs/toolkit/query/react';
import axios, { AxiosRequestConfig, AxiosError } from "axios";

const client = axios.create();

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

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

const axiosBaseQuery =
  ({ baseUrl }: { baseUrl: string } = { baseUrl: '' }):
    BaseQueryFn<{url: string, method: AxiosRequestConfig['method'], data?: AxiosRequestConfig['data']},
    unknown,
    unknown
  > =>
  async ({ url, method, data }) => {
    try {
      const result = await client.request({ url: baseUrl + url, method, data })
      return { data: result.data }
    } catch (axiosError) {
      let err = axiosError as AxiosError
      return {
        error: { status: err.response?.status, data: err.response?.data },
      }
    }
  }


export default client
export { axiosBaseQuery }
