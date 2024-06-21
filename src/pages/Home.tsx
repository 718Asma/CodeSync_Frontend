import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Discussion from "../components/UserDiscussion";
import Post from "../components/Post";
import "../styles/global.css";

import axios from "../utils/axios";
import redirector from "../utils/redirector";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { BellOutlined, LoadingOutlined } from '@ant-design/icons';

interface DiscussionProps
{
    _id: string;
    creator: string;
    participants: [];
    title: string;
    description: string;
    timestamp: Date;
    banner: string;
}

interface PostProps
{
    _id: string;
    owner: string;
    discussion: string;
    content: string;
    likes: number;
    dislikes: number;
    images: string[];
    timestamp: Date;
}

const Home = () => {
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState<any>(null);
    // const [discussions, setDiscussions] = useState<DiscussionProps[]>([]);
    const [posts, setPosts] = useState<PostProps[]>([]);

    const discussions: DiscussionProps[] = [
        {_id: '1', creator: '663cf771f92857ccb1716787', participants: [], title: 'Is PHP dead', description: 'A discussion on the current relevance and future of PHP in web development.', timestamp: new Date(), banner: '../assets/maxresdefault.png'},
        {_id: '2', creator: '66463d0e7165e3d5524e432e', participants: [], title: 'Laravel VS Symfony ??', description: 'Comparing the features, performance, and community support of Laravel and Symfony.', timestamp: new Date(), banner: '../assets/LARAVEL_VS_SYMFONY.png'},
        {_id: '3', creator: '663cf771f92857ccb1716787', participants: [], title: 'Node Js', description: 'Exploring the benefits and challenges of using Node.js for server-side development.', timestamp: new Date(), banner: '../assets/1671537942-mern-stack-1-mern-stack.png'},
        {_id: '4', creator: '66463d0e7165e3d5524e432e', participants: [], title: 'Is PHP dead', description: 'A discussion on the current relevance and future of PHP in web development.', timestamp: new Date(), banner: '../assets/maxresdefault.png'},
        {_id: '5', creator: '663cf771f92857ccb1716787', participants: [], title: 'Laravel VS Symfony ??', description: 'Comparing the features, performance, and community support of Laravel and Symfony.', timestamp: new Date(), banner: '../assets/LARAVEL_VS_SYMFONY.png'},
        {_id: '6', creator: '66463d0e7165e3d5524e432e', participants: [], title: 'Node Js', description: 'Exploring the benefits and challenges of using Node.js for server-side development.', timestamp: new Date(), banner: '../assets/1671537942-mern-stack-1-mern-stack.png'}
      ];

    const handleClick = () => {
      navigate('/createDiscussion');
    };
    
    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 5000);

        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        redirector(navigate);
        const fetchUserInfo = async () => {
            const userId = localStorage.getItem("user_id");
            if(userId == null) {
                console.error("No user id found");
            }
            const {data} = await axios.get(`/user/profile/${userId}`);
            setUser(data.data);
            localStorage.setItem("user_id", data.data._id);
            localStorage.setItem("username", data.data.fullName);
            localStorage.setItem("profileImage", data.data.profileImage);
        };
        
        fetchUserInfo();
    }, []);

    // useEffect(() => {
    //     const fetchDiscussions = async () => {
    //         try {
    //             const response = await axios.get("/discussion/user");
    //             console.log(response.data);
    //             setDiscussions(response.data);
    //         } catch (error) {
    //             console.error("Error fetching discussions:", error);
    //         }
    //     };

    //     fetchDiscussions();
    // }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`/posts?page=${page}`);
                setPosts(response.data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        fetchPosts();
    }, [page]);

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

    if(!user){
        return <LoadingOutlined style={{ fontSize: '50px', marginLeft: '50%', marginTop : '25px',  color : '#7808ED' }} />
    }
    else{
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
                        )
                        }   
                        <h3>Welcome back to your account</h3>
                    </div>
                    <div>
                        <input type="text" placeholder="Searching" className="search ml-4" style={{ backgroundColor: '#f0f0f0', border: 'none' }}/>
                        <button 
                            style={{backgroundColor : '#e3e3e3', marginLeft : '5px', width : '40px', height : '40px'}} 
                            className="rounded-full"
                            >
                                <BellOutlined style={{fontSize : '20px'}} />
                        </button>
                    </div>
                </header>
                <br/>
                <section style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '0px', marginLeft: '15px' }}>Your discussions</p>
                        <button style={{color : '#969696'}} onClick={handleClick}>
                            Create a new discussion &nbsp;
                            <FontAwesomeIcon icon={faPlusCircle} />
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', overflowX: 'auto', maxWidth: '100%' }}>
                        {discussions.length > 0 ? (
                            discussions.map((discussion, index) => (
                                <div key={index} style={{ flex: '0 0 auto', marginRight: '10px' }}>
                                    <Discussion {...discussion} />
                                </div>
                            ))
                        ) : (
                            <p style={{ fontSize: '20px', marginLeft: 'auto', marginRight: 'auto', marginTop:'50px' }}>
                                        You have no discussions. Discover new ones <a href="/" style={{ textDecoration: 'underline', color: '#ED080B' }}>here</a>.
                            </p>
                        )}
                    </div>
                </section>
                <br/><br/>
                <section>
                    {posts.map((post, index) => (
                            <div key={index} style={{ flex: '0 0 auto', marginRight: '10px' }}>
                                <Post {...post} />
                            </div>
                    ))}
                    {loading && <LoadingOutlined style={{ fontSize: '50px', marginLeft: '50%', marginTop : '25px',  color : '#7808ED' }} />}
                </section>
            </div>
            <Sidebar />
        </div>
    );
}
};

export default Home;

// Pa$$w0rd!