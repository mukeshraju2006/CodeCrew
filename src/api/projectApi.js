import client from "./client";

export const createPost = (data) =>
  client.post("/collaborationpost/createPost", data);

// Now supports query params properly
export const getAllPosts = (params) =>
  client.get("/collaborationpost/getAllPost", { params });

// Normalize single post response (unwrap array)
export const getSinglePost = async (id) => {
  const res = await client.get(`/collaborationpost/getPost/${id}`);

  return {
    ...res,
    data: {
      ...res.data,
      data: res.data.data[0], // unwrap array
    },
  };
};

export const getMyPosts = () =>
  client.get("/collaborationpost/getMyPosts");