import client from "./client";

// Sends multipart/form-data — backend uses multer upload.single("pic")
export const registerUser = (formData) =>
  client.post("/users/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const loginUser = (data) =>
  client.post("/users/login", data);

export const logoutUser = () =>
  client.post("/users/logout");

export const getCurrentUser = () =>
  client.get("/users/me");

export const viewRequester = (requesterId) =>
  client.get(`/users/getInfo/${requesterId}`);