import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { Link } from "react-router-dom";

const Profile = () => {
    const [data, setData] = useState<any>(null);
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const getUserIdFromUrl = window.location.href.split("/").pop();
                const response = await axios.get(
                    "/user/profile/" + getUserIdFromUrl
                );
                setData(response.data);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };
        fetchProfile();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Profile</h1>
            {data && (
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                    <p className="text-lg">Profile data:</p>
                    <div className="border border-gray-300 p-4 mt-2">
                        <p className="font-semibold">Full Name:</p>
                        <p className="text-gray-700">{data.data.fullName}</p>
                        <p className="font-semibold">Username:</p>
                        <p className="text-gray-700">{data.data.username}</p>
                        <p className="font-semibold">Password:</p>
                        <p className="text-gray-700">{data.data.password}</p>
                        <p className="font-semibold mt-4">Google ID:</p>
                        <p className="text-gray-700">{data.data.googleId}</p>
                    </div>
                </div>
            )}
            <Link to="/" className="block text-blue-500 hover:underline">
                Go back to Home
            </Link>
        </div>
    );
};

export default Profile;
