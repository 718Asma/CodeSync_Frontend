import { useEffect, useState } from "react";

import ProfileEdit from "../profileComponents/ProfileEdit";
import SettingsNavBar from "./settingsNavBar"
import { getUserProfile } from "../../services/userService";

const AccountSettings = () => {
    const [data, setData] = useState<any>(null);
    const userId = localStorage.getItem("user_id");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (userId) {
                    const response = await getUserProfile(userId);
                    console.log(response);
                    setData(response);
                } else {
                    console.error("No user id found");
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };
        fetchProfile();
    }, [userId]);
    
    return (
        <>
            <SettingsNavBar />
            <div className="container mx-auto px-4 py-8" style={{ width: '67%' }}>
                <ProfileEdit data={data}/>
            </div>
        </>
    );
};
  
  export default AccountSettings;