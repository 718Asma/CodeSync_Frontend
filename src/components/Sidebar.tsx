import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';

type userInfo = {
    _id: string;
    fullName: string;
    profileImage: string;
    bio: string;
    occupation: string;
};

const Sidebar = ( ) => {
    const navigate = useNavigate();
    
    const [user, setUser] = useState<userInfo>();

    const getUser = async () => {
        const userId = localStorage.getItem("user_id");
        if (userId) {
            try {
                const response: AxiosResponse<{ data: userInfo }> = await axios.get(`http://localhost:3000/user/profile/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                });
                const { _id, fullName, profileImage, bio, occupation } = response.data.data;
                const profileImgUrl = profileImage 
                    ? `http://localhost:3000/${profileImage}`
                    : "http://localhost:3000/assets/images/avatar.png";
                setUser({ _id, fullName, profileImage: profileImgUrl, bio, occupation });
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    console.error("User not authenticated:", error.response.data);
                    navigate("/auth/login");
                } else {
                    console.error("Error fetching user data:", error);
                }
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("username");
        navigate("/auth/login");
    };

    useEffect(() => {
        if (!localStorage.getItem("user_id")) {
            navigate("auth/login");
        } else {
            getUser();
        }
    }, []);
    
    return (
        <>
            {user && (
                <aside className="w-1/6 side">
                    <div>
                        <div className="flex items-center mx-7 mt-7">
                            <img src={user.profileImage} alt="Profile pic" className="mr-2" style={{ height: '50px', width: '50px' }} />
                            <div>
                                <p className='font-semibold'>{user?.fullName}</p>
                                <button
                                    className="info"
                                    onClick={handleLogout}
                                    style={{ color: '#ED080B' }}
                                >
                                    <FontAwesomeIcon icon={faSignOut} />&nbsp;
                                    Log Out
                                </button>
                            </div>
                        </div>
                        {user.bio != null ? (
                            <p className="info mx-7" style={{ fontSize: '15px', marginLeft: '50px', marginTop: '7.5px' }}>
                                {user.bio}
                            </p>
                        ) : user.occupation != null ? (
                            <p className="info mx-7" style={{ fontSize: '15px', marginLeft: '50px', marginTop: '7.5px' }}>
                                {user.occupation}
                            </p>
                        ) : null}
                        <br/>
                        <div className="flex items-center mb-4">
                            <p className="follow w-full"><span>427</span> Followers</p>
                            <p className="follow w-full"><span>845</span> Following</p>
                        </div>
                    </div>
                    <div className='mx-7'>
                        <p style={{fontWeight : 'bold', fontSize:'20px'}}>Trending Topics</p>
                        <ol>
                            <li><a>#Programming</a></li>
                            <li>#Python</li>
                            <li>#C++</li>
                            <li>#PHP</li>
                            <li>#meme</li>
                            <li>#OOP</li>
                            <li>#SpringBoot</li>
                            <li>#Node_Js</li>
                        </ol>
                    </div>
                    <br/>
                    <div className='mx-7'>
                        <p style={{fontWeight : 'bold', fontSize:'20px'}}>Friends</p>
                        
                    </div>
                </aside>
            )}
        </>
    );
            
}

export default Sidebar;
