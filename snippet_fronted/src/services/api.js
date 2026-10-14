import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Keep one refresh request for concurrent 401 responses.
let refreshPromise = null;

// REQUEST INTERCEPTOR
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status !== 401 ||
            !originalRequest ||
            originalRequest._retry ||
            originalRequest.url?.includes("/auth/login") ||
            originalRequest.url?.includes("/auth/register") ||
            originalRequest.url?.includes("/auth/refresh")
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        const authStore = useAuthStore.getState();
        const refreshToken = authStore.refreshToken;

        if (!refreshToken) {
            authStore.logout();
            return Promise.reject(error);
        }

        try {
            // Concurrent requests reuse the same refresh request.
            if (!refreshPromise) {
                refreshPromise = axios
                    .post(
                        `${import.meta.env.VITE_API_URL}/auth/refresh`,
                        { refreshToken }
                    )
                    .then((response) => {
                        const newAccessToken =
                            response.data.accessToken;

                        if (!newAccessToken) {
                            throw new Error(
                                "Refresh response did not contain an access token."
                            );
                        }

                        useAuthStore.setState({
                            accessToken: newAccessToken,
                        });

                        return newAccessToken;
                    })
                    .finally(() => {
                        refreshPromise = null;
                    });
            }

            const newAccessToken = await refreshPromise;

            originalRequest.headers =
                originalRequest.headers || {};

            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;

            return api(originalRequest);

        } catch (refreshError) {
            const status = refreshError.response?.status;

            // Log out only when the backend explicitly rejects
            // the refresh token as an authentication failure.
            if (status === 401 || status === 403) {
                useAuthStore.getState().logout();
            }

            return Promise.reject(refreshError);
        }
    }
);

export default api;