import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { Link } from "react-router-dom";
import ProfileData from "../components/profileComponents/ProfileData";
import ProfileImageUpload from "../components/profileComponents/ProfileImageUpload";

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
            <ProfileData data={data} />
            <ProfileImageUpload />
            <Link to="/" className="block text-blue-500 hover:underline">
                Go back to Home
            </Link>
        </div>
    );
};

export default Profile;
