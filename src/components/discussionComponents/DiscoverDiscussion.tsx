import React from "react";
import { useNavigate } from "react-router-dom";

import { Discussion } from "../../classes/discussion";

import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const DiscoverDiscussion: React.FC<Discussion> = ({ _id, banner, title, description }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/discussion/${_id}`);
    };

    return (
        <div className="discussionPage" onClick={handleClick} style={{ 
          backgroundImage: `url(${banner.replace(/\\/g, '/')})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          position: 'relative' 
        }}>
            <div className="titleBoxStyle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h2 style={{ fontWeight: 'bold', fontSize:'20px'}}>{title}</h2>
                    <p style={{ fontSize: '15px', color: '#6e6e6e'}}>{description}</p>
                </div>
                <button><FontAwesomeIcon icon={faExternalLinkAlt} style={{fontSize: '20px', marginRight: '5px'}} onClick={handleClick}/></button>
            </div>
        </div>
    );
}

export default DiscoverDiscussion;
