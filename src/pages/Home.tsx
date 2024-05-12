import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Discussion from "../components/Discussion";
import "../styles/global.css";

import axios from "../utils/axios";
import redirector from "../utils/redirector";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

interface DiscussionProps
{
    img: string;
    title: string;
    members: string;
}

const Home = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);
    const [userId, setUserId] = useState(null);
    const user = localStorage.getItem("username");

    const discussions: DiscussionProps[] = [{img: '../assets/maxresdefault.png', title: 'Is PHP dead', members: '15k'},
                        {img: '../assets/LARAVEL_VS_SYMFONY.png', title: 'Laravel VS Symfony ??', members: '52k'},
                        {img: '../assets/1671537942-mern-stack-1-mern-stack.png', title: 'Node Js', members: '152k'}]
                        
    useEffect(() => {
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
    }, []);

    return (
        <div className="flex h-screen">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-1">Hello, {user}</h1>
                        <h3>Welcome back to your account</h3>
                    </div>
                    <div>
                        <input type="text" placeholder="Searching" className="search ml-4" style={{ backgroundColor: '#f0f0f0', border: 'none' }}/>
                        <button 
                            style={{backgroundColor : '#e3e3e3', borderRadius : '50%', padding : '10px', marginLeft : '5px'}}>
                                <FontAwesomeIcon icon={faBell} />
                        </button>
                    </div>
                </header>
                <br/>
                <section>
                    <p style={{ fontWeight: 'bold', marginBottom: '0px', marginLeft: '15px' }}>Your discussions</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        {discussions.map((discussion, index) => (
                            <Discussion key={index} {...discussion} />
                        ))}
                    </div>
                </section>
                <section>
                    
                </section>
            </div>
            <Sidebar user={user} userId={userId}/>
        </div>
    );
};

export default Home;
