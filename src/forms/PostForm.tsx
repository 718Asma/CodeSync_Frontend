import { useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import {useDropzone} from 'react-dropzone';

import { createPost, uploadImages } from '../services/postService';

import { CloseOutlined, CloudUploadOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';

type PostFormProps =
{
    discussionId: string;
    currentUrl: string;
};

const PostForm: React.FC<PostFormProps> = ({ discussionId }) => {
    const navigate = useNavigate();
    const [content, setContent] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [errors, setErrors] = useState({ content: "" });

    const validateForm = () => {
        let valid = true;
        let errors = { content: "" };

        if (content.length < 5 || content.length > 500) {
            errors.content = "Content must be between 5 and 500 characters.";
            valid = false;
        }

        setErrors(errors);
        return valid;
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setImages((prev) => prev ? [...prev, ...acceptedFiles] : acceptedFiles);
    }, [setImages, images]);
    
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] }
    });

    const handleRemove = (index: number, e: React.MouseEvent<HTMLSpanElement>) => {
        e.stopPropagation();
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    const onSubmit = async (e: any) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const createPostResponse = await createPost(discussionId, content);

            const postId = createPostResponse.post._id;

            if (images && images.length > 0) {
                const formData = new FormData();
                formData.append("postId", postId);
                images.forEach((image) => {
                    formData.append("images", image);
                });

                const uploadImagesResponse = await uploadImages(postId, images);

                console.log("Upload images response:", uploadImagesResponse);
            }

            console.log("Post created successfully:", createPostResponse);
            navigate(`/post/${postId}`);
            toast.success("Post created successfully!");
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    return (
        <form onSubmit={onSubmit} className="container mt-4" style={{ marginLeft: '18%', padding: '3% 5% 5% 0%' }}>
            <div className="form-group" style={{marginBottom: '30px'}}>
                <label htmlFor="content" style={{fontWeight: 'bold', fontSize: '24px'}}>
                    <i className="fas fa-align-left"></i>&nbsp; Content
                </label>

                <textarea
                    id="content"
                    className="form-control"
                    style={{ width: '75%' }}
                    rows={5}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                {errors.content && <p>{errors.content}</p>}
            </div>

            <div className="form-group" style={{marginBottom: '30px'}}>
                <p style={{fontWeight: 'bold', fontSize: '24px'}}><i className="fas fa-image"></i>&nbsp; Images</p>
                <br />
                {/* <label
                    htmlFor="images"
                    className="cursor-pointer font-semibold py-2"
                    style={{
                        backgroundColor: '#7808ED',
                        borderColor: '#7808ED',
                        height: '45px',
                        borderRadius: '10px',
                        color:'white',
                        textAlign: 'center',
                        padding: '5px',
                        marginTop: '10px',
                    }}
                >
                    Upload Image(s)
                <input
                    id="images"
                    type="file"
                    className="form-control-file hidden"
                    accept="image/*"
                    name="images"
                    multiple
                    onChange={(e) => {
                        if (e.target.files) {
                            setImages(e.target.files);
                        } else {
                            setImages(null);
                        }
                    }}
                /> 
                </label>*/}
                <div {...getRootProps()} style={{ border: '3px #818181 dashed', padding: '10px', textAlign: 'center', width: '75%', height: 'auto', cursor: 'pointer' }}>
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <>
                            <CloudUploadOutlined style={{ fontSize: '50px', color: '#818181', marginBottom: '10px' }} />
                            <p style={{ fontSize: '17px', color: '#818181' }}>Drop files here to upload</p>
                        </>
                    ) : (
                        images && images.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '30px' }}>
                                {images.map((image, index) => (
                                    <div key={index} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', cursor: 'pointer', position: 'relative' }}>
                                        <img src={URL.createObjectURL(image)} alt={image.name} style={{ width: '100px', height: 'auto' }} />
                                        <p style={{ color: '#818181' }}>{image.name}</p>
                                        <CloseOutlined 
                                            onClick={(e) => handleRemove(index, e)}
                                            style={{ 
                                                position: 'absolute', 
                                                top: '5px', 
                                                right: '5px', 
                                                cursor: 'pointer', 
                                                color: 'red' 
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                <CloudUploadOutlined style={{ fontSize: '50px', color: '#818181', marginBottom: '10px' }} />
                                <p style={{ fontSize: '17px', color: '#818181' }}>You can drag and drop files here, or click to select files</p>
                            </>
                        )
                    )}
                </div>
            </div>

            <button
                type="submit"
                className="btn"
                style={{marginTop: '10px',
                        backgroundColor: '#ED080B',
                        borderColor: '#ED080B',
                        fontWeight: 'bold',
                        height: '45px',
                        borderRadius: '10px',
                        color:'white',
                        float: 'right',
                        marginRight: '17%',
                        marginBottom: '10px'
                    }}>
                <i className="fas fa-plus"></i>&nbsp; Create Post</button>
        </form>
    );
};

export default PostForm;