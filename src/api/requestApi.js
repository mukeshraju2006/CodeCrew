import client from "./client";

// send request
export const sendRequest = (postId, howCanYouContribute) =>
  client.post(`/collabReq/sendReq/${postId}`, {
    howCanYouContribute,
  });

// view my requests
export const getMyRequests = () =>
  client.get("/collabReq/getReqs");

// creator view requests on post
export const getRequestsOnPost = (post_id) =>
  client.get(`/collabReq/getReqStatus/${post_id}`);

// change status
export const changeStatus = (reqId, newStatus) =>
  client.patch(`/collabReq/changeStatus/${reqId}`, {
    newStatus,
  });