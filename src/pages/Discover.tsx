import { useEffect, useState } from "react";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DiscoverDiscussion from "../components/discussionComponents/DiscoverDiscussion";
import DiscussionForm from "../forms/DiscussionForm";
import { Discussion } from "../classes/discussion";
import { getAllDiscussions, getDiscussionByName } from "../services/discussionService";

import { LoadingOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const Discover = () => {
    const [discussions, setDiscussions] = useState<Discussion[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [allRetrieved, setAllRetrieved] = useState(false);

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        const fetchDiscussion = async () => {
            setLoading(true);
            try {
                const discussions = await (searchTerm 
                    ? getDiscussionByName(searchTerm) 
                    : getAllDiscussions(page, 5)
                );
    
                if (discussions.length > 0) {
                    if (searchTerm) {
                        setDiscussions(discussions);
                    } else {
                        setDiscussions(prevDiscussions => {
                            const uniqueDiscussions = discussions.filter(
                                (newDiscussion: Discussion) =>
                                    !prevDiscussions.some(prevPost => prevPost._id === newDiscussion._id)
                            );
                            return [...prevDiscussions, ...uniqueDiscussions];
                        });
                    }
                } else {
                    console.log('No more discussions to fetch.');
                    setAllRetrieved(true);
                }
            } catch (error) {
                console.error('Error fetching discussion:', error);
            } finally {
                setLoading(false); // Ensure loading state is reset
            }
        };
    
        fetchDiscussion();
    }, [page, searchTerm]);

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

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        setPage(1)
    };
    
    return (
        <div className="flex h-screen">
            <Navbar />
            <div className="container mx-auto px-4 py-8" style={{ width: '67%' }}>
                <header className="flex items-center justify-between"> 
                    <h1 className="text-3xl font-bold mb-1">&nbsp;Explore new Discussions</h1>
                    <div>
                        <input
                            type="text"
                            placeholder="Searching..."
                            className="search ml-4"
                            style={{ backgroundColor: '#f0f0f0', border: 'none' }}
                            value={searchTerm}
                            onChange={handleSearchChange}/>
                    </div>
                </header>
                <div className="flex justify-end items-center" style={{ marginBottom: '50px', marginRight: '1%', marginTop: '15px' }}>
                    <button onClick={togglePopup} style={{ color: '#969696' }}><FontAwesomeIcon icon={faPlusCircle} />&nbsp; Create a new discussion</button>
                    <Popup
                        trigger={<div></div>}
                        open={isOpen}
                        modal
                        nested
                        closeOnDocumentClick={false}
                        closeOnEscape={false}
                        onClose={handleClose}
                    >
                        <button onClick={handleClose} style={{ color: '#818181', position: 'absolute', top: '5px', right: '5px', cursor: 'pointer', background: 'transparent', border: '1px white solid', fontSize: '40px' }}>
                            &times;
                        </button>
                        <DiscussionForm />
                    </Popup>
                </div>
                <section> 
                    {discussions.map((discussion, index) => (
                        <div key={index} style={{ flex: '0 0 auto', marginRight: '10px' }}>
                            <DiscoverDiscussion {...discussion} />
                        </div>
                    ))}
                    {loading ? (
                        <LoadingOutlined style={{ fontSize: '50px', marginLeft: '50%', marginTop: '25px', color: '#7808ED' }} />
                    ) : allRetrieved ? (
                        <div style={{ textAlign: 'center', marginTop: '25px', fontFamily: 'cursive', marginBottom: '25px' }}>
                            <p style={{ fontSize: '28px', color: '#7808ED' }}>
                                Woohoo! You've explored everything! 🎉  
                            </p>
                            <p style={{ fontSize: '18px', color: '#7808ED' }}>
                                We hope something sparked your curiosity!
                            </p>
                        </div>
                    ) : null}
                </section>
            </div>
            <Sidebar />
        </div>
    );
};

export default Discover;