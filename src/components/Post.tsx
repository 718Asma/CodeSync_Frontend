import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import { LikeOutlined, DislikeOutlined, SendOutlined } from '@ant-design/icons';
import ImageCarousel from './ImageCarousel';
import axios from 'axios';

interface PostProps
{
    id: string;
    owner: string;
    discussion: string;
    content: string;
    likes: number;
    dislikes: number;
    images: string[];
    timestamp: Date;
}

const Post: React.FC<PostProps> = ({ id, owner, discussion, images, content, likes, dislikes, timestamp }) => {
    
    const handleLike = () => {
        const addLike = async () => {
            try {
                await axios.put(`/post/like/${id}`);
                console.log('Liked');
            } catch (error) {
                console.error(error);
            }
        }

        addLike();
    }

    const handleDislike = () => {
        const addDislike = async () => {
            try {
                await axios.put(`/post/dislike/${id}`);
                console.log('Disliked');
            } catch (error) {
                console.error(error);
            }
        }

        addDislike;
    }
    return ( 
        <div className="post">
            {images && (images.length > 0) ? (
                <table style={{height: '500px'}}>
                    <tbody>
                            <tr>
                                <td rowSpan={6} style={{ width: '75%' }}>
                                    {images.length > 1 ? (
                                        <ImageCarousel images={images} />
                                    ) : (
                                        <img src={images[0]} alt={content} />
                                    )}
                                </td>
                            </tr>
                        
                        <tr>
                            <td style={{ padding: '5px', height: '50px' }}>
                                <p>{owner}</p>
                            </td>
                        </tr>
                        <tr>
                            <td className='desc'>
                                <p>{content}</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div>
                                        <button><LikeOutlined onClick={handleLike} className='icons' /> {likes}</button>
                                        <button><DislikeOutlined onClick={handleDislike} className='icons' /> {dislikes}</button>
                                        <button><SendOutlined className='icons' /></button>
                                    </div>
                                    <button style={{ marginLeft: 'auto', marginRight: '10px', fontSize: '20px' }}>
                                        <FontAwesomeIcon icon={faBookmarkRegular} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style={{height: '200px'}}>
                                <p></p>
                            </td>
                        </tr>
                        <tr>
                            <td className='desc'>
                                <p>{timestamp.toUTCString()}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            ) : (
                <div style={{height:'auto'}}>
                    <div>
                        {owner}
                    </div>
                    <br/>
                    <div>
                        {content}
                    </div>
                    <br/>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div>
                            <button><LikeOutlined onClick={handleLike} className='icons' /> {likes}</button>
                            <button><DislikeOutlined onClick={handleDislike} className='icons' /> {dislikes}</button>
                            <button><SendOutlined className='icons' /></button>
                        </div>
                        <button style={{ marginLeft: 'auto', marginRight: '10px', fontSize: '20px' }}>
                            <FontAwesomeIcon icon={faBookmarkRegular} />
                        </button>
                    </div>
                    <div>
                        <p></p>
                    </div>
                    <div className='desc'>
                        <p>{timestamp.toUTCString()}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Post;
