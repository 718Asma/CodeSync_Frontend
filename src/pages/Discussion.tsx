import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import DiscussionHeader from '../components/DiscussionHeader';
import DiscussionSection from '../components/DiscussionSection';


const DiscussionPage: React.FC = () => {
  const userId = '123';

  const discussion = {
    id: '456',
    img: "path/to/your/image.jpg",
    title: "Discussion Title",
    description: "Discussion description"
  };

  const post = {
    img: "path/to/your/post/image.jpg",
    description: "Post description"
  };

  return (
    <div className="flex">
      <Navbar userId={userId} />
      <Sidebar user={userId} />
      <div className="flex-grow p-7 flex flex-col items-center">
        <div style={{ width: '80%' }}>
          <DiscussionHeader 
            img={discussion.img}
            title={discussion.title}
            description={discussion.description} discussionId={0}          />
        </div>
        <div style={{ 
          width: '80%', 
          marginTop: '40px', 
          margin: '0 auto', // Pour centrer horizontalement
          height: '400px', // Remplacez 400px par la hauteur souhaitée
}}>
  <DiscussionSection 
    img={post.img} 
    description={post.description} 
  />
</div>
      </div>
    </div>
  );
};

export default DiscussionPage;
