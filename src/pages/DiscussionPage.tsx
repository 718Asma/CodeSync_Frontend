import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

import ErrorPage from "./ErrorPage";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PostComponent from "../components/postComponents/PostComponent";
import PostForm from "../forms/PostForm";
import { Post } from "../classes/post";
import { Discussion } from "../classes/discussion";
import {
    deleteDiscussion,
    getDiscussionById,
    joinLeaveDiscussion,
} from "../services/discussionService";
import { getPostsByDiscussion } from "../services/postService";

import { LoadingOutlined } from "@ant-design/icons";

const DiscussionPage = () => {
    const navigate = useNavigate();

    const { discussionId } = useParams<{ discussionId: string }>();
    const [discussion, setDiscussion] = useState<Discussion>();

    const userId = localStorage.getItem("user_id");
    const [exists, setExists] = useState<boolean>(false);

    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [allRetrieved, setAllRetrieved] = useState(false);

    const [isOpenPost, setIsOpenPost] = useState(false);
    const [isOpenDelete, setIsOpenDelete] = useState(false);
    const [isOpenLeave, setIsOpenLeave] = useState(false);

    const togglePopup = (popupType: string) => {
        switch (popupType) {
            case "post":
                setIsOpenPost((prev) => !prev);
                break;
            case "delete":
                setIsOpenDelete((prev) => !prev);
                break;
            case "leave":
                setIsOpenLeave((prev) => !prev);
                break;
            default:
                break;
        }
    };

    const handleClose = (popupType: string) => {
        switch (popupType) {
            case "post":
                setIsOpenPost(false);
                break;
            case "delete":
                setIsOpenDelete(false);
                break;
            case "leave":
                setIsOpenLeave(false);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        const fetchDiscussion = async () => {
            try {
                if (discussionId) {
                    const response = await getDiscussionById(discussionId);

                    if (response) {
                        setDiscussion(response);

                        const userExists = response.participants.some(
                            (participant: { _id: string | null }) =>
                                userId === participant._id
                        );
                        setExists(userExists);
                    } else {
                        console.error(
                            "Unexpected response data:",
                            response.data
                        );
                    }
                }
            } catch (error) {
                console.error("Error fetching discussion:", error);
            }
        };

        fetchDiscussion();
    }, [discussionId, userId]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                if (discussionId) {
                    const posts = await getPostsByDiscussion(
                        discussionId,
                        5,
                        page
                    );

                    if (posts.length > 0) {
                        setPosts((prevPosts) => {
                            const uniquePosts = posts.filter(
                                (post) =>
                                    !prevPosts.some(
                                        (prevPost) => prevPost._id === post._id
                                    )
                            );
                            return [...prevPosts, ...uniquePosts];
                        });
                    } else {
                        console.log("No more posts to fetch.");
                        setLoading(false);
                        setAllRetrieved(true);
                    }
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
                setLoading(false);
            }
        };

        fetchPosts();
    }, [page, discussionId]);

    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop + 1 >=
            document.documentElement.scrollHeight
        ) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleDelete = async () => {
        try {
            if (discussionId) {
                await deleteDiscussion(discussionId);
                console.log("Discussion deleted successfully!");
                toast.warning("Discussion deleted successfully!");
                navigate("/");
            }
        } catch (error) {
            console.error("Error deleting discussion:", error);
        }
    };

    const handleJoinLeave = async () => {
        try {
            if (discussionId) {
                const response = await joinLeaveDiscussion(discussionId);
                console.log(response);
                setExists(!exists);
                if (exists) {
                    toast.warning("Discussion left successfully!");
                    navigate("/");
                } else {
                    toast.success("Discussion joined successfully!");
                }
            }
        } catch (error) {
            console.error("Error joining/leaving discussion:", error);
        }
    };

    return discussion ? (
        <>
            <Navbar />
            <div>
                <header>
                    <div
                        className="discussionPage"
                        style={{
                            backgroundImage: `url(${discussion.banner.replace(
                                /\\/g,
                                "/"
                            )})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            position: "relative",
                            width: "60%",
                        }}
                    >
                        <div
                            className="titleBoxStyle"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <div style={{ flex: "1" }}>
                                <h2
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: "1.7rem",
                                        marginBottom: "1%",
                                        fontFamily: "cursive",
                                    }}
                                >
                                    {discussion.title} &nbsp;
                                    {/* {discussion.creator._id === localStorage.getItem('user_id') ? (
                                    <button><i className="fa-solid fa-pen" style={{ fontSize: '14px', color: '#818181' }}></i></button>
                                ) : null
                            } */}
                                </h2>
                                <pre
                                    style={{
                                        fontFamily: "Arial",
                                        fontSize: "0.8rem",
                                        color: "#6e6e6e",
                                        marginLeft: '1%'
                                    }}
                                >
                                    {discussion.description} &nbsp;
                                    {/* {discussion.creator._id === localStorage.getItem('user_id') ? (
                                    <button><i className="fa-solid fa-pen" style={{ fontSize: '14px', color: '#818181' }}></i></button>
                                ) : null
                            } */}
                                </pre>
                            </div>
                            {discussion.creator._id ===
                            localStorage.getItem("user_id") ? (
                                <>
                                    <button
                                        onClick={() => togglePopup("delete")}
                                        className="btn btn-danger"
                                        style={{ marginRight: "10px" }}
                                    >
                                        <i className="fas fa-trash"></i>&nbsp;
                                        Delete
                                    </button>

                                    <Popup
                                        trigger={<div></div>}
                                        open={isOpenDelete}
                                        modal
                                        nested
                                        closeOnDocumentClick={false}
                                        closeOnEscape={false}
                                        onClose={() => handleClose("delete")}
                                        contentStyle={{
                                            width: "auto",
                                            height: "auto",
                                        }}
                                    >
                                        <div className="p-4 bg-white rounded-md shadow-md">
                                            <p
                                                className="lead"
                                                style={{ fontWeight: "bold" }}
                                            >
                                                Are you sure you want to delete
                                                the "{discussion.title}"
                                                discussion?
                                            </p>
                                            <div className="mt-4 flex justify-end gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleClose("delete")
                                                    }
                                                    className="btn btn-secondary"
                                                    style={{
                                                        marginRight: "10px",
                                                    }}
                                                >
                                                    <i
                                                        className="fa fa-times"
                                                        aria-hidden="true"
                                                    ></i>
                                                    &nbsp; Cancel
                                                </button>
                                                <button
                                                    onClick={handleDelete}
                                                    className="btn btn-danger"
                                                    style={{
                                                        marginRight: "10px",
                                                    }}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                    &nbsp; Delete
                                                </button>
                                            </div>
                                        </div>
                                    </Popup>
                                </>
                            ) : exists ? (
                                <>
                                    <button
                                        onClick={() => togglePopup("leave")}
                                        className="btn btn-danger"
                                        style={{ marginRight: "10px" }}
                                    >
                                        <i className="fas fa-sign-out"></i>
                                        &nbsp; Leave
                                    </button>
                                    <Popup
                                        trigger={<div></div>}
                                        open={isOpenLeave}
                                        modal
                                        nested
                                        closeOnDocumentClick={false}
                                        closeOnEscape={false}
                                        onClose={() => handleClose("leave")}
                                        contentStyle={{
                                            width: "auto",
                                            height: "auto",
                                        }}
                                    >
                                        <p
                                            className="lead"
                                            style={{ fontWeight: "bold" }}
                                        >
                                            Are you sure you want to leave the "
                                            {discussion.title}" discussion?
                                        </p>
                                        <br />
                                        <button
                                            onClick={handleJoinLeave}
                                            className="btn btn-danger"
                                            style={{ marginRight: "10px" }}
                                        >
                                            <i className="fas fa-sign-out"></i>
                                            &nbsp; Leave
                                        </button>
                                        <button
                                            onClick={() => handleClose("leave")}
                                            className="btn btn-secondary"
                                            style={{ marginRight: "10px" }}
                                        >
                                            <i
                                                className="fa fa-times"
                                                aria-hidden="true"
                                            ></i>
                                            &nbsp; Cancel
                                        </button>
                                    </Popup>
                                </>
                            ) : (
                                <button
                                    onClick={handleJoinLeave}
                                    className="btn btn-danger"
                                    style={{ marginRight: "10px" }}
                                >
                                    <i className="fas fa-sign-in"></i>&nbsp;
                                    Join
                                </button>
                            )}
                        </div>
                    </div>
                    <div
                        style={{
                            color: "#969696",
                            marginLeft: "67.5%",
                            marginTop: "0.5%",
                        }}
                    >
                        <button onClick={() => togglePopup("post")}>
                            <i className="fas fa-plus-circle"></i>&nbsp; Upload
                            a new post
                        </button>
                        <Popup
                            trigger={<div></div>}
                            open={isOpenPost}
                            modal
                            nested
                            closeOnDocumentClick={false}
                            closeOnEscape={false}
                            onClose={() => handleClose("post")}
                        >
                            <button
                                onClick={() => handleClose("post")}
                                style={{
                                    color: "#818181",
                                    position: "absolute",
                                    float: "right",
                                    top: "5px",
                                    right: "93%",
                                    cursor: "pointer",
                                    background: "transparent",
                                    border: "1px white solid",
                                    fontSize: "40px",
                                }}
                            >
                                &times;
                            </button>
                            {discussionId ? (
                                <PostForm
                                    discussionId={discussionId}
                                    currentUrl={window.location.href}
                                />
                            ) : null}
                        </Popup>
                    </div>
                </header>
                <br />
                <br />
                <section>
                    {posts.length > 0 ? (
                        posts.map((post, index) => (
                            <div
                                key={index}
                                style={{
                                    flex: "0 0 auto",
                                    marginRight: "10px",
                                }}
                            >
                                <PostComponent
                                    _id={post._id}
                                    owner={post.owner}
                                    discussionId={post.discussionId}
                                    content={post.content}
                                    likes={post.likes}
                                    dislikes={post.dislikes}
                                    replies={post.replies}
                                    images={post.images}
                                    timestamp={post.timestamp}
                                    width={"50%"}
                                />
                            </div>
                        ))
                    ) : !loading && allRetrieved ? (
                        <div
                            style={{
                                textAlign: "center",
                                marginTop: "2.5%",
                                fontFamily: "cursive",
                                color: "#7808ED",
                                fontSize: "1.5rem",
                            }}
                        >
                            <p>It’s awfully quiet in here... &#x1f997;</p>
                            <p
                                className="cursor-pointer hover:underline"
                                onClick={() => togglePopup("post")}
                            >
                                Why not be the hero "{discussion.title}"
                                deserves and drop the first post?
                            </p>
                        </div>
                    ) : null}
                    {loading && (
                        <LoadingOutlined
                            style={{
                                fontSize: "50px",
                                marginLeft: "50%",
                                marginTop: "25px",
                                color: "#7808ED",
                            }}
                        />
                    )}
                    {allRetrieved && posts.length > 0 && !loading && (
                        <div
                            style={{
                                textAlign: "center",
                                marginTop: "25px",
                                fontFamily: "cursive",
                                marginBottom: "25px",
                            }}
                        >
                            <p style={{ fontSize: "20px", color: "#7808ED" }}>
                                Woohoo! You've unraveled all of{" "}
                                {discussion.title}'s secrets! 🎉
                            </p>
                            <Link to="/discover">
                                <span
                                    style={{
                                        fontSize: "18px",
                                        color: "#ED080B",
                                        fontWeight: "lighter",
                                    }}
                                >
                                    Feel like diving into another discussion?
                                </span>
                            </Link>
                        </div>
                    )}
                </section>
            </div>
            <Sidebar />
        </>
    ) : (
        <ErrorPage />
    );
};

export default DiscussionPage;
