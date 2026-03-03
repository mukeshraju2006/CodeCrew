import client from "./client";

export const getMyTeams = () =>
  client.get("/team/allMyTeams")

export const getTeamByPost = (postId) =>
  client.get(`/team/myTeam/${postId}`);