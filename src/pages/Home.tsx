import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import redirector from "../utils/redirector";
import Popup from 'reactjs-popup';

import { Discussion } from "../classes/discussion";
import { Post } from "../classes/post";
import { getUserProfile } from "../services/userService";
import { getDiscussionByUser } from "../services/discussionService";
import { getAllPosts, getPostsForUser } from "../services/postService";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PostComponent from "../components/postComponents/PostComponent";
import HomeSearchBar from "../components/HomeSearchBar";
import Notification from "../components/Notification";
import UserDiscussion from "../components/discussionComponents/UserDiscussion";
import DiscussionForm from "../forms/DiscussionForm";

import "../styles/global.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { LoadingOutlined, PlusCircleFilled } from '@ant-design/icons';


const Home = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState<any>(null);
    const [discussions, setDiscussions] = useState<Discussion[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [allRetrieved, setAllRetrieved] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    const handleClose = () => {
        setIsOpen(false);
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
        redirector(navigate);

        const fetchUserInfo = async () => {
            const userId = localStorage.getItem("user_id");

            if(userId == null) {
                console.error("No user id found");
            } else {
                const data = await getUserProfile(userId);
                setUser(data);
            }
        };
        
        fetchUserInfo();
    }, []);

    useEffect(() => {
        const fetchDiscussions = async () => {
            try {
                const response = await getDiscussionByUser();
                setDiscussions(response);
            } catch (error) {
                console.error("Error fetching discussions:", error);
            }
        };

        fetchDiscussions();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                
                const posts = discussions.length > 0 
                    ? await getPostsForUser(page, 5) 
                    : await getAllPosts(page, 5);
                
                console.log(posts);
    
                if (posts.length > 0) {
                    setPosts((prevPosts) => [...prevPosts, ...posts]);
                } else {
                    console.log('No more posts to fetch.');
                    setAllRetrieved(true); // All posts fetched
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false); // Stop loading after fetch attempt
            }
        };
    
        fetchPosts();
    }, [page, discussions]);

    if (!user) {
        return <LoadingOutlined style={{ fontSize: '50px', marginLeft: '50%', marginTop: '25px', color: '#7808ED' }} />;
    } else {
        return (
            <div className="flex h-screen">
                <Navbar />
                <div className="container mx-auto px-4 py-8" style={{ width: '67%' }}>
                    <header className="flex items-center justify-between">
                        <div>
                            {user.username ? (
                                <h1 className="text-3xl font-bold mb-1">Hello, {user.username}</h1>
                            ) : (
                                <h1 className="text-3xl font-bold mb-1">Hello, {user.fullName}</h1>
                            )}
                            <h3>Welcome back to your account</h3>
                        </div>
                        <div>
                            <HomeSearchBar />
                            <Notification />
                        </div>
                    </header>
                    <br/>
                    <section style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1%' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '0px', marginLeft: '15px' }}>Your discussions</p>
                            <button onClick={togglePopup} style={{ color: '#969696', marginLeft: 'auto', marginRight: '1.5%' }}><FontAwesomeIcon icon={faPlusCircle} />&nbsp; Create a new discussion</button>
                            <Popup
                                trigger={<div></div>}
                                open={isOpen}
                                modal
                                nested
                                closeOnDocumentClick={false}
                                closeOnEscape={false}
                                onClose={handleClose}
                            >
                                <button onClick={handleClose} style={{ color: '#818181', position: 'absolute', float: 'right', top: '5px', right: '93%', cursor: 'pointer', background: 'transparent', border: '1px white solid', fontSize: '40px' }}>
                                    &times;
                                </button>
                                    <DiscussionForm/>
                            </Popup>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', overflowX: 'auto', maxWidth: '100%' }}>
                            {discussions.length > 0 ? (
                                <>
                                    {
                                        discussions.map((discussion) => (
                                            <div key={discussion._id} style={{ flex: '0 0 auto', marginRight: '10px' }}>
                                                <UserDiscussion {...discussion} />
                                            </div>
                                        ))
                                    }
                                    <NavLink
                                        to="/discover"
                                        style={{ marginBottom: 'auto', marginTop: 'auto', marginLeft: '2.5%', color: '#cecece', fontSize: '350%' }}
                                    >
                                        <span><PlusCircleFilled title="Discover New Discussions Here" /></span>
                                        {/* <span>Discover New Discussions Here</span> */}
                                    </NavLink>
                                </>
                            ) : (
                                <p style={{ fontSize: '20px', marginLeft: 'auto', marginRight: 'auto', marginTop: '50px', marginBottom: '5%' }}>
                                    You have no discussions. Discover new ones <a href="/discover" style={{ textDecoration: 'underline', color: '#ED080B' }}>here</a>.
                                </p>
                            )}
                        </div>
                    </section>
                    <section>
                        {posts.map((post) => (
                            <div key={post._id} style={{ flex: '0 0 auto', marginRight: '10px' }}>
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
                                    width={'90%'}
                                />
                            </div>
                        ))}
                        {loading ? (
                            <LoadingOutlined style={{ fontSize: '50px', marginLeft: '50%', marginTop: '25px', color: '#7808ED' }} />
                        ) : allRetrieved && posts.length != 0 ? (
                            <div style={{ textAlign: 'center', marginTop: '25px', fontFamily: 'cursive', marginBottom: '25px' }}>
                                <p style={{ fontSize: '20px', color: '#7808ED' }}>
                                    That's all for now! Time to dive into new discussions.
                                </p>
                                <Link to="/discover" style={{ fontSize: '18px', color: '#ED080B', fontWeight: 'lighter', textDecoration: 'none' }}>
                                    Explore more discussions <FontAwesomeIcon icon={faArrowRight} />
                                </Link>
                            </div>
                        ) : null}
                    </section>
                </div>
                <Sidebar />
            </div>
        );
    }
};

export default Home;

// Pa$$w0rd!