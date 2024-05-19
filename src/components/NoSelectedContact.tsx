import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";

type CurrentUserInfo = {
    _id: string;
    fullName: string;
    profileImage: string;
};

function NoSelectedContact({ currentUser }: { currentUser?: CurrentUserInfo }) {
    const navigate = useNavigate();
    const [user, setUser] = useState<CurrentUserInfo | null>(null);

    const fetchUserDetails = async (userId: string) => {
        try {
            const { data } = await axios.get(`user/profile/${userId}`);
            let { _id, fullName } = data.data;
            setUser({
                _id,
                fullName,
                profileImage: "http://localhost:3000/assets/images/avatar.png",
            });
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    useEffect(() => {
        const existingUserId = localStorage.getItem("user_id");

        if (currentUser) {
            setUser(currentUser);
        } else if (existingUserId) {
            fetchUserDetails(existingUserId);
        } else {
            navigate("/login");
        }
    }, [currentUser, navigate]);

    return (
        <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Welcome, {user ? user.fullName : "User"}!
            </h1>
            <h3 className="text-lg text-gray-600">
                Please select a chat to start messaging.
            </h3>
        </div>
    );
}

export default NoSelectedContact;
