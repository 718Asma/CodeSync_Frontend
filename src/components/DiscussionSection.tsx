import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import { HeartOutlined, MessageOutlined, SendOutlined } from '@ant-design/icons';
import "../styles/global.css";

interface DiscussionSectionProps {
    discussionId: number;
}

const DiscussionSection: React.FC<DiscussionSectionProps> = ({ discussionId }) => {
    
    const getImageUrlById = (id: number) => {
        switch (id) {
            case 1:
                return '../assets/maxresdefault.png';
            default:
                return '../assets/laravel.png';
        }
    };

    const getTitleAndDescriptionById = (id: number) => {
        switch (id) {
            case 1:
                return { title: 'Discussion 1', description: 'Description for discussion 1' };
            case 2:
                return { title: 'Discussion 2', description: 'Description for discussion 2' };
            case 3:
                return { title: 'Discussion 3', description: 'Description for discussion 3' };
            default:
                return { title: 'Yorna Salouej', description: 'Laravel is an open-source web framework written in PHP' };
        }
    };

    const imageUrl = getImageUrlById(discussionId);
    const { title, description } = getTitleAndDescriptionById(discussionId);

    return (
        <div className="post">
            <table>
                <tbody>
                    <tr>
                        <td rowSpan={6} className="post-image-cell">
                        <img src={imageUrl} alt="Post" className="post-image" style={{ width: '700px', height: '400px' }} />
                        </td>
                    </tr>
                    <tr>
                        <td className="post-owner">
                            <p>{title}</p>
                        </td>
                    </tr>
                    <tr>
                        <td className='post-description'>
                            <p>{description}</p>
                        </td>
                    </tr>
                    <tr>
                        <td className='post-icons'>
                            <div className="icon-container">
                                <div>
                                    <button><HeartOutlined className='icons' /></button>
                                    <button><MessageOutlined className='icons' /></button>
                                    <button><SendOutlined className='icons' /></button>
                                </div>
                                <button className="bookmark-button"><FontAwesomeIcon icon={faBookmarkRegular} /></button>
                            </div>
                        </td>
                    </tr>
                   
                    <tr>
                        <td className='post-timestamp'>
                            <p>2 PM</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default DiscussionSection;
