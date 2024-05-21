import { LeftCircleFilled, RightCircleFilled } from '@ant-design/icons';
import { useState } from 'react';

const ImageCarousel = ({ images }: { images: string[] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    };

    return (
        <div style={{ position: 'relative', width: 'auto', height: 'auto' }}>
            <table>
                <tbody>
                    <tr>
                        <td style={{padding: 'auto'}}>
                            <button onClick={prevImage} style={{ position: 'absolute', top: '50%', left: '10px', zIndex: 1, fontSize: '24px'}}>
                                <LeftCircleFilled style={{fontSize: '24px', color:'#ababab'}}/>
                            </button>
                        </td>
                        <td>
                            <img
                                src={images[currentIndex]}
                                alt="Post"
                                // style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </td>
                        <td style={{padding: 'auto'}}>
                            <button onClick={nextImage} style={{ position: 'absolute', top: '50%', right: '10px', zIndex: 1, fontSize: '24px' }}>
                                <RightCircleFilled style={{fontSize: '24px', color:'#ababab'}}/>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ImageCarousel;