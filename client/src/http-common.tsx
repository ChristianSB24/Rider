import axios from "axios";

export const axiosClientBuilder = () => {
  let token = JSON.parse(window.localStorage.getItem('taxi.auth') || 'null').access
  const client = axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URL}`,
    headers: { Authorization: `Bearer ${token}` }
  })
  return { client }
}

export const { client } = axiosClientBuilder()