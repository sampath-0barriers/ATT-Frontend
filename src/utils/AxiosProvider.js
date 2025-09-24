import { createContext, useContext, useEffect } from 'react';
import axios from 'axios';
const { storeExpiry, read } = require('./LocalStorageEncryption');
import { errorNotification } from "./index";

const AxiosContext = createContext();
const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:8080";

export const AxiosProvider = ({ children }) => {
    const axiosInstance = axios.create({
        baseURL: baseUrl,
        headers: {
            "Content-Type": "application/json"
        }
    });

    async function refreshToken() {
        // place request to backend service to refresh token
        try {
            const response = await axios.post(`${baseUrl}/token`, { "token": read("refreshToken") });
            // update stored instance
            storeExpiry("accessToken", response.data.accessToken, true);
            // update axios instance with new token
            axiosInstance.defaults.headers.common.Authorization = `Bearer ${response.data.accessToken}`;
        } catch (error) {
            console.error("Error refreshing token:", error);
            errorNotification("Error", "Failed to refresh session. Please login again.");
        }
    }

    useEffect(() => {
        const token = read("accessToken");
        if (token) {
            axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
        }

        axiosInstance.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                if (error.response) {
                    const { status, data } = error.response;

                    switch (status) {
                        case 401:
                            if (data === "Authentication Error: jwt expired") {
                                try {
                                    // attempting to refresh token;
                                    await refreshToken();
                                    // token refreshed, reattempting request;
                                    const { config } = error;
                                    // configure new request in a new instance;
                                    return await axiosInstance({ method: config.method, url: config.url, data: config.data });
                                } catch (e) {
                                    // eslint-disable-next-line no-return-assign
                                    // return window.location.href = "/auth/login";
                                    return Promise.reject(error);
                                }
                            } else {
                                // eslint-disable-next-line no-return-assign
                                // return window.location.href = "/auth/login";
                                return Promise.reject(error);
                            }
                        default:
                            return Promise.reject(error);
                    }
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    return Promise.reject(error);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    return Promise.reject(error);
                }
            }
        );
    }, [axiosInstance]);

    return (
        <AxiosContext.Provider value={axiosInstance}>
            {children}
        </AxiosContext.Provider>
    );
};

export const useAxios = () => {
    return useContext(AxiosContext);
};
