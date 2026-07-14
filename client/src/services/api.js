import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`,
  withCredentials: true,
  timeout: 65000, // Render cold starts can take ~60s; fail cleanly after that rather than hanging forever
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthCheck = error.config?.url?.includes("/auth/me");
    const onLoginPage = window.location.pathname === "/login";

    if (error.response?.status === 401 && !isAuthCheck && !onLoginPage) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
