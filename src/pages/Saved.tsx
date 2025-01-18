import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PostComponent from "../components/postComponents/PostComponent";
import { Post } from "../classes/post";
import { getSavedPosts } from "../services/userService";

import { LoadingOutlined } from "@ant-design/icons";


const Saved = () => {
    const { userId } = useParams<{ userId: string }>();
    const [savedPosts, setSavedPosts] = useState<Post[]>([]);

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [allRetrieved, setAllRetrieved] = useState(false);

    useEffect(() => {
        const fetchSavedPosts = async () => {
            try {
                if (userId) {
                    const newPosts = await getSavedPosts(userId, page, 5);
                    console.log(newPosts);
                    
                    if (newPosts.length > 0) {
                        setSavedPosts(prevPosts => {
                            const uniquePosts = newPosts.filter(newPost => !prevPosts.some(prevPost => prevPost._id === newPost._id));
                            return [...prevPosts, ...uniquePosts];
                        });
                    } else {
                        console.log('No more posts to fetch.');
                        setLoading(false);
                        setAllRetrieved(true);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };

        if (userId) {
            fetchSavedPosts();
        }
    }, [userId, page]);

    const handleScroll = () => {
        if(window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight)
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
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 5000);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <>
            <Navbar/>
            <div className="container mx-auto px-4 py-8" style={{ width: '67%' }}>
                {savedPosts.length > 0 ? (
                    <section>
                        {savedPosts.map((post) => (
                            <div key={post._id} style={{ flex: '0 0 auto', marginRight: '10px' }}>
                                <PostComponent
                                    _id={post._id}
                                    owner={post.owner}
                                    discussion={post.discussion}
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
                    </section>
                ) : (
                    <div style={{ textAlign: 'center', marginTop: '25px', fontFamily: 'cursive', marginBottom: '25px' }}>
                        <img src='..\..\assets\shopping.png' alt='Nada!' style={{ marginLeft: 'auto', marginRight: 'auto', width: '25%' }}/>
                        <p style={{ fontSize: '20px', color: '#7808ED' }}>
                            Uh-oh, looks like your saved posts folder is as empty as a Monday morning inbox!
                        </p>
                        <Link to="/" style={{ fontSize: '18px', color: '#ED080B', fontWeight: 'lighter', textDecoration: 'none' }}>
                            Time to start curating those unforgettable moments!
                        </Link>
                    </div>
                )}
    
                {loading && (
                    <LoadingOutlined style={{ fontSize: '50px', marginLeft: '50%', marginTop: '25px', color: '#7808ED' }} />
                )}
    
                {allRetrieved && savedPosts.length !== 0 ? (
                    <div style={{ textAlign: 'center', marginTop: '25px', fontFamily: 'cursive', marginBottom: '25px' }}>
                        <p style={{ fontSize: '20px', color: '#7808ED' }}>
                            Mission accomplished! You've scrolled through your saved posts.
                        </p>
                        <Link to="/" style={{ fontSize: '18px', color: '#ED080B', fontWeight: 'lighter', textDecoration: 'none' }}>
                            Now, head back to the homepage and continue saving memories!
                        </Link>
                    </div>
                ) : null}
            </div>
            <Sidebar/>
        </>
    );    
};

export default Saved;