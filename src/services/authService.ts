import axios from "../utils/axios";

interface LoginResponse {
    access_token: string;
    refresh_token: string;
    user_id: string;
}

const setLocalStorage = (data: LoginResponse) => {
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    localStorage.setItem("user_id", data.user_id);
};

export const login = async (username: string, password: string) => {
  try {
    const { data } = await axios.post("/auth/login", {
      username,
      password,
    });

    setLocalStorage(data);
  } catch (err) {
    console.error("An error occurred during login: ", err);
    throw err;
  }
};

export const register = async (fullName: string, username: string, password: string, confirmPassword: string) => {
  try {
    const response = await axios.post("/auth/signup", {
      fullName,
      username,
      password,
      confirmPassword,
    });

    const { refresh_token, access_token, user_id } = response.data;
    setLocalStorage({ refresh_token, access_token, user_id });

    return response.data;
  } catch (err) {
    console.error("An error occurred during registration: ", err);
    throw err;
  }
};

export const googleLogin = async (loginBody: {googleId: any, fullName: any}): Promise<void> => {
  try {
    const { data } = await axios.post("/auth/google", loginBody);
    setLocalStorage(data);
  } catch (err) {
    console.error("An error occurred with the Google login request: ", err);
    throw err;
  }
};