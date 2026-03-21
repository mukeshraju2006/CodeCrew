import axios from "axios";

const client = axios.create({
  baseURL: "https://nullchapter-backend.onrender.com/api/v1",
  withCredentials: true,
});

export default client;