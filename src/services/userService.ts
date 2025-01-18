import axios from "../utils/axios";

import { Post } from "../classes/post";
import { getRepliesByPost } from "./replyService";
import { User } from "../classes/user";

export const getUserProfile = async (userId: string) => {
    try {
        const { data } = await axios.get(`/user/profile/${userId}`);
        if (!data.data.profileImage) {
            data.data.profileImage = "http://localhost:3000/assets/images/avatar.png";
        } else {
            data.data.profileImage = `http://localhost:3000/${data.data.profileImage}`;
        }
        
        if (!data.data.coverImage) {
            data.data.coverImage = "http://localhost:3000/assets/images/avatar.png";
        } else {
            data.data.coverImage = `http://localhost:3000/${data.data.coverImage}`;
        }

        data.data.friends = data.data.friends?.map((friend: User) => ({
            ...friend,
            profileImage: friend.profileImage
                ? `http://localhost:3000/${friend.profileImage}`
                : "http://localhost:3000/assets/images/avatar.png",
        }));

        localStorage.getItem("user_id") === userId ? localStorage.setItem("profileImage", data.data.profileImage) : null;
        
        return data.data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};

export const searchUsersByName = async (name: string) => {
    try {
        const { data } = await axios.get(`/user/search-users?name=${name}`);

        for (let i = 0; i < data.data.length; i++) {
            if (!data.data[i].profileImage) {
                data.data[i].profileImage = "http://localhost:3000/assets/images/avatar.png";
            } else {
                data.data[i].profileImage = `http://localhost:3000/${data.data[i].profileImage}`;
            }
        }
        return data.data;
    } catch (error) {
        console.error("Error searching users by name:", error);
        throw error;
    }
};

export const uploadProfileImage = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await axios.post(
            `/user/upload-profile-image`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return data;
    } catch (error) {
        console.error("Error uploading profile image:", error);
        throw error;
    }
};

export const uploadCoverImage = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await axios.post(
            `/user/upload-cover-image`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return data;
    } catch (error) {
        console.error("Error uploading cover image:", error);
        throw error;
    }
};

export const updateProfileDetails = async (profileData: {
    fullName?: string;
    bio?: string;
    occupation?: string;
    gender?: string;
    dateOfBirth?: Date;
    address?: string;
    email?: string;
}) => {
    try {
        const { data } = await axios.post(
            `/user/update-profile-details`,
            profileData
        );
        return data;
    } catch (error) {
        console.error("Error updating profile details:", error);
        throw error;
    }
};

export const addFriend = async (userId: string) => {
    try {
        const { data } = await axios.post(`/user/add-friend/${userId}`);
        return data;
    } catch (error) {
        console.error("Error adding friend:", error);
        throw error;
    }
};

export const removeFriend = async (userId: string) => {
    try {
        const { data } = await axios.post(`/user/remove-friend/${userId}`);
        return data;
    } catch (error) {
        console.error("Error removing friend:", error);
        throw error;
    }
};

export const savePost = async (postId: string) => {
    try {
        const { data } = await axios.post(`/user/save-post/${postId}`);
        return data;
    } catch (error) {
        console.error("Error saving post:", error);
        throw error;
    }
};

export const unsavePost = async (postId: string) => {
    try {
        const { data } = await axios.post(`/user/unsave-post/${postId}`);
        return data;
    } catch (error) {
        console.error("Error unsaving post:", error);
        throw error;
    }
};

export const getSavedPosts = async (
    userId: string,
    page: number,
    perPage: number
) => {
    try {
        const { data } = await axios.get(`/user/saved-posts/${userId}?per_page=${perPage}&page=${page}`);
        
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
                console.log(newPosts);
                return newPosts;
            }
            else {
                return [];
            }
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching saved posts:", error);
        throw error;
    }
};

export const deleteAccount = async () => {
    try {
        const { data } = await axios.post(`/user/delete-account`);
        return data;
    } catch (error) {
        console.error("Error deleting account:", error);
        throw error;
    }
};

export const changePassword = async (passwordData: {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}) => {
    try {
        const { data } = await axios.post(
            `/user/change-password`,
            passwordData
        );
        return data;
    } catch (error) {
        console.error("Error changing password:", error);
        throw error;
    }
};

export const getUserContacts = async () => {
    try {
        const { data } = await axios.get(`/message/contacts`);
        const contactsWithOnlineStatus = data.contacts.map((contact: any) => ({
            ...contact,
            profileImage: contact.profileImage
                ? `http://localhost:3000/${contact.profileImage}`
                : "http://localhost:3000/assets/images/avatar.png",
            online: false, // Initialize all contacts as offline
        }));
        return contactsWithOnlineStatus;
    } catch (error) {
        console.error("Error fetching contacts:", error);
        throw error;
    }
}