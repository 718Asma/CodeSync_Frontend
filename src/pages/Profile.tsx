import { useEffect, useState } from "react";
import axios from "../utils/axios";
import { Link, useParams, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProfileData from "../components/profileComponents/ProfileData";
import ProfileImageUpload from "../components/profileComponents/ProfileImageUpload";
import ProfileHeader from "../components/profileComponents/ProfileHeader ";
import ProfilePost from "../components/profileComponents/ProfilePost";
import ProfileEdit from "../components/profileComponents/ProfileEdit";
import ProfileFriends from "../components/profileComponents/ProfileFriends";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
    const [data, setData] = useState<any>(null);
    const { userId } = useParams();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`/user/profile/${userId}`);
                setData(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };
        fetchProfile();
    }, [userId]);

    return (
        <div style={{width:"1230px"}} className="container mx-auto px-4 py-8 bg-gray-100">
            {/* <Navbar/> */}
            <ProfileHeader data={data} />
            <br />
            <div>
                <ProfileData data={data} />
                <ProfileFriends data={data} />
                {/* <ProfilePost data={data}/> */}
                <ProfileEdit data={data}/>
            </div>
            {/* <ProfileImageUpload /> */}
            <Link to="/">
                <FontAwesomeIcon 
                    style={{position:"fixed",top:"6%",left:"5.7%"}} 
                    className="border border-gray-300 bg-white text-secondary-500 p-2 px-3 rounded-lg 20 hover:bg-secondary hover:text-white hover:border-transparent" icon={faArrowLeft}
                />
            </Link>
        </div>
    );
};

export default Profile;
