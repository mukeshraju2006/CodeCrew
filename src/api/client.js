import axios from "axios";
export const USE_MOCK = false;
const client = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
});

export default client;