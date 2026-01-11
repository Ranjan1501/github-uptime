import axios from "axios";

const API_BASE = "http://localhost:5000/api/github";

export const getUserProfile = (username) =>
  axios.get(`${API_BASE}/user/${username}`);

export const getUserContributions = (username) =>
  axios.get(`${API_BASE}/contributions/${username}`);

export const getUserRepositories = (username) =>
  axios.get(`${API_BASE}/repositories/${username}`);
