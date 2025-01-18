import axios from "../utils/axios";

export const createReply = async (content: string, postId: string) => {
    try {
        const response = await axios.post(`/reply/create/${postId}`, {
            content,
        });

        response.data.reply.timestamp = new Date(response.data.reply.timestamp).toLocaleString().split(',')[0];
        
        response.data.reply.upvotes = await getReplyUpvotes(response.data.reply._id);
        response.data.reply.downvotes = await getReplyDownvotes(response.data.reply._id);
        
        if (!response.data.reply.owner.profileImage) {
            response.data.reply.owner.profileImage = "http://localhost:3000/assets/images/avatar.png";
        } else {
            response.data.reply.owner.profileImage = `http://localhost:3000/${response.data.reply.owner.profileImage}`;
        }

        return response.data.reply;
    } catch (error) {
        console.error("Error creating reply:", error);
        throw error;
    }
};

export const getReplyUpvotes = async (replyId: string) => {
    try {
        const { data } = await axios.get(`/reply/upvotes/${replyId}`);
        return data.numberOfUpvotes;
    } catch (error) {
        console.error("Error getting reply upvotes:", error);
        throw error;
    }
};

export const getReplyDownvotes = async (replyId: string) => {
    try {
        const { data } = await axios.get(`/reply/downvotes/${replyId}`);
        return data.numberOfDownvotes;
    } catch (error) {
        console.error("Error getting reply downvotes:", error);
        throw error;
    }
};

export const getRepliesByPost = async (postId: string) => {
    try {
        const { data } = await axios.get(`/reply/by-post/${postId}`);

        if (data.replies) {
            for (let i = 0; i < data.replies.length; i++) {
                data.replies[i].timestamp = new Date(data.replies[i].timestamp).toLocaleString().split(',')[0];
                
                data.replies[i].upvotes = await getReplyUpvotes(data.replies[i]._id);
                data.replies[i].downvotes = await getReplyDownvotes(data.replies[i]._id);
                if (!data.replies[i].owner.profileImage) {
                    data.replies[i].owner.profileImage = "http://localhost:3000/assets/images/avatar.png";
                } else {
                    data.replies[i].owner.profileImage = `http://localhost:3000/${data.replies[i].owner.profileImage}`;
                }
            }
            return data.replies;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error getting replies by post:", error);
        throw error;
    }
};

export const getRepliesByUser = async () => {
    try {
        const { data } = await axios.get(`/reply/user`);
        
        if (data.replies) {
            for (let i = 0; i < data.replies.length; i++) {
                data.replies[i].timestamp = new Date(data.replies[i].timestamp).toLocaleString().split(',')[0];
                
                data.replies[i].upvotes = await getReplyUpvotes(data.replies[i]._id);
                data.replies[i].downvotes = await getReplyDownvotes(data.replies[i]._id);
                if (!data.replies[i].owner.profileImage) {
                    data.replies[i].owner.profileImage = "http://localhost:3000/assets/images/avatar.png";
                } else {
                    data.replies[i].owner.profileImage = `http://localhost:3000/${data.replies[i].owner.profileImage}`;
                }
            }
            return data.replies;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error getting replies by user:", error);
        throw error;
    }
};

export const upvoteReply = async (replyId: string) => {
    try {
        const response = await axios.put(`/reply/upvote/${replyId}`);
        return response.data;
    } catch (error) {
        console.error("Error upvoting reply:", error);
        throw error;
    }
};

export const downvoteReply = async (replyId: string) => {
    try {
        const response = await axios.put(`/reply/downvote/${replyId}`);
        return response.data;
    } catch (error) {
        console.error("Error downvoting reply:", error);
        throw error;
    }
};

export const deleteReply = async (replyId: string) => {
    try {
        const response = await axios.delete(`/reply/delete/${replyId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting reply:", error);
        throw error;
    }
};