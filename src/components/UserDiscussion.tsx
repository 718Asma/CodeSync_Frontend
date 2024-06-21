import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

interface DiscussionProps
{
    _id: string;
    creator: string;
    participants: string[];
    title: string;
    description: string;
    timestamp: Date;
    banner: string;
}

const UserDiscussion: React.FC<DiscussionProps> = ({ banner, title, participants }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/discussion/${title}`);
      };
    
    return (
      <div className="discussion" style={{ backgroundImage: `url(${banner})`, backgroundSize: 'cover', position : 'relative' }}>
        <div className="titleBoxStyle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={banner} alt={title} className="rounded-full" style={{ objectFit : 'cover', width: '25px', height: '25px', marginRight: '10px' }} />
                <div>
                    <p style={{ marginBottom: '0', fontWeight : 'bold', fontSize : '10px' }}>{title}</p>
                    <p style={{ marginBottom: '0', fontSize : '10px' }}>{participants.length} members</p>
                </div>
            </div>
            <button><FontAwesomeIcon icon={faExternalLinkAlt} onClick={handleClick}/></button>
        </div>
      </div>
    );
}

export default UserDiscussion;
