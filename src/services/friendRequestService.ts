import axios from "../utils/axios";

// Send a friend request
export const sendFriendRequest = async (receiverId: string) => {
    try {
        const response = await axios.post(`/friend-requests/send`, { receiverId });
        return response.data;
    } catch (error) {
        console.error("Error sending friend request:", error);
        throw error;
    }
};

// Accept a friend request
export const acceptFriendRequest = async (requestId: string) => {
    try {
        const response = await axios.post(`/friend-requests/accept/${requestId}`);
        return response.data;
    } catch (error) {
        console.error("Error accepting friend request:", error);
        throw error;
    }
};

// Reject a friend request
export const rejectFriendRequest = async (requestId: string) => {
    try {
        const response = await axios.post(`/friend-requests/reject/${requestId}`);
        return response.data;
    } catch (error) {
        console.error("Error rejecting friend request:", error);
        throw error;
    }
};

// Get all pending friend requests
export const getAllFriendRequests = async (userId: string) => {
    try {
        const { data } = await axios.get(`/friend-requests/requests/${userId}`);
        
        if (data) {
            if (Array.isArray(data) && data.length > 0) {
                const updatedRequests = data.map((request: any) => {
                    if (!request.sender.profileImage) {
                        request.sender.profileImage = "http://localhost:3000/assets/images/avatar.png";
                    } else {
                        request.sender.profileImage = `http://localhost:3000/${request.sender.profileImage}`;
                    }
                    return { ...request };
                });
                return updatedRequests;
            } else {
                return [];
            }
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error getting all friend requests:", error);
        throw error;
    }
};

// Delete a specific friend request by ID
export const deleteFriendRequest = async (requestId: string) => {
    try {
        const response = await axios.delete(`/friend-requests/delete/${requestId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting friend request:", error);
        throw error;
    }
};

// Delete all friend requests for the logged-in user
export const deleteAllFriendRequests = async () => {
    try {
        const response = await axios.delete(`/friend-requests/delete-all`);
        return response.data;
    } catch (error) {
        console.error("Error deleting all friend requests:", error);
        throw error;
    }
};
