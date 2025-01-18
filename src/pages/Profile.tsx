import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import ErrorPage from "./ErrorPage";
import ProfileData from "../components/profileComponents/ProfileData";
import ProfileHeader from "../components/profileComponents/ProfileHeader";
import ProfileFriends from "../components/profileComponents/ProfileFriends";
import PostComponent from "../components/postComponents/PostComponent";
import { Post } from "../classes/post";
import { User } from "../classes/user";
import { getUserProfile } from "../services/userService";
import { getPostsByUser } from "../services/postService";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { LoadingOutlined } from '@ant-design/icons';

const Profile = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [data, setData] = useState<User>();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [allRetrieved, setAllRetrieved] = useState(false);
    const [message, setMessage] = useState("")
    

    const handleGoBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 5000);

        return () => clearTimeout(timeout);
    }, []);

    const handleScroll = () => {
        if(window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.offsetHeight)
        {
            setLoading(true);
            setPage(prev => prev + 1);
        }
    };
    
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (userId) {
                    const response = await getUserProfile(userId);
                    setData(response);
                }
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };
        fetchProfile();
    }, [userId]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                if (userId) {
                    const response = await getPostsByUser(userId, page, 5);
                    if (response.length > 0) {
                        setPosts((prevPosts) => [...prevPosts, ...response]);
                    } else {
                        setAllRetrieved(true);
    
                        if (posts.length === 0) {
                            if (localStorage.getItem("user_id") !== userId) {
                                setMessage(`It looks like ${data?.fullName} is still in stealth mode — no posts yet, but we're sure greatness is just around the corner! 🚀`);
                            } else {
                                setMessage("Looks like you haven't shared your thoughts yet. 💭 Time to break the silence and create your first post! 🚀");
                            }
                        } else {
                            setMessage("You’ve reached the end of the timeline! 🎉");
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };
    
        setPosts([]);
        setAllRetrieved(false);
        setPage(1);
        setLoading(true);
    
        fetchPosts();
    }, [userId, page]); 

    return (
        data ? (
                <div className="container mx-auto px-4 py-8 bg-gray-100 w-full">
                    <ProfileHeader data={data} />
                    <div className="flex justify-between mt-4 w-full">
                        <div className="mt-10">
                            <ProfileData data={data} />
                            <ProfileFriends data={data} />
                        </div>
                        <section className="w-full ml-6 px-0 mt-0">
                            {posts.map((post) => (
                                <PostComponent key={post._id} {...post} width="100%" />
                            ))}
                            {loading && (
                                <LoadingOutlined className="text-4xl text-purple-600 mx-auto block mt-6" />
                            )}
                            {allRetrieved && !loading && (
                                <div className="text-center mt-6">
                                    <p className="text-[#7808ED] text-2xl mt-20 mb-4">{message}</p>
                                    { userId === localStorage.getItem("user_id") &&
                                        <Link to="/discover" className="text-[#ED080B] text-xl hover:underline">
                                            Explore more discussions <FontAwesomeIcon icon={faArrowRight} />
                                        </Link>
                                    }
                                </div>
                            )}
                        </section>
                    </div>
                    <button onClick={handleGoBack} className="w-12 fixed top-6 left-6 bg-white border p-2 rounded-lg">
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                </div>
            ) : <ErrorPage />
    );
};

export default Profile;
