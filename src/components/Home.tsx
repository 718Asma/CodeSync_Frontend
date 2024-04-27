import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../utils/axios";
import redirector from "../utils/redirector";

const Home = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [userId, setUserId] = useState(null);
    useEffect(() => {
        redirector(navigate);
        const fetchProtectedData = async () => {
            try {
                const response = await axios.get("/");
                setUserId(response.data.userId);
                setData(response.data);
            } catch (error) {
                console.error("Error fetching protected data:", error);
            }
        };
        fetchProtectedData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/auth/login");
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">Welcome to Home</h1>
            {data && (
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                    <p className="text-lg">Protected data:</p>
                    <p className="text-gray-700">{data.message}</p>
                </div>
            )}
            <a
                href={`/user/profile/${userId}`}
                className="text-blue-500 hover:underline block mb-2"
            >
                Visit your profile
            </a>
            <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
                Logout
            </button>
        </div>
    );
};

export default Home;
