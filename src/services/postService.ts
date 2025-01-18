import axios from "../utils/axios";
import { Post } from "../classes/post";
import { getRepliesByPost } from "./replyService";

export const createPost = async (discussionId: string, content: string) => {
    try {
        const response = await axios.post("/post/create", {
            discussionId: discussionId,
            content: content,
        });
        return response.data;
    } catch (error) {
        console.error("Error creating post:", error);
        throw error;
    }
};

export const uploadImages = async (postId: string, images: File[]) => {
    try {
        const formData = new FormData();
        formData.append("postId", postId);
        images.forEach((image) => {
            formData.append("images", image);
        });

        const response = await axios.put("/post/upload-images", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error uploading images:", error);
        throw error;
    }
};

export const getAllPosts = async (page: number, perPage: number) => {
    try {
        const { data } = await axios.get(`/post/all?per_page=${perPage}&page=${page}`);
        console.log(data);

        if (data) {
            if (Array.isArray(data.posts) && data.posts.length > 0) {
                const newPosts = await Promise.all(
                    data.posts.map(async (post: Post) => {
                        post.timestamp = new Date(post.timestamp).toLocaleString().split(',')[0];
                        if (post.images.length > 0) {
                            post.images = post.images.map((image) => {
                                return `http://localhost:3000/${image}`;
                            });
                        }
                        if (!post.owner.profileImage) {
                            post.owner.profileImage = "http://localhost:3000/assets/images/avatar.png";
                        } else {
                            post.owner.profileImage = `http://localhost:3000/${post.owner.profileImage}`;
                        }

                        if (post.discussionId.banner) {
                            post.discussionId.banner = `http://localhost:3000/${post.discussionId.banner}`;
                        } else {
                            post.discussionId.banner = "http://localhost:3000/assets/images/dfltBanner.jpg";
                        }

                        if(post.owner.friends) {
                            for(let i=0; i<post.owner.friends.length; i++) {
                                if (!post.owner.friends[i].profileImage) {
                                    post.owner.friends[i].profileImage = "http://localhost:3000/assets/images/avatar.png";
                                } else {
                                    post.owner.friends[i].profileImage = `http://localhost:3000/${post.owner.friends[i].profileImage}`;
                                }
                            }
                        }
                        post.replies = await getRepliesByPost(post._id);
                        
                        return { ...post };
                    })
                );
                return newPosts;
            }
            else {
                return [];
            }
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error getting all posts:", error);
        throw error;
    }
};

export const getPostById = async (id: string) => {
    try {
        const { data } = await axios.get(`/post/id/${id}`);

        if (data) {
            const post = data.post
                
            post.timestamp = new Date(post.timestamp).toLocaleString().split(',')[0];

            if (post.images.length > 0) {
                post.images = post.images.map((image: string) => {
                    return `http://localhost:3000/${image}`;
                });
            }

            if (!post.owner.profileImage) {
                post.owner.profileImage = "http://localhost:3000/assets/images/avatar.png";
            } else {
                post.owner.profileImage = `http://localhost:3000/${post.owner.profileImage}`;
            }

            if (post.discussionId.banner) {
                post.discussionId.banner = `http://localhost:3000/${post.discussionId.banner}`;
            } else {
                post.discussionId.banner = "http://localhost:3000/assets/images/dfltBanner.jpg";
            }

            if(post.owner.friends) {
                for(let i=0; i<post.owner.friends.length; i++) {
                    if (!post.owner.friends[i].profileImage) {
                        post.owner.friends[i].profileImage = "http://localhost:3000/assets/images/avatar.png";
                    } else {
                        post.owner.friends[i].profileImage = `http://localhost:3000/${post.owner.friends[i].profileImage}`;
                    }
                }
            }
            
            post.replies = await getRepliesByPost(post._id);

            return post;
        }
        else {
            return;
        }
    } catch (error) {
        console.error(`Error getting post by id ${id}:`, error);
        throw error;
    }
};

export const getPostsByUser = async (userId:string, page: number, perPage: number) => {
    try {
        const { data } = await axios.get(`/post/user/${userId}?per_page=${perPage}&page=${page}`);

        if (data) {
            if (Array.isArray(data.posts) && data.posts.length > 0) {
                const newPosts = await Promise.all(
                    data.posts.map(async (post: Post) => {
                        post.timestamp = new Date(post.timestamp).toLocaleString().split(',')[0];
                        if (post.images.length > 0) {
                            post.images = post.images.map((image) => {
                                return `http://localhost:3000/${image}`;
                            });
                        }
                        if (!post.owner.profileImage) {
                            post.owner.profileImage = "http://localhost:3000/assets/images/avatar.png";
                        } else {
                            post.owner.profileImage = `http://localhost:3000/${post.owner.profileImage}`;
                        }

                        if (post.discussionId.banner) {
                            post.discussionId.banner = `http://localhost:3000/${post.discussionId.banner}`;
                        } else {
                            post.discussionId.banner = "http://localhost:3000/assets/images/dfltBanner.jpg";
                        }

                        if(post.owner.friends) {
                            for(let i=0; i<post.owner.friends.length; i++) {
                                if (!post.owner.friends[i].profileImage) {
                                    post.owner.friends[i].profileImage = "http://localhost:3000/assets/images/avatar.png";
                                } else {
                                    post.owner.friends[i].profileImage = `http://localhost:3000/${post.owner.friends[i].profileImage}`;
                                }
                            }
                        }
                        post.replies = await getRepliesByPost(post._id);
                        
                        return { ...post };
                    })
                );
                return newPosts;
            }
            else {
                return [];
            }
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error getting posts by user:", error);
        throw error;
    }
};

export const getPostsForUser = async (page: number, perPage: number) => {
    try {
        const { data } = await axios.get(
            `/post/fyp?per_page=${perPage}&page=${page}`
        );

        if (data) {
            if (Array.isArray(data.posts) && data.posts.length > 0) {
                const newPosts = await Promise.all(
                    data.posts.map(async (post: Post) => {
                        post.timestamp = new Date(post.timestamp).toLocaleString().split(',')[0];
                        if (post.images.length > 0) {
                            post.images = post.images.map((image) => {
                                return `http://localhost:3000/${image}`;
                            });
                        }
                        if (!post.owner.profileImage) {
                            post.owner.profileImage = "http://localhost:3000/assets/images/avatar.png";
                        } else {
                            post.owner.profileImage = `http://localhost:3000/${post.owner.profileImage}`;
                        }

                        if (post.discussionId.banner) {
                            post.discussionId.banner = `http://localhost:3000/${post.discussionId.banner}`;
                        } else {
                            post.discussionId.banner = "http://localhost:3000/assets/images/dfltBanner.jpg";
                        }

                        if(post.owner.friends) {
                            for(let i=0; i<post.owner.friends.length; i++) {
                                if (!post.owner.friends[i].profileImage) {
                                    post.owner.friends[i].profileImage = "http://localhost:3000/assets/images/avatar.png";
                                } else {
                                    post.owner.friends[i].profileImage = `http://localhost:3000/${post.owner.friends[i].profileImage}`;
                                }
                            }
                        }
                        post.replies = await getRepliesByPost(post._id);
                        
                        return { ...post };
                    })
                );
                return newPosts;
            }
            else {
                return [];
            }
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error getting posts for user:", error);
        throw error;
    }
};

export const getPostsByDiscussion = async (discussionId: string, perPage: number, page: number) => {
    try {
        const { data } = await axios.get(
            `/post/by-discussion/${discussionId}?per_page=${perPage}&page=${page}`
        );

        if (data) {
            if (Array.isArray(data.posts) && data.posts.length > 0) {
                const newPosts = await Promise.all(
                    data.posts.map(async (post: Post) => {
                        post.timestamp = new Date(post.timestamp).toLocaleString().split(',')[0];
                        if (post.images.length > 0) {
                            post.images = post.images.map((image) => {
                                return `http://localhost:3000/${image}`;
                            });
                        }
                        if (!post.owner.profileImage) {
                            post.owner.profileImage = "http://localhost:3000/assets/images/avatar.png";
                        } else {
                            post.owner.profileImage = `http://localhost:3000/${post.owner.profileImage}`;
                        }

                        if (post.discussionId.banner) {
                            post.discussionId.banner = `http://localhost:3000/${post.discussionId.banner}`;
                        } else {
                            post.discussionId.banner = "http://localhost:3000/assets/images/dfltBanner.jpg";
                        }

                        if(post.owner.friends) {
                            for(let i=0; i<post.owner.friends.length; i++) {
                                if (!post.owner.friends[i].profileImage) {
                                    post.owner.friends[i].profileImage = "http://localhost:3000/assets/images/avatar.png";
                                } else {
                                    post.owner.friends[i].profileImage = `http://localhost:3000/${post.owner.friends[i].profileImage}`;
                                }
                            }
                        }
                        post.replies = await getRepliesByPost(post._id);
                        
                        return { ...post };
                    })
                );
                return newPosts;
            }
            else {
                return [];
            }
        } else {
            return [];
        }
    } catch (error) {
        console.error(
            `Error getting posts by discussion ${discussionId}:`,
            error
        );
        throw error;
    }
};

export const getPostLikes = async (postId: string) => {
    try {
        const { data } = await axios.get(`/post/likes/${postId}`);
        return data;
    } catch (error) {
        console.error(`Error getting likes for post ${postId}:`, error);
        throw error;
    }
};

export const getPostDislikes = async (postId: string) => {
    try {
        const { data } = await axios.get(`/post/dislikes/${postId}`);
        return data;
    } catch (error) {
        console.error(`Error getting dislikes for post ${postId}:`, error);
        throw error;
    }
};

export const likePost = async (postId: string) => {
    try {
        const response = await axios.put(`/post/like/${postId}`);
        return response.data;
    } catch (error) {
        console.error(`Error liking post ${postId}:`, error);
        throw error;
    }
};

export const dislikePost = async (postId: string) => {
    try {
        const response = await axios.put(`/post/dislike/${postId}`);
        return response.data;
    } catch (error) {
        console.error(`Error disliking post ${postId}:`, error);
        throw error;
    }
};

export const deletePost = async (postId: string) => {
    try {
        const response = await axios.delete(`/post/delete/${postId}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting post ${postId}:`, error);
        throw error;
    }
};
