import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";
import redirector from "../utils/redirector";

import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Login = () => {
    function GoogleLoginButton() {
        const onSuccess = async (response: any) => {
            if (!response) console.error("onSuccess response is null.");
            const decodedCredential = jwtDecode(response.credential);
            const googleUser = {
                googleId: response.clientId,
                fullName: (decodedCredential as any).name,
            };
            const res = await axios.post("/auth/google", googleUser);
            const { refresh_token, access_token } = res.data;
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);
            navigate("/");
        };

        const onFail = () => {
            console.error("Login failed:");
        };

        return <GoogleLogin onSuccess={onSuccess} onError={() => onFail()} />;
    }

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string[]>([]);

    async function handleLogin(e: any) {
        e.preventDefault();
        setError([]);
        if (username === "")
            setError((error) => [...error, "Username must not be empty."]);
        if (password === "")
            setError((error) => [...error, "Password must not be empty."]);
        let user = {
            username: username,
            password: password,
        };
        try {
            const response = await axios.post("/auth/login", user);

            const { refresh_token, access_token, user_id } = response.data;
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);
            localStorage.setItem("user_id", user_id);

            navigate("/");
        } catch (error) {
            console.error("Error: ", error);
        }
    }

    useEffect(() => {
        redirector(navigate);
        return () => {
            setError([]);
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-xs">
                <h1 className="text-2xl font-bold mb-4">Login</h1>
                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="username"
                    >
                        Username:
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                    />
                </div>
                <div className="mb-6">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="password"
                    >
                        Password:
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </div>
                <div className="mb-6">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                        onClick={(e) => handleLogin(e)}
                    >
                        Login
                    </button>
                </div>
            </form>
            <ul className="text-red-500">
                {error.map((err, index) => (
                    <li key={index}>{err}</li>
                ))}
            </ul>

            <div className="text-center mt-4">
                <p>Didn't sign up yet?</p>
                <a className="text-blue-500" href="/auth/signup">
                    Signup
                </a>
            </div>
            <div className="text-center mt-4">
                <GoogleLoginButton />
            </div>
        </div>
    );
};

export default Login;
