import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Discussion from "../components/Discussion";
import Post from "../components/Post";
import "../styles/global.css";

import axios from "../utils/axios";
import redirector from "../utils/redirector";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { BellOutlined, LoadingOutlined } from '@ant-design/icons';

interface DiscussionProps
{
    img: string;
    title: string;
    members: string;
}

interface PostProps
{
    img: string,
    description: string
}

const Home = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const [userId, setUserId] = useState(null);
    // const [discussions, setDiscussions] = useState<DiscussionProps[]>([]);
    // const [posts, setPosts] = useState<PostProps[]>([]);
    
    const user = localStorage.getItem("username");

    const discussions: DiscussionProps[] = [{img: '../assets/maxresdefault.png', title: 'Is PHP dead', members: '15k'},
                        {img: '../assets/LARAVEL_VS_SYMFONY.png', title: 'Laravel VS Symfony ??', members: '52k'},
                        {img: '../assets/1671537942-mern-stack-1-mern-stack.png', title: 'Node Js', members: '152k'},
                        {img: '../assets/maxresdefault.png', title: 'Is PHP dead', members: '15k'},
                        {img: '../assets/LARAVEL_VS_SYMFONY.png', title: 'Laravel VS Symfony ??', members: '52k'},
                        {img: '../assets/1671537942-mern-stack-1-mern-stack.png', title: 'Node Js', members: '152k'}]
                     
    const [posts, setPosts] = useState<PostProps[]>([{img: '../assets/107730523_1684123215077508_2274373016493296102_n.png', description: 'Python now vs Python back then 😂😂'},
                        {img: '../assets/107730523_1684123215077508_2274373016493296102_n.png', description: 'Python now vs Python back then 😂😂'},
                        {img: '../assets/107730523_1684123215077508_2274373016493296102_n.png', description: 'Python now vs Python back then 😂😂'}
    ]);

   /* useEffect(() => {
        redirector(navigate);
        const fetchProtectedData = async () => {
            try {
                const response = await axios.get("/");
                setUserId(response.data.userId);
                setData(response.data);
            } catch (error) {
                console.error("Error fetching protected data:", error);
            }
        };
        fetchProtectedData();
    }, []);*/

    const handleScroll = () => {
        if (
          window.innerHeight + document.documentElement.scrollTop + 1 >=
          document.documentElement.offsetHeight
        ) {
          setLoading(true);
          setTimeout(() => {
            setPosts((prevPosts) => [
              ...prevPosts,
              {img: '../assets/107730523_1684123215077508_2274373016493296102_n.png', description: 'Python now vs Python back then 😂😂'},
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
                        <button 
                            style={{backgroundColor : '#e3e3e3', borderRadius : '50%', padding : '10px', marginLeft : '5px'}}>
                                <BellOutlined style={{fontSize : '20px'}} />
                        </button>
                    </div>
                </header>
                <br/>
                <section style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '0px', marginLeft: '15px' }}>Your discussions</p>
                        <button style={{color : '#969696'}}>
                            Create a new discussion &nbsp;
                            <FontAwesomeIcon icon={faPlusCircle} />
                        </button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row', overflowX: 'auto', maxWidth: '100%' }}>
                        {discussions.map((discussion, index) => (
                            <div key={index} style={{ flex: '0 0 auto', marginRight: '10px' }}>
                                <Discussion id={""} {...discussion} />
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    {posts.map((post, index) => (
                            <div key={index} style={{ flex: '0 0 auto', marginRight: '10px' }}>
                                <Post {...post} />
                            </div>
                    ))}
                {loading && <LoadingOutlined style={{ fontSize: '50px', marginLeft: '50%', marginTop : '25px',  color : '#7808ED' }} />}
                </section>
            </div>
            <Sidebar user={user} />
        </div>
    );
};

export default Home;
