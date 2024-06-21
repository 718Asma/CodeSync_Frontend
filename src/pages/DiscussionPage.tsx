import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import Post from '../components/Post';
import { useParams } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';

type DiscussionProps =
{
    _id: string;
    creator: string;
    participants: [];
    title: string;
    description: string;
    timestamp: Date;
    banner: string;
}

type PostProps =
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

const DiscussionPage = () => {
    const { discussionName } = useParams<{ discussionName: string }>();
    const [discussion, setDiscussion] = useState<DiscussionProps>();
    const [posts, setPosts] = useState<PostProps[]>([]);

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDiscussion = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await axios.get('http://localhost:3000/discussion/by-name', {
                    params: { name: discussionName },
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log(response);
                if (response.data) {
                    setDiscussion(response.data.discussions[0]);
                } else {
                    console.error('Unexpected response data:', response.data);
                }
            } catch (error) {
                console.error('Error fetching discussion:', error);
            }
            };
        fetchDiscussion();
    }, []);
      
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`/by-discussion/:discussionId`);
                if (Array.isArray(response.data)) {
                    setPosts(response.data);
                } else {
                    console.error('Unexpected response data:', response.data);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
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

    return (
        discussion ? (
          <>
            <Navbar />
            <header>
                <div className='discussionPage' style={{ backgroundImage: `url(${discussion.banner})`}}>
                    <div className="titleBoxStyle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div>
                                <h2 style={{ fontWeight: 'bold', fontSize:'20px'}}>{discussion.title}</h2>
                                <p style={{ fontSize: '15px', color: '#6e6e6e'}}>{discussion.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <br/><br/>
            <section>
              {posts.map((post, index) => (
                <div key={index} style={{ flex: '0 0 auto', marginRight: '10px' }}>
                  <Post {...post} />
                </div>
              ))}
              {loading && (
                <LoadingOutlined
                  style={{
                    fontSize: '50px',
                    marginLeft: '50%',
                    marginTop: '25px',
                    color: '#7808ED',
                  }}
                />
              )}
            </section>
            <Sidebar />
          </>
        ) : ( null )
      );
};

export default DiscussionPage;
