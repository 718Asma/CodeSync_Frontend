import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import { HeartOutlined, MessageOutlined, SendOutlined } from '@ant-design/icons';

interface PostProps {
    img: string;
    description: string;
}

const Post: React.FC<PostProps> = ({ img, description }) => {
    return (
        <div className="post">
            <table>
                <tbody>
                    <tr>
                        <td rowSpan={6} style={{ width: '75%' }}>
                            <img src={img} alt="Post" />
                        </td>
                    </tr>
                    <tr>
                        <td style={{ padding: '5px', height: '100px' }}>
                            <p>Post Owner</p>
                        </td>
                    </tr>
                    <tr>
                        <td className='desc h-20'>
                            <p>{description}</p>
                        </td>
                    </tr>
                    <tr>
                        <td className='h-10'>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div>
                                    <button><HeartOutlined className='icons' /></button>
                                    <button><MessageOutlined className='icons' /></button>
                                    <button><SendOutlined className='icons' /></button>
                                </div>
                                <button style={{ marginLeft: 'auto', marginRight: '10px', fontSize: '20px' }}><FontAwesomeIcon icon={faBookmarkRegular} /></button>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td className='desc'>
                            <p>Comments[]</p>
                        </td>
                    </tr>
                    <tr>
                        <td className='desc h-10'>
                            <p>TimeStamp</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Post;
