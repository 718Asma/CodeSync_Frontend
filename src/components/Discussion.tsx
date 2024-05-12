import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

interface DiscussionProps
{
    img: string;
    title: string;
    members: string;
}

const Discussion: React.FC<DiscussionProps> = ({ img, title, members }) => {
    return (
      <div className="discussion" style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover', position : 'relative' }}>
        <div className="titleBoxStyle" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={img} alt="Discussion" style={{ width: '10%', height: '10%', borderRadius: '50%', marginRight: '10px' }} />
                <div>
                    <p style={{ marginBottom: '0', fontWeight : 'bold', fontSize : '10px' }}>{title}</p>
                    <p style={{ marginBottom: '0', fontSize : '10px' }}>{members}</p>
                </div>
            </div>
            <a><FontAwesomeIcon icon={faExternalLinkAlt} /></a>
        </div>
      </div>
    );
}

export default Discussion;
