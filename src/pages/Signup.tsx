import { useEffect, useState } from "react";
import axios from "../utils/axios";
import redirector from "../utils/redirector";
import { useNavigate } from "react-router-dom";
import { log } from "console";

const Signup = () => {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string[]>([]); // Update the type of 'error' state to be an array of strings

    async function handleSignup(e: any) {
        e.preventDefault();
        // verify that the password and confirm password match
        setError([]);
        if (fullName === "") {
            setError((error) => [...error, "Full name is required"]);
        }
        if (username === "") {
            setError((error) => [...error, "Username is required"]);
        }
        if (password === "") {
            setError((error) => [...error, "Password is required"]);
        }
        if (confirmPassword === "") {
            setError((error) => [...error, "Confirm password is required"]);
        }
        if (password !== confirmPassword) {
            setError((error) => [...error, "Passwords do not match"]);
        }
        if (error.length > 0) {
            return;
        }

        try {
            let signUpForm = {
                fullName: fullName,
                username: username,
                password: password,
                confirm_password: confirmPassword,
            };
            const res = await axios.post("/auth/signup", signUpForm);
            console.log(res.data);
            // implement the sign up --> logs in the user and redirects to the home page
            const { refresh_token, access_token } = res.data;
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);
            navigate("/");
        } catch (error) {
            setError((error) => [
                ...error,
                "An error occurred while signing up. Please try again.",
            ]);
        }
    }

    useEffect(() => {
        redirector(navigate, "signup");
        return () => {
            setError([]);
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-xs">
                <h1 className="text-2xl font-bold mb-4">Signup</h1>
                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="fullName"
                    >
                        Full name:
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your full name"
                    />
                </div>
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
                        placeholder="Choose a username"
                    />
                </div>
                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="password"
                    >
                        Password:
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </div>
                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="confirm_password"
                    >
                        Confirm password:
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="password"
                        id="confirm_password"
                        name="confirm_password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                    />
                </div>
                <div className="mb-6">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                        onClick={(e) => handleSignup(e)}
                    >
                        Signup
                    </button>
                </div>
            </form>
            <ul className="text-red-500">
                {error.map((err, index) => (
                    <li key={index}>{err}</li>
                ))}
            </ul>

            <div className="text-center mt-4">
                <p>Already signed up?</p>
                <a className="text-blue-500" href="/auth/login">
                    Login
                </a>
            </div>
        </div>
    );
};

export default Signup;
