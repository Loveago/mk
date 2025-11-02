import axios from 'axios';
import { clearStoredTokens, getStoredTokens, setStoredTokens } from './tokenStorage.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: false,
});

let refreshHandler = null;
let logoutHandler = null;
let isRefreshing = false;
let queue = [];

function processQueue(error, token) {
  queue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  queue = [];
}

export function setAuthHandlers({ refresh, logout }) {
  refreshHandler = refresh;
  logoutHandler = logout;
}

apiClient.interceptors.request.use((config) => {
  const tokens = getStoredTokens();
  if (tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      refreshHandler &&
      getStoredTokens()?.refreshToken
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newTokens = await refreshHandler();
        processQueue(null, newTokens.accessToken);
        originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        clearStoredTokens();
        if (logoutHandler) logoutHandler();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export function updateStoredTokens(tokens) {
  setStoredTokens(tokens);
}

export function removeStoredTokens() {
  clearStoredTokens();
}

export default apiClient;


