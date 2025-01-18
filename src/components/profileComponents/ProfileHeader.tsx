import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Popup from "reactjs-popup";

import ReportForm from "../../forms/ReportForm";
import { removeFriend, uploadCoverImage } from "../../services/userService";
import { acceptFriendRequest, deleteFriendRequest, getAllFriendRequests, rejectFriendRequest, sendFriendRequest } from "../../services/friendRequestService";
import { createNotification } from "../../services/notificationService";
import { friendRequest } from "../../classes/friendRequest";
import { User } from "../../classes/user";

type ProfileHeaderProps = {
    data: any;
};
const ProfileHeader = ({ data }: ProfileHeaderProps) => {
    console.log(data);
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [imagePath, setImagePath] = useState("");
    const [isFriend, setIsFriend] = useState(false);
    const [isRequesting, setIsRequesting] = useState(false);
    const [isRequested, setIsRequested] = useState(false);
    const [reportPopupOpen, setReportPopupOpen] = useState(false);
    const userId = localStorage.getItem("user_id");

    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                if(userId){
                    const response = await getAllFriendRequests(userId);
                    console.log(response);

                    // Check if the current user has sent a friend request
                    setIsRequesting(response.some((request: friendRequest) => request.receiver == userId && request.status == 'pending'));

                    // Check if the current user has received a friend request
                    setIsRequested(response.some((request: friendRequest) => request.sender._id == userId && request.status == 'pending'));

                    // Check if the users are already friends
                    setIsFriend(data.friends.some((friend: User) => friend._id === userId));

                    console.log(isFriend, isRequesting, isRequested);
                }
            } catch (error) {
                console.error("Error fetching friend requests:", error);
            }
        };

        fetchFriendRequests();
    }, [data, userId]);

    const handleFileChange = async (e: any) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target) {
                    setImagePath(event.target.result as string);
                }
            };
            reader.readAsDataURL(selectedFile);
            await handleSubmit(selectedFile);
        }
    };

    const handleSubmit = async (selectedFile: File) => {
        try {
            const response = await uploadCoverImage(selectedFile);
            console.log(response.data);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const handleAddFriend = async (friendId: string) => {
        try {
            await sendFriendRequest(friendId);
            toast.success(
                `You’ve just sent a friend request to ${data.fullName}! Now the waiting game begins... ⏳😬`
            );
            userId
                ? await createNotification(friendId, "friend_request_sent", userId)
                : null;
            setIsRequested(true);
        } catch (error) {
            toast.error("Error adding friend! Please try again later.");
            console.error("Error adding friend:", error);
        }
    };

    const handleRemoveFriend = async (friendId: string) => {
        try {
            await removeFriend(friendId);
            toast.warning("You’ve just hit “unfriend” on ${data.fullName}. It’s not you, it’s them. 🙃");
            setIsRequesting(false);
            setIsRequested(false);
            setIsFriend(false);
        } catch (error) {
            toast.error("Error removing friend! Please try again later.");
            console.error("Error removing friend:", error);
        }
    };

    const handleCancel = async (friendId: string) => {
        try {
            const response = await getAllFriendRequests(friendId);
            const request: friendRequest = response.find((request: friendRequest) => request.sender._id === userId);
            
            await deleteFriendRequest(request._id);
            setIsRequested(false);
            toast.warning(
                `Friend request to ${data.fullName} cancelled. Not ready to commit? 👀`
            );
        } catch (error) {
            toast.error("Error removing request! Please try again later.");
            console.error("Error removing request:", error);
        }
    };

    const handleAccept = async (friendId: string) => {
        try {
            const response = await getAllFriendRequests(friendId);
            const request: friendRequest = response.find((request: friendRequest) => request.sender._id === friendId);
            
            if (!request) {
                toast.error("Friend request not found.");
                return;
            }
    
            await acceptFriendRequest(request._id);
            userId
                ? await createNotification(friendId, "friend_request_accepted", userId)
                : null;
            setIsRequesting(false);
            setIsRequested(false);
            setIsFriend(true);
            toast.success(
                `You’ve just leveled up in friendship! 🎉 ${data.fullName} is now in your friend zone.`
            );
        } catch (error) {
            toast.error("Error accepting friend request! Please try again later.");
            console.error("Error accepting friend request:", error);
        }
    };

    const handleReject = async (friendId: string) => {
        try {
            const response = await getAllFriendRequests(friendId);
            const request: friendRequest = response.find((request: friendRequest) => request.sender._id === friendId);
            
            if (!request) {
                toast.error("Friend request not found.");
                return;
            }
    
            await rejectFriendRequest(request._id);
            userId
                ? await createNotification(friendId, "friend_request_rejected", userId)
                : null;
            setIsRequesting(false);
            setIsRequested(false);
            setIsFriend(false);
            toast.warning(
                `You’ve just hit ‘reject’ on a friendship. Maybe next time, ${data.fullName}! 🚫💔`
            );
        } catch (error) {
            toast.error("Error rejecting  friend request! Please try again later.");
            console.error("Error rejecting  friend request:", error);
        }
    };

    const getButtonContent = () => {
        if (isFriend) {
            return (
                <>
                    <button
                        onClick={() => handleRemoveFriend(data._id)}
                        className="bg-white text-secondary-500 font-semibold py-2 px-4 mx-2 border border-secondary-500 rounded-lg hover:bg-secondary hover:text-black hover:border-transparent"
                    >
                        Remove Friend
                    </button>
                    <button
                        onClick={() => navigate("/chat")}
                        className="bg-white text-secondary-500 font-semibold py-2 px-4 mx-2 border border-secondary-500 rounded-lg hover:bg-secondary hover:text-black hover:border-transparent"
                    >
                        Message {data.fullName}
                    </button>
                </>
            );
        }
    
        if (isRequesting) {
            return (
                <>
                    <button
                        onClick={() => handleAccept(data._id)}
                        className="bg-white text-green-500 font-semibold py-2 px-4 mx-2 border border-green-500 rounded-lg hover:bg-secondary hover:text-black hover:border-transparent"
                    >
                        Accept Request
                    </button>
                    <button
                        onClick={() => handleReject(data._id)}
                        className="bg-white text-red-500 font-semibold py-2 px-4 mx-2 border border-red-500 rounded-lg hover:bg-secondary hover:text-black hover:border-transparent"
                    >
                        Reject Request
                    </button>
                </>
            );
        }
    
        if (isRequested) {
            return (
                <button
                    onClick={() => handleCancel(data._id)}
                    className="bg-white text-secondary-500 font-semibold py-2 px-4 mx-2 border border-secondary-500 rounded-lg hover:bg-secondary hover:text-black hover:border-transparent"
                >
                    Cancel Request
                </button>
            );
        }
    
        return (
            <button
                onClick={() => handleAddFriend(data._id)}
                className="bg-white text-secondary-500 font-semibold py-2 px-4 mx-2 border border-secondary-500 rounded-lg hover:bg-secondary hover:text-black hover:border-transparent"
            >
                Add Friend
            </button>
        );
    };

    return (
        <div>
            {data && (
                <div
                    style={{
                        boxShadow: "5px 0px 10px rgba(0, 0, 0, 0.1)",
                        position: "relative",
                    }}
                    className="rounded-xl bg-white w-full"
                >
                    <div
                        style={{ height: "300px" }}
                        className="bg-white-100 rounded-xl "
                    >
                        <img
                            src={imagePath || data.coverImage}
                            alt=""
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            }}
                            className="rounded-t-xl"
                        />
                        <img
                            src={data.profileImage}
                            style={{
                                height: "150px",
                                width: "150px",
                                position: "absolute",
                                top: "225px",
                                left: "12.5%",
                                objectFit: "cover",
                            }}
                            className="bg-white rounded-full"
                        />
                        {data._id == userId && (
                            <div>
                                <form>
                                    <label
                                        style={{
                                            width: "155px",
                                            position: "absolute",
                                            top: "225px",
                                            left: "81%",
                                        }}
                                        htmlFor="cover"
                                        className="cursor-pointer bg-white hover:bg-secondary-500 text-primary-500 font-semibold hover:text-black py-2 px-4  rounded-lg"
                                    >
                                        Edit Cover Photo
                                        <input
                                            type="file"
                                            id="cover"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                </form>
                                <button
                                    style={{
                                        float: "right",
                                        width: "155px",
                                        position: "absolute",
                                        top: "330px",
                                        left: "81%",
                                    }}
                                    className="
                                        bg-white 
                                        text-secondary-500 
                                        font-semibold  
                                        py-2 px-4 
                                        border border-secondary-500
                                        rounded-lg 
                                        hover:bg-secondary hover:text-black hover:border-transparent
                                    "
                                >
                                    Edit Profile
                                </button>
                            </div>
                        )}
                        {data._id != userId && (
                            <div
                                style={{
                                    display: "flex",
                                    float: "right",
                                    width: "50%",
                                    position: "absolute",
                                    top: "330px",
                                    left: isFriend || isRequesting ? "61%" : "81%",
                                }}
                            >
                                {getButtonContent()}
                                {/* {isFriend ? (
                                    <div>
                                        <button
                                            onClick={() => {
                                                handleRemoveFriend(data._id);
                                            }}
                                            className="
                                                bg-white
                                                text-secondary-500
                                                font-semibold
                                                py-2 
                                                px-4
                                                mx-2
                                                border border-secondary-500
                                                rounded-lg 
                                                hover:bg-secondary 
                                                hover:text-black 
                                                hover:border-transparent
                                            "
                                        >
                                            Remove Friend
                                        </button>
                                        <button
                                            onClick={() => {
                                                navigate("/chat");
                                            }}
                                            className="
                                                bg-white
                                                text-secondary-500
                                                font-semibold
                                                py-2 
                                                px-4
                                                mx-2
                                                border border-secondary-500
                                                rounded-lg 
                                                hover:bg-secondary 
                                                hover:text-black 
                                                hover:border-transparent
                                            "
                                        >
                                            Message {data.fullName}
                                        </button>
                                    </div>
                                ) : !isRequesting && !isRequested ? (
                                    <button
                                        onClick={() => {
                                            handleAddFriend(data._id);
                                        }}
                                        className="
                                            bg-white
                                            text-secondary-500
                                            font-semibold
                                            py-2 
                                            px-4
                                            mx-2
                                            border border-secondary-500
                                            rounded-lg 
                                            hover:bg-secondary 
                                            hover:text-black 
                                            hover:border-transparent
                                        "
                                    >
                                        Add Friend
                                    </button>
                                ) : isRequested ? (
                                    <button
                                        onClick={() => {handleCancel(data._id)}}
                                        className="
                                            bg-white
                                            text-secondary-500
                                            font-semibold
                                            py-2 
                                            px-4
                                            mx-2
                                            border border-secondary-500
                                            rounded-lg 
                                            hover:bg-secondary 
                                            hover:text-black 
                                            hover:border-transparent
                                        "
                                    >
                                        Cancel Request
                                    </button>
                                ) : isRequesting ? (
                                    <>
                                        <button
                                            className="
                                                bg-green-500
                                                text-secondary-500
                                                font-semibold
                                                py-2 
                                                px-4
                                                mx-2
                                                border border-secondary-500
                                                rounded-lg 
                                                hover:bg-secondary 
                                                hover:text-black 
                                                hover:border-transparent
                                            "
                                        >
                                            Accept Request
                                        </button>
                                        <button
                                            className="
                                                bg-red-500
                                                text-secondary-500
                                                font-semibold
                                                py-2 
                                                px-4
                                                mx-2
                                                border border-secondary-500
                                                rounded-lg 
                                                hover:bg-secondary 
                                                hover:text-black 
                                                hover:border-transparent
                                            "
                                        >
                                            Reject Request
                                        </button>
                                    </>
                                ) : null} */}
                                <Popup
                                    trigger={
                                        <button
                                            className="mx-2"
                                            style={{ color: "#818181" }}
                                        >
                                            {" "}
                                            <i className="fa fa-ellipsis-v"></i>{" "}
                                        </button>
                                    }
                                    position="bottom center"
                                    contentStyle={{ width: "9%" }}
                                >
                                    <button
                                        style={{ color: "#818181" }}
                                        onClick={() => setReportPopupOpen(true)}
                                    >
                                        {" "}
                                        <i className="fa fa-flag"></i> Report
                                        User{" "}
                                    </button>
                                </Popup>
                                <Popup
                                    trigger={<div></div>}
                                    open={reportPopupOpen}
                                    modal
                                    nested
                                    closeOnDocumentClick={false}
                                    closeOnEscape={false}
                                    onClose={() => setReportPopupOpen(false)}
                                    contentStyle={{
                                        width: "50%",
                                        borderRadius: "10px",
                                        padding: "20px",
                                    }}
                                >
                                    <ReportForm
                                        reported={data._id}
                                        reportedType="User"
                                        closePopup={() =>
                                            setReportPopupOpen(false)
                                        }
                                    />
                                </Popup>
                            </div>
                        )}
                    </div>
                    <div
                        style={{ marginLeft: "25%", height: "100px" }}
                        className="p-4 mt-2"
                    >
                        <p className="font-bold text-xl text-gray-700">
                            {data.fullName}
                        </p>
                        <p className="font-semibold text-md text-gray-700">
                            {data.occupation}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileHeader;
