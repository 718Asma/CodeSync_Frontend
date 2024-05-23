import { useState } from "react";
import axios from "../utils/axios";

const PostForm = () => {
    const [discussionId, setDiscussionId] = useState("");
    const [content, setContent] = useState("");
    const [images, setImages] = useState<FileList | null>(null);
    const [errors, setErrors] = useState({ discussionId: "", content: "" });

    const validateForm = () => {
        let valid = true;
        let errors = { discussionId: "", content: "" };

        if (!discussionId) {
            errors.discussionId = "Discussion ID is required.";
            valid = false;
        }
        if (content.length < 5 || content.length > 500) {
            errors.content = "Content must be between 5 and 500 characters.";
            valid = false;
        }

        setErrors(errors);
        return valid;
    };

    const onSubmit = async (e: any) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const createPostResponse = await axios.post("/post/create", {
                discussionId,
                content,
            });

            const postId = createPostResponse.data.post._id;

            // if (images && images.length > 0) {
            //     const formData = {
            //         postId,
            //         images,
            //     };
            //     // formData.append("postId", postId);
            //     // Array.from(images).forEach((image) => {
            //     //     formData.append("images", image);
            //     // });
            //     console.log("Form data:", formData);

            //     const uploadImagesResponse = await axios.put(
            //         "/post/upload-images",
            //         formData,
            //         {
            //             headers: {
            //                 "Content-Type": "multipart/form-data",
            //             },
            //         }
            //     );

            //     console.log("Upload images response:", uploadImagesResponse);
            // }

            console.log("Post created successfully:", createPostResponse);
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    return (
        <form onSubmit={onSubmit}>
            <div>
                <label htmlFor="discussionId">Discussion ID</label>
                <input
                    id="discussionId"
                    value={discussionId}
                    onChange={(e) => setDiscussionId(e.target.value)}
                />
                {errors.discussionId && <p>{errors.discussionId}</p>}
            </div>

            <div>
                <label htmlFor="content">Content</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                {errors.content && <p>{errors.content}</p>}
            </div>

            <div>
                <label htmlFor="images">Images</label>
                <input
                    id="images"
                    type="file"
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
            </div>

            <button type="submit">Create Post</button>
        </form>
    );
};

export default PostForm;
