import React from "react";

interface DiscussionProps {
    creator: string;
    participants: string[];
    title: string;
    description: string;
    timestamp: Date;
    banner: string;
}

const DiscoverDiscussion: React.FC<DiscussionProps> = ({ banner, title, description, participants }) => {
    return (
        <div className="explore" style={{ 
            backgroundImage: `url(${banner})`, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            backgroundRepeat: 'no-repeat', 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'flex-end', 
            alignItems: 'flex-start',
            padding: '0px'
        }}>
            <div style={{ 
                width: '100%', 
                background: 'white', 
                padding: '20px',
                borderRadius: '10px',
                margin: '0px',
                border: '1px solid #f1f1f1',
            }}>
                <a href='/' style={{fontWeight: 'bold', fontSize: '24px'}}>{title}</a>
                <p style={{fontSize: '12px', color: 'gray'}}>{description}</p>
            </div>
        </div>
    );
}

export default DiscoverDiscussion;
