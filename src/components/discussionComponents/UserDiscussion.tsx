import React from "react";
import { useNavigate } from "react-router-dom";

import { Discussion } from "../../classes/discussion";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";


const UserDiscussion: React.FC<Discussion> = ({ _id, banner, title, participants }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/discussion/${_id}`);
	};
    
    return (
      <div className="discussion" style={{ 
        backgroundImage: `url(${banner.replace(/\\/g, '/')})`, 
        backgroundSize: 'cover', 
		backgroundPosition: 'center',
        position: 'relative' 
      }}>
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
