//Axios is a JavaScript library used to send HTTP requests from your React application.
// persist only remembers the login state.
// It does not automatically send the JWT to Spring Boot.
//
// Connect the JWT token from Zustand to Axios so every protected
// request automatically sends the token to Spring Boot.
//
// We will add an Axios request interceptor.
// When we hit a protected API, Axios first runs this interceptor
// and gets the JWT from Zustand.
//
// The request sent to Spring Boot becomes:
//
// GET /api/snippets
// Authorization:
// Bearer eyJhbGciOiJIUzI1Ni...

import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({

    baseURL: import.meta.env.VITE_API_URL,

    headers: {
        "Content-Type": "application/json",
    },
});

//An interceptor allows you to process requests or responses before your application handles them
// ===============================
// REQUEST INTERCEPTOR=>Runs before a request is sent.Common use: Attach the JWT access token to protected API requests.
// ===============================

api.interceptors.request.use((config) => {

    const token = useAuthStore.getState().accessToken;

    if (token) {

        config.headers.Authorization =
            `Bearer ${token}`;
    }

    return config;
});


// ===============================
// RESPONSE INTERCEPTOR=>uns when a response arrives or an error occurs
// ===============================
//Its main job is to automatically refresh an expired access token and retry the failed API request without asking the user to log in again.
api.interceptors.response.use(

    // If response is successful
    (response) => {

        return response;
    },


    // If response has an error
    async (error) => {

        const originalRequest = error.config;//Configuration of the failed request.originalRequest refers to the request that failed


        // Check for 401 Unauthorized
        if (
            error.response?.status === 401 &&
            originalRequest &&//this checks that the failed request's configuration exists.We need the original request because we intend to retry it.
            !originalRequest._retry &&//This prevents the same request from repeatedly attempting token refresh.Initially, this property is usually undefined.!undefined // true.The request is eligible for a refresh attempt.But after we set:originalRequest._retry = true;!true = false
            !originalRequest.url?.includes("/auth/login") &&
            !originalRequest.url?.includes("/auth/register") &&
            !originalRequest.url?.includes("/auth/refresh")
        ) {

            originalRequest._retry = true;

            try {

                // Get refresh token from Zustand
                const refreshToken =
                    useAuthStore.getState().refreshToken;


                // No refresh token
                if (!refreshToken) {

                    useAuthStore.getState().logout();

                    return Promise.reject(error);
                }


                // Send refresh token
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/auth/refresh`,
                    {
                        refreshToken: refreshToken
                    }
                );


                const newAccessToken =
                    response.data.accessToken;


                // Save new access token
                useAuthStore.setState({

                    accessToken: newAccessToken,

                });


                // Update original request
                originalRequest.headers.Authorization =
                    `Bearer ${newAccessToken}`;


                // Retry original request
                return api(originalRequest);


            } catch (refreshError) {

                // Refresh token is invalid or expired
                useAuthStore.getState().logout();

                return Promise.reject(refreshError);
            }
        }


        return Promise.reject(error);
    }
);


export default api;

