import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useNavigate } from "react-router-dom";

type DiscussionProps = {
    _id: string;
    creator: string;
    participants: string[];
    title: string;
    description: string;
    timestamp: Date;
    banner: string;
}

const DiscoverDiscussion: React.FC<DiscussionProps> = ({ banner, title, description }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/discussion/${title}`);
    };

    return (
        <div className='discussionPage' style={{ backgroundImage: `url(${banner})`}}>
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
