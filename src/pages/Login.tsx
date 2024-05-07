import { useEffect, useRef, useState } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";
import redirector from "../utils/redirector";

import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

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

const GoogleLoginButton: React.FC = () => {
    const navigate = useNavigate();

    const onSuccess = async (res: any) => {
        if (!res) console.error("'onSuccess' response is null.");
        const decodedRes = jwtDecode(res.credential);
        const loginBody = {
            googleId: decodedRes.sub,
            fullName: (decodedRes as any).name,
        };
        try {
            const { data } = await axios.post("/auth/google", loginBody);
            setLocalStorage(data);
            navigate("/");
        } catch (err) {
            console.error("an error occurred with the login request: ", err);
        }
    };

    const onFail = () => {
        console.error("google login failed.");
    };

    return <GoogleLogin onSuccess={onSuccess} onError={onFail} />;
};

const Login = () => {
    const navigate = useNavigate();
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string[]>([]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError([]);
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;
        if (!username)
            setError((prevErrors) => [
                ...prevErrors,
                "Username must not be empty.",
            ]);
        if (!password)
            setError((prevErrors) => [
                ...prevErrors,
                "Password must not be empty.",
            ]);

        if (username && username.length < 3)
            setError((prevErrors) => [
                ...prevErrors,
                "Username must be at least 3 characters long.",
            ]);

        if (password && password.length < 8)
            setError((prevErrors) => [
                ...prevErrors,
                "Password must be at least 8 characters long.",
            ]);

        if (error.length > 0) return;

        let loginBody = {
            username: username!,
            password: password!,
        };
        try {
            const { data } = await axios.post<LoginResponse>(
                "/auth/login",
                loginBody
            );
            setLocalStorage(data);
            navigate("/");
        } catch (error) {
            console.error("Error: ", error);
            setError((prevErrors) => [
                ...prevErrors,
                (error as any).response.data.message,
            ]);
        }
    };

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
                        ref={usernameRef}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        id="username"
                        name="username"
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
                        ref={passwordRef}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                    />
                </div>
                <div className="mb-6">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                        onClick={handleLogin}
                    >
                        Login
                    </button>
                </div>
            </form>
            {error.length > 0 && (
                <ul className="text-red-500 bg-red-100 p-2 rounded-md mb-4">
                    {error.map((err, index) => (
                        <li key={index}>{err}</li>
                    ))}
                </ul>
            )}

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
