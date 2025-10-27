import axios from "axios";

const baseURL = "http://localhost:8000/api";

// Token helpers
const getAccessToken = () => localStorage.getItem("access_token");
const getRefreshToken = () => localStorage.getItem("refresh_token");
const saveAccessToken = (token) => localStorage.setItem("access_token", token);
const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

// Create Axios instance
const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach access token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired tokens (401 responses)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh = getRefreshToken();
        if (!refresh) throw new Error("No refresh token available.");

        const response = await axios.post(`${baseURL}/auth/refresh/`, { refresh });
        const newAccess = response.data.access;

        saveAccessToken(newAccess);
        api.defaults.headers.Authorization = `Bearer ${newAccess}`;
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return api(originalRequest);
      } catch (err) {
        clearTokens();
        window.location.href = "/login"; // redirect if refresh also fails
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export { getAccessToken, getRefreshToken, saveAccessToken, clearTokens };
export default api;
