import axios from "axios";
import { getAccessToken } from "./services/AuthService";

const token = getAccessToken();

export default axios.create({
  baseURL: `${process.env.REACT_APP_BASE_URL}`,
  headers: { Authorization: `Bearer ${token}` }
});