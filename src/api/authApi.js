import client from "./client";

export const registerUser = (data) => {
  return client.post("/users/register", data);
};

export const loginUser = (data) => {
  return client.post("/users/login", data);
};

export const logoutUser = () => {
  return client.post("/users/logout");
};

export const getCurrentUser = () => {
  return client.get("/users/me");
};

export const viewRequester = (requesterId) =>
  client.get(`/users/getInfo/${requesterId}`);