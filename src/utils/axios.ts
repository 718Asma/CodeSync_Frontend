import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
    const access_token = localStorage.getItem("access_token");

    if (access_token) {
        config.headers.authorization = `Bearer ${access_token}`;
    }

    return config;
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refresh_token = localStorage.getItem("refresh_token");
            try {
                const response = await axiosInstance.post(
                    "/auth/refresh-token",
                    {
                        refresh_token,
                    }
                );
                const { access_token } = response.data;
                localStorage.setItem("access_token", access_token);
                return axiosInstance(originalRequest);
            } catch (error) {
                console.error("Error refreshing token: ", error);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
