import axios from "axios";

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:5000", // Your backend server URL
  withCredentials: true, // Important for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Handle FormData requests
api.interceptors.request.use((config) => {
  // Don't set Content-Type for FormData - let browser set it with boundary
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  
  // Add Authorization header if token exists in localStorage
  const token = localStorage.getItem('accessToken');
  // console.log("=== AUTH DEBUG ===");
  // console.log("Token in localStorage:", token ? "Present" : "Missing");
  // console.log("Token value:", token);
  // console.log("Request URL:", config.url);
  // console.log("==================");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("No authentication token found!");
  }
  
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response, // Return successful response
  (error) => {
    console.log("=== RESPONSE ERROR ===");
    console.log("Error status:", error.response?.status);
    console.log("Error message:", error.response?.data?.message);
    console.log("====================");
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      console.warn("Authentication failed - clearing tokens and redirecting to login");
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      // Redirect to login page
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;
