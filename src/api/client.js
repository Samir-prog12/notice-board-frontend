import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: { 'Content-Type': 'application/json' },
});

const isAuthCall = (url) => typeof url === 'string' && url.startsWith('/auth');

// Attach the JWT to every request except /auth/*.
// (The backend filter rejects an expired token even on the login endpoint.)
api.interceptors.request.use((config) => {
  if (!isAuthCall(config.url)) {
    try {
      const stored = JSON.parse(localStorage.getItem('auth') || 'null');
      if (stored?.token) config.headers.Authorization = `Bearer ${stored.token}`;
    } catch {
      /* ignore corrupted storage */
    }
  }
  return config;
});

// 401 on a protected call means the session is no longer valid.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isAuthCall(error.config?.url)) {
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (!error?.response) {
    return 'Cannot reach the server. Check that the backend is running on port 8080.';
  }
  const { status, data } = error.response;
  if (status === 401) return 'Your session has expired. Please log in again.';
  if (status === 403) return 'You do not have permission to do that.';
  if (status === 404) return 'That item no longer exists.';
  if (data && typeof data.message === 'string' && data.message) return data.message;
  return fallback;
}

export default api;
