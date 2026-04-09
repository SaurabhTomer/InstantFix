import axios from "axios";

// Create axios instance specifically for chat (no redirect on 401)
const chatApi = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
chatApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  // console.log("=== CHAT API DEBUG ===");
  // console.log("Token in localStorage:", token ? "Present" : "Missing");
  // console.log("Request URL:", config.url);
  // console.log("====================");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Handle response errors (NO REDIRECT on 401)
chatApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("=== CHAT API ERROR ===");
    console.log("Error status:", error.response?.status);
    console.log("Error message:", error.response?.data?.message);
    console.log("====================");
    
    // DON'T redirect on 401 - let the component handle it
    return Promise.reject(error);
  }
);

export default chatApi;
