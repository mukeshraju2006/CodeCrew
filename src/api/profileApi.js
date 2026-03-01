import api, { USE_MOCK } from "./client";

let mockProfile = {
  name: "Test User",
  skills: "React, Python",
  techStack: "MERN",
  experience: "Beginner",
  github: "",
  interests: "Web Dev",
};

export const getProfile = async () => {
  if (USE_MOCK) return mockProfile;

  const res = await api.get("/profile");
  return res.data;
};

export const saveProfile = async (data) => {
  if (USE_MOCK) {
    mockProfile = data;
    return data;
  }

  const res = await api.put("/profile", data);
  return res.data;
};