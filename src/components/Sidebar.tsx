import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { User } from "../classes/user";
import { friendRequest } from "../classes/friendRequest";
import { getUserProfile } from "../services/userService";
import { getAllFriendRequests } from "../services/friendRequestService";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { Avatar } from "@mantine/core";

const Sidebar = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState<User>();
    const [pendingRequests, setPendingRequests] = useState<friendRequest[]>([]);

    const getUser = async () => {
        const userId = localStorage.getItem("user_id");
        if (userId) {
            try {
                const response = await getUserProfile(userId);
                const {_id, fullName, profileImage, bio, occupation, friends} = response;
                setUser({_id, fullName, profileImage: profileImage, bio, occupation, friends});

                const pendingResponse = await getAllFriendRequests(userId);
                const receiverRequests = pendingResponse.filter((request: friendRequest) => request.receiver === userId);
                setPendingRequests(receiverRequests);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
    };

    const handleLogout = () => {
        localStorage.clear();
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
                            <Avatar
                                src={user?.profileImage}
                                alt={user?.fullName}
                                radius="xl"
                                size="lg"
                            />{" "}
                            &nbsp;&nbsp;&nbsp;
                            <div>
                                <p className="font-semibold">
                                    {user?.fullName}
                                </p>
                                <button
                                    className="info"
                                    onClick={handleLogout}
                                    style={{ color: "#ED080B" }}
                                >
                                    <FontAwesomeIcon icon={faSignOut} />
                                    &nbsp; Log Out
                                </button>
                            </div>
                        </div>
                        {user.bio != null ? (
                            <p
                                className="info mx-7"
                                style={{
                                    fontSize: "16.5px",
                                    marginLeft: "50px",
                                    marginTop: "10px",
                                }}
                            >
                                {user.bio}
                            </p>
                        ) : user.occupation != null ? (
                            <p
                                className="info mx-7"
                                style={{
                                    fontSize: "16.5px",
                                    marginLeft: "50px",
                                    marginTop: "10px",
                                }}
                            >
                                {user.occupation}
                            </p>
                        ) : null}
                        <br />
                    </div>
                    {/* <div className="mx-7">
                        <p
                            style={{
                                fontWeight: "bold",
                                fontSize: "20px",
                                marginBottom: "10px",
                            }}
                        >
                            Friend Requests
                        </p>
                        {pendingRequests.length > 0 ? (
                            <>
                                {pendingRequests.map((request, index) => (
                                    <div
                                        className="flex items-center gap-4 mb-4"
                                        key={index}
                                        onClick={() =>
                                            navigate(`/user/profile/${request._id}`)
                                        }
                                    >
                                        <Avatar
                                            src={request?.sender.profileImage}
                                            alt={request?.sender.fullName}
                                            radius="xl"
                                            size="lg"
                                        />
                                        <h2
                                            className="text-[#818181] text-lg hover:text-[#ED080B]"
                                            style={{ cursor: "pointer" }}
                                        >
                                            {request?.sender.fullName}
                                        </h2>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <p className="text-sm text-[#818181] ml-2">
                                Looks like you're on the "no one wants to talk to me" list! 😅
                            </p>
                        )}
                    </div> */}
                    <div className="mx-7">
                        <p
                            style={{
                                fontWeight: "bold",
                                fontSize: "20px",
                                marginBottom: "10px",
                            }}
                        >
                            Trending Topics
                        </p>
                        <ol>
                            <li>
                                <a>#Programming</a>
                            </li>
                            <li>#Python</li>
                            <li>#C++</li>
                            <li>#PHP</li>
                            <li>#meme</li>
                            <li>#OOP</li>
                            <li>#SpringBoot</li>
                            <li>#Node_Js</li>
                        </ol>
                    </div>
                    <br />
                    <div className="mx-7">
                        <p
                            style={{
                                fontWeight: "bold",
                                fontSize: "20px",
                                marginBottom: "10px",
                            }}
                        >
                            Friends
                        </p>
                        {user.friends && user.friends.length > 0 ? (
                            <>
                                {user.friends.map((friend, index) => (
                                    <div
                                        className="flex items-center gap-4 mb-4"
                                        key={index}
                                        onClick={() =>
                                            navigate(
                                                `/user/profile/${friend._id}`
                                            )
                                        }
                                    >
                                        <Avatar
                                            src={friend?.profileImage}
                                            alt={friend?.fullName}
                                            radius="xl"
                                            size="lg"
                                        />
                                        <h2
                                            className="text-[#818181] text-lg hover:text-[#ED080B]"
                                            style={{ cursor: "pointer" }}
                                        >
                                            {friend?.fullName}
                                        </h2>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <p className="text-sm text-[#818181] ml-2">
                                Don’t be shy — invite some friends and start
                                building your crew!🚀
                            </p>
                        )}
                    </div>
                </aside>
            )}
        </>
    );
};

export default Sidebar;
