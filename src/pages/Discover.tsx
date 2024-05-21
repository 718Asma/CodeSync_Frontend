import { BellOutlined, LoadingOutlined } from "@ant-design/icons";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DiscoverDiscussion from "../components/DiscoverDiscussion";
import { useEffect, useState } from "react";
import axios from "axios";

interface DiscussionProps
{
    creator: string;
    participants: [];
    title: string;
    description: string;
    timestamp: Date;
    banner: string;
}

const Discover = () => {
    const [discussions, setDiscussions] = useState<DiscussionProps[]>([]);

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDiscussions = async () => {
            try {
                const response = await axios.get(`/discussion/all?page=${page}`);
                if (Array.isArray(response.data)) {
                    setDiscussions(prevDiscussions => [...prevDiscussions, ...response.data]);
                    if (response.data.length === 0) {
                        setLoading(true);
                    } else {
                        setLoading(false);
                    }
                } else {
                    console.error("Unexpected response data:", response.data);
                    setLoading(true);
                }
            } catch (error) {
                console.error("Error fetching discussions:", error);
                setLoading(true);
            }
        };

        fetchDiscussions();
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
    
    return (
        <>
            <div className="flex h-screen">
                <Navbar />
                <div className="container mx-auto px-4 py-8" style={{ width: '67%' }}>
                    <header className="flex items-center justify-between" style={{marginBottom: '100px'}}> 
                        <h1 className="text-3xl font-bold mb-1">&nbsp;Explore new Discussions</h1>
                        <div>
                            <input type="text" placeholder="Searching" className="search ml-4" style={{ backgroundColor: '#f0f0f0', border: 'none' }}/>
                            <button 
                                style={{backgroundColor : '#e3e3e3', marginLeft : '5px', width : '40px', height : '40px'}} 
                                className="rounded-full">
                                    <BellOutlined style={{fontSize : '20px'}} />
                            </button>
                        </div>
                    </header>
                    <section>
                    {discussions.map((discussion, index) => (
                            <div key={index} style={{ flex: '0 0 auto', marginRight: '10px' }}>
                                <DiscoverDiscussion {...discussion} />
                            </div>
                    ))}
                    {loading && <LoadingOutlined style={{ fontSize: '50px', marginLeft: '50%', marginTop : '25px',  color : '#7808ED' }} />}
                    </section>
                </div>
                <Sidebar />
            </div>
        </>
    );
};

export default Discover;