import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { io, Socket } from "socket.io-client";

import ImageCarousel from "./ImageCarousel";
import Options from "./Options";
import ReplyComponent from "../ReplyComponent";
import { dislikePost, likePost } from "../../services/postService";
import { savePost, unsavePost } from "../../services/userService";
import { createReply } from "../../services/replyService";
import { sendMessages } from "../../services/messageService";
import { Post } from "../../classes/post";

import { Avatar } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import {
    LikeOutlined,
    DislikeOutlined,
    SendOutlined,
    LikeFilled,
    DislikeFilled,
} from "@ant-design/icons";
import { createNotification } from "../../services/notificationService";
import { Reply } from "../../classes/reply";

const PostComponent: React.FC<Post & { width: string }> = ({
    _id,
    owner,
    discussionId,
    content,
    likes,
    dislikes,
    replies,
    images,
    timestamp,
    width,
}) => {
    const socket = useRef<Socket | undefined>(undefined);

    const [replyes, setReplyes] = useState<Reply []>(replies);

    const [likeCount, setLikeCount] = useState(likes.length);
    const [dislikeCount, setDislikeCount] = useState(dislikes.length);

    const [liked, setLiked] = useState(likeCount > 0);
    const [disliked, setDisliked] = useState(dislikeCount > 0);

    const [saved, setSaved] = useState(owner.savedPosts?.includes(_id));

    const [reply, setReply] = useState("");

    const [sharePopupOpen, setSharePopupOpen] = useState(false);
    
    useEffect(() => {
        if (localStorage.getItem("user_id")) {
            socket.current = io(import.meta.env.VITE_SOCKET_URL);
            socket.current.emit("add-user", localStorage.getItem("user_id"));
        }
    }, [localStorage.getItem("user_id")]);

    const handleReaction = async (type: "like" | "dislike") => {
        try {
            const response =
                type === "like" ? await likePost(_id) : await dislikePost(_id);
            console.log(`${type}d`, response);
    
            // Define state updates
            const newLikeCount = type === "like"
                ? likeCount + (liked ? -1 : 1)
                : likeCount - (liked ? 1 : 0);
    
            const newDislikeCount = type === "dislike"
                ? dislikeCount + (disliked ? -1 : 1)
                : dislikeCount - (disliked ? 1 : 0);
    
            // Apply state changes
            setLikeCount(newLikeCount);
            setDislikeCount(newDislikeCount);
    
            // Update liked or disliked states
            setLiked(type === "like" ? !liked : liked);
            setDisliked(type === "dislike" ? !disliked : disliked);
    
            // Handle notifications
            if (type === "like" && !liked) {
                localStorage.getItem("user_id") === owner._id ? null : await createNotification(owner._id, "post_like", _id);
            }
    
            // Clear conflicting reactions
            if (type === "like" && disliked) {
                setDislikeCount(dislikeCount - 1);
                setDisliked(false);
            }
            if (type === "dislike" && liked) {
                setLikeCount(likeCount - 1);
                setLiked(false);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = async () => {
        try {
            const response = saved
                ? await unsavePost(_id)
                : await savePost(_id);
            console.log("Success", response.data);

            setSaved(!saved);
            saved
                ? toast.warning("Post unsaved successfully!")
                : toast.success("Post saved successfully!");
        } catch (error) {
            console.error(error);
        }
    };

    const handleShare = async (friend: string, id: string) => {
        const url = `${import.meta.env.VITE_FRONTEND_URL}/post/${id}`;
        const currentTime = new Date();
        const formattedDate = currentTime.toLocaleDateString("en-GB");
        const formattedTime = currentTime
            .toLocaleTimeString("en-GB")
            .split(":")
            .slice(0, 2)
            .join(":");


        try {
            await sendMessages(friend, url);

            socket.current?.emit("send-msg", {
                receiver: friend,
                sender: localStorage.getItem("user_id"),
                content: url,
                date: formattedDate,
                time: formattedTime,
            });

            toast.success("Post shared successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to share post.");
        }
    };

    const handleCopyLink = (id: string) => {
        const url = `${import.meta.env.VITE_FRONTEND_URL}/post/${id}`;

        navigator.clipboard
            .writeText(url)
            .then(() => {
                toast.success("Link copied to clipboard!");
                setSharePopupOpen(false);
            })
            .catch((error) => {
                toast.error("Failed to copy link.");
                console.error(error);
            });
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await createReply(reply, _id);
            console.log("Replied");
            setReplyes([response, ...replyes]);
            localStorage.getItem("user_id") === owner._id ? null : await createNotification(owner._id, "comment", _id);
            setReply("");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div
            className="post bg-white"
            style={{ width: `${width}`, display: "flex", flexDirection: "row" }}
        >
            <div style={{ height: "auto", width: "100%", margin: "5px" }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "5px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "1%",
                        }}
                    >
                        <Avatar
                            src={discussionId.banner}
                            alt={discussionId.title}
                            radius="xl"
                            size="xl"
                            className="border border-black rounded-full"
                        />
                        &nbsp;&nbsp;
                        <div>
                            <Link to={`discussion/${discussionId._id}`} className="font-bold text-2xl hover:text-[#7808ED] cursor-pointer" title={`${discussionId.title}`}>
                                {discussionId.title}
                            </Link>
                            <br />
                            <Link to={`/user/profile/${owner._id}`} className="font-bold text-gray-400 text-sm hover:text-[#ED080B] cursor-pointer" title={`${owner.fullName}`}>
                                {owner.fullName}
                            </Link>
                        </div>
                    </div>
                    <div style={{ display: "flex" }}>
                        <p className="desc">{timestamp}</p>&nbsp;
                        <Options postId={_id} ownerId={owner._id} />
                    </div>
                </div>
                <hr
                    style={{
                        borderColor: "#cecece",
                        backgroundColor: "#cecece",
                    }}
                />
                <br />
                <table style={{ width: "100%", height: "auto" }}>
                    <tbody>
                        <tr>
                            {images && images.length > 0 ? (
                                <td style={{ width: "80%" }}>
                                    {images.length > 1 ? (
                                        <ImageCarousel images={images} />
                                    ) : (
                                        <img
                                            src={images[0]}
                                            alt="Image description"
                                            style={{ width: "100%" }}
                                        />
                                    )}
                                </td>
                            ) : null}
                            <td style={{ width: "20%", verticalAlign: "top" }}>
                                <pre
                                    style={{
                                        fontSize: "18px",
                                        fontFamily: "Arial",
                                        whiteSpace: "pre-wrap",
                                        width: "100%",
                                    }}
                                >
                                    {content}
                                </pre>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <hr
                    style={{
                        borderColor: "#cecece",
                        backgroundColor: "#cecece",
                        marginBottom: "7px",
                    }}
                />
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <div>
                        {liked ? (
                            <LikeFilled
                                className="icons"
                                onClick={() => handleReaction("like")}
                            />
                        ) : (
                            <LikeOutlined
                                className="icons"
                                onClick={() => handleReaction("like")}
                            />
                        )}
                        &nbsp;
                        {likeCount}
                        &nbsp;&nbsp;
                        {disliked ? (
                            <DislikeFilled
                                className="icons"
                                onClick={() => handleReaction("dislike")}
                            />
                        ) : (
                            <DislikeOutlined
                                className="icons"
                                onClick={() => handleReaction("dislike")}
                            />
                        )}
                        &nbsp;
                        {dislikeCount}
                        &nbsp;&nbsp;
                        <Popup
                            trigger={<SendOutlined className="icons" />}
                            open={sharePopupOpen}
                            modal
                            contentStyle={{
                                width: "50%",
                                borderRadius: "10px",
                                padding: "20px",
                            }}
                            onClose={() => setSharePopupOpen(false)}
                        >
                            <div>
                                <div
                                    className="flex items-center gap-4 mb-4"
                                    onClick={() => {
                                        handleCopyLink(_id);
                                    }}
                                >
                                    <Avatar
                                        src="assets\link.png"
                                        alt="Copy Link"
                                        radius="xl"
                                        size="md"
                                    />
                                    <h2
                                        className="text-[#818181] text-lg hover:text-[#ED080B]"
                                        style={{ cursor: "pointer" }}
                                    >
                                        Copy Post Link
                                    </h2>
                                </div>
                                <hr style={{ borderColor: "#a1a1a1" }} />
                                <br />
                                <h2 className="text-[#000000] text-lg mb-3">
                                    Share with Friends
                                </h2>
                                {owner.friends?.map((friend, index) => (
                                    <div
                                        className="flex items-center gap-4 mb-4 ml-4"
                                        key={index}
                                        onClick={() =>
                                            handleShare(friend._id, _id)
                                        }
                                    >
                                        <Avatar
                                            src={friend?.profileImage}
                                            alt={friend?.fullName}
                                            radius="xl"
                                            size="md"
                                        />
                                        <h2
                                            className="text-[#818181] text-lg hover:text-[#ED080B]"
                                            style={{ cursor: "pointer" }}
                                        >
                                            {friend?.fullName}
                                        </h2>
                                    </div>
                                ))}
                            </div>
                        </Popup>
                    </div>
                    {saved ? (
                        <i
                            className="fa-solid fa-bookmark"
                            onClick={handleSave}
                            style={{
                                marginLeft: "auto",
                                marginRight: "10px",
                                fontSize: "20px",
                            }}
                        ></i>
                    ) : (
                        <FontAwesomeIcon
                            icon={faBookmarkRegular}
                            onClick={handleSave}
                            style={{
                                marginLeft: "auto",
                                marginRight: "10px",
                                fontSize: "20px",
                            }}
                        />
                    )}
                </div>
                <form
                    onSubmit={onSubmit}
                    className="flex items-center gap-1"
                    style={{ marginBottom: "2%" }}
                >
                    <input
                        id="reply"
                        type="text"
                        placeholder="Add a reply..."
                        className="comment"
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                    />
                    &nbsp;&nbsp;
                    <button
                        type="submit"
                        style={{
                            fontSize: "13px",
                            color: "#7808ED",
                            fontWeight: "bold",
                        }}
                    >
                        Post
                    </button>
                </form>
                {replyes.length == 0 ? (
                    <p className="desc">
                        {" "}
                        Silence is golden, but a reply is priceless. Be the
                        first to break the ice!{" "}
                    </p>
                ) : replyes.length <= 2 ? (
                    <ul>
                        {replyes.map((reply, index) => (
                            <li key={index} style={{ marginBottom: "25px" }}>
                                <ReplyComponent {...reply} />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <>
                        <ul>
                            {replyes.slice(0, 2).map((reply, index) => (
                                <li
                                    key={index}
                                    style={{ marginBottom: "25px" }}
                                >
                                    <ReplyComponent {...reply} />
                                </li>
                            ))}
                        </ul>
                        <a href={`/post/${_id}`} style={{ color: "#818181" }}>
                            View More...
                        </a>
                    </>
                )}
            </div>
        </div>
    );
};

export default PostComponent;
