import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import ErrorPage from "./ErrorPage";
import Navbar from "../components/Navbar";
import ImageCarousel from "../components/postComponents/ImageCarousel";
import ReplyComponent from "../components/ReplyComponent";
import Options from "../components/postComponents/Options";
import { Post } from "../classes/post";
import { likePost, dislikePost, getPostById } from "../services/postService";
import { createReply } from "../services/replyService";
import { savePost } from "../services/userService";

import { Avatar } from "@mantine/core";
import { DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined, SendOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';


const PostPage = () => {
    const navigate = useNavigate();
    const { postId } = useParams<{ postId: string }>();
    const [post, setPost] = useState<Post>();

    const [reply, setReply] = useState('');

    const [likeCount, setLikeCount] = useState(0);
    const [dislikeCount, setDislikeCount] = useState(0);

    const [liked, setLiked] = useState(likeCount > 0);
    const [disliked, setDisliked] = useState(dislikeCount > 0);
    const [saved, setSaved] = useState(false);

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleLike = async () => {
        try {
            if (postId) {
                const response = await likePost(postId);
                console.log('Liked', response);
                if(!liked)
                {
                    setLikeCount(likeCount + 1);
                    setLiked(true);
                    if(dislikeCount > 0)
                    {
                        setDislikeCount(dislikeCount - 1);
                        setDisliked(false);
                    }
                } else {
                    setLikeCount(likeCount - 1);
                    setLiked(false);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleDislike = async () => {
        try {
            if (postId) {
                const response = await dislikePost(postId);
                console.log('Disliked', response);
                if(!disliked)
                {
                    setDislikeCount(dislikeCount + 1);
                    setDisliked(true);
                    if(likeCount > 0)
                    {
                        setLikeCount(likeCount - 1);
                        setLiked(false);
                    }
                } else {
                    setDislikeCount(dislikeCount - 1);
                    setDisliked(false);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = async () => {
        try {
            if (postId) {
                const response = await savePost(postId);
                console.log('Saved', response);
                setSaved(!saved);
                saved ? toast.warning("Post unsaved successfully!") : toast.success("Post saved successfully!");
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchPost = async () => {
            try {
                if (postId) {
                    const response = await getPostById(postId);
                    console.log(response);

                    if(response) {
                        setPost(response);
                        setLikeCount(response.likes.length);
                        setDislikeCount(response.dislikes.length);
                        setLiked(response.likes.includes(localStorage.getItem('user_id') ?? ''));
                        setDisliked(response.dislikes.includes(localStorage.getItem('user_id') ?? ''));
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchPost();
    }, [postId]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (postId) {
                await createReply(reply, postId);
                console.log('Replied');
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        post ? (
            <>
                <Navbar />
                <div className="post" style={{ width: '78%', marginLeft: '20%', marginRight: '5%', marginTop: '1%', marginBottom: '5%', padding: '1.5%' }}>
                    <div className="flex items-center gap-1" style={{ marginBottom: '5px'}}>
                        <FontAwesomeIcon 
                            style={{ marginRight: '2%', color: '#ED080B', cursor: 'pointer'}} 
                            onClick={handleGoBack}
                            icon={faArrowLeft}
                        />
                        <Avatar
                            src={post.owner.profileImage}
                            alt={post.owner.fullName}
                            radius="xl"
                            size="md"
                        /> &nbsp;
                        <h2>
                            {post.owner.fullName}
                        </h2>
                        <p className="desc" style={{ marginLeft: 'auto' }}>
                            {post.timestamp}
                        </p>
                        {postId && <Options postId={postId} ownerId={post.owner._id} />}
                    </div>
                    <hr style={{borderColor: '#cecece', backgroundColor: '#cecece', marginTop: '1%', marginBottom: '1%' }}/>
                    <div>
                        <pre style={{ fontFamily: 'Arial', fontSize: '22px', marginBottom: '2.5%' }}>
                            {post.content}
                        </pre>
                        { post.images && ( post.images.length > 0) ? (
                            <div style={{ width: '100%', height: 'auto' }}>
                                { post.images.length > 1 ? (
                                        <ImageCarousel images={ post.images} />
                                    ) : (
                                        <img src={ post.images[0] } alt={ post.content} />
                                ) }
                            </div>
                        ) : null }
                    </div>
                    <hr style={{borderColor: '#cecece', backgroundColor: '#cecece', marginTop: '1%', marginBottom: '1%' }}/>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5%' }}>
                        <div>
                            {liked ? (
                                <LikeFilled className='icons' onClick={handleLike} />
                            ) : (
                                <LikeOutlined className='icons' onClick={handleLike} />
                            )}&nbsp;
                            {likeCount}
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            {disliked ? (
                                <DislikeFilled className='icons' onClick={handleDislike} />
                            ) : (
                                <DislikeOutlined className='icons' onClick={handleDislike} />
                            )}&nbsp;
                            {dislikeCount}
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <button><SendOutlined className='icons' /></button>
                        </div>
                        {saved ? (
                            <i className="fa-solid fa-bookmark" onClick={handleSave} style={{ marginLeft: 'auto', marginRight: '10px', fontSize: '20px' }}></i>
                        ):(
                            <FontAwesomeIcon icon={faBookmarkRegular} onClick={handleSave} style={{ marginLeft: 'auto', marginRight: '10px', fontSize: '20px' }} />
                        )}
                    </div>
                    <div>
                        <h2 style={{ fontWeight: 'bold', fontSize: '25px', textDecoration: 'underline', marginBottom: '2%' }}>
                            Replies
                        </h2>
                        <div>
                            <form onSubmit={onSubmit} className="flex items-center gap-1" style={{ marginBottom: '2%' }}>
                                <input
                                    id='reply'
                                    type='text'
                                    placeholder='Add a reply...'
                                    style={{ width: '96%', border: 'none', outline: 'none', fontSize: '16px' }}
                                    value={reply}
                                    onChange={(e) => setReply(e.target.value)}
                                />&nbsp;&nbsp;
                                <button type='submit' style={{fontSize: '13px', color: '#7808ED', fontWeight: 'bold' }}>Post</button>
                            </form>
                        </div>
                        <ul>
                            {post.replies.map((reply, index) => (
                                <li key={index} style={{ marginBottom: '25px'}}>
                                    <ReplyComponent {...reply} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </>
        ) : <ErrorPage />
    );
};

export default PostPage;