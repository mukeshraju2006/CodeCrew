import client from "./client";

export const createPost = (data) =>
  client.post("/collaborationpost/createPost", data);

export const getAllPosts = (params) =>
  client.get("/collaborationpost/getAllPost");

export const getSinglePost = (id) =>
  client.get(`/collaborationpost/getPost/${id}`);

export const getMyPosts = () =>
  client.get("/collaborationpost/getMyPosts");