import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Discussion from '../components/Discussion';
import DiscussionSection from '../components/DiscussionSection'; // Importer le composant
import "../styles/global.css";

import axios from '../utils/axios';
import redirector from '../utils/redirector';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { BellOutlined, LoadingOutlined } from '@ant-design/icons';

interface DiscussionProps {
    img: string;
    title: string;
}

interface PostProps {
    discussionId: number;
}

const App = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);
    
    const user = localStorage.getItem("username");

    const discussions: DiscussionProps[] = [
        { img: 'https://via.placeholder.com/150', title: 'Is PHP dead' },
        { img: 'https://via.placeholder.com/150', title: 'Laravel VS Symfony ??' },
        { img: 'https://via.placeholder.com/150', title: 'Node Js' }
    ];

    const [posts, setPosts] = useState<PostProps[]>([
        { discussionId: 1 },
        { discussionId: 2 },
        { discussionId: 3 }
    ]);

    useEffect(() => {
        redirector(navigate);
        const fetchProtectedData = async () => {
            try {
                const response = await axios.get("/");
                setUserId(response.data.userId);
            } catch (error) {
                console.error("Error fetching protected data:", error);
            }
        };
        fetchProtectedData();
    }, [navigate]);

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.offsetHeight) {
            setLoading(true);
            setTimeout(() => {
                setPosts((prevPosts) => [
                    ...prevPosts,
                    { discussionId: 1 }
                ]);
                setPage((prevPage) => prevPage + 1);
                setLoading(false);
            }, 5000);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="flex h-screen">
            <Navbar userId={userId}/>
            <div className="container mx-auto px-4 py-8" style={{ width: '67%' }}>
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">Hello, {user}</h1>
                        <h3>Welcome back to your account</h3>
                    </div>
                    <div>
                        <input type="text" placeholder="Searching" className="search ml-4" style={{ backgroundColor: '#f0f0f0', border: 'none' }}/>
                        <button style={{backgroundColor: '#e3e3e3', borderRadius: '50%', padding: '10px', marginLeft: '5px'}}>
                            <BellOutlined style={{fontSize: '20px'}} />
                        </button>
                    </div>
                </header>
                <br/>
                <section style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '0px', marginLeft: '15px' }}>Your discussions</p>
                        <button style={{color: '#969696'}}>
                            Create a new discussion &nbsp;
                            <FontAwesomeIcon icon={faPlusCircle} />
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', overflowX: 'auto', maxWidth: '100%' }}>
                        {discussions.map((discussion, index) => (
                            <div key={index} style={{ flex: '0 0 auto', marginRight: '10px' }}>
                                <Discussion members={''} id={""} {...discussion} />
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    {posts.map((post, index) => (
                        <div key={index} style={{ flex: '0 0 auto', marginRight: '10px' }}>
                            <DiscussionSection discussionId={post.discussionId} />
                        </div>
                    ))}
                    {loading && <LoadingOutlined style={{ fontSize: '50px', marginLeft: '50%', marginTop: '25px', color: '#7808ED' }} />}
                </section>
            </div>
            <Sidebar user={user} />
        </div>
    );
};

export default App;
