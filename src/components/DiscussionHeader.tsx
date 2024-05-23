// DiscussionHeader.tsx
import React from 'react';

interface DiscussionHeaderProps {
    img: string;
    discussionId: number;
}

const DiscussionHeader: React.FC<DiscussionHeaderProps> = ({ img, discussionId }) => {
    
    const getImageUrlById = (id: number) => {
        switch (id) {
            case 1:
                return '../assets/LARAVEL_VS_SYMFONY.png';
            case 2:
                return '../assets/LARAVEL_VS_SYMFONY.png';
            case 3:
                return  '../assets/LARAVEL_VS_SYMFONY.png';
            default:
                return '../assets/LARAVEL_VS_SYMFONY.png';
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
                return { title: ' Laravel VS Symfony ??', description: '   This comparison examines the two popular PHP frameworks, Laravel and Symfony. Both frameworks have their own strengths and weaknesses. Laravel is known for its simplicity, ease of use, and a large ecosystem of extensions and packages. On the other hand, Symfony is known for its flexibility, scalability, and robust architecture, making it suitable for large-scale enterprise applications.  ' };
        }
    };

    const imageUrl = getImageUrlById(discussionId);
    const { title, description } = getTitleAndDescriptionById(discussionId);

    return (
        <div className="discussion" style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', position: 'relative', height: '300px', width: '80%', margin: '0 auto' }}>
            <div className="titleBoxStyle" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
               
                <div>
                    <p style={{ marginBottom: '5px', fontWeight: 'bold', fontSize: '16px' }}>{title}</p>
                    <p style={{ marginBottom: '0', fontWeight: 'bold', fontSize: '10px' }}>{description}</p>
                </div>
            </div>
        </div>
    );
}

export default DiscussionHeader;
