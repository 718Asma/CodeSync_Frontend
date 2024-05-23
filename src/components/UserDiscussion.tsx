import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

interface DiscussionProps
{
<<<<<<< HEAD:src/components/Discussion.tsx
    id: string;
    img: string;
=======
    creator: string;
    participants: string[];
>>>>>>> 49ebd5bf54069dac826cf0e46b0c277b927b23ed:src/components/UserDiscussion.tsx
    title: string;
    description: string;
    timestamp: Date;
    banner: string;
}

<<<<<<< HEAD:src/components/Discussion.tsx
const Discussion: React.FC<DiscussionProps> = ({ id, img, title, members }) => {
=======
const UserDiscussion: React.FC<DiscussionProps> = ({ banner, title, participants }) => {
>>>>>>> 49ebd5bf54069dac826cf0e46b0c277b927b23ed:src/components/UserDiscussion.tsx
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
            <Link to={`/discussion/${id}`}>
                <FontAwesomeIcon icon={faExternalLinkAlt} />
            </Link>

        </div>
      </div>
    );
}

export default UserDiscussion;
